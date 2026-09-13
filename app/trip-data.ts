export type StatusTone =
  | 'locked'
  | 'core'
  | 'recommended'
  | 'choice'
  | 'optional'
  | 'travel'
  | 'open';

export type TimelineItem = {
  time: string;
  title: string;
  location: string;
  note?: string;
  detail?: string;
  price?: string;
  status: string;
  statusTone: StatusTone;
  mapUrl?: string;
  bookingUrl?: string;
  bookingLabel?: string;
};

export type TripDay = {
  day: number;
  date: string;
  dayLabel: string;
  shortTitle: string;
  title: string;
  theme: string;
  summary: string;
  intensity: number;
  accent: string;
  arc: string[];
  items: TimelineItem[];
};

export type DecisionOption = {
  name: string;
  label?: string;
  description: string;
  meta?: string;
  price?: string;
  note?: string;
  mapUrl?: string;
  bookingUrl?: string;
};

export type Decision = {
  id: string;
  kicker: string;
  title: string;
  note: string;
  status: string;
  statusTone: StatusTone;
  options: DecisionOption[];
};

export type Place = {
  name: string;
  eyebrow: string;
  description: string;
  meta?: string;
  price?: string;
  status?: string;
  statusTone?: StatusTone;
  mapUrl?: string;
  bookingUrl?: string;
};

const maps = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const apartmentAddress = 'Budapest, Király utca 13, 1075, Hungary';
const apartmentMapUrl = maps(apartmentAddress);
const apartmentListingUrl =
  'https://www.airbnb.com/rooms/1555012803685922636?unique_share_id=73e89a81-881a-4a94-bad0-9b0e6e1af1d1&viralityEntryPoint=1&s=76';

const anniversaryUrl =
  'https://instant-fogas.com/fbcustomevents/%F0%9F%A6%89instant18-nagykoru-lett-az-instant%F0%9F%A6%89/';

export const trip = {
  city: 'Budapest',
  name: 'Budapest Bachelor Trip',
  startDate: '2026-09-17',
  endDate: '2026-09-21',
  dateLabel: '17–21 Sep 2026',
  base: {
    name: 'Király utca 13',
    address: apartmentAddress,
    area: 'Gozsdu Udvar / Erzsébetváros',
    detail: 'Rooftop apartment · 3 bedrooms · full kitchen · 3 AC units',
    warning: 'Entrance, check-in and key handover still need confirmation.',
    mapUrl: apartmentMapUrl,
    listingUrl: apartmentListingUrl,
  },
  arrival: {
    dateLabel: 'Thu 17 Sep',
    time: '16:35',
    flight: 'BZ440-ish · confirm flight number',
    airport: 'Budapest Ferenc Liszt International Airport',
    airportAddress: '1185 Budapest, Hungary',
    mapUrl: maps('Budapest Ferenc Liszt International Airport'),
    transfer: 'Bolt or official taxi → District VII around 17:30–18:00',
  },
  departure: {
    dateLabel: 'Mon 21 Sep',
    time: '18:45',
    flight: 'BZ441 · Budapest → Tel Aviv',
    airport: 'Budapest Ferenc Liszt International Airport',
    airportAddress: '1185 Budapest, Hungary',
    mapUrl: maps('Budapest Airport Terminal 2B'),
    terminal: 'Expected Terminal 2B / non-Schengen · reconfirm 24–48h before',
    leaveCity: 'Leave central Budapest at 15:30–15:45',
  },
  mapUrl: apartmentMapUrl,
  navigation: [
    { id: 'home', label: 'Home' },
    { id: 'timeline', label: 'Days' },
    { id: 'decisions', label: 'Plan' },
    { id: 'highlights', label: 'Guide' },
    { id: 'essentials', label: 'Trip info' },
  ],
  nextUp: {
    dayLabel: 'THU',
    time: '19:30',
    title: 'Mazel Tov',
    note: 'First dinner in the courtyard · locked, reservation still needed',
    status: 'LOCKED',
    statusTone: 'locked' as StatusTone,
    mapUrl: maps('Mazel Tov Akácfa u. 47 Budapest'),
    bookingUrl: 'https://mazeltov.hu/en/',
  },
  days: [
    {
      day: 1,
      date: '2026-09-17',
      dayLabel: 'Thu 17 Sep',
      shortTitle: 'Touchdown',
      title: 'Arrival & first night',
      theme: 'Airport, apartment, dinner and drinks.',
      summary: 'Airport → apartment → Mazel Tov → La Siesta → home around midnight.',
      intensity: 3,
      accent: '#ff6757',
      arc: ['Land', 'Reset', 'Dinner', 'Drinks', 'Home'],
      items: [
        {
          time: '16:35',
          title: 'Land in Budapest',
          location: 'Ferenc Liszt International Airport',
          note: 'Inbound flight is noted as BZ440-ish; exact number still needs confirmation.',
          detail: 'Bolt or official taxi → apartment around 17:30–18:00, traffic and baggage depending.',
          status: 'TRAVEL',
          statusTone: 'travel',
          mapUrl: maps('Budapest Ferenc Liszt International Airport'),
        },
        {
          time: '17:45',
          title: 'Apartment reset',
          location: 'Király utca 13',
          note: 'Drop bags, shower and change before dinner.',
          status: 'FLEX',
          statusTone: 'open',
          mapUrl: apartmentMapUrl,
        },
        {
          time: '19:30',
          title: 'Mazel Tov',
          location: 'Akácfa u. 47 · District VII',
          note: 'Mediterranean courtyard restaurant close to the apartment.',
          detail: 'Locked in the plan, but the table should still be reserved.',
          status: 'LOCKED',
          statusTone: 'locked',
          mapUrl: maps('Mazel Tov Akácfa u. 47 Budapest'),
          bookingUrl: 'https://mazeltov.hu/en/',
          bookingLabel: 'Reserve',
        },
        {
          time: '21:45',
          title: 'La Siesta',
          location: 'Kazinczy u. 52/b',
          note: 'Cocktails, DJ and dancing after dinner.',
          detail: 'Thursday entry has been advertised as free. Recheck opening and event status.',
          status: 'LOCKED',
          statusTone: 'locked',
          mapUrl: maps('La Siesta Budapest Kazinczy u. 52/b'),
          bookingUrl: 'https://www.lasiestaclub.hu/',
          bookingLabel: 'Venue',
        },
        {
          time: '23:30',
          title: 'Walk home',
          location: 'Király utca 13',
          note: 'Instant-Fogas is an optional late stop.',
          status: 'OPTIONAL',
          statusTone: 'optional',
          mapUrl: apartmentMapUrl,
          bookingUrl: anniversaryUrl,
          bookingLabel: 'Wildcard',
        },
      ],
    },
    {
      day: 2,
      date: '2026-09-18',
      dayLabel: 'Fri 18 Sep',
      shortTitle: 'Warm-up',
      title: 'Drive, dine, dance',
      theme: 'Brunch, afternoon activity, break, dinner and Instant-Fogas.',
      summary: 'Brunch → afternoon activity → apartment break → dinner → Instant-Fogas.',
      intensity: 6,
      accent: '#3157e5',
      arc: ['Brunch', 'Adrenaline', 'Reset', 'Dinner', 'Dance'],
      items: [
        {
          time: '10:30',
          title: 'VINYL & WOOD',
          location: 'Wesselényi u. 23',
          note: 'Coffee, brunch, music and design close to the apartment. Cirkusz is the backup.',
          status: 'RECOMMENDED',
          statusTone: 'recommended',
          mapUrl: maps('VINYL & WOOD Wesselényi u. 23 Budapest'),
          bookingUrl: 'https://vinylandwood.hu/?lang=en',
          bookingLabel: 'Menu',
        },
        {
          time: '15:00',
          title: 'Hungaroring driving experience',
          location: 'Hungaroring · Mogyoród',
          note: 'Official event window is 15:00–18:00; the personal slot follows voucher registration.',
          detail: 'Bring a physical licence and closed shoes. Every driver must be completely sober.',
          price: '79,900–179,900 HUF · 2 laps / driver',
          status: 'CHOOSE',
          statusTone: 'choice',
          mapUrl: maps('Hungaroring Mogyoród Hungary'),
          bookingUrl: 'https://hungaroring.hu/site/en/experience/driving-experience',
          bookingLabel: 'Experience',
        },
        {
          time: '18:00',
          title: 'Apartment break',
          location: 'Király utca 13',
          note: 'Shower, rest, change and prepare for the evening.',
          detail: 'Keep this block free when confirming afternoon transport.',
          status: 'PROTECTED',
          statusTone: 'locked',
          mapUrl: apartmentMapUrl,
        },
        {
          time: '20:00',
          title: 'BiBo or VIBE',
          location: 'District V · choose one',
          note: 'BiBo is the rooftop option; VIBE includes DJs and performers.',
          status: 'CHOOSE',
          statusTone: 'choice',
          mapUrl: maps('BiBo Budapest Dorothea Hotel'),
          bookingUrl: 'https://bibobudapest.hu/en/',
          bookingLabel: 'BiBo',
        },
        {
          time: '22:30',
          title: 'Instant-Fogas · 18th anniversary',
          location: 'Akácfa u. 49–51',
          note: 'Hip-hop, R&B, trap and reggaeton rooms during the anniversary weekend.',
          detail: 'Entry has been advertised as free. Aim to leave around 00:30–01:00.',
          status: 'PLANNED',
          statusTone: 'recommended',
          mapUrl: maps('Instant-Fogas Komplexum Budapest'),
          bookingUrl: anniversaryUrl,
          bookingLabel: 'Event',
        },
        {
          time: '00:30',
          title: 'Return to apartment',
          location: 'Bolt / walk to Király utca 13',
          note: 'Plan to leave around 00:30–01:00.',
          status: 'TARGET',
          statusTone: 'locked',
          mapUrl: apartmentMapUrl,
        },
      ],
    },
    {
      day: 3,
      date: '2026-09-19',
      dayLabel: 'Sat 19 Sep',
      shortTitle: 'Sparty day',
      title: 'Recover, then Sparty',
      theme: 'Late brunch, spa, apartment break, dinner and Sparty.',
      summary: 'Late brunch → Royal Spa → reset → light dinner → Sparty → decide at 02:00.',
      intensity: 10,
      accent: '#a53f96',
      arc: ['Brunch', 'Spa', 'Reset', 'Dinner', 'Sparty'],
      items: [
        {
          time: '12:30',
          title: 'TATI Farm Brunch',
          location: 'Dohány u. 58–62',
          note: 'Michelin-recognized farm-to-table brunch.',
          detail: 'Reserve around 12:30. Twentysix is the nearby alternative.',
          status: 'RECOMMENDED',
          statusTone: 'recommended',
          mapUrl: maps('TATI Budapest Dohány u. 58-62'),
          bookingUrl: 'https://tatibudapest.com/brunch-menu/',
          bookingLabel: 'Brunch',
        },
        {
          time: '14:00',
          title: 'Royal Spa · Corinthia',
          location: 'Erzsébet körút 43–49',
          note: 'Pool, sauna, steam and a 60-minute massage — not 90.',
          detail: 'External access is subject to availability. Confirm three treatments in the same window; the old 12,000 HUF entry figure is invalid.',
          price: 'Massage: 44,000–51,500 HUF / person',
          status: 'BOOK',
          statusTone: 'recommended',
          mapUrl: maps('Royal Spa Corinthia Budapest'),
          bookingUrl: 'https://www.corinthia.com/en-gb/budapest/royal-spa/',
          bookingLabel: 'Spa',
        },
        {
          time: '17:00',
          title: 'Apartment break',
          location: 'Király utca 13',
          note: 'Nap, hydrate, shower and change for Sparty.',
          detail: 'Reserved until dinner at 19:00.',
          status: 'PROTECTED',
          statusTone: 'locked',
          mapUrl: apartmentMapUrl,
        },
        {
          time: '19:00',
          title: 'Dobrumba',
          location: 'Dob u. 5',
          note: 'Middle Eastern sharing plates before Sparty.',
          price: 'Most dishes 3,000–6,500 HUF',
          status: 'RECOMMENDED',
          statusTone: 'recommended',
          mapUrl: maps('Dobrumba Budapest Dob u. 5'),
          bookingUrl: 'https://dobrumba.hu/en/menu/',
          bookingLabel: 'Reserve',
        },
        {
          time: '21:30',
          title: 'Sparty at Széchenyi',
          location: 'Állatkerti krt. 9–11',
          note: 'Runs 21:30–02:00; last entry is around 01:00.',
          detail: 'Bring swimwear, flip-flops, a waterproof phone pouch, minimal valuables, and a towel if the tier excludes it.',
          price: 'Premium Plus €97 · Express + VIP €143',
          status: 'MUST BOOK',
          statusTone: 'core',
          mapUrl: maps('Széchenyi Thermal Bath Budapest'),
          bookingUrl: 'https://spartybooking.com/landing-2026-sep/',
          bookingLabel: 'Tickets',
        },
        {
          time: '02:00',
          title: 'After Sparty',
          location: 'Széchenyi → Király utca 13',
          note: 'Choose between a Bolt home or the Instant-Fogas anniversary event.',
          detail: 'Decide at 02:00 based on the group.',
          status: 'OPTIONAL',
          statusTone: 'optional',
          mapUrl: maps('Instant-Fogas Komplexum Budapest'),
          bookingUrl: anniversaryUrl,
          bookingLabel: 'Afterparty',
        },
      ],
    },
    {
      day: 4,
      date: '2026-09-20',
      dayLabel: 'Sun 20 Sep',
      shortTitle: 'Recovery mode',
      title: 'Reset the system',
      theme: 'Brunch, spa, free time and rooftop.',
      summary: 'Cirkusz → AWAY Spa + massage → free time → Leo Rooftop → easy home.',
      intensity: 2,
      accent: '#158d82',
      arc: ['Brunch', 'Steam', 'Massage', 'Pause', 'Rooftop'],
      items: [
        {
          time: '12:00',
          title: 'Cirkusz Café',
          location: 'Dob u. 25',
          note: 'Brunch close to the apartment. Franziska Pest is the backup.',
          status: 'RECOMMENDED',
          statusTone: 'recommended',
          mapUrl: maps('Cirkusz Café Budapest Dob u. 25'),
        },
        {
          time: '14:00',
          title: 'AWAY Spa · W Budapest',
          location: 'Andrássy út 25',
          note: 'Book a treatment and qualifying spa access is included.',
          detail: 'Ask for three massages simultaneously or in a tight staggered window. Omorovicza Healing is the preferred 60-minute choice.',
          price: '52,000–58,000 HUF / person with spa access',
          status: 'BOOK',
          statusTone: 'recommended',
          mapUrl: maps('AWAY Spa W Budapest Andrássy út 25'),
          bookingUrl: 'https://awayspa.wbudapest.com/treatments',
          bookingLabel: 'Treatments',
        },
        {
          time: '17:00',
          title: 'Free time',
          location: 'Apartment / wherever feels right',
          note: 'Change, nap, hydrate, or do nothing at all.',
          status: 'FREE',
          statusTone: 'open',
          mapUrl: apartmentMapUrl,
        },
        {
          time: '18:30',
          title: 'Leo Rooftop',
          location: 'Hotel Clark · Clark Ádám tér 1',
          note: 'Danube, Chain Bridge and skyline views with cocktails and small plates.',
          detail: 'Reserve a normal table around 18:30–19:00; weather decides the final rooftop.',
          status: 'RECOMMENDED',
          statusTone: 'recommended',
          mapUrl: maps('Leo Rooftop Budapest Hotel Clark'),
        },
        {
          time: '22:30',
          title: 'Return to apartment',
          location: 'Király utca 13',
          note: 'No additional booking planned.',
          status: 'EASY',
          statusTone: 'optional',
          mapUrl: apartmentMapUrl,
        },
      ],
    },
    {
      day: 5,
      date: '2026-09-21',
      dayLabel: 'Mon 21 Sep',
      shortTitle: 'Exit cleanly',
      title: 'Checkout, lunch & airport',
      theme: 'Checkout, luggage, shopping, lunch and airport.',
      summary: 'Pack → store bags → Fashion Street → ÉS Bisztró → collect → airport.',
      intensity: 1,
      accent: '#75649a',
      arc: ['Pack', 'Store', 'Shop', 'Lunch', 'Fly'],
      items: [
        {
          time: '10:00',
          title: 'Pack & check out',
          location: 'Király utca 13',
          note: 'Confirm checkout and host luggage storage before the trip.',
          status: 'CONFIRM',
          statusTone: 'choice',
          mapUrl: apartmentMapUrl,
        },
        {
          time: '10:30',
          title: 'Store the luggage',
          location: 'Host first · Locky backup',
          note: 'Locky has central automated locations; Lion’s Locker is the staffed alternative.',
          price: 'Locky from ~€1/hour · Lion’s ~€5/bag/day',
          status: 'BACKUP',
          statusTone: 'optional',
          mapUrl: maps('Locky Gozsdu Budapest'),
          bookingUrl: 'https://locky.hu/',
          bookingLabel: 'Locky',
        },
        {
          time: '11:00',
          title: 'Fashion Street',
          location: 'Deák Ferenc utca',
          note: 'Open-air shopping. Use Westend for bad weather or a specific store.',
          detail: 'Most stores begin around 10:00. Central Market Hall is the souvenir alternative.',
          status: 'RECOMMENDED',
          statusTone: 'recommended',
          mapUrl: maps('Fashion Street Budapest Deák Ferenc utca'),
          bookingUrl: 'https://fashionstreet.hu/',
          bookingLabel: 'Stores',
        },
        {
          time: '13:15',
          title: 'ÉS Bisztró',
          location: 'Deák Ferenc u. 12 · Kempinski',
          note: 'Bistro lunch beside Fashion Street.',
          detail: 'Reserve to avoid wasting departure-day time. Parisi 6 is the alternative.',
          status: 'RECOMMENDED',
          statusTone: 'recommended',
          mapUrl: maps('ÉS Bisztró Budapest Deák Ferenc u. 12'),
          bookingUrl: 'https://www.kempinski.com/en/hotel-corvinus-budapest/restaurants-bars/es-bisztro',
          bookingLabel: 'Reserve',
        },
        {
          time: '14:30',
          title: 'Coffee, bags, final walk',
          location: 'Central Budapest',
          note: 'Collect luggage by 15:10. Do not fit in one more attraction.',
          status: 'BUFFER',
          statusTone: 'locked',
          mapUrl: maps('Deák Ferenc tér Budapest'),
        },
        {
          time: '15:30',
          title: 'Leave for the airport',
          location: 'Budapest Airport · expected Terminal 2B',
          note: 'Non-negotiable city departure window: 15:30–15:45.',
          detail: 'Reconfirm BZ441, the 18:45 departure, and Terminal 2B 24–48 hours before.',
          status: 'LOCKED',
          statusTone: 'locked',
          mapUrl: maps('Budapest Airport Terminal 2B'),
        },
        {
          time: '18:45',
          title: 'BZ441 to Tel Aviv',
          location: 'Budapest Ferenc Liszt International Airport',
          note: 'Trip complete.',
          status: 'FLIGHT',
          statusTone: 'travel',
          mapUrl: maps('Budapest Ferenc Liszt International Airport'),
        },
      ],
    },
  ] satisfies TripDay[],
  decisions: [
    {
      id: 'friday-activity',
      kicker: 'Friday · activity',
      title: 'Friday activity',
      note: 'Hungaroring has an official driving event on 18 September.',
      status: 'CHOOSE ONE',
      statusTone: 'choice',
      options: [
        {
          name: 'Hungaroring',
          label: 'PRIMARY OPTION',
          description: 'Each person drives a different sports car for 2 laps / about 8.8 km on the actual Formula 1 circuit.',
          meta: 'Official event 15:00–18:00 · exact assigned slot follows registration · 18+ · physical licence · sober drivers only',
          price: '79,900–179,900 HUF per driver',
          note: 'Listed cars include GT-R, 911 GT3, Ferrari 488 and Lamborghini. Premium variants are usually about +10,000 HUF.',
          mapUrl: maps('Hungaroring Mogyoród Hungary'),
          bookingUrl: 'https://drxsport.hu/helyszin/hungaroring/',
        },
        {
          name: 'VadQuad tank driving',
          label: 'BACKUP',
          description: 'One driving turn each plus an instructor-driven extreme lap; roughly one hour total.',
          meta: 'Appointment only · ask about central-Budapest transfer · no walk-ins',
          price: '€400 total for the 3+1 package',
          note: 'A previously advertised VIP add-on was around €200; verify what is actually included.',
          mapUrl: maps('VadQuad Domonyvölgy Hungary'),
          bookingUrl: 'https://vadquad.hu/en/szolgaltatas/tank-driving/',
        },
        {
          name: 'Cold War Park APC',
          label: 'BACKUP',
          description: 'A private APC / military-vehicle session about 20–25 minutes from the center by car.',
          meta: 'Book at least 48h ahead · minimum 3 drivers · normal paintball needs 10 people',
          price: 'PSZh €396/group · BTR-60 €465/group',
          note: 'Full tank packages can exceed €1,150.',
          mapUrl: maps('Cold War Park Budapest Budaörs Airport'),
          bookingUrl: 'https://www.coldwarparkbudapest.hu/category/group-drivings',
        },
        {
          name: 'Budapest Shooting',
          label: 'CENTRAL BACKUP',
          description: 'The central, low-logistics fallback with instructor-led pistol, rifle and shotgun packages.',
          meta: 'Daily working hours 10:00–20:00 · online reservation strongly recommended',
          price: 'From ~22,980 HUF / person',
          note: 'Larger packages are roughly 25,000–32,000+ HUF before add-ons.',
          mapUrl: maps('Budapest Shooting Nagymező u. 37-39'),
          bookingUrl: 'https://booking.budapestshooting.eu/',
        },
      ],
    },
    {
      id: 'friday-dinner',
      kicker: 'Friday · dinner',
      title: 'Friday dinner',
      note: 'Choose rooftop dining or dinner with live entertainment.',
      status: 'CHOOSE ONE',
      statusTone: 'choice',
      options: [
        {
          name: 'BiBo Budapest',
          label: '#1 · VIEW + FOOD',
          description: 'Rooftop Danube and Buda views with Spanish-contemporary sharing dishes and cocktails.',
          meta: 'Aim for 19:45–20:00 · request a panoramic / terrace / view-facing table',
          note: 'No specific 18 September event was found; treat it as normal Friday operation.',
          mapUrl: maps('BiBo Budapest Dorothea Hotel'),
          bookingUrl: 'https://bibobudapest.hu/en/',
        },
        {
          name: 'VIBE Budapest',
          label: '#2 · DINNER + SHOW',
          description: 'Dinner, cocktails, DJs and performers in the same venue.',
          meta: 'Friday working hours 17:00–02:00 · reservation effectively required',
          price: 'Prior events used ~20,000 HUF / person minimum spend',
          note: 'The 18 September DJ / performance lineup and exact dress terms are still TBD.',
          mapUrl: maps('VIBE Budapest Széchenyi István tér 7-8'),
          bookingUrl: 'https://www.sevenrooms.com/reservations/vibebudapest',
        },
      ],
    },
    {
      id: 'sparty-tier',
      kicker: 'Saturday · Sparty',
      title: 'Sparty ticket tier',
      note: 'Do not buy Basic. Verify inclusions and the SEP10 code at checkout.',
      status: 'MUST DECIDE',
      statusTone: 'core',
      options: [
        {
          name: 'Premium Plus',
          label: 'MID TIER',
          description: 'Mid-tier ticket. Verify the included entry, cabin and gear benefits.',
          price: '€97 / person',
          note: 'The September page has advertised 10% off non-Basic tickets with code SEP10.',
          mapUrl: maps('Széchenyi Thermal Bath Budapest'),
          bookingUrl: 'https://spartybooking.com/landing-2026-sep/',
        },
        {
          name: 'Express + VIP',
          label: 'HIGH TIER',
          description: 'Higher tier with express entry and VIP access. Verify the current inclusions.',
          price: '€143 / person',
          note: 'Benefits may include faster entry, cabin, drinks, VIP area, towel or flip-flops. Confirm exact current inclusions.',
          mapUrl: maps('Széchenyi Thermal Bath Budapest'),
          bookingUrl: 'https://spartybooking.com/landing-vip/',
        },
      ],
    },
    {
      id: 'sunday-flow',
      kicker: 'Sunday · recovery',
      title: 'Sunday spa and rooftop',
      note: 'Choose after checking weather and availability.',
      status: 'FLEX',
      statusTone: 'recommended',
      options: [
        {
          name: 'AWAY Spa → Leo Rooftop',
          label: 'RECOMMENDED',
          description: 'Massage at W Budapest followed by rooftop drinks at Hotel Clark.',
          meta: 'AWAY around 14:00 · Leo around 18:30–19:00',
          price: 'Massage 52,000–58,000 HUF / person',
          mapUrl: maps('AWAY Spa W Budapest'),
          bookingUrl: 'https://awayspa.wbudapest.com/',
        },
        {
          name: 'Harmony Spa → High Note',
          label: 'SAME BUILDING',
          description: 'Spa and rooftop are both inside Aria Hotel.',
          meta: 'Outside guests receive wellness access with a treatment',
          price: 'Published 60-minute massage ~€105 / person',
          mapUrl: maps('Aria Hotel Budapest Harmony Spa'),
          bookingUrl: 'https://www.ariahotelbudapest.com/en/harmony-spa.html',
        },
        {
          name: 'AWAY Spa → 360 Bar',
          label: 'LIVELIER OPTION',
          description: 'Massage at W Budapest followed by 360 Bar nearby.',
          meta: '360 Bar is very close to W Budapest',
          mapUrl: maps('360 Bar Budapest Andrássy út 39'),
          bookingUrl: 'https://www.360bar.hu/',
        },
      ],
    },
  ] as Decision[],
  bookingPriorities: [
    { priority: 1, title: 'Airbnb arrival details', when: 'BEFORE TRIP', note: 'Confirm entrance, permit, check-in/out, keys, terrace rules and Monday luggage.', status: 'CONFIRM', statusTone: 'choice' as StatusTone, bookingUrl: apartmentListingUrl },
    { priority: 2, title: 'Sparty tickets', when: 'SAT 19 SEP', note: 'Choose Premium Plus vs Express + VIP; verify SEP10 and package inclusions.', status: 'MUST BOOK', statusTone: 'core' as StatusTone, bookingUrl: 'https://spartybooking.com/landing-2026-sep/' },
    { priority: 3, title: 'Mazel Tov', when: 'THU · 19:30', note: 'Locked in the plan; reserve the table.', status: 'RESERVE', statusTone: 'locked' as StatusTone, bookingUrl: 'https://mazeltov.hu/en/' },
    { priority: 4, title: 'Friday activity', when: 'FRI AFTERNOON', note: 'Check Hungaroring first, then VadQuad / Cold War Park / Shooting.', status: 'CHOOSE', statusTone: 'choice' as StatusTone, bookingUrl: 'https://drxsport.hu/helyszin/hungaroring/' },
    { priority: 5, title: 'Friday dinner', when: 'FRI · 20:00', note: 'BiBo view table or VIBE event energy.', status: 'CHOOSE', statusTone: 'choice' as StatusTone, bookingUrl: 'https://bibobudapest.hu/en/' },
    { priority: 6, title: 'Royal Spa', when: 'SAT · 14:00', note: 'Confirm outside access and three 60-minute massages together.', status: 'RESERVE', statusTone: 'recommended' as StatusTone, bookingUrl: 'https://www.corinthia.com/en-gb/budapest/royal-spa/' },
    { priority: 7, title: 'TATI brunch', when: 'SAT · 12:30', note: 'Reserve the late brunch slot.', status: 'RESERVE', statusTone: 'recommended' as StatusTone, bookingUrl: 'https://tatibudapest.com/brunch-menu/' },
    { priority: 8, title: 'Dobrumba', when: 'SAT · 19:00', note: 'Keep dinner light and on time before Sparty.', status: 'RESERVE', statusTone: 'recommended' as StatusTone, bookingUrl: 'https://dobrumba.hu/en/menu/' },
    { priority: 9, title: 'AWAY Spa', when: 'SUN · 14:00', note: 'Ask for three simultaneous or tightly staggered treatments.', status: 'RESERVE', statusTone: 'recommended' as StatusTone, bookingUrl: 'https://awayspa.wbudapest.com/contact' },
    { priority: 10, title: 'Leo Rooftop', when: 'SUN · 18:30', note: 'Reserve a normal table; keep rooftop choice weather-aware.', status: 'RESERVE', statusTone: 'recommended' as StatusTone },
    { priority: 11, title: 'ÉS Bisztró', when: 'MON · 13:15', note: 'Optional reservation removes departure-day waiting.', status: 'OPTIONAL', statusTone: 'optional' as StatusTone, bookingUrl: 'https://www.kempinski.com/en/hotel-corvinus-budapest/restaurants-bars/es-bisztro' },
  ],
  highlights: [
    {
      name: 'Hungaroring',
      eyebrow: 'FRIDAY · DRIVING',
      description: 'Official Formula 1 circuit driving experience.',
      meta: 'Exact personal driving slot must be confirmed after voucher registration.',
      price: '79,900–179,900 HUF / driver',
      status: 'CHOOSE',
      statusTone: 'choice',
      mapUrl: maps('Hungaroring Mogyoród Hungary'),
      bookingUrl: 'https://hungaroring.hu/site/en/experience/driving-experience',
    },
    {
      name: 'Sparty',
      eyebrow: 'SATURDAY · 21:30',
      description: 'Thermal-pool party at Széchenyi on Saturday night.',
      meta: '21:30–02:00 · confirmed 19 September date · 18+',
      price: 'Preferred tiers: €97 or €143 / person',
      status: 'MUST BOOK',
      statusTone: 'core',
      mapUrl: maps('Széchenyi Thermal Bath Budapest'),
      bookingUrl: 'https://spartybooking.com/landing-2026-sep/',
    },
    {
      name: 'Royal Spa',
      eyebrow: 'SATURDAY · 14:00',
      description: 'Pool, steam room and 60-minute massage at Corinthia.',
      meta: 'External access subject to availability · book three treatments together',
      price: '44,000–51,500 HUF / 60-minute massage',
      status: 'RECOMMENDED',
      statusTone: 'recommended',
      mapUrl: maps('Royal Spa Corinthia Budapest'),
      bookingUrl: 'https://www.corinthia.com/en-gb/budapest/royal-spa/',
    },
    {
      name: 'AWAY Spa',
      eyebrow: 'SUNDAY · 14:00',
      description: 'Massage treatment with qualifying spa access included.',
      meta: 'Omorovicza Healing is the most interesting 60-minute choice',
      price: '52,000–58,000 HUF / person',
      status: 'RECOMMENDED',
      statusTone: 'recommended',
      mapUrl: maps('AWAY Spa W Budapest'),
      bookingUrl: 'https://awayspa.wbudapest.com/treatments',
    },
    {
      name: 'Leo Rooftop',
      eyebrow: 'SUNDAY · SUNSET',
      description: 'Cocktails and small plates with Chain Bridge and skyline views.',
      meta: 'Aim for 18:30–19:00 · rooftop choice stays weather-dependent',
      status: 'RECOMMENDED',
      statusTone: 'recommended',
      mapUrl: maps('Leo Rooftop Budapest Hotel Clark'),
    },
  ] satisfies Place[],
  food: [
    { name: 'Mazel Tov', eyebrow: 'THU · DINNER', description: 'Mediterranean courtyard restaurant on Akácfa Street.', meta: '19:30 · reservation recommended', status: 'LOCKED', statusTone: 'locked', mapUrl: maps('Mazel Tov Budapest'), bookingUrl: 'https://mazeltov.hu/en/' },
    { name: 'VINYL & WOOD', eyebrow: 'FRI · BRUNCH', description: 'Coffee, brunch and design within an easy walk of base.', meta: 'Working hours 08:00–16:00', status: 'RECOMMENDED', statusTone: 'recommended', mapUrl: maps('VINYL & WOOD Budapest'), bookingUrl: 'https://vinylandwood.hu/?lang=en' },
    { name: 'BiBo', eyebrow: 'FRI · VIEW + FOOD', description: 'Panoramic rooftop dining and cocktails before Instant.', meta: 'Request a view-facing table · kitchen may close around 22:00', status: 'OPTION #1', statusTone: 'choice', mapUrl: maps('BiBo Budapest'), bookingUrl: 'https://bibobudapest.hu/en/' },
    { name: 'VIBE', eyebrow: 'FRI · DINNER + NIGHT', description: 'A high-energy room with DJs and performers built into dinner.', meta: '18 Sep lineup and minimum spend still TBD', price: 'Prior events ~20,000 HUF minimum / person', status: 'OPTION #2', statusTone: 'choice', mapUrl: maps('VIBE Budapest'), bookingUrl: 'https://www.sevenrooms.com/reservations/vibebudapest' },
    { name: 'TATI', eyebrow: 'SAT · BRUNCH', description: 'Michelin-recognized farm-to-table brunch.', meta: 'Weekend brunch 09:00–15:00 · aim for 12:30', status: 'RECOMMENDED', statusTone: 'recommended', mapUrl: maps('TATI Budapest'), bookingUrl: 'https://tatibudapest.com/brunch-menu/' },
    { name: 'Dobrumba', eyebrow: 'SAT · LIGHT DINNER', description: 'Middle Eastern sharing plates before Sparty.', price: 'Most dishes 3,000–6,500 HUF', status: 'RECOMMENDED', statusTone: 'recommended', mapUrl: maps('Dobrumba Budapest'), bookingUrl: 'https://dobrumba.hu/en/menu/' },
    { name: 'Cirkusz Café', eyebrow: 'SUN · BRUNCH', description: 'Brunch close to the apartment.', meta: 'Sunday working hours 07:30–16:00', status: 'RECOMMENDED', statusTone: 'recommended', mapUrl: maps('Cirkusz Café Budapest') },
    { name: 'Franziska Pest', eyebrow: 'SUN · BRUNCH BACKUP', description: 'Brunch alternative close to the apartment.', meta: 'Sunday working hours 08:00–16:00', status: 'BACKUP', statusTone: 'optional', mapUrl: maps('Franziska Pest Budapest') },
    { name: 'ÉS Bisztró', eyebrow: 'MON · LUNCH', description: 'Bistro beside Fashion Street.', meta: '13:15–14:30 · reserve to protect the airport buffer', status: 'RECOMMENDED', statusTone: 'recommended', mapUrl: maps('ÉS Bisztró Budapest'), bookingUrl: 'https://www.kempinski.com/en/hotel-corvinus-budapest/restaurants-bars/es-bisztro' },
  ] satisfies Place[],
  nightlife: [
    { name: 'La Siesta', eyebrow: 'THU · DRINKS', description: 'Cocktails, DJ and dancing on Kazinczy Street.', meta: 'Working hours 19:00–05:00 · recheck Thursday entry', status: 'LOCKED', statusTone: 'locked', mapUrl: maps('La Siesta Budapest'), bookingUrl: 'https://www.lasiestaclub.hu/' },
    { name: 'Instant-Fogas', eyebrow: 'FRI · ANNIVERSARY NIGHT', description: 'Hip-hop, R&B, trap and reggaeton rooms during the 18th-anniversary weekend.', meta: 'Aim for 22:30–00:30 · 18+ · free entry has been advertised', status: 'PLANNED', statusTone: 'recommended', mapUrl: maps('Instant-Fogas Budapest'), bookingUrl: anniversaryUrl },
    { name: 'Sparty', eyebrow: 'SAT · 21:30', description: 'Thermal-bath party at Széchenyi.', meta: '21:30–02:00 · last entry around 01:00', price: '€97–143 preferred tiers', status: 'MUST BOOK', statusTone: 'core', mapUrl: maps('Széchenyi Thermal Bath Budapest'), bookingUrl: 'https://spartybooking.com/landing-2026-sep/' },
    { name: 'Leo Rooftop', eyebrow: 'SUN · ROOFTOP', description: 'Cocktails and skyline views from Hotel Clark.', meta: 'Often uses ~2-hour seating slots', status: 'RECOMMENDED', statusTone: 'recommended', mapUrl: maps('Leo Rooftop Budapest') },
    { name: 'High Note SkyBar', eyebrow: 'SUN · BACKUP', description: 'Basilica-view rooftop directly above Harmony Spa.', meta: 'Normal tables are enough; skip the high-minimum Panorama Towers', status: 'BACKUP', statusTone: 'optional', mapUrl: maps('High Note SkyBar Budapest'), bookingUrl: 'https://highnoteskybar.hu/en/' },
    { name: '360 Bar', eyebrow: 'SUN · BACKUP', description: 'Rooftop bar close to W Budapest.', meta: 'Working Sunday hours 14:00–00:00', status: 'BACKUP', statusTone: 'optional', mapUrl: maps('360 Bar Budapest'), bookingUrl: 'https://www.360bar.hu/' },
  ] satisfies Place[],
  mapSpots: [
    { name: 'Apartment', label: 'Király utca 13', mapUrl: apartmentMapUrl },
    { name: 'Arrival / departure', label: 'Budapest Airport', mapUrl: maps('Budapest Ferenc Liszt International Airport') },
    { name: 'Thursday loop', label: 'Mazel Tov → La Siesta', mapUrl: maps('Mazel Tov Budapest') },
    { name: 'Friday lead', label: 'Hungaroring', mapUrl: maps('Hungaroring Mogyoród Hungary') },
    { name: 'Saturday Sparty', label: 'Széchenyi Thermal Bath', mapUrl: maps('Széchenyi Thermal Bath Budapest') },
    { name: 'Sunday view', label: 'Leo Rooftop', mapUrl: maps('Leo Rooftop Budapest') },
    { name: 'Monday loop', label: 'Fashion Street → ÉS', mapUrl: maps('Fashion Street Budapest') },
  ],
  budget: [
    { category: 'Friday activity', estimate: '79,900–179,900 HUF / driver', note: 'Hungaroring car choice; tank backups are about €396–465/group.' },
    { category: 'Sparty', estimate: '€97–143 / person', note: 'Premium Plus vs Express + VIP; verify SEP10 at checkout.' },
    { category: 'Royal Spa', estimate: '44,000–51,500 HUF / person', note: '60-minute massage; current external day-entry price must be confirmed.' },
    { category: 'AWAY Spa', estimate: '52,000–58,000 HUF / person', note: 'Preferred massages include qualifying spa access.' },
    { category: 'VIBE fallback', estimate: '~20,000 HUF / person minimum', note: 'Seen on prior events; 18 September terms are not confirmed.' },
    { category: 'Luggage backup', estimate: 'From €1/hour or ~€5/bag/day', note: 'Locky automated locker vs Lion’s staffed storage.' },
  ],
  essentials: [
    {
      title: 'Apartment · open items',
      eyebrow: 'UNCONFIRMED',
      items: [
        'Exact entrance and arrival instructions',
        'Rental permit / registration',
        'Check-in, checkout and key handover',
        'Monday luggage storage',
        'Private vs shared rooftop and noise rules',
      ],
    },
    {
      title: 'Packing',
      eyebrow: 'DO NOT FORGET',
      items: [
        'Physical driving licence + closed shoes',
        'Swimwear + flip-flops + waterproof phone pouch',
        'Towel if the Sparty tier excludes it',
        'Earplugs + power bank + comfortable shoes',
        'One or two smart-casual outfits',
      ],
    },
    {
      title: 'Transport',
      eyebrow: 'TRANSPORT',
      items: [
        'Install Bolt and BudapestGO',
        'Walk when it is genuinely convenient',
        'Use Bolt freely when it saves energy',
        'Plan a dedicated transfer for Hungaroring / tank options',
        'Keep the 15:30–15:45 Monday airport departure sacred',
      ],
    },
    {
      title: 'Night rules',
      eyebrow: 'PACE',
      items: [
        'Normal nights end around 23:00–00:30',
        'Saturday is the only full late-night exception',
        'Friday must not steal Saturday',
        'Post-Sparty Instant happens only if everyone genuinely wants it',
        'Avoid random promoter-driven venues',
      ],
    },
  ],
  verifyBeforeTrip: [
    'Inbound flight number, BZ441 time, and Terminal 2B',
    'Airbnb entrance, keys, checkout, and luggage plan',
    'Every reservation and the exact Hungaroring driving slot',
    'VIBE and Instant-Fogas event programming / minimum spend / entry',
    'Royal Spa outside access and massage times',
    'Sparty tier, promo, weather, entry rules, and included gear',
    'AWAY’s ability to host three treatments together',
    'Sunday rooftop weather and Monday store hours',
  ],
  safety: [
    'Keep phones and wallets controlled in nightlife crowds.',
    'Take minimal valuables to Sparty.',
    'Nobody drinks before driving experiences.',
    'Provider safety and ID rules win for tank / shooting activities.',
  ],
};
