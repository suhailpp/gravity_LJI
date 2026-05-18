// ============ GRAVITY · Shared UI ============
const { useState, useEffect, useRef, useMemo, useLayoutEffect } = React;

/* ──────────────────────────────────────────────────────────────────────
   OFFERS_DATA — single source of truth for every offer count rendered
   anywhere in the app. Dashboard pipeline, dashboard Live Offers grid,
   Offer List header & tab counts, drawer detail — all derive from this.
   No counts are hardcoded; every consumer filters this array.

   Status values map to the dashboard pipeline buckets:
     draft → "Draft", review → "Review", live → "Live",
     scheduled (kept separate) and expired/ended → "Expired".
   ────────────────────────────────────────────────────────────────────── */
const OFFERS_DATA = [
  { id:1,  code:'MA', sponsor:'Marriott Bonvoy', brand:'Marriott Bonvoy', name:'Flat 50% Off Weekend Stays',     desc:'Two-night weekend bookings at 50% off across UAE Bonvoy properties for Gold and Platinum members.', cat:'Hotels',        mech:'BOGO',      tiers:['Gold','Plat'],     region:['Dubai','Abu Dhabi'], status:'live',      signal:'trending', health:87,   delta:12,  target:96, trend7:[62,68,71,74,78,83,87], cid:'EMSK_MA_BOGO_MAY24', image:'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=70', range:{kind:'range', from:'May 1', to:'Jun 30'},                  trophy:false },
  { id:2,  code:'CA', sponsor:'Careem',          brand:'Careem',          name:'10% Cashback on Every Ride',     desc:'Members earn 10% Skywards Miles cashback on every Careem ride completed in Dubai and Sharjah.',     cat:'Rides',         mech:'Cashback',  tiers:['Blue','Silver'],   region:['Dubai','Sharjah'],   status:'live',      signal:'fast',     health:74,   delta:8,   target:80, trend7:[58,60,64,67,69,72,74], cid:'EMSK_CA_EARN_MAY24', range:{kind:'range', from:'May 5', to:'Jun 15'},                  trophy:false },
  { id:3,  code:'NO', sponsor:'Noon',            brand:'Noon',            name:'3× Miles on All Bookings',       desc:'Triple Miles accelerator on every Noon purchase for one month — all tiers, no spend minimum.',       cat:'E-commerce',    mech:'Points ×N', tiers:['All Tiers'],       region:['All UAE'],           status:'live',      signal:'losing',   health:41,   delta:-15, target:75, trend7:[68,65,60,56,52,47,41], cid:'EMSK_NO_RAM_MAY24', image:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=70',  range:{kind:'range-expiring', from:'May 5', to:'Jun 15', expires:'12d'}, trophy:true  },
  { id:4,  code:'CF', sponsor:'Cult.fit',        brand:'Cult.fit',        name:'1 Month Free Cult.fit Access',   desc:'Complimentary 30-day Cult.fit pass for Gold-tier members redeemable at any Dubai studio.',           cat:'Lifestyle',     mech:'Voucher',   tiers:['Gold'],            region:['Dubai'],             status:'live',      signal:'elite',    health:81,   delta:5,   target:85, trend7:[72,74,75,77,78,80,81], cid:'EMSK_CF_FIT_MAY24',  range:{kind:'range', from:'May 10', to:'Jul 31'},                 trophy:false },
  { id:5,  code:'BM', sponsor:'BookMyShow',      brand:'BookMyShow',      name:'Buy 2 Tickets Get 1 Free',       desc:'Buy two cinema tickets and get a third free across BookMyShow venues in Dubai and Abu Dhabi.',      cat:'Entertainment', mech:'BOGO',      tiers:['Silver','Gold'],   region:['Dubai','Abu Dhabi'], status:'live',      signal:'expiring', health:89,   delta:9,   target:90, trend7:[78,80,82,84,85,87,89], cid:'EMSK_BM_EXP_MAY24', image:'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=70',  range:{kind:'expiring', label:'4 days left'},                     trophy:false },
  { id:6,  code:'EM', sponsor:'Emirates',        brand:'Emirates',        name:'Complimentary Business Upgrade', desc:'Platinum members receive a complimentary one-time Business cabin upgrade on any DXB–AUH segment.',   cat:'Travel',        mech:'BOGO',      tiers:['Platinum'],        region:['DXB','AUH'],         status:'live',      signal:null,       health:63,   delta:6,   target:70, trend7:[55,58,60,59,61,62,63], cid:'EMSK_EM_BIZ_APR24',  range:{kind:'range', from:'Apr 1', to:'Jun 30'},                  trophy:false },

  /* ── Scheduled ── */
  { id:7,  code:'CH', sponsor:'Chalhoub',        brand:'Chalhoub',        name:'20% Off Luxury Collections',     desc:'Twenty percent off curated luxury collections at Chalhoub partner boutiques in Dubai.',              cat:'Luxury',        mech:'Flat Off',  tiers:['Gold','Plat'],     region:['Dubai'],             status:'scheduled', signal:null,       health:null, delta:0,   target:0,  trend7:[],                     cid:'EMSK_CH_LUX_JUN24',  range:{kind:'starts', label:'Starts Jun 1'},                      trophy:false },

  /* ── In Review ── */
  { id:8,  code:'TH', sponsor:'Talabat',         brand:'Talabat',         name:'AED 25 Off Weekend Orders',      desc:'AED 25 off Talabat weekend orders above AED 100 for Silver and Gold members across the UAE.',        cat:'Food',          mech:'Flat Off',  tiers:['Silver','Gold'],   region:['All UAE'],           status:'review',    signal:null,       health:null, delta:0,   target:0,  trend7:[],                     cid:'EMSK_TH_FLAT_JUL24', range:{kind:'starts', label:'Starts Jul 5'},                      trophy:false },

  /* ── Drafts ── */
  { id:9,  code:'AS', sponsor:'Almosafer',       brand:'Almosafer',       name:'Family Holiday Bonus',           desc:'Bonus Miles on family holiday bookings to GCC destinations — currently being scoped with partner.',  cat:'Travel',        mech:'Points ×N', tiers:['All Tiers'],       region:['All UAE'],           status:'draft',     signal:null,       health:null, delta:0,   target:0,  trend7:[],                     cid:'DRAFT_AS_FAM',       range:{kind:'draft', label:'Draft'},                              trophy:false },
  { id:10, code:'CR', sponsor:'Carrefour',       brand:'Carrefour',       name:'Grocery Cashback Boost',         desc:'Cashback boost on Carrefour grocery purchases — draft pending sponsor sign-off.',                    cat:'Retail',        mech:'Cashback',  tiers:['Blue','Silver'],   region:['All UAE'],           status:'draft',     signal:null,       health:null, delta:0,   target:0,  trend7:[],                     cid:'DRAFT_CR_GROC',      range:{kind:'draft', label:'Draft'},                              trophy:false },

  /* ── Expired / Ended ── */
  { id:11, code:'NO', sponsor:'Noon',            brand:'Noon',            name:'Eid Exclusive Gift Voucher',     desc:'Eid-window gift voucher unlocked after qualifying spend at Noon — single-use, all tiers.',           cat:'E-commerce',    mech:'Voucher',   tiers:['All Tiers'],       region:['All UAE'],           status:'ended',   signal:null,       health:null, delta:0,   target:0,  trend7:[],                     cid:'EMSK_NO_EID_APR24',  range:{kind:'ended', label:'Ended Apr 25'},                       trophy:false },
  { id:12, code:'JS', sponsor:'Jumeirah',        brand:'Jumeirah',        name:'Spring Spa Retreat',             desc:'Discounted Jumeirah spa retreat package — campaign window closed.',                                  cat:'Hotels',        mech:'Flat Off',  tiers:['Gold','Plat'],     region:['Dubai'],             status:'ended',   signal:null,       health:null, delta:0,   target:0,  trend7:[],                     cid:'EMSK_JS_SPA_FEB24',  range:{kind:'ended', label:'Ended Mar 31'},                       trophy:false },

  /* ── Additional Live ── */
  { id:13, code:'TE', sponsor:'The Entertainer',  brand:'The Entertainer', name:'Buy 1 Get 1 Dining Pass',        desc:'BOGO dining access at 500+ Entertainer partner restaurants across the UAE.',                         cat:'Lifestyle',     mech:'BOGO',      tiers:['Silver','Gold'],   region:['Dubai','Abu Dhabi','Sharjah'], status:'live', signal:'trending', health:78, delta:7,  target:85, trend7:[60,63,67,70,73,76,78], cid:'EMSK_TE_BOGO_MAY24', range:{kind:'range', from:'May 3', to:'Jul 3'},              trophy:false },
  { id:14, code:'LH', sponsor:'Lulu Hypermarket', brand:'Lulu Hypermarket',name:'5% Cashback on Groceries',       desc:'Five percent Miles-cashback on Lulu grocery purchases above AED 200 — all tiers.',                   cat:'Retail',        mech:'Cashback',  tiers:['All Tiers'],       region:['All UAE'],          status:'live',     signal:'fast',     health:72, delta:6,  target:80, trend7:[55,58,62,65,68,70,72], cid:'EMSK_LH_CASH_MAY24', range:{kind:'range', from:'May 1', to:'Jun 30'},             trophy:false },
  { id:15, code:'SD', sponsor:'Sharaf DG',        brand:'Sharaf DG',       name:'2× Miles on Electronics',        desc:'Double Skywards Miles on Sharaf DG electronics over AED 500 — Silver and above.',                    cat:'Electronics',   mech:'Points ×N', tiers:['Silver','Gold','Plat'], region:['Dubai','Abu Dhabi'], status:'live', signal:'elite',   health:84, delta:4,  target:88, trend7:[76,78,79,80,82,83,84], cid:'EMSK_SD_2X_MAY24',   range:{kind:'range', from:'May 8', to:'Jul 8'},             trophy:false },
  { id:16, code:'ET', sponsor:'Etihad',           brand:'Etihad',          name:'30% Off Codeshare Flights',      desc:'Thirty percent off Etihad codeshare flights from AUH and DXB for Platinum members.',                 cat:'Travel',        mech:'Flat Off',  tiers:['Platinum'],        region:['DXB','AUH'],        status:'live',     signal:'trending', health:91, delta:11, target:92, trend7:[80,82,85,87,88,90,91], cid:'EMSK_ET_FLT_MAY24', image:'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=70',  range:{kind:'range', from:'May 1', to:'Jul 31'},             trophy:true  },
  { id:17, code:'DU', sponsor:'Du',               brand:'Du',              name:'AED 50 Off Postpaid Bill',       desc:'AED 50 off any Du postpaid bill for Skywards members on auto-pay.',                                  cat:'Telecom',       mech:'Flat Off',  tiers:['Blue','Silver','Gold'], region:['All UAE'],      status:'live',     signal:null,       health:68, delta:3,  target:75, trend7:[62,63,65,66,67,67,68], cid:'EMSK_DU_BILL_MAY24', range:{kind:'range', from:'May 5', to:'Jun 30'},             trophy:false },
  { id:18, code:'ES', sponsor:'Etisalat',         brand:'Etisalat',        name:'3× Miles on Data Top-up',        desc:'Triple Miles when topping up Etisalat data bundles — short-window flash promo.',                     cat:'Telecom',       mech:'Flash',     tiers:['All Tiers'],       region:['All UAE'],          status:'live',     signal:'fast',     health:77, delta:9,  target:82, trend7:[65,67,70,72,74,76,77], cid:'EMSK_ES_FLASH_MAY24',range:{kind:'expiring', label:'6 days left'},               trophy:false },
  { id:19, code:'VC', sponsor:'VOX Cinemas',      brand:'VOX Cinemas',     name:'Free Popcorn with Ticket',       desc:'Complimentary regular popcorn with any VOX ticket booked using Miles — all tiers.',                  cat:'Entertainment', mech:'Voucher',   tiers:['All Tiers'],       region:['Dubai','Abu Dhabi','Sharjah'], status:'live', signal:null,        health:65, delta:2,  target:75, trend7:[60,61,62,63,64,64,65], cid:'EMSK_VC_POP_MAY24',  range:{kind:'range', from:'May 6', to:'Jul 6'},              trophy:false },
  { id:20, code:'IK', sponsor:'IKEA',             brand:'IKEA',            name:'AED 100 Off Furniture',          desc:'AED 100 off IKEA orders above AED 500 — Gold and Platinum members only.',                            cat:'Retail',        mech:'Flat Off',  tiers:['Gold','Plat'],     region:['Dubai','Abu Dhabi'], status:'live',    signal:'elite',    health:82, delta:6,  target:86, trend7:[72,74,76,78,80,81,82], cid:'EMSK_IK_FURN_MAY24', range:{kind:'range', from:'May 2', to:'Jun 15'},             trophy:false },
  { id:21, code:'FA', sponsor:'Faces',            brand:'Faces',           name:'15% Off Beauty Splurge',         desc:'Fifteen percent off Faces beauty range across all Chalhoub locations.',                              cat:'Beauty',        mech:'Flat Off',  tiers:['Silver','Gold'],   region:['Dubai'],            status:'live',     signal:'losing',   health:48, delta:-9, target:70, trend7:[60,58,55,53,50,49,48], cid:'EMSK_FA_BEAU_MAY24', range:{kind:'range', from:'May 4', to:'Jul 4'},              trophy:false },
  { id:22, code:'CP', sponsor:'Centrepoint',      brand:'Centrepoint',     name:'Family Wardrobe Bundle',         desc:'Bundle savings on Centrepoint family wardrobe purchases — all tiers, UAE-wide.',                     cat:'Retail',        mech:'Flat Off',  tiers:['All Tiers'],       region:['All UAE'],          status:'live',     signal:null,       health:70, delta:4,  target:78, trend7:[64,65,67,68,69,70,70], cid:'EMSK_CP_BUND_MAY24', range:{kind:'range', from:'May 10', to:'Jul 31'},            trophy:false },
  { id:23, code:'AT', sponsor:'Atlantis',         brand:'Atlantis',        name:'Stay 3 Pay 2 Suites',            desc:'Three-night stays at the price of two at Atlantis The Palm — Platinum exclusive.',                   cat:'Hotels',        mech:'BOGO',      tiers:['Platinum'],        region:['Dubai'],            status:'live',     signal:'elite',    health:88, delta:5,  target:90, trend7:[80,82,83,85,86,87,88], cid:'EMSK_AT_SUITE_MAY24', image:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=70',range:{kind:'range', from:'May 1', to:'Aug 31'},             trophy:true  },
  { id:24, code:'AN', sponsor:'Anantara',         brand:'Anantara',        name:'Spa Credit AED 200',             desc:'AED 200 spa credit on Anantara stays of 2+ nights — Gold members.',                                  cat:'Hotels',        mech:'Voucher',   tiers:['Gold'],            region:['Abu Dhabi'],        status:'live',     signal:'trending', health:75, delta:8,  target:82, trend7:[63,66,69,71,73,74,75], cid:'EMSK_AN_SPA_MAY24',  range:{kind:'range', from:'May 12', to:'Jul 12'},            trophy:false },
  { id:25, code:'PH', sponsor:'Park Hyatt',       brand:'Park Hyatt',      name:'Breakfast on Us',                desc:'Complimentary breakfast for two on Park Hyatt stays — Silver and above.',                            cat:'Hotels',        mech:'Voucher',   tiers:['Silver','Gold','Plat'], region:['Dubai'],       status:'live',     signal:null,       health:73, delta:5,  target:80, trend7:[65,67,68,70,71,72,73], cid:'EMSK_PH_BFAST_MAY24',range:{kind:'range', from:'May 7', to:'Jun 30'},             trophy:false },
  { id:26, code:'FW', sponsor:'Ferrari World',    brand:'Ferrari World',   name:'2-for-1 Day Pass',               desc:'Two day passes for the price of one at Ferrari World Yas Island.',                                   cat:'Entertainment', mech:'BOGO',      tiers:['Silver','Gold'],   region:['AUH'],              status:'live',     signal:'fast',     health:79, delta:10, target:85, trend7:[64,67,70,73,75,77,79], cid:'EMSK_FW_BOGO_MAY24', range:{kind:'range', from:'May 5', to:'Jun 30'},             trophy:false },
  { id:27, code:'YW', sponsor:'Yas Waterworld',   brand:'Yas Waterworld',  name:'Family Splash Pack',             desc:'Discounted family entry pack for Yas Waterworld — Blue and Silver members.',                         cat:'Entertainment', mech:'Flat Off',  tiers:['Blue','Silver'],   region:['AUH'],              status:'live',     signal:null,       health:67, delta:3,  target:75, trend7:[60,62,63,64,65,66,67], cid:'EMSK_YW_FAM_MAY24',  range:{kind:'range', from:'May 8', to:'Jul 8'},              trophy:false },
  { id:28, code:'CC', sponsor:'Costa Coffee',     brand:'Costa Coffee',    name:'Buy 2 Coffees Get 1 Free',       desc:'Buy two Costa coffees and get a third free — daily redemption cap of one per member.',               cat:'Food',          mech:'BOGO',      tiers:['All Tiers'],       region:['All UAE'],          status:'live',     signal:'trending', health:80, delta:11, target:85, trend7:[65,68,71,74,76,78,80], cid:'EMSK_CC_COF_MAY24', image:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=70',  range:{kind:'range', from:'May 2', to:'Jul 2'},              trophy:false },
  { id:29, code:'SB', sponsor:'Starbucks',        brand:'Starbucks',       name:'Double Star Wednesdays',         desc:'Double Skywards Miles on Starbucks orders every Wednesday — Gold and above.',                        cat:'Food',          mech:'Points ×N', tiers:['Gold','Plat'],     region:['Dubai','Abu Dhabi'], status:'live',    signal:null,       health:71, delta:4,  target:78, trend7:[64,65,67,68,69,70,71], cid:'EMSK_SB_2X_MAY24',   range:{kind:'range', from:'May 6', to:'Aug 6'},              trophy:false },
  { id:30, code:'MC', sponsor:'McDonald\'s',      brand:'McDonalds',       name:'Free Upsize on Meals',           desc:'Free meal upsize on McDonald\'s combos paid with Miles — all tiers.',                                 cat:'Food',          mech:'Voucher',   tiers:['All Tiers'],       region:['All UAE'],          status:'live',     signal:'expiring', health:62, delta:1,  target:70, trend7:[58,59,60,60,61,61,62], cid:'EMSK_MC_UP_MAY24',   range:{kind:'expiring', label:'5 days left'},                trophy:false },
  { id:31, code:'NK', sponsor:'Nike',             brand:'Nike',            name:'20% Off Running Gear',           desc:'Twenty percent off Nike running apparel and footwear for Silver and Gold members.',                  cat:'Sports',        mech:'Flat Off',  tiers:['Silver','Gold'],   region:['Dubai','Abu Dhabi'], status:'live',    signal:'fast',     health:83, delta:9,  target:88, trend7:[70,73,76,78,80,82,83], cid:'EMSK_NK_RUN_MAY24',  range:{kind:'range', from:'May 9', to:'Jul 9'},              trophy:false },

  /* ── Additional Scheduled ── */
  { id:32, code:'AD', sponsor:'Adidas',           brand:'Adidas',          name:'Member-Only Sneaker Drop',       desc:'Early access sneaker drop for Skywards members ahead of public release.',                            cat:'Sports',        mech:'Flash',     tiers:['Platinum'],        region:['Dubai'],             status:'scheduled', signal:null,      health:null, delta:0, target:0, trend7:[],                     cid:'EMSK_AD_DROP_JUN24', range:{kind:'starts', label:'Starts Jun 5'},                 trophy:false },
  { id:33, code:'GG', sponsor:'Gold\'s Gym',      brand:'Gold\'s Gym',     name:'3-Month Membership Voucher',     desc:'Discounted 3-month Gold\'s Gym membership voucher — Gold tier exclusive.',                            cat:'Fitness',       mech:'Voucher',   tiers:['Gold'],            region:['Dubai','Sharjah'],   status:'scheduled', signal:null,      health:null, delta:0, target:0, trend7:[],                     cid:'EMSK_GG_GYM_JUN24',  range:{kind:'starts', label:'Starts Jun 10'},                trophy:false },
  { id:34, code:'HM', sponsor:'H&M',              brand:'H&M',             name:'Summer Collection Preview',      desc:'Member preview of H&M\'s summer collection with 15% off first purchase.',                             cat:'Fashion',       mech:'Flat Off',  tiers:['Silver','Gold'],   region:['All UAE'],           status:'scheduled', signal:null,      health:null, delta:0, target:0, trend7:[],                     cid:'EMSK_HM_SUM_JUN24',  range:{kind:'starts', label:'Starts Jun 15'},                trophy:false },

  /* ── Additional Review ── */
  { id:35, code:'SP', sponsor:'Splash',           brand:'Splash',          name:'Back-to-School Bundle',          desc:'Back-to-school apparel bundle savings for families — pending legal sign-off.',                        cat:'Fashion',       mech:'Flat Off',  tiers:['All Tiers'],       region:['All UAE'],           status:'review',    signal:null,      health:null, delta:0, target:0, trend7:[],                     cid:'EMSK_SP_BTS_JUL24',  range:{kind:'starts', label:'Starts Jul 15'},                trophy:false },
  { id:36, code:'ME', sponsor:'Mall of Emirates', brand:'Mall of Emirates',name:'Weekend Shopper Bonus',          desc:'Weekend bonus Miles for spend above AED 500 across Mall of the Emirates stores.',                    cat:'Retail',        mech:'Points ×N', tiers:['Silver','Gold','Plat'], region:['Dubai'],        status:'review',    signal:null,      health:null, delta:0, target:0, trend7:[],                     cid:'EMSK_ME_WKND_JUL24', range:{kind:'starts', label:'Starts Jul 20'},                trophy:false },
  { id:37, code:'PZ', sponsor:'Pizza Hut',        brand:'Pizza Hut',       name:'Family Feast Combo',             desc:'Family feast combo at flat price for Skywards members — pricing review in progress.',                cat:'Food',          mech:'Flat Off',  tiers:['All Tiers'],       region:['All UAE'],           status:'review',    signal:null,      health:null, delta:0, target:0, trend7:[],                     cid:'EMSK_PZ_FAM_JUL24',  range:{kind:'starts', label:'Starts Jul 8'},                 trophy:false },

  /* ── Additional Drafts ── */
  { id:38, code:'KF', sponsor:'KFC',              brand:'KFC',             name:'Weekday Combo Discount',         desc:'Lunchtime weekday combo discount draft — partner terms being negotiated.',                            cat:'Food',          mech:'Flat Off',  tiers:['Blue','Silver'],   region:['All UAE'],           status:'draft',     signal:null,      health:null, delta:0, target:0, trend7:[],                     cid:'DRAFT_KF_WKD',       range:{kind:'draft', label:'Draft'},                         trophy:false },
  { id:39, code:'DM', sponsor:'DAMAC',            brand:'DAMAC',           name:'Property Viewing Bonus',         desc:'Bonus Miles for property viewing visits at DAMAC developments — concept stage.',                     cat:'Real Estate',   mech:'Points ×N', tiers:['Platinum'],        region:['Dubai'],             status:'draft',     signal:null,      health:null, delta:0, target:0, trend7:[],                     cid:'DRAFT_DM_VIEW',      range:{kind:'draft', label:'Draft'},                         trophy:false },
  { id:40, code:'SQ', sponsor:'Souq',             brand:'Souq',            name:'Free Shipping Weekend',          desc:'Free shipping weekend across Souq partner stores — awaiting logistics sign-off.',                     cat:'E-commerce',    mech:'Voucher',   tiers:['All Tiers'],       region:['All UAE'],           status:'draft',     signal:null,      health:null, delta:0, target:0, trend7:[],                     cid:'DRAFT_SQ_SHIP',      range:{kind:'draft', label:'Draft'},                         trophy:false },
];

/* Helpers — every consumer should derive counts via these, never hardcode. */
const offersByStatus = (status) => OFFERS_DATA.filter(o => o.status === status);
const offerById      = (id)     => OFFERS_DATA.find(o => o.id === id);
/* Canonical loyalty-offer lifecycle: draft → review → scheduled → live → paused → ended.
   Every count rendered anywhere should come through one of these getters. */
const offerCounts    = {
  get all()       { return OFFERS_DATA.length; },
  get draft()     { return offersByStatus('draft').length; },
  get review()    { return offersByStatus('review').length; },
  get scheduled() { return offersByStatus('scheduled').length; },
  get live()      { return offersByStatus('live').length; },
  get paused()    { return offersByStatus('paused').length; },
  get ended()     { return offersByStatus('ended').length; },
  get active()    { return offersByStatus('live').length; }, // synonym for "live"
};

// Expose globally so the bundled JSX files can read it.
window.OFFERS_DATA   = OFFERS_DATA;
window.offersByStatus = offersByStatus;
window.offerById      = offerById;
window.offerCounts    = offerCounts;

/* ──────────────────────────────────────────────────────────────────────
   SEGMENT MEMBERSHIP — single source of truth for which offers belong to
   which segment. Drives the Segments screen AND the relationship-map edges
   (any two offers sharing a segment get a labeled edge between them in
   the map view). Edit here once; both screens stay in sync.
   ────────────────────────────────────────────────────────────────────── */
const SEGMENTS_META = [
  { id:1, name:'High-Value UAE Travelers', offerIds:[1, 4, 6, 15, 16, 20, 23, 24, 25, 29] },
  { id:2, name:'Lapsed Gold Members',      offerIds:[3, 4, 21, 31] },
  { id:3, name:'Ramadan Active Members',   offerIds:[3, 5, 13, 16, 26, 28, 30] },
  { id:4, name:'Platinum Frequent Flyers', offerIds:[1, 6, 16, 23, 39] },
  { id:5, name:'First-Time Members',       offerIds:[2, 14, 19, 22, 27, 31] },
  { id:6, name:'Staff & Corporate',        offerIds:[6, 16, 17, 18] },
];

/* Build pairwise edges between offers that share a segment, restricted to
   the set of visible node ids. Each edge is tagged with the segment name
   so the graph can render it as a labeled relationship. Multi-segment
   pairs get one edge per shared segment so labels stay accurate. */
const offerEdgesFromSegments = (visibleIds) => {
  const visible = new Set(visibleIds);
  const out = [];
  const seen = new Set(); // de-dupe identical (a,b,group) edges
  SEGMENTS_META.forEach(seg => {
    const ids = seg.offerIds.filter(id => visible.has(id));
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = Math.min(ids[i], ids[j]);
        const b = Math.max(ids[i], ids[j]);
        const key = `${a}-${b}-${seg.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ a, b, group: seg.name });
      }
    }
  });
  return out;
};

window.SEGMENTS_META           = SEGMENTS_META;
window.offerEdgesFromSegments  = offerEdgesFromSegments;

// ─── Design Tokens ─────────────────────────
const COLORS = {
  bgBase:        '#0A0C10',
  bgSurface:     '#111318',
  bgElevated:    '#181C24',
  border:        '#252A35',
  textPrimary:   '#F0F2F7',
  textSecondary: '#8892A4',
  textMuted:     '#4A5568',
  gold:          '#D4A853',
  green:         '#2DD4A0',
  amber:         '#F59E0B',
  orange:        '#F97316',
  red:           '#F26B6B',
  blue:          '#4A90D9',
};

const HEALTH_COLOR = (score) => {
  if (score >= 80) return COLORS.green;
  if (score >= 60) return COLORS.amber;
  if (score >= 40) return COLORS.orange;
  return COLORS.red;
};

// ─── Icons (inline SVG, lucide-style) ───────────────────
const Icon = ({ name, size = 16, stroke = 1.6, color }) => {
  const paths = {
    LayoutDashboard: <>
      <rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/>
      <rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    Tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.2"/></>,
    Users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    FileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8M8 9h2"/></>,
    Gift: <><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></>,
    BarChart2: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    Settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.14.66.39.85.7l.06.06a2 2 0 0 1 0 2.82l-.06.06a1.65 1.65 0 0 0-.85.7z"/></>,
    TrendingDown: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></>,
    TrendingUp: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    FileEdit: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M10.5 13.5l3 3 6-6"/></>,
    DollarSign: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    Bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    Sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    Moon: <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
    X: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    ChevronDown: <><polyline points="6 9 12 15 18 9"/></>,
    ChevronUp: <><polyline points="18 15 12 9 6 15"/></>,
    ChevronRight: <><polyline points="9 6 15 12 9 18"/></>,
    Search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    Plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    Filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    Check: <><polyline points="20 6 9 17 4 12"/></>,
    AlertTriangle: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    MoreHorizontal: <><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></>,
    Edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    Copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    Pause: <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    Clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    Map: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    Table: <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></>,
    Upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    Trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/></>,
    ArrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    Sparkles: <><path d="M12 3l1.4 4.2L17.6 9 13.4 10.6 12 15 10.6 10.6 6.4 9 10.6 7.2z"/><path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9z"/></>,
    Sliders: <><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
    Smartphone: <><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
    Monitor: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
    Image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    Share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    Bookmark: <><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></>,
    Globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    ArrowDown: <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
    Refresh: <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>,
    Send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    ArrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    Trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    Zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    Star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    ChevronLeft: <><polyline points="15 18 9 12 15 6"/></>,
    ArrowUp: <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color || 'currentColor'} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
};

// ─── Sigil ───────────────────────────────
const Sigil = ({ size = 14, color }) => (
  <span style={{ color: color || 'var(--accent-gold)', fontSize: size, fontFamily: 'Sora, sans-serif', display:'inline-block', lineHeight: 1 }}>✦</span>
);

// ─── Pill ─────────────────────────────────
const Pill = ({ children, kind = '', icon, style }) =>
  <span className={"pill " + kind} style={style}>
    {icon && <span style={{display:'inline-flex'}}>{icon}</span>}
    {children}
  </span>;

// ─── Btn ─────────────────────────────────
const Btn = ({ children, kind = '', sm = false, lg = false, onClick, style, icon }) =>
  <button
    className={"btn " + kind + (sm ? " sm" : "") + (lg ? " lg" : "")}
    onClick={onClick}
    style={style}>
    {icon && <span style={{display:'inline-flex'}}>{icon}</span>}
    {children}
  </button>;

// ─── Toggle ───────────────────────────────
const Toggle = ({ on, onToggle, label }) =>
  <span className={"toggle " + (on ? "on" : "")} onClick={onToggle}>
    <span className="knob"/>
    {label && <span style={{fontSize:12, color:'var(--text-secondary)'}}>{label}</span>}
  </span>;

// ─── Brand to logo URL map ────────────────
const BRAND_LOGOS = {
  // Original 12
  'Marriott Bonvoy':  'https://www.google.com/s2/favicons?sz=128&domain=marriott.com',
  'Marriott':         'https://www.google.com/s2/favicons?sz=128&domain=marriott.com',
  'Careem':           'https://www.google.com/s2/favicons?sz=128&domain=careem.com',
  'Noon':             'https://www.google.com/s2/favicons?sz=128&domain=noon.com',
  'Cult.fit':         'https://www.google.com/s2/favicons?sz=128&domain=cult.fit',
  'BookMyShow':       'https://www.google.com/s2/favicons?sz=128&domain=bookmyshow.com',
  'Emirates':         'https://www.google.com/s2/favicons?sz=128&domain=emirates.com',
  'Chalhoub':         'https://www.google.com/s2/favicons?sz=128&domain=chalhoubgroup.com',
  'Talabat':          'https://www.google.com/s2/favicons?sz=128&domain=talabat.com',
  'Almosafer':        'https://www.google.com/s2/favicons?sz=128&domain=almosafer.com',
  'Carrefour':        'https://www.google.com/s2/favicons?sz=128&domain=carrefouruae.com',
  'Jumeirah':         'https://www.google.com/s2/favicons?sz=128&domain=jumeirah.com',
  // Added (ids 13–40)
  'The Entertainer':  'https://www.google.com/s2/favicons?sz=128&domain=theentertainerme.com',
  'Lulu Hypermarket': 'https://www.google.com/s2/favicons?sz=128&domain=luluhypermarket.com',
  'Sharaf DG':        'https://www.google.com/s2/favicons?sz=128&domain=sharafdg.com',
  'Etihad':           'https://www.google.com/s2/favicons?sz=128&domain=etihad.com',
  'Du':               'https://www.google.com/s2/favicons?sz=128&domain=du.ae',
  'Etisalat':         'https://www.google.com/s2/favicons?sz=128&domain=etisalat.ae',
  'VOX Cinemas':      'https://www.google.com/s2/favicons?sz=128&domain=voxcinemas.com',
  'IKEA':             'https://www.google.com/s2/favicons?sz=128&domain=ikea.com',
  'Faces':            'https://www.google.com/s2/favicons?sz=128&domain=faces.com',
  'Centrepoint':      'https://www.google.com/s2/favicons?sz=128&domain=centrepointstores.com',
  'Atlantis':         'https://www.google.com/s2/favicons?sz=128&domain=atlantis.com',
  'Anantara':         'https://www.google.com/s2/favicons?sz=128&domain=anantara.com',
  'Park Hyatt':       'https://www.google.com/s2/favicons?sz=128&domain=hyatt.com',
  'Ferrari World':    'https://www.google.com/s2/favicons?sz=128&domain=ferrariworldabudhabi.com',
  'Yas Waterworld':   'https://www.google.com/s2/favicons?sz=128&domain=yaswaterworld.com',
  'Costa Coffee':     'https://www.google.com/s2/favicons?sz=128&domain=costacoffee.com',
  'Starbucks':        'https://www.google.com/s2/favicons?sz=128&domain=starbucks.com',
  'McDonalds':        'https://www.google.com/s2/favicons?sz=128&domain=mcdonalds.com',
  'Nike':             'https://www.google.com/s2/favicons?sz=128&domain=nike.com',
  'Adidas':           'https://www.google.com/s2/favicons?sz=128&domain=adidas.com',
  "Gold's Gym":       'https://www.google.com/s2/favicons?sz=128&domain=goldsgym.com',
  'H&M':              'https://www.google.com/s2/favicons?sz=128&domain=hm.com',
  'Splash':           'https://www.google.com/s2/favicons?sz=128&domain=splashfashions.com',
  'Mall of Emirates': 'https://www.google.com/s2/favicons?sz=128&domain=malloftheemirates.com',
  'Pizza Hut':        'https://www.google.com/s2/favicons?sz=128&domain=pizzahut.com',
  'KFC':              'https://www.google.com/s2/favicons?sz=128&domain=kfc.com',
  'DAMAC':            'https://www.google.com/s2/favicons?sz=128&domain=damacproperties.com',
  'Souq':             'https://www.google.com/s2/favicons?sz=128&domain=amazon.ae',
};
const CODE_TO_BRAND = {
  MA:'Marriott Bonvoy', CA:'Careem', NO:'Noon', CF:'Cult.fit',
  BM:'BookMyShow', EM:'Emirates', CH:'Chalhoub',
  TH:'Talabat', AS:'Almosafer', CR:'Carrefour', JS:'Jumeirah',
  TE:'The Entertainer', LH:'Lulu Hypermarket', SD:'Sharaf DG', ET:'Etihad',
  DU:'Du', ES:'Etisalat', VC:'VOX Cinemas', IK:'IKEA', FA:'Faces',
  CP:'Centrepoint', AT:'Atlantis', AN:'Anantara', PH:'Park Hyatt',
  FW:'Ferrari World', YW:'Yas Waterworld', CC:'Costa Coffee', SB:'Starbucks',
  MC:'McDonalds', NK:'Nike', AD:'Adidas', GG:"Gold's Gym",
  HM:'H&M', SP:'Splash', ME:'Mall of Emirates', PZ:'Pizza Hut',
  KF:'KFC', DM:'DAMAC', SQ:'Souq',
};
const CODE_TO_SIGNAL = {
  MA:'trending', CA:'fast', NO:'losing', CF:'elite',
  BM:'expiring', EM:'stable', CH:'stable'
};

// ─── Logo bubble (image with initials fallback) ──
const Logo = ({ code, brand, lg = false, sm = false, color, circle = true }) => {
  const [err, setErr] = useState(false);
  const resolvedBrand = brand || CODE_TO_BRAND[code];
  const src = resolvedBrand ? BRAND_LOGOS[resolvedBrand] : null;
  const showImg = src && !err;
  const cls = "logo-bubble " + (lg?'lg':'') + (sm?'sm':'') + (circle?' circ':'') + (showImg?' with-img':'');
  return (
    <div className={cls}
         style={color ? { color, background: 'transparent', borderColor: color + '55' } : {}}>
      {showImg
        ? <img src={src} alt={resolvedBrand} onError={()=>setErr(true)}/>
        : <span>{code}</span>}
    </div>
  );
};

// ─── Health score color (single source of truth) ───
// Canonical thresholds used by HealthDonut and any inline health rendering.
const getHealthColor = (value) => {
  if (value == null) return 'var(--text-muted)';
  if (value >= 75) return '#52C08A'; // green
  if (value >= 50) return '#E8A030'; // amber
  return '#E05252';                  // red
};

// ─── Health Donut (half-pie or circle) ─────────────
// ─── HealthDonut ─────────────────────────
// THE canonical health gauge used across every screen. Three sizes:
//   sm = 40px   (table rows, segment/rule tiles)
//   md = 60px   (offer cards — the look on the dashboard, unchanged)
//   lg = 80px   (drawer / detail panels)
// Renders a closed ring with a 1-color track + value-color arc and a
// centered Sora numeric. Colors come from getHealthColor (75/50 splits).
// Optional `delta` renders a tiny arrow + number below the donut.
const HEALTH_DIMS = {
  sm: { D: 40, R: 16, SW: 2.5, fz: 14 },
  md: { D: 60, R: 25, SW: 3.5, fz: 20 },
  lg: { D: 80, R: 34, SW: 4.5, fz: 26 },
};
const HealthDonut = ({ score, value, delta = null, size = 'md' }) => {
  // accept `score` (new canonical) and `value` (back-compat alias)
  const v = score != null ? score : value;
  if (v == null) return <span style={{color:'var(--text-muted)', fontSize:13}}>—</span>;
  // map legacy size names
  const sKey = size === 'circle' ? 'md' : (HEALTH_DIMS[size] ? size : 'md');
  const { D, R, SW, fz } = HEALTH_DIMS[sKey];
  const stroke = getHealthColor(v);
  const circ = 2 * Math.PI * R;
  const pct = Math.max(0, Math.min(100, v)) / 100;

  // In table rows (sm) the delta sits to the RIGHT of the donut, vertically centred.
  // In card / detail sizes (md / lg) the delta stays BELOW the donut.
  const isInline = sKey === 'sm';
  const deltaText = (delta != null && delta !== 0) ? (
    <span style={{display:'inline-flex', alignItems:'center', gap:2,
                  font:'500 11px/1 Manrope, sans-serif',
                  fontVariantNumeric:'tabular-nums',
                  color: delta > 0 ? '#52C08A' : '#E05252'}}>
      {delta > 0 ? '↑' : '↓'} {Math.abs(delta)}
    </span>
  ) : null;

  const donut = (
    <div style={{position:'relative', width:D, height:D, flexShrink:0}}>
      <svg width={D} height={D} viewBox={`0 0 ${D} ${D}`} style={{transform:'rotate(-90deg)'}}>
        <circle cx={D/2} cy={D/2} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={SW}/>
        <circle cx={D/2} cy={D/2} r={R} fill="none" stroke={stroke} strokeWidth={SW}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - pct)}
                style={{transition:'stroke-dashoffset .6s cubic-bezier(0,0,0.2,1), stroke .3s ease'}}/>
      </svg>
      <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
                   fontFamily:'Sora, sans-serif', fontWeight:700, fontSize:fz, color:'#ffffff', lineHeight:1,
                   fontVariantNumeric:'tabular-nums'}}>
        {v}
      </div>
    </div>
  );

  return (
    <div style={{display:'flex',
                 flexDirection: isInline ? 'row' : 'column',
                 alignItems:'center', gap: isInline ? 10 : 6}}>
      {donut}
      {deltaText}
    </div>
  );
};

// Back-compat aliases — all now thin wrappers around HealthDonut so the
// dashboard donut is the single source of truth visually.
const HealthScore  = ({ value, score, delta, size }) => <HealthDonut score={score ?? value} delta={delta} size={size || 'md'}/>;
const HealthNumber = ({ value, score, delta })       => <HealthDonut score={score ?? value} delta={delta} size="sm"/>;
const MiniHealth   = ({ value, score, delta })       => <HealthDonut score={score ?? value} delta={delta} size="sm"/>;

// ─── Behavioral Signal Badge ────────────
const SignalBadge = ({ signal }) => {
  if (!signal) return <span style={{color:'var(--text-muted)', fontSize:12}}>—</span>;
  const map = {
    trending:    { kind: 'amber',  icon: 'TrendingUp',   label: 'Trending' },
    fast:        { kind: 'blue',   icon: 'Zap',          label: 'Fast Growing' },
    losing:      { kind: 'red',    icon: 'TrendingDown', label: 'Losing Momentum' },
    elite:       { kind: 'gold',   icon: 'Star',         label: 'Elite Favorite' },
    expiring:    { kind: 'orange', icon: 'Clock',        label: 'Expiring Soon' },
  };
  const s = map[signal];
  if (!s) return <span style={{color:'var(--text-muted)', fontSize:12}}>—</span>;
  return <Pill kind={s.kind}><Icon name={s.icon} size={11}/>{s.label}</Pill>;
};

// ─── Status with dot ────────────────────
const Status = ({ kind, label }) => {
  const k = kind === 'live' ? 'live' : kind === 'scheduled' ? 'blue' : kind === 'in-review' ? 'amber' : kind === 'ended' ? 'gray' : kind === 'paused' ? 'amber' : 'gray';
  return <span className="row gap-6" style={{fontSize:12, color:'var(--text-primary)'}}><span className={"dot " + k}/>{label}</span>;
};

// ─── Toast helper ───────────────────────
const ToastContext = React.createContext({ show: () => {} });
function useToast() { return React.useContext(ToastContext); }

// ============================================================
// SHARED TABLE BEHAVIOR — single source of truth for all tables
// (offers, segments, rules). Edit here once, applies everywhere.
// ============================================================

// ─── TableRowActions ────────────────────
// Wraps a row's quick-action icons. Hover behavior comes from
// .tbl-row:hover .row-actions in gravty.css (opacity 0to1,
// visibility hiddentovisible, no transition). The actions sit in
// the grid cell with margin-left:auto so they hug the right edge
// without breaking the grid layout that each table relies on.
// Declared as `function` (hoisted, attached to window) to match
// the pattern used by other cross-file shared components.
function TableRowActions({ children, style }) {
  return (
    <div className="row-actions" style={{
      justifyContent: 'flex-end',
      marginLeft: 'auto',
      paddingRight: 16,
      minWidth: 90,
      overflow: 'visible',
      position: 'relative',
      ...style
    }}>
      {children}
    </div>
  );
}

// ─── TablePagination ────────────────────
// Fixed bottom bar (.tbl-pagination CSS handles position:fixed,
// bottom:0, left:56px, right:0, height:48px). Use this for every
// table — it auto-shows page controls only when total > pageSize.
//   <TablePagination total={n} noun="segments" />
//   <TablePagination total={n} noun="offers" pageSize={25}
//                    currentPage={p} onPageChange={setPage} />
function TablePagination({
  total,
  noun = 'items',
  pageSize = 25,
  currentPage = 1,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 35, 50, 100],
}) {
  const [sizeOpen, setSizeOpen] = useState(false);
  const sizeRef = useRef(null);
  useEffect(() => {
    if (!sizeOpen) return;
    const onDoc = (e) => { if (sizeRef.current && !sizeRef.current.contains(e.target)) setSizeOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [sizeOpen]);

  const safeSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(total / safeSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * safeSize + 1;
  const end = Math.min(safePage * safeSize, total);

  const go = (p) => onPageChange && onPageChange(Math.min(Math.max(1, p), totalPages));
  const pickSize = (s) => { setSizeOpen(false); onPageSizeChange && onPageSizeChange(s); };

  // Page-size selector (always rendered — even when there's only one page, so the user can change it)
  const sizeSelector = (
    <div ref={sizeRef} style={{position:'relative'}}>
      <span
        style={{cursor: onPageSizeChange ? 'pointer' : 'default', userSelect:'none'}}
        onClick={() => onPageSizeChange && setSizeOpen(o => !o)}
      >
        {pageSize} per page {onPageSizeChange ? '▾' : ''}
      </span>
      {sizeOpen && (
        <div style={{
          position:'absolute', bottom:'calc(100% + 6px)', left:0,
          background:'var(--bg-surface)', border:'1px solid var(--border-default)', borderRadius:8,
          boxShadow:'0 8px 20px rgba(0,0,0,0.4)', padding:4, minWidth:120, zIndex:60,
        }}>
          {pageSizeOptions.map(opt => (
            <div key={opt}
                 onClick={() => pickSize(opt)}
                 style={{
                   padding:'6px 10px', fontSize:12, borderRadius:6, cursor:'pointer',
                   color: opt === pageSize ? 'var(--accent-gold)' : 'var(--text-secondary)',
                   background: opt === pageSize ? 'rgba(212,175,55,0.08)' : 'transparent',
                 }}
                 onMouseEnter={(e)=>{ if (opt !== pageSize) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                 onMouseLeave={(e)=>{ if (opt !== pageSize) e.currentTarget.style.background = 'transparent'; }}>
              {opt} per page
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Single page → no prev/next/numbers, just the size selector + count
  if (total <= safeSize) {
    return (
      <div className="tbl-pagination">
        <div className="row gap-12">
          {sizeSelector}
          <span>Showing {total} of {total} {noun}</span>
        </div>
        <span/>
      </div>
    );
  }

  // Multi-page → compact page list with ellipsis when needed
  const pageNums = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const set = new Set([1, totalPages, safePage, safePage - 1, safePage + 1]);
    const list = [...set].filter(p => p >= 1 && p <= totalPages).sort((a,b) => a - b);
    const out = [];
    list.forEach((p, i) => {
      if (i > 0 && p - list[i-1] > 1) out.push('…');
      out.push(p);
    });
    return out;
  })();

  return (
    <div className="tbl-pagination">
      <div className="row gap-12">
        {sizeSelector}
        <span>Showing {start}–{end} of {total} {noun}</span>
      </div>
      <div className="row gap-6">
        <span style={{display:'inline-flex', alignItems:'center', gap:4, cursor: safePage === 1 ? 'default' : 'pointer', opacity: safePage === 1 ? 0.4 : 1}}
              onClick={() => go(safePage - 1)}><Icon name="ChevronLeft" size={14}/>Prev</span>
        {pageNums.map((p, i) => (
          p === '…'
            ? <span key={`e${i}`} style={{padding:'4px 6px', color:'var(--text-muted)'}}>…</span>
            : p === safePage
              ? <Pill key={p} kind="solid-gold">{p}</Pill>
              : <span key={p} style={{padding:'4px 10px', cursor:'pointer'}} onClick={() => go(p)}>{p}</span>
        ))}
        <span style={{display:'inline-flex', alignItems:'center', gap:4, cursor: safePage === totalPages ? 'default' : 'pointer', opacity: safePage === totalPages ? 0.4 : 1}}
              onClick={() => go(safePage + 1)}>Next<Icon name="ChevronRight" size={14}/></span>
      </div>
    </div>
  );
};

// ─── OfferCard ───────────────────────────
// Shared offer-summary card. `c` is the offer record (brand, code,
// name, mech, tiers, region, health, delta, sig, pct, q, cat).
// Layout: header row (logo + brand/cat on left; signal badge +
// hover-only Edit/More icons on right) to title to pills to region to
// centered health donut with breathing room to redemption bar.
// Hover reveals quick-action icons (no transition, instant).
function OfferCard({ c, onClick }) {
  const firstRegion = (c.region || '').split(' · ')[0];
  const scoreColor = getHealthColor(c.health);
  const logoSrc = BRAND_LOGOS[c.brand];
  const tags = [c.mech, c.tiers].filter(Boolean);

  const stop = (e) => { e.stopPropagation(); };
  const onKebab = (e) => {
    stop(e);
    if (window.__toast) window.__toast('Coming in the next release.');
  };

  return (
    <div className="offer-card-ref hoverable" onClick={onClick}
         style={{display:'flex', flexDirection:'row', alignItems:'flex-start', gap:16, position:'relative'}}>

      {/* LEFT — 56×56 logo */}
      <div style={{
        width:56, height:56, borderRadius:10, flexShrink:0,
        background:'var(--bg-overlay)', border:'1px solid var(--border-default)',
        overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'}}>
        {logoSrc
          ? <img src={logoSrc} alt={c.brand} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
          : <span style={{font:'600 14px/1 Inter, sans-serif', color:'var(--text-primary)'}}>{c.code}</span>}
      </div>

      {/* CENTER — text stack */}
      <div style={{flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:8, paddingRight:88}}>
        {/* brand + status dot + inline signal chip (wraps to next line if name is long) */}
        <div style={{display:'flex', alignItems:'center', gap:8, minWidth:0, flexWrap:'wrap', rowGap:6}}>
          <span style={{font:'400 13px/1 Inter, sans-serif', color:'var(--text-muted)'}}>
            {c.brand}
          </span>
          <span style={{width:7, height:7, borderRadius:'50%', background:'#59d499', flexShrink:0}}/>
          {c.sig && <SignalBadge signal={c.sig}/>}
        </div>

        {/* title 16px bold */}
        <div style={{font:'600 16px/1.3 Inter, sans-serif', color:'var(--text-primary)',
                     display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>
          {c.name}
        </div>

        {/* tag pills */}
        {tags.length > 0 && (
          <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
            {tags.map((t, i) => (
              <span key={i} style={{
                font:'500 11px/1 Inter, sans-serif', color:'var(--text-muted)',
                padding:'5px 10px', border:'1px solid #242728', borderRadius:12,
                whiteSpace:'nowrap'}}>{t}</span>
            ))}
          </div>
        )}

        {/* location */}
        {firstRegion && (
          <div style={{font:'400 12px/1.2 Inter, sans-serif', color:'var(--text-muted)', marginTop:'auto'}}>
            {c.region}
          </div>
        )}
      </div>

      {/* RIGHT — kebab + donut + delta, absolutely positioned */}
      <button type="button" onClick={onKebab}
              style={{position:'absolute', top:12, right:12,
                      background:'transparent', border:0, padding:4, cursor:'pointer',
                      color:'var(--text-muted)', display:'inline-flex', borderRadius:4}}
              aria-label="More options">
        <Icon name="MoreHorizontal" size={16}/>
      </button>
      <div style={{position:'absolute', top:40, right:16,
                   display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
        <HealthDonut score={c.health} size="md"/>
        {c.delta != null && c.delta !== 0 && (
          <span style={{display:'inline-flex', alignItems:'center', gap:3,
                        font:'500 11px/1 Inter, sans-serif', color:scoreColor}}>
            <Icon name={c.delta > 0 ? 'ArrowUp' : 'ArrowDown'} size={10}/>
            {Math.abs(c.delta)}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── EmptyArt ────────────────────────────
// Line-geometric SVGs for empty states. Kinds: stage | funnel | drafts.
// Stays generic; pair with screen-specific copy in the call site.
function EmptyArt({ kind }) {
  const stroke = "var(--text-muted)";
  if (kind === 'stage') return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
      <rect x="20" y="22" width="22" height="36" rx="3" stroke={stroke} strokeWidth="1.5"/>
      <rect x="50" y="14" width="22" height="44" rx="3" stroke={stroke} strokeWidth="1.5"/>
      <rect x="80" y="30" width="22" height="28" rx="3" stroke={stroke} strokeWidth="1.5"/>
      <line x1="10" y1="62" x2="112" y2="62" stroke="var(--accent-gold)" strokeWidth="1" strokeDasharray="3 4"/>
      <circle cx="61" cy="20" r="2" fill="var(--accent-gold)"/>
    </svg>
  );
  if (kind === 'funnel') return (
    <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
      <path d="M15 14h70l-25 30v22l-20-8v-14z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="50" cy="68" r="2" fill="var(--accent-gold)"/>
    </svg>
  );
  if (kind === 'drafts') return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
      <rect x="30" y="14" width="60" height="58" rx="4" stroke={stroke} strokeWidth="1.5"/>
      <line x1="40" y1="28" x2="80" y2="28" stroke={stroke} strokeWidth="1.5"/>
      <line x1="40" y1="40" x2="80" y2="40" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 3"/>
      <line x1="40" y1="52" x2="65" y2="52" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 3"/>
      <circle cx="86" cy="60" r="6" stroke="var(--accent-gold)" strokeWidth="1.5"/>
      <line x1="83" y1="60" x2="89" y2="60" stroke="var(--accent-gold)"/>
      <line x1="86" y1="57" x2="86" y2="63" stroke="var(--accent-gold)"/>
    </svg>
  );
  return null;
}

// ─── FilterCheck ─────────────────────────
// Checklist row inside a filter panel. Caller owns active state.
//   <FilterCheck label="Marriott Bonvoy" active={isOn} onClick={toggle}/>
function FilterCheck({ label, active, onClick }) {
  return (
    <div className={"filter-check " + (active ? 'on' : '')} onClick={onClick}>
      <span className="box"><Icon name="Check" size={11} stroke={2.5}/></span>
      {label}
    </div>
  );
}

// ─── FilterChip ──────────────────────────
// Toggleable pill inside a filter panel. Caller owns active state.
//   <FilterChip label="Gold" active={isOn} onClick={toggle}/>
function FilterChip({ label, active, onClick }) {
  return (
    <button className={"filter-pill " + (active ? 'active' : '')} onClick={onClick}>{label}</button>
  );
}

// ─── RadioRow ────────────────────────────
// Single row of a radio-list (segments, rules, choices). Caller owns
// the active state. Supports three shapes:
//   <RadioRow label="…" active onClick={…}/>                           — radio + label
//   <RadioRow label="…" sublabel="…" active onClick={…}/>              — radio + label + sublabel
//   <RadioRow icon="Plus" label="Build new…" muted onClick={…}/>       — icon + muted label (add-new variant)
// Sublabel accepts any ReactNode so callers can interpolate <b/>.
function RadioRow({ label, sublabel, active, onClick, icon, muted }) {
  const rowStyle = muted ? { color: 'var(--text-secondary)' } : undefined;
  const labelStyle = muted ? { color: 'var(--text-secondary)' } : undefined;
  return (
    <div className={"radio-row " + (active ? 'active' : '')}
         onClick={onClick}
         style={rowStyle}>
      {icon ? <Icon name={icon} size={11}/> : <div className="radio"/>}
      {sublabel ? (
        <div style={{flex:1}}>
          <div className="rl" style={labelStyle}>{label}</div>
          <div className="rs">{sublabel}</div>
        </div>
      ) : (
        <span className="rl" style={labelStyle}>{label}</span>
      )}
    </div>
  );
}

// ─── OfferChipRow ────────────────────────
// Horizontal row of small offer chips (logo + truncated title) with a
// "+N more" tail when offers overflow. Used by segments and rules to
// preview the offers attached to a segment/rule in accordion details.
//   <OfferChipRow offers={[{c, n}]} more={2} onClick={(o)=>…}/>
function OfferChipRow({ offers, more = 0, onClick }) {
  const shown = offers.slice(0, 4);
  const remaining = more + Math.max(0, offers.length - 4);
  const trunc = (s, n = 12) => s == null ? '' : (s.length <= n ? s : s.slice(0, n - 1) + '…');
  return (
    <div className="offer-chip-row" style={{marginBottom:18}}>
      {shown.map((o, i) => (
        <div key={i} className="offer-chip" onClick={(e)=>{e.stopPropagation(); onClick && onClick(o);}}>
          <Logo code={o.c} brand={CODE_TO_BRAND[o.c]} sm/>
          <span>{trunc(o.n, 14)}</span>
        </div>
      ))}
      {remaining > 0 && <span className="offer-chip-more">+{remaining} more</span>}
    </div>
  );
}

// ─── InsightCard ─────────────────────────
// Colored attention card used on the Dashboard intelligence strip.
// `tone` = red | green | amber | blue (drives the existing
// `.insight-card.<tone>` CSS variant — no new styles).
//   <InsightCard tone="red" icon={<Icon name="TrendingDown"/>}
//                headline="…" body="…" ctaLabel="View"
//                onClick={…}/>
function InsightCard({ tone = 'blue', icon, headline, body, ctaLabel, onClick, watermark, dot }) {
  return (
    <div className={"insight-card " + tone + " hoverable"} onClick={onClick} style={{position:'relative', overflow:'hidden'}}>
      {watermark && (
        <span aria-hidden="true" style={{
          position:'absolute', right:-8, bottom:-20,
          fontFamily:"'Inter', sans-serif", fontWeight:800, fontSize:96,
          color:'var(--accent-red)', opacity:0.10, letterSpacing:'-0.04em',
          lineHeight:0.85, pointerEvents:'none', userSelect:'none', zIndex:0,
          fontVariantNumeric:'tabular-nums'
        }}>{watermark}</span>
      )}
      {dot && (
        <span aria-hidden="true" style={{
          position:'absolute', top:14, right:14, width:6, height:6, borderRadius:'50%',
          background: dot, zIndex:2
        }}/>
      )}
      <div className="ic-icon" style={{position:'relative', zIndex:1}}>{icon}</div>
      <h4 style={{position:'relative', zIndex:1}}>{headline}</h4>
      <p style={{position:'relative', zIndex:1}}>{body}</p>
      <div className="ic-cta row gap-4" style={{position:'relative', zIndex:1}}>{ctaLabel} <Icon name="ArrowRight" size={12}/></div>
    </div>
  );
}

// ─── MetricTile ──────────────────────────
// KPI tile with label / value / change indicator. `changeKind` drives
// the existing `.mc.up | .down | .flat | .warn` CSS variant.
//   <MetricTile label="Active Members" value="1.24M" change="^ 3.1%" changeKind="up"/>
//   <MetricTile … onClick={…}/>  // tile gets `.clickable` class
function MetricTile({ label, value, unit, change, changeKind = 'flat', onClick, bordered = false, sparkline }) {
  return (
    <div className={"metric-tile" + (bordered ? ' bordered' : ' chrome-free') + (onClick ? ' clickable' : '')} onClick={onClick}>
      <div className="ml">{label}</div>
      <div className="row gap-12" style={{alignItems:'baseline', justifyContent:'space-between'}}>
        <div className="mv">{value}{unit && <span className="unit"> {unit}</span>}</div>
        {sparkline}
      </div>
      <div className={"mc " + changeKind}>{change}</div>
    </div>
  );
}

// ─── ViewToggle ──────────────────────────
// Segmented button group (e.g. Table | Map). Uses the existing
// `.btn.sm.ghost` styling. Options: [{ id, label, icon? }].
//   <ViewToggle value={view} onChange={setView}
//               options={[{id:'table',label:'Table',icon:'Table'},
//                         {id:'map',  label:'Map',  icon:'Map'}]}/>
function ViewToggle({ value, onChange, options }) {
  return (
    <div className="row gap-4"
         style={{padding:'3px', background:'var(--bg-elevated)', borderRadius:8, border:'1px solid var(--border-default)'}}>
      {options.map(o => (
        <button key={o.id}
                className="btn sm ghost"
                style={{
                  background: value === o.id ? 'var(--accent-gold)' : 'transparent',
                  color:      value === o.id ? '#0A0C10'           : 'var(--text-secondary)',
                }}
                onClick={()=>onChange(o.id)}>
          {o.icon && <Icon name={o.icon} size={13}/>} {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── PathCard ────────────────────────────
// Large branching-choice card (e.g. "Start from a Template" vs
// "Build from Scratch"). `art` is any ReactNode (typically an inline
// SVG) shown above the title. `highlighted` swaps to the gold-border
// variant + primary CTA.
//   <PathCard highlighted title="…" subtitle="…" ctaLabel="…"
//             onCTA={…} art={<TemplateArt/>}/>
function PathCard({ highlighted, title, subtitle, ctaLabel, onCTA, art }) {
  return (
    <div className="card hoverable" style={{
      borderWidth: highlighted ? 2 : 1,
      borderColor: highlighted ? 'var(--accent-gold)' : 'var(--border-default)',
      background:  highlighted ? 'var(--bg-elevated)' : 'var(--bg-surface)',
      padding: '24px',
      display:'flex', flexDirection:'column', gap:14, minHeight: 250
    }}>
      <div style={{height:80, display:'flex', alignItems:'center'}}>{art}</div>
      <div className="sora" style={{fontSize:18, fontWeight:600}}>{title}</div>
      <div className="mute" style={{fontSize:13, lineHeight:1.5}}>{subtitle}</div>
      <div style={{flex:1}}/>
      <div>
        <Btn kind={highlighted ? 'primary' : ''} onClick={onCTA}>{ctaLabel}</Btn>
      </div>
    </div>
  );
}

// ─── TemplateCard ────────────────────────
// Single offer-template card used in the Templates grid. `template`
// shape: { i, cat, rec?, name, desc, meta: string[] }. The first
// item in `meta` is rendered with a green up-arrow; the rest are
// muted. `onSelect(template)` fires when the CTA is clicked.
function TemplateCard({ template, onSelect }) {
  const t = template;
  const [saved, setSaved] = useState(false);
  return (
    <div className={"tpl-card" + (t.rec ? ' recommended' : '')} onClick={() => onSelect && onSelect(t)}>
      <span className="tpl-cat">{t.cat}</span>

      {t.rec ? (
        <span className="tpl-rec-badge"><span>✦</span> Recommended</span>
      ) : (
        <span className="tpl-bookmark"
              onClick={(e)=>{ e.stopPropagation(); setSaved(s=>!s); }}
              aria-label={saved ? 'Unsave template' : 'Save template'}>
          <Icon name="Star" size={16} color={saved ? '#E8A030' : 'currentColor'}/>
        </span>
      )}

      <div className="tpl-title">{t.name}</div>
      <div className="tpl-desc">{t.desc}</div>

      <div className="tpl-meta">
        {t.meta.map((m, mi) => (
          <div key={mi} className="tpl-meta-row">
            {mi === 0 ? (
              <>
                <Icon name="ArrowUp" size={12} color="#52C08A"/>
                <span className="tpl-meta-lift">{m}</span>
              </>
            ) : (
              <>
                <Icon name={mi === 1 ? 'Tag' : 'Users'} size={11}/>
                <span>{m}</span>
              </>
            )}
          </div>
        ))}
      </div>

      <button className="tpl-cta"
              onClick={(e)=>{ e.stopPropagation(); onSelect && onSelect(t); }}>
        Use This Template <Icon name="ArrowRight" size={12}/>
      </button>
    </div>
  );
}

// ─── StatusTimeline ──────────────────────
// Vertical milestone timeline (created / approved / live / now /
// projected). Uses existing CSS: .timeline / .tnode.{past|now|peak|future}
// / .tdate / .ttitle / .tsub. Each node:
//   { kind, date, title, sub?, subStyle? }
//   <StatusTimeline nodes={…} style={{marginTop:14}}/>
function StatusTimeline({ nodes, style }) {
  return (
    <div className="timeline" style={style}>
      {nodes.map((n, i) => (
        <div key={i} className={"tnode " + (n.kind || 'past')}>
          <div className="tdate">{n.date}</div>
          <div className="ttitle">{n.title}</div>
          {n.sub && <div className="tsub" style={n.subStyle}>{n.sub}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── PageLayout ──────────────────────────
// Single source of truth for screen padding + width. `.shell` in
// gravty.css already provides the 84px top + 56px left offset for
// the dev-bar/top-bar/nav-rail; PageLayout only owns inner padding.
//   <PageLayout><PageHeader …/> … </PageLayout>
function PageLayout({ children }) {
  return (
    <div style={{
      padding: '32px 40px',
      minHeight: 'calc(100vh - 84px)',
      boxSizing: 'border-box',
      width: '100%',
    }}>
      {children}
    </div>
  );
}

// ─── PageHeader ──────────────────────────
// Consistent screen header: optional back link to title to subtitle on
// the left; optional action group on the right.
//   <PageHeader title="…" subtitle="…"
//               backLabel="Back to Offers" onBack={…}
//               actions={<Btn>+ Create</Btn>}/>
function PageHeader({ title, subtitle, actions, backLabel, onBack }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '24px',
    }}>
      <div>
        {backLabel && (
          <button onClick={onBack} style={{
            background: 'none',
            border: 'none',
            color: '#8892A4',
            fontSize: '13px',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Icon name="ArrowLeft" size={13}/> {backLabel}
          </button>
        )}
        <h1 style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '24px',
          fontWeight: 700,
          color: '#F0F2F7',
          margin: 0,
        }}>{title}</h1>
        {subtitle && (
          <p style={{
            fontSize: '13px',
            color: '#8892A4',
            margin: '4px 0 0',
          }}>{subtitle}</p>
        )}
      </div>
      {actions && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          {actions}
        </div>
      )}
    </div>
  );
}

// ─── Expose ───────────────────────────
Object.assign(window, {
  COLORS, HEALTH_COLOR,
  Icon, Sigil, Pill, Btn, Toggle, Logo, HealthScore, HealthDonut, HealthNumber, MiniHealth,
  getHealthColor, SignalBadge, Status,
  ToastContext, useToast, BRAND_LOGOS, CODE_TO_BRAND, CODE_TO_SIGNAL,
  TableRowActions, TablePagination, OfferCard,
  EmptyArt, FilterCheck, FilterChip, OfferChipRow, RadioRow,
  InsightCard, MetricTile, ViewToggle, PathCard, TemplateCard,
  StatusTimeline, PageLayout, PageHeader
});
