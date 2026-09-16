// Active local-preview data. trip-data.ts is preserved for the previous app.
// Source: Budapest_Bachelor_Trip_Master_v10.md, consolidated 14 September 2026.
// Prices, hours and availability below are research notes, not live confirmations.
import { trip as previous, type Decision, type DecisionOption, type Place, type TimelineItem, type TripDay } from './trip-data.ts';
export type { DecisionOption } from './trip-data';

const maps = (query:string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const venue = (name:string, description:string, website?:string, address?:string, meta?:string, price?:string):DecisionOption => ({name,description,bookingUrl:website,mapUrl:maps(address??`${name} Budapest`),meta,price});
const shooting = venue('Budapest Shooting','Selected activity for all 4; time slot and individual packages are not reserved.','https://booking.budapestshooting.eu/','Nagymező u. 37–39, 1065 Budapest','Published hours about 10:00–20:00. Bring valid ID if requested; follow the instructor briefing. No alcohol beforehand. Compare upper packages for value.','Adrenaline ~22,980 HUF/person; larger packages ~25,000–32,000+ HUF/person');
const driving = venue('Hungaroring','Optional second activity if timing works. A different day is only possible if the operator confirms a date.','https://hungaroring.hu/site/en/experience/driving-experience','Hungaroring út 10, 2146 Mogyoród','18 Sep official event window ~15:00–18:00; personal slot follows registration. 18+, physical driving licence, on-site registration, sober driver and passenger-seat instructor. Weather/track dependent; recheck 48h before.','2 laps: Mustang GT 79,900; Mach 1 99,900; GT-R 119,900; 911 GT3 149,900; Ferrari 488 / Huracán 179,900 HUF');
shooting.links=[{label:'Compare packages',url:'https://budapestshooting.eu/en/packages/'}];
driving.links=[{label:'Car options',url:'https://drxsport.hu/helyszin/hungaroring/'},{label:'Registration',url:'https://regisztracio.drxsport.hu/'}];
const fridayDinner:DecisionOption[] = [
  venue('BiBo','Rooftop food, views and cocktails.','https://bibobudapest.hu/en/','Dorothea Hotel, Apáczai Csere János u. 11, Budapest','7th floor; target 19:45–20:00 for 4. Request panoramic/terrace/view-facing table. Working hours ~12:00–23:30. No specific Sep 18 event confirmed.'),
  venue('VIBE','Dinner, drinks, DJs and performers.','https://www.sevenrooms.com/reservations/vibebudapest','Széchenyi István tér 7–8, Budapest','Friday ~17:00–02:00; reserve for 4. Sep 18 lineup, minimum spend and smart-dress terms need reconfirmation.','Prior Late Night events used ~20,000 HUF/person minimum spend'),
];
const saturdayDinner:DecisionOption[] = [
  venue('Spago','Current leading option: upscale international dining with strong meat choices. The Duchess is in the same property.','https://www.spagobudapest.com/','Matild Palace, Váci u. 36, 1056 Budapest','Master-plan research: Michelin Guide Selected; availability for 4 was found for Sep 18 and 19. Not reserved and not a live availability guarantee.'),
  venue('Cut & Barrel','Meat-and-grill focused; the strongest meat-first alternative.','https://cutandbarrel.com/en/',undefined,'Master-plan research: Michelin Guide Selected. Check current availability for 4 on Sep 18–19.'),
  venue('Borkonyha Winekitchen','Modern Hungarian-influenced cooking, wine and strong meat choices. Choose à la carte to keep dinner manageable.','https://borkonyha.hu/','Sas u. 3, 1051 Budapest','Master-plan research: 1 Michelin Star. Availability for 4 still needs checking through the official reservation/deposit system.'),
  venue('Textúra','Creative contemporary cuisine in a lively, upscale setting.','https://texturaetterem.hu/en/',undefined,'Master-plan research: Michelin Guide Selected. Friday/Saturday service; online reservations/deposit. Availability for 4 not confirmed.'),
  venue('Stand','A longer, more formal modern Hungarian tasting-menu dinner; choose only if dinner itself becomes the main event.','https://standrestaurant.hu/en/',undefined,'Master-plan research: 2 Michelin Stars; 60-day booking window. Check current inventory rather than relying on the earlier “not open yet” note.'),
];
const saturdayNight:DecisionOption[] = [
  venue('The Duchess','Leading choice: rooftop cocktails with weekend DJ energy and a more grown-up atmosphere.','https://theduchessbudapest.com/en/','Matild Palace, Váci u. 36, 1056 Budapest','Working Saturday hours ~18:00–01:00. Confirm Sep 19 program, table availability and entry terms.'),
  venue('White Raven Skybar','Elegant rooftop with Danube/Parliament views and DJ or live-music programming.','https://whiteravenskybar.com/','Hilton Budapest, Hess András tér 1–3, 1014 Budapest','Working Saturday hours ~14:00–00:00. Confirm the date-specific program and closing time.'),
  venue('360 Bar','More DJ/party energy and dancing, with a more mixed and possibly younger crowd.','https://www.360bar.hu/','Andrássy út 39, 1061 Budapest','Working Saturday hours ~14:00–02:00; confirm the Sep 19 session.'),
  venue('High Note SkyBar','Elegant Basilica-view cocktails; generally calmer unless a DJ or special event is scheduled.','https://highnoteskybar.hu/en/','Aria Hotel, Hercegprímás u. 5, Budapest','Working Saturday hours ~14:00–00:00. Also an option for Sunday after Harmony Spa.'),
];
const royal = venue('Royal Spa','4 × Deep Muscle massages; 60 minutes each is the preferred choice. Pool, jacuzzi, Finnish/salt saunas, steam and relaxation areas.','https://www.corinthia.com/en-gb/budapest/royal-spa/massages/','Erzsébet körút 43–49, Budapest','Target arrival 13:45–14:00, wellness then ~15:00 massages, leave 16:30–17:00. Ask for 4 simultaneous or tightly staggered appointments and confirm external-guest access. Working hours ~07:00–21:00.','60 min ~51,500 HUF/person (206,000 for 4); 90 min ~59,000 (236,000 for 4)');
const away = venue('AWAY Spa','Sunday primary: Omorovicza Healing Massage, with spa admission under the researched qualifying-treatment policy.','https://awayspa.wbudapest.com/treatments','W Budapest, Andrássy út 25','Ask for 4 simultaneous/tightly staggered appointments and reconfirm included admission. Working hours ~08:00–20:00.','Omorovicza 60 min ~58,000 HUF/person (232,000 for 4); De-Stress / Performance / Reset / Detox 50 min ~52,000; Quick Fix 30 min ~32,000; researched weekend day pass ~22,000');
const harmony = venue('Aria Harmony Spa','Sunday spa backup, especially when paired with High Note SkyBar in the same hotel.','https://www.ariahotelbudapest.com/en/harmony-spa.html','Aria Hotel Budapest','Treatment, external access and availability for 4 need confirmation.');
const leo = venue('Leo Rooftop','Sunday leading choice: cocktails and small plates with Danube and Chain Bridge views.',undefined,'Hotel Clark, Clark Ádám tér 1, Budapest','Reserve for 4 around 18:30–19:00; weather-dependent.');
const choice = (id:string,title:string,note:string,options:DecisionOption[]):Decision => ({id,kicker:title,title,note,status:'TO CONFIRM',statusTone:'choice',options});
const place = (option:DecisionOption,eyebrow:string):Place => ({...option,eyebrow});
const stop = (time:string,title:string,location:string,note:string,extra:Partial<TimelineItem>={}):TimelineItem => ({time,title,location,note,status:'TARGET',statusTone:'recommended',...extra});
const home = previous.base.mapUrl;
const days:TripDay[] = [
  {...previous.days[0],items:previous.days[0].items.map((item,i)=> i===0?{...item,note:'Blue Bird BZ442 · TLV Terminal 3 departure 14:00; Budapest arrival 16:35. Flights booked.'}:i===1?{...item,detail:'Check-in from 15:00; self check-in via lockbox. Final access instructions/code still needed.'}:i===2?{...item,detail:'Selected restaurant; reserve a table for 4 at 19:30.',status:'RESERVE'}:i===3?{...item,detail:'Target ~21:45–23:45. Recheck the Sep 17 program.'}: {...item,time:'23:45',note:'Walk home. Instant-Fogas is only an optional extra if everyone wants it.'})},
  {...previous.days[1],title:'Shooting, dinner & nightlife',theme:'Brunch, shooting, apartment reset, dinner and Instant-Fogas.',summary:'Brunch → shooting → reset → BiBo or VIBE → Instant-Fogas.',arc:['Brunch','Shooting','Reset','Dinner','Dance'],items:[
    previous.days[1].items[0],
    stop('14:00','Budapest Shooting','Nagymező u. 37–39','Selected for all 4. Reserve a slot and choose packages.',{detail:'14:00 is a provisional planning time, not a reservation. No alcohol before the activity. Bring ID if requested and follow the instructor briefing. Optional Hungaroring details are below.',price:shooting.price,status:'TIME TBD',statusTone:'choice',mapUrl:shooting.mapUrl,bookingUrl:shooting.bookingUrl}),
    {...previous.days[1].items[2],detail:'Protected reset; target return 18:00–18:45. Shower, rest, drinks, music, change and a short nap if needed.'},
    {...previous.days[1].items[3],detail:'Both options remain open. Reserve for 4 at 19:45–20:00; no dinner reservation made yet.'},
    {...previous.days[1].items[4],detail:'Tickets reported as handled by the group. Free entry has been advertised; recheck Sep 18 room schedule. Target arrival 22:30–23:00, leave 00:30–01:00.',status:'HANDLED',statusTone:'locked'},
    previous.days[1].items[5],
  ]},
  {...previous.days[2],shortTitle:'Spa & rooftop',title:'Spa, dinner & rooftop',theme:'Brunch, Deep Muscle massages, premium dinner, apartment reset and rooftop DJs.',summary:'TATI → Royal Spa → dinner → apartment reset → rooftop.',arc:['Brunch','Spa','Dinner','Reset','Rooftop'],items:[
    {...previous.days[2].items[0],detail:'Target 12:00–12:30 for 4. Weekend Farm Brunch ~09:00–15:00. Twentysix is the alternative.',status:'RESERVE'},
    stop('14:00','Royal Spa · Corinthia','Erzsébet körút 43–49','4 × Deep Muscle massages; 60 minutes each preferred.',{detail:royal.meta,price:royal.price,status:'RESERVE',mapUrl:royal.mapUrl,bookingUrl:royal.bookingUrl}),
    stop('18:00','Saturday dinner · choose venue','Spago leads · 5 options','Premium dinner for 4. Spago is the current first choice, not a confirmed booking.',{detail:'Target 18:00–19:00 depending on spa finish and venue. Timing remains provisional. Dinner comes before the apartment reset.',status:'CHOOSE',statusTone:'choice'}),
    stop('19:30','Apartment reset','Király utca 13','Digest, rest, shower, change and hydrate.',{detail:'Protected ~19:30–20:40 block after dinner; music and time together before dressing for the rooftop. No thermal party planned.',status:'PROTECTED',statusTone:'locked',mapUrl:home}),
    stop('22:00','Saturday rooftop · choose venue','The Duchess leads · 4 options','Rooftop cocktails and DJs. Final venue and reservation still needed.',{detail:'Target arrival 22:00–22:30. Finish around 00:30–02:00 depending on venue; White Raven and High Note may close at midnight, Duchess around 01:00, 360 around 02:00. Confirm current hours and program.',status:'CHOOSE',statusTone:'choice'}),
    stop('01:00','Return to apartment','Király utca 13','Flexible target: leave around 00:30–02:00 depending on venue and energy.',{status:'FLEX',statusTone:'open',mapUrl:home}),
  ]},
  {...previous.days[3],items:previous.days[3].items.map((item,i)=>i===1?{...item,note:'Omorovicza Healing is the preferred Sunday treatment.',detail:away.meta,price:away.price}:item)},
  {...previous.days[4],shortTitle:'Departure day',title:'Shopping, lunch & airport',theme:'Pack, shopping, lunch, apartment and airport.',summary:'Pack → Fashion Street → ÉS → apartment/bags → airport.',arc:['Pack','Shop','Lunch','Bags','Fly'],items:[
    stop('10:00','Wake & pack','Király utca 13','Late checkout confirmed; exact checkout time still TBD.',{detail:'Luggage storage may not be needed. Confirm the latest apartment access time with Gabrielle before planning bag collection.',status:'CONFIRM',statusTone:'choice',mapUrl:home}),
    previous.days[4].items[2],
    {...previous.days[4].items[3],detail:'Target 13:00–13:30 depending on confirmed late checkout. No reservation made yet.'},
    stop('14:30','Apartment & bags','Király utca 13','Collect bags and prepare to leave; adjust to the confirmed late-checkout time.',{status:'BUFFER',statusTone:'locked',mapUrl:home}),
    {...previous.days[4].items[5],location:'Budapest Airport · booking shows T2A',note:'Leave central Budapest around 15:30–15:45, or earlier if live traffic/flight information requires it.',detail:'Blue Bird BZ441 at 18:45; booking currently displays T2A. Reconfirm terminal and status 24–48h before departure.',mapUrl:maps('Budapest Airport Terminal 2A')},
    {...previous.days[4].items[6],note:'Blue Bird BZ441 · Budapest 18:45 → Tel Aviv 23:00. Times local to each airport.'},
  ]},
];

export const trip = {
  ...previous,version:'v10',groupSize:4,sourceUpdated:'14 September 2026',
  base:{...previous.base,listingName:'Velvet Sky Residence – InnerTown | Garage | 3 BR',host:'Gabrielle',checkIn:'Thu 17 Sep · 15:00',checkOut:'Late checkout confirmed · time TBD',area:'Directly at Gozsdu Udvar',detail:'4th floor with elevator · 3 bedrooms · terrace · Wi-Fi · AC/heating · linens, towels and toiletries · coffee/tea',warning:'Self check-in via lockbox. Final instructions/code still TBD.',rules:'Smoking only on the terrace. Whether the terrace is private or shared still needs confirmation.',parking:'Optional secure off-site parking, approximately 6–9 minutes away; listed at €30/car/night.'},
  arrival:{...previous.arrival,flight:'Blue Bird BZ442 · booked',departureTime:'14:00',arrivalTime:'16:35',duration:'3h 35m',terminal:'Depart TLV Terminal 3'},
  departure:{...previous.departure,flight:'Blue Bird BZ441 · booked',departureTime:'18:45',arrivalTime:'23:00',duration:'3h 15m',terminal:'Booking currently shows BUD T2A. Reconfirm terminal and flight status 24–48h before departure.',mapUrl:maps('Budapest Airport Terminal 2A')},
  days,
  decisions:[
    choice('friday-activity','Friday activity','Shooting is selected, but not reserved. Hungaroring is optional, not a replacement.',[shooting,driving]),
    choice('friday-dinner','Friday dinner','Both preserved; choose and reserve for 4.',fridayDinner),
    choice('saturday-dinner','Saturday dinner','Target 18:00–19:00. Spago leads; availability found in research is not a reservation.',saturdayDinner),
    choice('saturday-night','Saturday rooftop','The Duchess leads. Choose one venue and confirm its Sep 19 DJ program, hours and reservation terms.',saturdayNight),
    choice('sunday-flow','Sunday spa and rooftop','Preferred flow: Cirkusz → W AWAY → free time → Leo. All reservations still pending.',[away,harmony,leo,...saturdayNight.filter(p=>['High Note SkyBar','360 Bar'].includes(p.name))]),
  ],
  confirmedBookings:[
    {title:'Flights',note:'Blue Bird BZ442 outbound and BZ441 return booked.',info:'flights'},
    {title:'Apartment',note:'Velvet Sky Residence · host Gabrielle.',info:'apartment'},
    {title:'Late checkout',note:'Confirmed; exact time still TBD.',info:'apartment'},
    {title:'Instant-Fogas tickets',note:'Reported as handled by the group.',eventId:'2-5'},
  ],
  bookingPriorities:[
    {title:'Royal Spa · 4 Deep Muscle massages',when:'SAT · 14:00 target',note:'4 × 60 minutes; simultaneous or tightly staggered. Confirm outside-guest access.',eventId:'3-2',bookingUrl:royal.bookingUrl},
    {title:'Budapest Shooting',when:'FRI · TIME TBD',note:'Reserve for 4 and choose individual packages.',eventId:'2-2',bookingUrl:shooting.bookingUrl},
    {title:'Saturday dinner',when:'SAT · 18:00–19:00 target',note:'Spago / Cut & Barrel / Borkonyha / Textúra / Stand. Choose and reserve.',eventId:'3-3'},
    {title:'Saturday rooftop / DJ venue',when:'SAT · 22:00–22:30 target',note:'Duchess / White Raven / 360 / High Note. Confirm closing time and program.',eventId:'3-5'},
    {title:'Friday dinner',when:'FRI · 19:45–20:00 target',note:'BiBo or VIBE for 4.',eventId:'2-4'},
    {title:'Mazel Tov',when:'THU · 19:30 target',note:'Reserve a table for 4.',eventId:'1-3',bookingUrl:'https://mazeltov.hu/en/'},
    {title:'W AWAY treatments',when:'SUN · 14:00 target',note:'4 treatments; Omorovicza Healing preferred. Confirm included access.',eventId:'4-2',bookingUrl:away.bookingUrl},
    {title:'Leo Rooftop',when:'SUN · 18:30–19:00 target',note:'Reserve for 4; final rooftop choice weather-dependent.',eventId:'4-4'},
    {title:'TATI brunch',when:'SAT · 12:00–12:30 target',note:'Reserve for 4; Twentysix is the alternative.',eventId:'3-1',bookingUrl:'https://tatibudapest.com/brunch-menu/'},
    {title:'ÉS Bisztró',when:'MON · 13:00–13:30 target',note:'Optional lunch reservation; align with late checkout.',eventId:'5-3',bookingUrl:previous.days[4].items[3].bookingUrl},
  ].map((b,i)=>({...b,priority:i+1,status:'RESERVE',statusTone:'recommended' as const})),
  highlights:[place(shooting,'FRIDAY · SELECTED, NOT RESERVED'),place(driving,'OPTIONAL · DRIVING'),place(royal,'SATURDAY · SPA'),place(away,'SUNDAY · SPA'),place(harmony,'SUNDAY · SPA BACKUP')],
  food:[...previous.food.filter(p=>!['Dobrumba','BiBo','VIBE'].includes(p.name)),...fridayDinner.map(p=>place(p,'FRIDAY · DINNER OPTION')),...saturdayDinner.map(p=>place(p,'SATURDAY · DINNER OPTION')),place(venue('Twentysix','Saturday brunch alternative if timing changes.'),'SATURDAY · BRUNCH BACKUP')],
  nightlife:[...previous.nightlife.filter(p=>['La Siesta','Instant-Fogas'].includes(p.name)).map(p=>p.name==='Instant-Fogas'?{...p,status:'HANDLED',meta:'Tickets reported as handled. Target 22:30–23:00 arrival; leave 00:30–01:00. Recheck Sep 18 room schedule.'}:p),...saturdayNight.map(p=>place(p,'SATURDAY · ROOFTOP OPTION')),place(leo,'SUNDAY · ROOFTOP')],
  mapSpots:[...previous.mapSpots.filter(p=>!['Friday lead','Saturday Sparty'].includes(p.name)),{name:'Friday activity',label:'Budapest Shooting',mapUrl:shooting.mapUrl!},{name:'Saturday leading rooftop',label:'The Duchess',mapUrl:saturdayNight[0].mapUrl!}],
  budget:[
    {category:'Budapest Shooting',estimate:shooting.price!,note:'Working package estimates; choose per person. Add-ons depend on the package.'},
    {category:'Hungaroring · optional',estimate:'79,900–179,900 HUF / driver',note:driving.price!},
    {category:'Royal Spa · Deep Muscle',estimate:'206,000 HUF for 4 × 60 min',note:'~51,500 each. 90-minute alternative: ~59,000 each / 236,000 for 4. Reconfirm access and price.'},
    {category:'W AWAY · Omorovicza',estimate:'232,000 HUF for 4 × 60 min',note:'~58,000 each, with admission under the researched treatment policy. Reconfirm before booking.'},
    {category:'VIBE',estimate:'Prior events ~20,000 HUF/person minimum',note:'Not confirmed for Sep 18.'},
    {category:'Optional apartment parking',estimate:'€30 / car / night',note:'Secure off-site parking approximately 6–9 minutes away.'},
  ],
  essentials:[
    {title:'Apartment · details to confirm',eyebrow:'OPEN ITEMS',items:['Final lockbox instructions and code','Exact late-checkout time on Monday','Whether the terrace is private or shared','Whether late checkout covers the planned bag collection time']},
    {title:'Packing',eyebrow:'DO NOT FORGET',items:['Travel documents and valid ID for shooting if requested','Physical driving licence if adding Hungaroring','Swimwear and flip-flops for the spas','Smart-casual outfits for dinner and rooftop venues','Power bank, earplugs and comfortable shoes']},
    {title:'Transport',eyebrow:'TRANSPORT',items:['Bolt or official taxi from the airport; apartment arrival roughly 17:30–18:00 depending on traffic and baggage','Walk when convenient; Bolt when useful','If adding Hungaroring, arrange a dedicated transfer and protect the apartment reset','Leave central Budapest Monday around 15:30–15:45; earlier if traffic/flight status requires','Booking shows return terminal T2A; reconfirm 24–48h before']},
    {title:'Group & night plans',eyebrow:'TRIP NOTES',items:['4 friends, one groom; no food restrictions','Music: hip-hop, R&B, mainstream and reggaeton/Latin; pure techno is lower priority','Normal nights end around midnight; Friday target 00:30–01:00','Saturday rooftop target 22:00–22:30; finish depends on venue, roughly 00:30–02:00','Preserve apartment downtime. Sunday is recovery, not a sightseeing checklist.']},
  ],
  verifyBeforeTrip:['Final lockbox instructions/code, late-checkout time and terrace privacy','BZ442 / BZ441 status, TLV T3 and return BUD T2A 24–48h before departure','Shooting package and exact time; whether optional Hungaroring is added','Friday dinner selection and reservation','4 Royal Spa Deep Muscle appointments and external access','Saturday dinner and rooftop selection, DJ program, hours and reservations','W AWAY treatment, admission policy and appointments for 4','Sunday rooftop choice/weather and Monday lunch timing'],
  safety:['No alcohol before shooting or driving. Follow venue instructors and ID/safety requirements.','Keep phones and wallets secure in nightlife crowds.','Smoking is allowed only on the apartment terrace.'],
  researchHistory:'FLAVA is not an active dinner candidate: the original concept reportedly changed format / primarily serves hotel guests. Kept only as research history. Sparty, VadQuad tank driving and Cold War Park were removed in v10.',
};
