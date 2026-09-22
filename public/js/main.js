/**
 * THE ART OF ARRIVAL RETREAT — Interactive Client Engine
 * Founder & Host: Carly Anne Kasinpila
 * Location: Playa Hermosa, Costa Rica @ Amanti Sanctuary
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initThemeEngine();
  initIconNavTooltips();
  initAudioAmbience();
  initLetterSwitcher();
  initItineraryTabs();
  initRetreatCalculator();
  initQuizEngine();
  initLightbox();
  initStripeStatus();
  initMobileNav();
  initNewsletter();
});

/* ==========================================================================
   1. Luxury Theme Engine
   ========================================================================== */
function initThemeEngine() {
  const savedTheme = localStorage.getItem('arrive_sanctuary_theme') || 'tropical-sunshine';
  setTheme(savedTheme);

  const themeButtons = document.querySelectorAll('[data-set-theme]');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const theme = btn.getAttribute('data-set-theme');
      setTheme(theme);
    });
  });

  const drawerToggle = document.getElementById('open-theme-drawer');
  const drawerClose = document.getElementById('close-theme-drawer');
  const drawer = document.getElementById('theme-drawer');

  if (drawerToggle && drawer) {
    drawerToggle.addEventListener('click', () => drawer.classList.add('open'));
  }
  if (drawerClose && drawer) {
    drawerClose.addEventListener('click', () => drawer.classList.remove('open'));
  }
}

function setTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem('arrive_sanctuary_theme', themeId);

  document.querySelectorAll('.theme-card-option').forEach(card => {
    if (card.getAttribute('data-theme-id') === themeId) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

/* ==========================================================================
   2. Audio Ambience Engine (Subtle Jungle & Waves Ambient)
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let oceanGain = null;
let jungleGain = null;
let birdTimer = null;

function initAudioAmbience() {
  const toggleBtn = document.getElementById('audio-ambient-toggle');
  const soundWave = document.querySelector('.sound-wave');
  const label = document.getElementById('audio-label');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      createAmbientSynthesis();
    }

    if (isAudioPlaying) {
      if (oceanGain && jungleGain) {
        oceanGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
        jungleGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
      }
        window.clearTimeout(birdTimer);
      isAudioPlaying = false;
      if (soundWave) soundWave.classList.add('paused');
      if (label) label.textContent = 'Audio: Paused';
    } else {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (oceanGain && jungleGain) {
        oceanGain.gain.setTargetAtTime(0.08, audioCtx.currentTime, 0.5);
        jungleGain.gain.setTargetAtTime(0.04, audioCtx.currentTime, 0.5);
      }
      scheduleBirdCall();
      isAudioPlaying = true;
      if (soundWave) soundWave.classList.remove('paused');
      if (label) label.textContent = 'Pacific Waves & Forest';
    }
  });
}

function createAmbientSynthesis() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // Build a low, gently moving wave bed instead of a constant white-noise loop.
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Low-passed surf with a slow swell creates the sense of water arriving and receding.
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, audioCtx.currentTime);

    // LFO for wave swelling
    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, audioCtx.currentTime);
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(140, audioCtx.currentTime);
    lfo.connect(filter.frequency);

    oceanGain = audioCtx.createGain();
    oceanGain.gain.setValueAtTime(0, audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(oceanGain);
    oceanGain.connect(audioCtx.destination);

    whiteNoise.start();
    lfo.start();

    // A quiet forest-air layer gives the ambience a natural space without a tonal hum.
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(72, audioCtx.currentTime);
    jungleGain = audioCtx.createGain();
    jungleGain.gain.setValueAtTime(0, audioCtx.currentTime);

    osc.connect(jungleGain);
    jungleGain.connect(audioCtx.destination);
    osc.start();

  } catch (e) {
    console.log('Ambient audio synthesis not permitted until user click');
  }
}

function scheduleBirdCall() {
  if (!audioCtx || !isAudioPlaying) return;

  const start = audioCtx.currentTime + 0.05;
  const bird = audioCtx.createOscillator();
  const birdGain = audioCtx.createGain();
  bird.type = 'sine';
  bird.frequency.setValueAtTime(1500 + Math.random() * 350, start);
  bird.frequency.exponentialRampToValueAtTime(2400 + Math.random() * 500, start + 0.16);
  bird.frequency.exponentialRampToValueAtTime(1200 + Math.random() * 250, start + 0.32);
  birdGain.gain.setValueAtTime(0.0001, start);
  birdGain.gain.exponentialRampToValueAtTime(0.018, start + 0.04);
  birdGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.36);
  bird.connect(birdGain);
  birdGain.connect(audioCtx.destination);
  bird.start(start);
  bird.stop(start + 0.4);
  birdTimer = window.setTimeout(scheduleBirdCall, 4200 + Math.random() * 5200);
}

/* ==========================================================================
   3. Host Letter Switcher (Option A vs Option B)
   ========================================================================== */
function initLetterSwitcher() {
  const tabs = document.querySelectorAll('.letter-tab-btn');
  const letterA = document.getElementById('letter-content-a');
  const letterB = document.getElementById('letter-content-b');

  if (!tabs.length || !letterA || !letterB) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active', 'border-accent-gold', 'text-accent-gold'));
      tab.classList.add('active', 'border-accent-gold', 'text-accent-gold');

      const target = tab.getAttribute('data-letter-target');
      if (target === 'option-b') {
        letterA.classList.add('hidden');
        letterB.classList.remove('hidden');
      } else {
        letterB.classList.add('hidden');
        letterA.classList.remove('hidden');
      }
    });
  });
}

/* ==========================================================================
   4. Elemental Itinerary Tabs
   ========================================================================== */
function initItineraryTabs() {
  const dayButtons = document.querySelectorAll('.itinerary-day-btn');
  const dayCards = document.querySelectorAll('.itinerary-day-content');

  if (!dayButtons.length || !dayCards.length) return;

  dayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dayButtons.forEach(b => b.classList.remove('active-day', 'bg-accent-gold', 'text-black'));
      btn.classList.add('active-day', 'bg-accent-gold', 'text-black');

      const selectedDay = btn.getAttribute('data-day');
      dayCards.forEach(card => {
        if (card.getAttribute('data-day-content') === selectedDay || selectedDay === 'all') {
          card.classList.remove('hidden');
          card.style.opacity = '1';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive Custom Retreat Builder & Cost Calculator
   ========================================================================== */
function initRetreatCalculator() {
  const form = document.getElementById('retreat-builder-form');
  if (!form) return;

  const packageSelect = document.getElementById('calc-package');
  const roomSelect = document.getElementById('calc-room');
  const depositToggle = document.getElementById('calc-deposit-toggle');
  const excursionsCheckboxes = document.querySelectorAll('.calc-excursion-check');
  const spaCheckboxes = document.querySelectorAll('.calc-spa-check');
  const airportSelect = document.getElementById('calc-airport');

  const displayBase = document.getElementById('display-base-price');
  const displayRoom = document.getElementById('display-room-price');
  const displayExcursions = document.getElementById('display-excursions-total');
  const displaySpa = document.getElementById('display-spa-total');
  const displayTransport = document.getElementById('display-transport-total');
  const displayGrandTotal = document.getElementById('display-grand-total');
  const displayDueToday = document.getElementById('display-due-today');
  const dueLabel = document.getElementById('display-due-label');

  function calculate() {
    // 1. Package Base
    const pkgVal = packageSelect ? packageSelect.value : 'standard';
    const basePrice = pkgVal === 'vip' ? 3100 : 2200;
    if (displayBase) displayBase.textContent = `$${basePrice.toLocaleString()}`;

    // 2. Room Upgrade
    let roomUpgrade = 0;
    if (roomSelect) {
      const selectedOption = roomSelect.options[roomSelect.selectedIndex];
      roomUpgrade = Number(selectedOption.getAttribute('data-upgrade') || 0);
    }
    if (displayRoom) displayRoom.textContent = roomUpgrade > 0 ? `+$${roomUpgrade.toLocaleString()}` : '$0 (Included)';

    // 3. Excursions
    let excursionsTotal = 0;
    excursionsCheckboxes.forEach(cb => {
      if (cb.checked) {
        excursionsTotal += Number(cb.getAttribute('data-price') || 0);
      }
    });
    if (displayExcursions) displayExcursions.textContent = `+$${excursionsTotal.toLocaleString()}`;

    // 4. Spa
    let spaTotal = 0;
    spaCheckboxes.forEach(cb => {
      if (cb.checked) {
        spaTotal += Number(cb.getAttribute('data-price') || 0);
      }
    });
    if (displaySpa) displaySpa.textContent = `+$${spaTotal.toLocaleString()}`;

    // 5. Transportation
    let transportTotal = 0;
    if (airportSelect) {
      transportTotal = Number(airportSelect.value || 0);
    }
    if (displayTransport) displayTransport.textContent = transportTotal > 0 ? `+$${transportTotal.toLocaleString()}` : '$0';

    // Grand Total
    const grandTotal = basePrice + roomUpgrade + excursionsTotal + spaTotal + transportTotal;
    if (displayGrandTotal) displayGrandTotal.textContent = `$${grandTotal.toLocaleString()}`;

    // Due Today
    const isDeposit = depositToggle ? depositToggle.checked : true;
    if (isDeposit) {
      if (displayDueToday) displayDueToday.textContent = '$500';
      if (dueLabel) dueLabel.textContent = 'Deposit Due Today (Remainder Scheduled)';
    } else {
      if (displayDueToday) displayDueToday.textContent = `$${grandTotal.toLocaleString()}`;
      if (dueLabel) dueLabel.textContent = 'Total Investment Due Today';
    }

    return {
      packageType: pkgVal === 'vip' ? 'VIP Experience' : 'Standard Experience',
      roomType: roomSelect ? roomSelect.options[roomSelect.selectedIndex].text : 'Queen Suite',
      grandTotal,
      isDeposit,
      amountDueToday: isDeposit ? 500 : grandTotal
    };
  }

  // Bind change listeners
  [packageSelect, roomSelect, depositToggle, airportSelect].forEach(elem => {
    if (elem) elem.addEventListener('change', calculate);
  });
  excursionsCheckboxes.forEach(cb => cb.addEventListener('change', calculate));
  spaCheckboxes.forEach(cb => cb.addEventListener('change', calculate));

  // Initial calculation
  calculate();

  // Handle Checkout submission
  const checkoutBtn = document.getElementById('proceed-to-stripe-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const calcData = calculate();
      const guestNameInput = document.getElementById('calc-guest-name');
      const guestEmailInput = document.getElementById('calc-guest-email');
      const guestPhoneInput = document.getElementById('calc-guest-phone');
      const guestNotesInput = document.getElementById('calc-guest-notes');

      const guestName = guestNameInput ? guestNameInput.value.trim() : '';
      const guestEmail = guestEmailInput ? guestEmailInput.value.trim() : '';
      const guestPhone = guestPhoneInput ? guestPhoneInput.value.trim() : '';
      const specialRequests = guestNotesInput ? guestNotesInput.value.trim() : '';

      if (!guestName || !guestEmail) {
        alert('Please provide your name and email address so we can coordinate your reservation.');
        if (guestNameInput && !guestName) guestNameInput.focus();
        else if (guestEmailInput) guestEmailInput.focus();
        return;
      }

      // Collect selected excursions & spa
      const selectedExcursions = [];
      excursionsCheckboxes.forEach(cb => {
        if (cb.checked) selectedExcursions.push(cb.getAttribute('data-name') || cb.value);
      });

      const selectedSpa = [];
      spaCheckboxes.forEach(cb => {
        if (cb.checked) selectedSpa.push(cb.getAttribute('data-name') || cb.value);
      });

      const payload = {
        packageType: calcData.packageType,
        roomType: calcData.roomType,
        isDeposit: calcData.isDeposit,
        customAmount: calcData.amountDueToday,
        guestName,
        guestEmail,
        guestPhone,
        selectedExcursions,
        selectedSpa,
        transportation: airportSelect ? airportSelect.options[airportSelect.selectedIndex].text : 'None',
        specialRequests
      };

      checkoutBtn.disabled = true;
      const originalText = checkoutBtn.innerHTML;
      checkoutBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Connecting to Stripe Gateway...
      `;

      try {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          alert('Unable to initiate checkout session: ' + (data.error || 'Please try again.'));
          checkoutBtn.disabled = false;
          checkoutBtn.innerHTML = originalText;
        }
      } catch (err) {
        console.error('Checkout error:', err);
        alert('Network or gateway error. Please ensure the local server is running.');
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = originalText;
      }
    });
  }
}

/* ==========================================================================
   6. Retreat Readiness Quiz / Element Matcher
   ========================================================================== */
function initQuizEngine() {
  const quizModal = document.getElementById('quiz-modal');
  const openQuizBtns = document.querySelectorAll('[data-open-quiz]');
  const closeQuizBtn = document.getElementById('close-quiz-modal');

  if (openQuizBtns.length && quizModal) {
    openQuizBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        quizModal.classList.add('open');
        resetQuiz();
      });
    });
  }

  if (closeQuizBtn && quizModal) {
    closeQuizBtn.addEventListener('click', () => quizModal.classList.remove('open'));
  }

  const quizSubmit = document.getElementById('quiz-submit-btn');
  if (quizSubmit) {
    quizSubmit.addEventListener('click', () => {
      const q1 = document.querySelector('input[name="q1"]:checked')?.value || 'earth';
      const q2 = document.querySelector('input[name="q2"]:checked')?.value || 'water';
      const q3 = document.querySelector('input[name="q3"]:checked')?.value || 'fire';
      const q4 = document.querySelector('input[name="q4"]:checked')?.value || 'air';

      const tallies = { earth: 0, water: 0, fire: 0, air: 0, avatar: 0 };
      [q1, q2, q3, q4].forEach(val => tallies[val] = (tallies[val] || 0) + 1);

      let dominantElement = 'earth';
      let maxCount = -1;
      for (const el in tallies) {
        if (tallies[el] > maxCount) {
          maxCount = tallies[el];
          dominantElement = el;
        }
      }

      showQuizResult(dominantElement);
    });
  }
}

function resetQuiz() {
  const form = document.getElementById('quiz-form');
  const resultContainer = document.getElementById('quiz-result');
  if (form) form.classList.remove('hidden');
  if (resultContainer) resultContainer.classList.add('hidden');
}

function showQuizResult(element) {
  const form = document.getElementById('quiz-form');
  const resultContainer = document.getElementById('quiz-result');
  const title = document.getElementById('quiz-result-element');
  const desc = document.getElementById('quiz-result-description');
  const rec = document.getElementById('quiz-result-recommendation');

  if (form) form.classList.add('hidden');
  if (resultContainer) resultContainer.classList.remove('hidden');

  const archetypes = {
    earth: {
      title: 'Earth Anchor (Grounding & Restoration)',
      desc: 'Your nervous system is calling for safety, deep rest, and physical replenishment. Autopilot burnout has drained your reserves.',
      rec: 'We recommend the Standard Experience with Amapola Villa or Queen Suite, paired with the 90-Minute Therapeutic Bodywork and Beach Bonfire grounding.'
    },
    water: {
      title: 'Water Alchemist (Emotional Flow & Release)',
      desc: 'You are ready to let go of old mental luggage and soften into genuine vulnerability and fluid strength.',
      rec: 'Your soul thrives in flow. Prioritize the Rainmaker Waterfall hike, Hanging Bridges, and our Emotional Alchemy workshop.'
    },
    fire: {
      title: 'Fire Igniter (Courage & Power)',
      desc: 'You have a breakthrough waiting to happen. You need intentional challenge to rewrite fear into sovereign leadership.',
      rec: 'We recommend the VIP Package with Jungle Horseback Riding, Temazcal Sweat Lodge, and a 1-on-1 private strategy session with Carly Anne.'
    },
    air: {
      title: 'Air Visionary (Clarity & Perspective)',
      desc: 'You are seeking the space between your thoughts. Overthinking has clouded your intuition.',
      rec: 'Focus on our daily Pranayama Breathwork, Canopy Ziplining, and "The Space Between Your Thoughts" White Party workshop.'
    }
  };

  const arch = archetypes[element] || archetypes.earth;
  if (title) title.textContent = arch.title;
  if (desc) desc.textContent = arch.desc;
  if (rec) rec.textContent = arch.rec;
}

/* ==========================================================================
   7. Lightbox Image Viewer
   ========================================================================== */
function initLightbox() {
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('close-lightbox');

  if (!lightboxModal) return;

  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const src = item.getAttribute('data-lightbox-src') || item.getAttribute('src');
      const caption = item.getAttribute('data-lightbox-caption') || item.getAttribute('alt') || '';

      if (lightboxImg) lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightboxModal.classList.add('open');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => lightboxModal.classList.remove('open'));
  }
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) lightboxModal.classList.remove('open');
  });
}

/* ==========================================================================
   8. Stripe Gateway Status Badge
   ========================================================================== */
async function initStripeStatus() {
  const badge = document.getElementById('stripe-status-badge');
  if (!badge) return;

  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    if (data.isConfigured) {
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
        <span class="text-emerald-400 font-mono text-[11px] uppercase tracking-wider">Stripe Connected (${data.mode.toUpperCase()})</span>
      `;
    } else {
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
        <span class="text-amber-300 font-mono text-[11px] uppercase tracking-wider">Stripe Sandbox (Test Mode)</span>
        <a href="/stripe-setup.html" class="underline hover:text-white ml-1">Setup Keys</a>
      `;
    }
  } catch (e) {
    // offline / static preview mode
  }
}

/* ==========================================================================
   9. Mobile Navigation Drawer & Touch Tooltips
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const closeBtn = document.getElementById('close-mobile-nav');

  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.classList.add('hidden');
    drawer.style.display = 'none';
    document.body.classList.remove('overflow-hidden');
  };

  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.classList.remove('hidden');
    drawer.style.display = 'flex';
    document.body.classList.add('overflow-hidden');
  };

  if (toggle && drawer) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = drawer.classList.contains('is-open') || drawer.style.display === 'flex';
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawer();
    });
  }

  // Auto-close on link click
  if (drawer) {
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });
  }

  // Escape key closes drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
}

function initIconNavTooltips() {
  const iconItems = document.querySelectorAll('.nav-icon-item');
  if (!iconItems.length) return;

  iconItems.forEach(item => {
    const btn = item.querySelector('.nav-icon-btn');
    if (!btn) return;

    // Handle touch event for mobile / tablet devices
    let touchMoved = false;
    btn.addEventListener('touchmove', () => { touchMoved = true; }, { passive: true });

    btn.addEventListener('touchend', (e) => {
      if (touchMoved) {
        touchMoved = false;
        return;
      }
      
      const isOpen = item.classList.contains('touch-open');
      // If not yet open on touch, show tooltip on first touch
      if (!isOpen) {
        e.preventDefault();
        iconItems.forEach(other => other.classList.remove('touch-open'));
        item.classList.add('touch-open');
      }
      // If already open, the touch will naturally trigger link navigation
    });

    // Handle mouse enter / leave for desktop hover
    item.addEventListener('mouseenter', () => {
      item.classList.add('touch-open');
    });
    item.addEventListener('mouseleave', () => {
      item.classList.remove('touch-open');
    });
  });

  // Tap outside closes any active tooltip
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.nav-icon-item')) {
      iconItems.forEach(item => item.classList.remove('touch-open'));
    }
  }, { passive: true });
}

/* ==========================================================================
   10. Newsletter & Lead Magnet (The Arrive Reset)
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const successMsg = document.getElementById('newsletter-success');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('newsletter-name');
    const emailInput = document.getElementById('newsletter-email');
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = nameInput ? nameInput.value : '';
    const email = emailInput ? emailInput.value : '';

    if (!email) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Joining...';
    }

    try {
      await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          type: 'Newsletter',
          message: 'Requested The Arrive Reset lead magnet guide'
        })
      });
    } catch (err) {
      console.log('Newsletter registered locally');
    }

    form.classList.add('hidden');
    if (successMsg) successMsg.classList.remove('hidden');
  });
}
