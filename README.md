# THE ART OF ARRIVAL RETREAT — SANCTUARY WEB PLATFORM
**Curated & Hosted by Carly Anne Kasinpila**  
*Playa Hermosa, Costa Rica @ Amanti Sanctuary*  
*High-Fashion Editorial Vogue Aesthetics × Trauma-Informed Nervous System Somatics*

---

## 🌺 Overview

This is the production-ready master website for **The Art of Arrival Retreats**, designed with a seamless blend of high-fashion editorial aesthetics (celebrating Carly Anne Kasinpila's background as an international model with Diamond Cut Entertainment and CFDA/NYFW runway artist) and grounded, biophilic luxury wellness in Costa Rica.

Every single material, room specification, menu, price, excursion, and scientific reference from the client's documents has been woven into this platform.

### ✨ Key Features & Architecture

1. **Haute Couture & Vogue Aesthetics**:
   - Custom editorial typography (`Playfair Display`, `Cormorant Garamond`, `Plus Jakarta Sans`, `Space Grotesk`).
   - 5 Dynamic Visual Themes switchable in real-time via the Theme Engine:
     - `01. Couture Noir & Champagne Gold` (Default Haute Editorial)
     - `02. Biophilic Rainforest Emerald` (Lush Costa Rica Sanctuary)
     - `03. Sunset Somatic Terracotta` (Pacific Dusk & Clay)
     - `04. Parisian Atelier Silk` (Light Minimalist Editorial)
     - `05. Avatar Cosmic Spectrum` (High-Vibration Prismatic)
   - Integrated ambient sound synthesizer (Pacific ocean swells, rainforest breeze & 108Hz harmonic sub-tones).

2. **Full Accommodations & Estates Explorer**:
   - **Amapola 5-Bedroom Luxury House**: Sleeps up to 10, 5 beds, 3 baths, 2 kitchens, 2 dining salons, private pool, foosball lounge, and balcony terrace.
   - **Toucan Villa (1,301 ft²)**: 2–3 bedrooms, 2 baths, full kitchen, spacious salon, courtyard pool view, and private rooftop BBQ terrace for stargazing.
   - **Macaw Villa (1,076 ft²)**: 2 bedrooms, private patio, kitchenette, and spa bath.
   - **Honeymoon Queen Suite (431 ft²)**: 1 queen bed with memory foam topper, attached spa bath, kitchenette, and garden patio facing the pool.
   - **Queen Suite**: 1 queen bed + pullout trundle, private kitchenette & bath, workspace (Included in standard package).
   - **Family Studio Suite (431 ft²)**: 2 queen beds side-by-side, kitchenette, bath, and patio.
   - **Shared Sanctuary Spaces**: Café Terrace, SWAY Lounge, Sky Yoga Decks, The Art Gallery.

3. **SWAY Restaurant & Lounge (Gastronomy)**:
   - All meals and non-alcoholic smoothies/juices included.
   - 100% custom meal plans: Vegan, Vegetarian, Gluten-Free, and Detox-Friendly.
   - Fresh organic juice and cold-pressed smoothie bar.
   - Themed dinners matching the 6-day elemental curriculum: Day 1 *"Rooted in Abundance"*, Day 2 *"Go With The Flow"*, Day 3 *"Crouching Yogi, Hidden Lion"*, Day 4 *"It's The Little Things That Count"* (Tapas & All-White Party), Day 5 *"Gratitude Gala"*.

4. **The 6-Day Elemental Pathway (Itinerary)**:
   - Day 1: **Earth** — Arrival & Grounding (Airport transfers, Welcome Bonfire *"From Root to Rise"*, Green & Neutrals dress code).
   - Day 2: **Water** — Seeds of Hope & Flow (Morning Vinyasa, Waterfall jump, Rainmaker Hanging Bridges, Emotional Alchemy workshop, Ocean Blues & Teals).
   - Day 3: **Fire** — Ignite & Transform (Power Yoga, Horseback riding, Temazcal Sweat Lodge, Monkey Cruise, *"Prevention → Pain → Power → Passion → Purpose"*, Crimson & Gold).
   - Day 4: **Air** — Inner Realms & Breath (Pranayama, Canopy Ziplining or Butterfly Sanctuary, Tapas dinner, *"The Space Between Your Thoughts"*, All-White Party).
   - Day 5: **Avatar State** — Integration (Tortuga Island catamaran day trip, snorkeling, beach BBQ, Gratitude Gala Feast, live celebration set with DJ Aphasia, Rainbow dress code).
   - Day 6: **Departure** — *"What If I Fly?"* (Morning stretch, farewell breakfast, SJO airport shuttles).

5. **Excursions & 5-Star Spa Menu with Exact Pricing**:
   - Beach Bonfire (Included, $0)
   - Rainforest Waterfalls ($25)
   - Rainmaker Hanging Bridges Add-on ($25)
   - ATV & Buggies to Waterfall Jump ($100)
   - Waterfall Rappelling ($60)
   - Playa Hermosa Black Sand Beach (Included, $0)
   - Beach & Jungle Horseback Riding ($70)
   - Temazcal Sacred Sweat Lodge ($80)
   - Monkey Mangrove River Cruise ($60)
   - Butterfly Gardens Sanctuary ($25)
   - Canopy Zipline Tour ($75+)
   - Tortuga Island Full-Day Catamaran ($160)
   - **Spa Menu**: 60-Min Massage ($75), 90-Min Massage ($125), 30-Min Beachfront Reflexology ($50), Manicure/Pedicure ($50/$60/$100), Facials & Wraps (On request).
   - **Transportation**: Luxury Sprinters (14–17 pax), Coach Bus (24 pax), Airport Run ($150 up to 4 guests + $25/extra).

6. **Curator Biography & Credentials**:
   - Carly Anne Kasinpila's full story: University of Florida B.S. in Business Administration, Cornell University accounting certification, 500-hour YTT, 12 years personal practice, 9 years professional instruction.
   - Modeling with Diamond Cut Entertainment, NYFW runway, and fine artist portfolio (fire dancing, acrylic painting, piano, aerial silks).
   - Father Howard "Barry" Appledorf's legacy as karaoke pioneer in the U.S. (*Sing A Song & Karaoke Store*).
   - International upbringing in Thailand; teaching at Warner Brothers, music festivals, and Israel mountain under the stars.
   - Press Honors: *"Top 30 Inspirational Women To Look Out For In 2026"* (NY Weekly).
   - Interactive Letter from the Host (Option A vs. Option B switcher).
   - The ARRIVE Framework™: Anchor, Reveal, Rewrite, Integrate, Voice, Embody.

7. **Interactive Custom Retreat Cost Calculator & Direct Stripe Checkout**:
   - Real-time price updates based on package (Standard $2,200 vs VIP $3,100), room choice, excursions, spa treatments, and airport transportation.
   - $500 Deposit toggle vs. Full Payment toggle.
   - Direct integration with Stripe Checkout.
   - Inquiries and bookings logged to `data/bookings.json`.

8. **Retreat Readiness Quiz / Elemental Diagnostic**:
   - 4 intuitive questions assessing the guest's nervous system state, revealing their primary element (Earth, Water, Fire, Air) and personal package recommendation.

---

## 💳 Stripe Merchant Account Setup

The website has a full Node.js / Express backend with native Stripe SDK integration.

### Method 1: Via the Visual Portal (Easiest)
1. Start the server (see instructions below).
2. Open your browser to: **`http://localhost:3000/stripe-setup.html`**
3. Paste your **Stripe Publishable Key** (`pk_live_...` or `pk_test_...`) and **Stripe Secret Key** (`sk_live_...` or `sk_test_...`).
4. Click **Save & Activate Stripe Gateway**. The system automatically updates `.env` and activates live card processing immediately!

### Method 2: Via `.env` File
Open `.env` in the root folder and enter:
```env
PORT=3000
NODE_ENV=production
STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_key
STRIPE_SECRET_KEY=sk_live_your_actual_key
BASE_URL=http://localhost:3000
```

> **Note:** If Stripe keys are not yet entered, the website automatically runs in **Stripe Sandbox / Test Mode**, providing an instant simulated checkout and confirmation page so the entire user flow can be tested without errors!

---

## 💻 Running Locally on Windows

### 1-Click Startup
Double click **`launch.bat`**.  
This script will:
1. Verify dependencies (`npm install`)
2. Launch the Express server on port 3000
3. Automatically open your default web browser to `http://localhost:3000`

### Manual Startup via Terminal
```powershell
cd "C:\Users\bekin\OneDrive\Desktop\Arrive Yoga Corporate\Website Arrive Current Website"
npm install
npm start
```
Open **`http://localhost:3000`** in your browser.

---

## 🚀 Deploying Live to Railway & GitHub

### Step 1: Initialize Git Repository
```powershell
cd "C:\Users\bekin\OneDrive\Desktop\Arrive Yoga Corporate\Website Arrive Current Website"
git init
git add .
git commit -m "Launch The Art of Arrival Sanctuary Website with Stripe Gateway"
```

### Step 2: Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new), named for example: `arrive-yoga-sanctuary`
2. Link your local repo and push:
```powershell
git remote add origin https://github.com/<your-username>/arrive-yoga-sanctuary.git
git branch -M main
git push -u origin main
```

### Step 3: 1-Click Railway Deployment
1. Log into [Railway.app](https://railway.app)
2. Click **+ New Project** → **Deploy from GitHub repo**
3. Select your `arrive-yoga-sanctuary` repository
4. Railway will automatically detect `railway.json`, `nixpacks.toml`, or `Dockerfile` and build the container.
5. In your Railway service **Variables** tab, add your production environment variables:
   - `STRIPE_PUBLISHABLE_KEY` = your live Stripe public key
   - `STRIPE_SECRET_KEY` = your live Stripe secret key
   - `BASE_URL` = `https://your-railway-domain.up.railway.app` (or custom domain `https://arriveyoga.com`)
6. In **Settings** → **Domains**, generate a public domain (or link your custom domain `arriveyoga.com`).
7. Your sanctuary website is live to the world!

---

## 📂 Project Directory Structure

```
Website Arrive Current Website/
│
├── .env                  # Live environment variables (Stripe keys, PORT)
├── .env.example          # Environment template
├── .gitignore            # Git exclusion rules
├── Dockerfile            # Production Docker container
├── launch.bat            # 1-click Windows launcher
├── nixpacks.toml         # Railway build configuration
├── package.json          # Node dependencies (Express, Stripe, Cors, Dotenv)
├── Procfile              # Web process command
├── railway.json          # Railway cloud orchestration
├── README.md             # This comprehensive master manual
├── server.bat            # Direct Node runner
├── server.js             # Express server & Stripe Checkout API
│
├── data/
│   └── bookings.json     # Local store for reservations & inquiries
│
└── public/
    ├── index.html        # Flagship immersive master experience
    ├── about.html        # Carly Anne Kasinpila bio & modeling portfolio
    ├── accommodations.html # Estates, Toucan Villa, Amapola House & specs
    ├── itinerary.html    # 6-Day elemental schedule & excursions pricing
    ├── dining.html       # SWAY Restaurant, menus & juice bar
    ├── method.html       # The ARRIVE Method™ curriculum & science
    ├── pricing.html      # Packages, custom builder & calculator
    ├── stripe-setup.html # Client & admin Stripe setup portal
    ├── booking-success.html # Stripe confirmation & onboarding receipt
    ├── booking-cancel.html  # Paused checkout return page
    │
    ├── css/
    │   └── style.css     # Haute couture styling & design system
    │
    ├── js/
    │   └── main.js       # Theme engine, audio player, calculator & Stripe API
    │
    └── assets/
        ├── carly/        # 51 high-fashion editorial & yoga photos
        ├── rooms/        # 23 villa, suite & interior photos
        ├── resort/       # 69 Costa Rica landscapes, pools & decks
        ├── dining/       # Chef-prepared dishes & organic salads
        ├── press/        # Top 30 Women to Watch in 2026 & articles
        └── video/        # Drone footage & retreat reels
```

---

## 🌿 Contact & Concierge
- **Website**: [everybodyisayogabody.org](https://everybodyisayogabody.org)
- **Direct Phone**: 954-336-7048
- **Email**: hello@arriveyoga.com
- **Curator**: Carly Anne Kasinpila, Founder & CEO
