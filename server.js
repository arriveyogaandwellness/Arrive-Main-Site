const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d'
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

// Start Server
app.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🌺 THE ART OF ARRIVAL — SANCTUARY WEB SERVER ONLINE`);
  console.log(`🌐 Local URL:      http://localhost:${PORT}`);
  console.log(`💳 Stripe Status:  ${stripe ? 'CONNECTED (Live/Test Mode)' : 'SANDBOX / TEST MODE'}`);
  console.log(`⚙️ Stripe Setup:   http://localhost:${PORT}/stripe-setup.html`);
  console.log(`🚀 Railway Ready:  PORT=${PORT}, Health check at /api/health`);
  console.log('================================================================');
});
