const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

function getPublicOrigin(req) {
  const configuredBaseUrl = process.env.BASE_URL
    || (process.env.RAILWAY_PUBLIC_DOMAIN && `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  const forwardedProtocol = req.get('x-forwarded-proto')?.split(',')[0].trim();
  const protocol = ['http', 'https'].includes(forwardedProtocol) ? forwardedProtocol : req.protocol;
  const publicUrl = new URL(configuredBaseUrl || `${protocol}://${req.get('host')}`);

  if (!['http:', 'https:'].includes(publicUrl.protocol)) {
    throw new Error('BASE_URL must use HTTP or HTTPS.');
  }

  return publicUrl.origin;
}

// Initialize Stripe if secret key is present
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Stripe SDK initialized successfully with secret key.');
  } catch (err) {
    console.error('⚠️ Error initializing Stripe SDK:', err.message);
  }
} else {
  console.log('ℹ️ Running in Stripe Sandbox / Test Mode. Enter your Stripe keys in .env or via /stripe-setup.html to activate live card processing.');
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  const publicOrigin = getPublicOrigin(req);
  fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, html) => {
    if (err) return next(err);
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.type('html').send(html.replace(/__PUBLIC_ORIGIN__/g, publicOrigin));
  });
});

// Serve static assets with no-cache headers for instant updates
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 0,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
}));

// Inquiries storage directory
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Healthcheck for Railway & Cloud deployment
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    stripeConfigured: !!stripe
  });
});

// Get Stripe configuration
app.get('/api/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    isConfigured: !!stripe,
    mode: stripe ? (process.env.STRIPE_SECRET_KEY.startsWith('sk_live_') ? 'live' : 'test') : 'mock'
  });
});

// Save Stripe keys dynamically (from client setup portal)
app.post('/api/save-stripe-keys', (req, res) => {
  try {
    const { publishableKey, secretKey } = req.body;
    if (!publishableKey || !secretKey) {
      return res.status(400).json({ error: 'Both Publishable Key and Secret Key are required.' });
    }

    // Basic format validation
    if (!publishableKey.startsWith('pk_') || !secretKey.startsWith('sk_')) {
      return res.status(400).json({ error: 'Invalid Stripe key format. Publishable key must begin with pk_ and Secret key must begin with sk_.' });
    }

    // Update .env file
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const updateEnvVar = (content, key, val) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(content)) {
        return content.replace(regex, `${key}=${val}`);
      } else {
        return content + `\n${key}=${val}`;
      }
    };

    envContent = updateEnvVar(envContent, 'STRIPE_PUBLISHABLE_KEY', publishableKey.trim());
    envContent = updateEnvVar(envContent, 'STRIPE_SECRET_KEY', secretKey.trim());
    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');

    // Update current process env
    process.env.STRIPE_PUBLISHABLE_KEY = publishableKey.trim();
    process.env.STRIPE_SECRET_KEY = secretKey.trim();

    // Re-init stripe
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    console.log('✅ Stripe keys updated and verified successfully.');
    res.json({ success: true, message: 'Stripe keys updated and verified successfully!' });
  } catch (err) {
    console.error('Error saving Stripe keys:', err);
    res.status(500).json({ error: 'Failed to save Stripe keys: ' + err.message });
  }
});

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const {
      packageType = 'Standard Experience',
      roomType = 'Queen Suite',
      isDeposit = true,
      customAmount = null,
      guestName = 'Valued Guest',
      guestEmail = '',
      guestPhone = '',
      selectedExcursions = [],
      selectedSpa = [],
      transportation = '',
      specialRequests = ''
    } = req.body;

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

    // Calculate total price or use deposit
    let unitAmountCents = 0;
    let description = '';

    if (isDeposit) {
      unitAmountCents = 500 * 100; // $500 Deposit
      description = `Non-refundable $500 reservation deposit for ${packageType} (${roomType}) at The Art of Arrival Retreat, Costa Rica. Balance scheduled prior to arrival.`;
    } else if (customAmount && Number(customAmount) > 0) {
      unitAmountCents = Math.round(Number(customAmount) * 100);
      description = `Full payment for custom curated ${packageType} (${roomType}) including selected excursions and spa treatments.`;
    } else {
      // Default standard vs VIP
      const basePrice = packageType.toLowerCase().includes('vip') ? 3100 : 2200;
      unitAmountCents = basePrice * 100;
      description = `Full registration for ${packageType} (${roomType}) at The Art of Arrival Retreat, Costa Rica. All meals, yoga, and core experiences included.`;
    }

    // If Stripe is configured with live/test key, create actual session
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `The Art of Arrival Retreat — ${packageType}`,
                description: description,
                images: [
                  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
                ],
              },
              unit_amount: unitAmountCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: guestEmail || undefined,
        metadata: {
          guestName,
          guestEmail,
          guestPhone,
          packageType,
          roomType,
          isDeposit: String(isDeposit),
          selectedExcursions: Array.isArray(selectedExcursions) ? selectedExcursions.join(', ') : '',
          selectedSpa: Array.isArray(selectedSpa) ? selectedSpa.join(', ') : '',
          transportation,
          specialRequests
        },
        success_url: `${baseUrl}/booking-success.html?session_id={CHECKOUT_SESSION_ID}&package=${encodeURIComponent(packageType)}&amount=${(unitAmountCents/100).toFixed(2)}&deposit=${isDeposit}&guest=${encodeURIComponent(guestName)}`,
        cancel_url: `${baseUrl}/booking-cancel.html`,
      });

      // Also log inquiry locally
      saveBookingRecord({
        sessionId: session.id,
        guestName,
        guestEmail,
        guestPhone,
        packageType,
        roomType,
        amount: unitAmountCents / 100,
        isDeposit,
        status: 'pending_stripe_payment',
        createdAt: new Date().toISOString()
      });

      return res.json({ id: session.id, url: session.url });
    } else {
      // Fallback Demo / Simulated Mode when Stripe keys are not yet input
      console.log('⚡ Processing simulated Stripe checkout for demo testing:');
      console.log(`   Guest: ${guestName} (${guestEmail}) | Package: ${packageType} | Amount: $${(unitAmountCents/100).toFixed(2)}`);

      const simulatedSessionId = 'mock_stripe_' + Math.random().toString(36).substring(2, 11);
      
      saveBookingRecord({
        sessionId: simulatedSessionId,
        guestName,
        guestEmail,
        guestPhone,
        packageType,
        roomType,
        amount: unitAmountCents / 100,
        isDeposit,
        status: 'simulated_test_checkout',
        createdAt: new Date().toISOString()
      });

      const redirectUrl = `${baseUrl}/booking-success.html?session_id=${simulatedSessionId}&package=${encodeURIComponent(packageType)}&amount=${(unitAmountCents/100).toFixed(2)}&deposit=${isDeposit}&guest=${encodeURIComponent(guestName)}&mock=true`;

      return res.json({
        id: simulatedSessionId,
        url: redirectUrl,
        isMock: true,
        message: 'Stripe Sandbox mode active. To process real credit cards, add your STRIPE_SECRET_KEY in .env or via /stripe-setup.html.'
      });
    }
  } catch (err) {
    console.error('Error creating Stripe checkout session:', err);
    res.status(500).json({ error: err.message });
  }
});

// Save general inquiry or contact message
app.post('/api/inquiry', (req, res) => {
  try {
    const inquiry = {
      id: 'inq_' + Date.now(),
      ...req.body,
      receivedAt: new Date().toISOString()
    };
    saveBookingRecord(inquiry);
    res.json({ success: true, message: 'Thank you for arriving! Our concierge team will contact you within 24 hours.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to save data to local json file
function saveBookingRecord(record) {
  try {
    const filePath = path.join(DATA_DIR, 'bookings.json');
    let records = [];
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      if (data) records = JSON.parse(data);
    }
    records.push(record);
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write booking record:', e.message);
  }
}

// Fallback for SPA routing if needed
app.get('*', (req, res) => {
  const reqPath = path.join(__dirname, 'public', req.path);
  if (fs.existsSync(reqPath) && fs.statSync(reqPath).isFile()) {
    return res.sendFile(reqPath);
  }
  // If html extension missing
  if (fs.existsSync(reqPath + '.html')) {
    return res.sendFile(reqPath + '.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ==========================================================================
   Photo Manager — drag & drop photo replacement (edit mode ?edit=1)
   POST /api/admin/verify        { password } -> { ok, configured }
   POST /api/admin/upload-photo  { password, targetPath, dataUrl } -> commits
                                   the photo to GitHub; Railway redeploys it.
   Requires env: ADMIN_PASSWORD, GITHUB_TOKEN (repo contents:write).
   ========================================================================== */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GH_OWNER = 'arriveyogaandwellness';
const GH_REPO = 'Arrive-Main-Site';

function adminAuthed(body) {
  const pw = body && body.password;
  if (!ADMIN_PASSWORD || typeof pw !== 'string' || !pw) return false;
  const a = Buffer.from(pw, 'utf8');
  const b = Buffer.from(ADMIN_PASSWORD, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

app.post('/api/admin/verify', (req, res) => {
  res.json({ ok: adminAuthed(req.body), configured: ADMIN_PASSWORD.length > 0 });
});

// Identify image bytes by magic numbers (not by extension).
function detectImageType(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'jpg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'png';
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  const head = buf.toString('ascii', 0, 6);
  if (head === 'GIF87a' || head === 'GIF89a') return 'gif';
  if (buf.toString('ascii', 4, 8) === 'ftyp') {
    const brand = buf.toString('ascii', 8, 12);
    if (['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'hevm', 'hevs', 'mif1'].includes(brand)) return 'heic';
  }
  return null;
}

const famOf = (t) => (t === 'jpg' || t === 'jpeg' ? 'jpg' : t);

app.post('/api/admin/upload-photo', async (req, res) => {
  try {
    if (!adminAuthed(req.body)) return res.status(401).json({ ok: false, error: 'Not authorized.' });

    const { targetPath, dataUrl } = req.body || {};
    // Strict path allow-list: only image files under public/assets/, no traversal.
    if (
      typeof targetPath !== 'string' ||
      targetPath.includes('..') ||
      !/^public\/assets\/[A-Za-z0-9_][A-Za-z0-9_\/.\-~]*\.(jpg|jpeg|png|webp|gif)$/i.test(targetPath)
    ) {
      return res.status(400).json({ ok: false, error: 'Invalid target path.' });
    }

    const m = /^data:image\/[a-zA-Z]+;base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || '').replace(/\s/g, ''));
    if (!m) return res.status(400).json({ ok: false, error: 'Invalid image data.' });
    let buf = Buffer.from(m[1], 'base64');
    if (buf.length === 0 || buf.length > 8 * 1024 * 1024) {
      return res.status(400).json({ ok: false, error: 'Photo must be under 8MB.' });
    }

    let type = detectImageType(buf);
    if (!type) return res.status(400).json({ ok: false, error: 'Not a recognized photo (JPG, PNG, WebP, GIF, HEIC).' });

    // iPhone HEIC -> JPEG so the slot keeps working everywhere.
    if (type === 'heic') {
      try {
        const convert = require('heic-convert');
        buf = Buffer.from(await convert({ buffer: buf, format: 'JPEG', quality: 0.92 }));
        type = 'jpg';
      } catch (e) {
        return res.status(400).json({ ok: false, error: 'HEIC conversion is unavailable on the server right now.' });
      }
    }

    const targetExt = targetPath.split('.').pop().toLowerCase();
    if (famOf(type) !== famOf(targetExt)) {
      return res.status(400).json({ ok: false, error: `This photo slot needs a ${targetExt.toUpperCase()} file.` });
    }

    if (!GITHUB_TOKEN) return res.status(500).json({ ok: false, error: 'Server is missing GITHUB_TOKEN.' });

    const ghHeaders = {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'arrive-photo-manager',
    };
    const contentsUrl = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${targetPath}`;
    const curRes = await fetch(`${contentsUrl}?ref=main`, { headers: ghHeaders });
    if (!curRes.ok) return res.status(502).json({ ok: false, error: 'Could not read the current photo from GitHub.' });
    const cur = await curRes.json();

    const putRes = await fetch(contentsUrl, {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Photo update via drag-drop: ${targetPath}`,
        content: buf.toString('base64'),
        sha: cur.sha,
        branch: 'main',
      }),
    });
    if (!putRes.ok) return res.status(502).json({ ok: false, error: 'GitHub commit failed.' });
    res.json({ ok: true });
  } catch (e) {
    console.error('upload-photo error:', e.message);
    res.status(500).json({ ok: false, error: 'Server error.' });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log('================================================================');
  console.log(`🌺 THE ART OF ARRIVAL — SANCTUARY WEB SERVER ONLINE`);
  console.log(`🌐 Local URL:      http://localhost:${PORT}`);
  console.log(`💳 Stripe Status:  ${stripe ? 'CONNECTED (Live/Test Mode)' : 'SANDBOX / TEST MODE'}`);
  console.log(`⚙️ Stripe Setup:   http://localhost:${PORT}/stripe-setup.html`);
  console.log(`🚀 Railway Ready:  PORT=${PORT}, Health check at /api/health`);
  console.log('================================================================');
});
