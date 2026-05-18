// Mock data for Emirates Skywards loyalty app

const MEMBER = {
  name: 'Aisha',
  tier: 'Gold',
  miles: 42800,
  toNextTier: 3200,
  nextTier: 'Platinum',
  progress: 0.93,
  nextFlight: { code: 'EK 006', from: 'DXB', to: 'LHR', when: 'Tomorrow' },
};

// Image map (Unsplash thumbnails)
const IMG = {
  hotel:    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=70',
  drive:    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=70',
  dine:     'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70',
  shop:     'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=70',
  flight:   'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=70',
  wellness: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=70',
  watch:    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=70',
  fashion:  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=70',
  events:   'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=70',
};

// 8 offers using real partner brands per Clearbit availability
const OFFERS = [
  {
    id: 'off-marriott',
    partner: 'Marriott Bonvoy', domain: 'marriott.com',
    title: '50% Off Weekend Stays',
    desc: 'Book any 2-night stay this weekend and save 50% at Marriott properties across Dubai and Abu Dhabi.',
    miles: 500, cost: 1500, tier: 'Gold', mechanic: 'FLAT OFF',
    expires: 'Jun 30', region: 'Dubai · Abu Dhabi', distance: '0.8 km',
    health: 89, delta: 12, elite: true, locked: false,
    image: IMG.hotel, swatch: ['#1f1408', '#3a2810'],
    minStay: '2 nights', minSpend: 'AED 800/night',
    valid: 'Jun 1 – Jul 31', max: '1 per member',
  },
  {
    id: 'off-chalhoub',
    partner: 'Chalhoub', domain: 'chalhoubgroup.com',
    title: '3× Miles on Timepieces',
    desc: 'Earn triple miles on watches above AED 25,000.',
    miles: 1500, cost: 0, tier: 'Platinum', mechanic: '3× MILES',
    expires: 'Jul 14', region: 'Dubai Mall', distance: '2.4 km',
    health: 64, delta: -3, elite: true, locked: true,
    image: IMG.watch, swatch: ['#0f0d18', '#2a2440'],
    minStay: '—', minSpend: 'AED 25,000',
    valid: 'May 20 – Jul 14', max: '3 per member',
  },
  {
    id: 'off-talabat',
    partner: 'Talabat', domain: 'talabat.com',
    title: '20% Off Tasting Menu',
    desc: '7-course chef\u2019s table, weekday evenings.',
    miles: 350, cost: 850, tier: 'Silver', mechanic: '20% OFF',
    expires: 'Jun 18', region: 'Downtown', distance: '3.1 km',
    health: 77, delta: 6, elite: false, locked: false,
    image: IMG.dine, swatch: ['#180f0a', '#3a1f12'],
    minStay: '—', minSpend: 'AED 600',
    valid: 'Apr 1 – Jun 18', max: '2 per member',
  },
  {
    id: 'off-noon',
    partner: 'Noon', domain: 'noon.com',
    title: 'Private Stylist + 2× Miles',
    desc: 'Personal styling session with double miles.',
    miles: 750, cost: 0, tier: 'Gold', mechanic: '2× MILES',
    expires: 'Aug 02', region: 'Mall of the Emirates', distance: '6.7 km',
    health: 81, delta: 4, elite: false, locked: false,
    image: IMG.fashion, swatch: ['#171008', '#37260c'],
    minStay: '—', minSpend: 'AED 2,500',
    valid: 'May 1 – Aug 2', max: '1 per member',
  },
  {
    id: 'off-cultfit',
    partner: 'Cult.fit', domain: 'cult.fit',
    title: 'Couple\u2019s Hammam + Lunch',
    desc: 'Two-hour ritual with mezze tasting.',
    miles: 420, cost: 650, tier: 'Silver', mechanic: 'BUNDLE',
    expires: 'Jul 09', region: 'Palm Jumeirah', distance: '4.2 km',
    health: 71, delta: 8, elite: false, locked: false,
    image: IMG.wellness, swatch: ['#0e1614', '#1d322d'],
    minStay: '—', minSpend: 'AED 1,200',
    valid: 'May 10 – Jul 9', max: '1 per member',
  },
  {
    id: 'off-careem',
    partner: 'Careem', domain: 'careem.com',
    title: '40% Off Weekend Rentals',
    desc: 'Luxury fleet — Fri to Sun pickups.',
    miles: 280, cost: 1200, tier: 'Silver', mechanic: '40% OFF',
    expires: 'Jun 24', region: 'DXB Airport', distance: '11.0 km',
    health: 58, delta: -2, elite: false, locked: false,
    image: IMG.drive, swatch: ['#0f1218', '#222a3a'],
    minStay: '2 days', minSpend: 'AED 600',
    valid: 'May 1 – Jun 24', max: '1 per member',
  },
  {
    id: 'off-emirates',
    partner: 'Emirates', domain: 'emirates.com',
    title: 'Companion Fare to Europe',
    desc: 'Bring one for the price of taxes.',
    miles: 5000, cost: 8500, tier: 'Platinum', mechanic: 'COMPANION',
    expires: 'Aug 31', region: 'All gateways', distance: '—',
    health: 94, delta: 18, elite: true, locked: true,
    image: IMG.flight, swatch: ['#13100a', '#352a14'],
    minStay: '—', minSpend: '—',
    valid: 'Jul 1 – Aug 31', max: '1 per member',
  },
  {
    id: 'off-bms',
    partner: 'BookMyShow', domain: 'bookmyshow.com',
    title: '5× Miles on Live Events',
    desc: 'Quintuple miles on shows and concerts.',
    miles: 220, cost: 0, tier: 'Silver', mechanic: '5× MILES',
    expires: 'Jun 30', region: 'Citywide', distance: '1.6 km',
    health: 66, delta: 2, elite: false, locked: false,
    image: IMG.events, swatch: ['#10140e', '#243124'],
    minStay: '—', minSpend: 'AED 250',
    valid: 'May 1 – Jun 30', max: '4 per member',
  },
];

const CATEGORIES = ['All', 'Stay', 'Dine', 'Shop', 'Drive', 'Wellness', 'Travel'];
const TIERS = ['All Tiers', 'Silver', 'Gold', 'Platinum'];

// Challenge icons rendered as SVGs in the card
const CHALLENGES = [
  { id: 'ch-streak',  iconKey: 'flame',   title: '3-Month Streak', sub: 'Stay active monthly', cur: 2, tot: 3, award: 1000 },
  { id: 'ch-sprint',  iconKey: 'plane',   title: '5-Trip Sprint',  sub: 'Within 90 days',     cur: 3, tot: 5, award: 2500 },
  { id: 'ch-partner', iconKey: 'compass', title: 'Partner Pioneer', sub: 'Try 4 categories',   cur: 2, tot: 4, award: 1500 },
  { id: 'ch-weekend', iconKey: 'moon',    title: 'Weekend Voyager', sub: 'Two weekend stays',  cur: 1, tot: 2, award:  800 },
];

Object.assign(window, { MEMBER, OFFERS, CATEGORIES, TIERS, IMG, CHALLENGES });
