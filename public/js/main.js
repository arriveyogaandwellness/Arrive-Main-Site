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
  injectWhyRetreatSection();
  removeAgencyCredit();
  initHeroPoster();
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
/* Theme 6: Peacock Lagoon — picker card injected via JS so the new theme
   appears in the theme drawer on every page without duplicating markup
   across all HTML files. Added 2026-10-02 (Stella). */
function injectPeacockLagoonCard() {
  const drawer = document.getElementById('theme-drawer');
  if (!drawer || drawer.querySelector('[data-theme-id="peacock-lagoon"]')) return;
  drawer.insertAdjacentHTML('beforeend', `
    <!-- Theme 6: Peacock Lagoon -->
    <div class="theme-card-option" data-theme-id="peacock-lagoon" data-set-theme="peacock-lagoon">
      <div>
        <strong class="text-white text-sm block">06. Peacock Lagoon \ud83e\udd9a</strong>
        <span class="text-xs text-slate-400">Deep ocean teal, emerald &amp; flashes of feather gold</span>
      </div>
      <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-300 to-amber-400 border border-white/40 shadow-sm"></div>
    </div>`);
}


/* Why The Retreat — home hero section injected via JS (kept in main.js so the
   copy stays in one place; content adapted from "Why The Art of Arrival
   Retreat Works" — Office Arrive Drive docs. Added 2026-10-03 (Stella). */
function injectWhyRetreatSection() {
  if (document.getElementById('why-retreat')) return;
  const video = document.querySelector('video[aria-label="Amanti Resort promotional video"]');
  if (!video) return;
  const container = video.closest('.aspect-video');
  if (!container) return;
  container.insertAdjacentHTML('afterend', `
<!-- Why The Retreat -->
      <div id="why-retreat" class="luxe-card w-full max-w-6xl mx-auto p-6 sm:p-10 md:p-12 mb-10 sm:mb-14 text-left relative overflow-hidden">
        <div class="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span class="badge-rainbow"><i data-lucide="sparkles" class="w-3.5 h-3.5 text-pink-500"></i>Why The Art of Arrival</span>
          <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl text-slate-900 mt-4 mb-4">More Than <span class="text-rainbow">a Vacation</span></h2>
          <p class="text-slate-600 text-base sm:text-lg font-light leading-relaxed">This isn&rsquo;t just a vacation. It&rsquo;s a structured nervous system reset, a community laboratory, and a nature-immersive experience &mdash; designed to help you remember who you are and what you&rsquo;re capable of.</p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div class="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 text-center">
            <div class="w-10 h-10 mx-auto mb-2 rounded-full border border-[var(--border-subtle)] flex items-center justify-center"><i data-lucide="activity" class="w-5 h-5 text-[var(--accent-gold)]"></i></div>
            <h3 class="font-serif text-lg text-slate-900 mb-1">Body</h3>
            <p class="text-slate-600 text-xs font-light">Strength, mobility &amp; deep rest</p>
          </div>
          <div class="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 text-center">
            <div class="w-10 h-10 mx-auto mb-2 rounded-full border border-[var(--border-subtle)] flex items-center justify-center"><i data-lucide="brain" class="w-5 h-5 text-[var(--accent-gold)]"></i></div>
            <h3 class="font-serif text-lg text-slate-900 mb-1">Mind</h3>
            <p class="text-slate-600 text-xs font-light">Clarity, focus &amp; emotional regulation</p>
          </div>
          <div class="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 text-center">
            <div class="w-10 h-10 mx-auto mb-2 rounded-full border border-[var(--border-subtle)] flex items-center justify-center"><i data-lucide="heart" class="w-5 h-5 text-[var(--accent-gold)]"></i></div>
            <h3 class="font-serif text-lg text-slate-900 mb-1">Heart</h3>
            <p class="text-slate-600 text-xs font-light">Connection, courage &amp; healing</p>
          </div>
          <div class="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 text-center">
            <div class="w-10 h-10 mx-auto mb-2 rounded-full border border-[var(--border-subtle)] flex items-center justify-center"><i data-lucide="sparkles" class="w-5 h-5 text-[var(--accent-gold)]"></i></div>
            <h3 class="font-serif text-lg text-slate-900 mb-1">Spirit</h3>
            <p class="text-slate-600 text-xs font-light">Meaning, purpose &amp; alignment</p>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-8 sm:mb-10">
          <div class="flex gap-3">
            <div class="w-10 h-10 rounded-full border border-[var(--border-subtle)] flex items-center justify-center shrink-0"><i data-lucide="waves" class="w-5 h-5 text-[var(--accent-gold)]"></i></div>
            <div><h4 class="font-bold text-slate-900 text-sm mb-0.5">Nervous System Reset</h4><p class="text-slate-600 text-xs font-light leading-relaxed">Gentle practices signal safety to your body, easing anxiety, tension, and burnout.</p></div>
          </div>
          <div class="flex gap-3">
            <div class="w-10 h-10 rounded-full border border-[var(--border-subtle)] flex items-center justify-center shrink-0"><i data-lucide="moon" class="w-5 h-5 text-[var(--accent-gold)]"></i></div>
            <div><h4 class="font-bold text-slate-900 text-sm mb-0.5">Deep Rest &amp; Better Sleep</h4><p class="text-slate-600 text-xs font-light leading-relaxed">Guided relaxation, nature, and tech-free time help your body remember how to recharge.</p></div>
          </div>
          <div class="flex gap-3">
            <div class="w-10 h-10 rounded-full border border-[var(--border-subtle)] flex items-center justify-center shrink-0"><i data-lucide="dumbbell" class="w-5 h-5 text-[var(--accent-gold)]"></i></div>
            <div><h4 class="font-bold text-slate-900 text-sm mb-0.5">Stronger, Freer Body</h4><p class="text-slate-600 text-xs font-light leading-relaxed">Accessible yoga, mobility, and mindful movement support joints, fascia, and posture.</p></div>
          </div>
          <div class="flex gap-3">
            <div class="w-10 h-10 rounded-full border border-[var(--border-subtle)] flex items-center justify-center shrink-0"><i data-lucide="users" class="w-5 h-5 text-[var(--accent-gold)]"></i></div>
            <div><h4 class="font-bold text-slate-900 text-sm mb-0.5">Real Connection</h4><p class="text-slate-600 text-xs font-light leading-relaxed">Meet aligned humans, share stories, and remember you&rsquo;re not alone in your growth.</p></div>
          </div>
          <div class="flex gap-3">
            <div class="w-10 h-10 rounded-full border border-[var(--border-subtle)] flex items-center justify-center shrink-0"><i data-lucide="compass" class="w-5 h-5 text-[var(--accent-gold)]"></i></div>
            <div><h4 class="font-bold text-slate-900 text-sm mb-0.5">Clarity &amp; Confidence</h4><p class="text-slate-600 text-xs font-light leading-relaxed">Step beyond your comfort zone &mdash; safely &mdash; and build trust in yourself and your next steps.</p></div>
          </div>
          <div class="flex gap-3">
            <div class="w-10 h-10 rounded-full border border-[var(--border-subtle)] flex items-center justify-center shrink-0"><i data-lucide="leaf" class="w-5 h-5 text-[var(--accent-gold)]"></i></div>
            <div><h4 class="font-bold text-slate-900 text-sm mb-0.5">Nature Immersion</h4><p class="text-slate-600 text-xs font-light leading-relaxed">Waterfalls, ocean air, and rainforest greens scientifically support mood and immunity.</p></div>
          </div>
        </div>

        <div class="text-center border-t border-[var(--border-subtle)] pt-6 sm:pt-8">
          <p class="font-serif text-xl sm:text-2xl text-slate-900 mb-2">You won&rsquo;t just return relaxed. <span class="text-rainbow font-bold">You return with tools.</span></p>
          <p class="text-slate-600 text-sm font-light mb-4 max-w-2xl mx-auto">Breath practices, mindset frameworks, rituals &mdash; and the felt sense of &ldquo;I can do hard things, and beautiful things, on purpose.&rdquo;</p>
          <p class="font-mono text-xs tracking-[0.3em] uppercase text-[var(--accent-gold)]">Root down &bull; Rise up &bull; Arrive</p>
        </div>
      </div>
  `);
  if (window.lucide) window.lucide.createIcons();
}


/* Remove legacy agency credit wording wherever it appears. (The full home.html
   exceeds the direct-push size limit, so its instance is handled here via
   text-node cleanup.) Added 2026-10-03 (Stella). */
function removeAgencyCredit() {
  try {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const targets = [];
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.includes('Diamond Cut Entertainment')) targets.push(walker.currentNode);
    }
    targets.forEach(n => {
      n.nodeValue = n.nodeValue.replace(' represented by Diamond Cut Entertainment', '');
    });
  } catch (e) { /* non-fatal */ }
}

function initThemeEngine() {
  injectPeacockLagoonCard();
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
   2. Retreat Audio Player
   ========================================================================== */
function initAudioAmbience() {
  const tracks = [
    { title: 'The Art of Arrival Track (1)', src: '/assets/Audio/The%20Art%20of%20Arrival%20Track%20(1).mp3' },
    { title: 'The Art of Arrival Track (2)', src: '/assets/Audio/The%20Art%20of%20Arrival%20Track%20(2).mp3' },
    { title: 'The Journey Home', src: '/assets/Audio/The%20Journey%20Home.mp3' }
  ];

  document.querySelectorAll('.audio-dock').forEach(dock => {
    const toggleBtn = dock.querySelector('#audio-ambient-toggle');
    const soundWave = dock.querySelector('.sound-wave');
    const label = dock.querySelector('#audio-label, #home-promo-sound-label');
    if (!toggleBtn) return;

    const panel = document.createElement('div');
    panel.id = 'audio-player-panel';
    panel.className = 'audio-player-panel';
    panel.setAttribute('aria-label', 'Audio tracks');
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML = `
      <p class="audio-player-heading">Choose a track</p>
      <div class="audio-track-list" role="group" aria-label="Available tracks"></div>
      <audio class="audio-player-controls" controls preload="none"></audio>
      <p class="audio-player-status" aria-live="polite"></p>
    `;
    dock.append(panel);

    const audio = panel.querySelector('audio');
    const trackList = panel.querySelector('.audio-track-list');
    const status = panel.querySelector('.audio-player-status');
    let selectedIndex = 0;

    const updateSelectedTrack = () => {
      trackList.querySelectorAll('button').forEach((trackButton, index) => {
        const isSelected = index === selectedIndex;
        trackButton.setAttribute('aria-pressed', String(isSelected));
        trackButton.classList.toggle('is-selected', isSelected);
      });
      if (label) label.textContent = tracks[selectedIndex].title;
    };

    tracks.forEach((track, index) => {
      const trackButton = document.createElement('button');
      trackButton.className = 'audio-track-button';
      trackButton.type = 'button';
      trackButton.textContent = track.title;
      trackButton.addEventListener('click', async () => {
        selectedIndex = index;
        updateSelectedTrack();
        status.textContent = '';
        audio.src = track.src;
        audio.load();
        try {
          await audio.play();
        } catch (error) {
          status.textContent = 'Unable to play this track. Please try again.';
        }
      });
      trackList.append(trackButton);
    });

    audio.src = tracks[selectedIndex].src;
    updateSelectedTrack();

    toggleBtn.type = 'button';
    toggleBtn.setAttribute('aria-controls', 'audio-player-panel');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Choose an audio track');
    toggleBtn.title = 'Choose an audio track';
    toggleBtn.addEventListener('click', () => {
      const isOpen = dock.classList.toggle('is-open');
      panel.setAttribute('aria-hidden', String(!isOpen));
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    audio.addEventListener('play', () => {
      if (soundWave) soundWave.classList.remove('paused');
      if (label) label.textContent = `Playing: ${tracks[selectedIndex].title}`;
      status.textContent = '';
    });
    audio.addEventListener('pause', () => {
      if (soundWave) soundWave.classList.add('paused');
      if (!audio.ended && label) label.textContent = tracks[selectedIndex].title;
    });
    audio.addEventListener('error', () => {
      if (soundWave) soundWave.classList.add('paused');
      status.textContent = 'This track could not be loaded.';
      if (label) label.textContent = 'Track unavailable';
    });

    document.addEventListener('click', event => {
      if (!dock.contains(event.target)) {
        dock.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
    dock.addEventListener('keydown', event => {
      if (event.key === 'Escape' && dock.classList.contains('is-open')) {
        dock.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.focus();
      }
    });

    dock.classList.add('is-open', 'audio-player-intro');
    panel.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    window.setTimeout(() => {
      dock.classList.remove('is-open', 'audio-player-intro');
      panel.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }, 2000);
  });
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

  const applyMobileNavContrast = () => {
    if (!drawer) return;

    drawer.querySelectorAll('.mobile-nav-item strong').forEach(el => {
      el.style.color = '#f8f4ee';
    });

    drawer.querySelectorAll('.mobile-nav-item span').forEach(el => {
      el.style.color = '#f7c872';
    });
  };

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
      applyMobileNavContrast();
    });
  }

  applyMobileNavContrast();

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
/* Home hero backdrop — "welcome-background.png" from Drive (Arrive Assets),
   swapped in 2026-10-04 per Peter (replaces the earlier chat-uploaded poster).
   Served as base64 chunks because the GitHub connector is text-only.
   Rendered nearly opaque per Peter: "make it less transparent". */
function initHeroPoster() {
  var hero = document.getElementById('hero');
  if (!hero) return;
  function load(src) {
    return new Promise(function (res) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { res(true); };
      s.onerror = function () { res(false); };
      document.head.appendChild(s);
    });
  }
  function apply() {
    try {
      var b64 = window.__heroWelcomeB64;
      if (!b64 || b64.length < 50000) return;
      var st = document.createElement('style');
      st.textContent = '@keyframes heroPosterDrift{0%{transform:scale(1.03)}50%{transform:scale(1.13) translate(-1.2%,1%)}100%{transform:scale(1.03)}}'
        + '.hero-poster-bg{animation:heroPosterDrift 42s ease-in-out infinite;will-change:transform}'
        + '@media (prefers-reduced-motion:reduce){.hero-poster-bg{animation:none}}';
      document.head.appendChild(st);
      var bg = hero.firstElementChild;
      if (!bg) return;
      var img = bg.querySelector('img');
      if (img) {
        img.src = 'data:image/jpeg;base64,' + b64;
        img.alt = 'Welcome to Arrive \u2014 visionary jungle artwork';
        img.className = 'hero-poster-bg w-full h-full object-cover object-center opacity-95';
      }
      var kids = bg.children;
      if (kids[1]) kids[1].className = 'absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-[var(--bg-primary)]';
      if (kids[2]) kids[2].className = 'absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/25 via-transparent to-transparent';
    } catch (e) { /* backdrop is decorative; never break the page */ }
  }
  var tag = document.querySelector('script[src*="js/main.js"]');
  var prefix = tag ? tag.src.split('js/main.js')[0] : '';
  Promise.all([
    load(prefix + 'js/hero-welcome-b64-1.js?v=1.0'),
    load(prefix + 'js/hero-welcome-b64-2.js?v=1.0'),
    load(prefix + 'js/hero-welcome-b64-3.js?v=1.0')
  ]).then(apply);
}
