// Public app content from the 16 September 2026 developer update.
// Reservation references, booking names and access codes are deliberately excluded.
import { trip as v10 } from './trip-data-v10.ts';
import type { Decision, DecisionOption, Place, TripDay } from './trip-data.ts';
export type { DecisionOption } from './trip-data.ts';

export type BookingState = 'confirmed'|'waiting'|'action'|'later'|'backup'|'handled'|'optional';
export type Reservation = {
  id:string; title:string; when:string; state:BookingState; label:string; note:string;
  eventId?:string; info?:string; bookingUrl?:string;
};
const maps=(q:string)=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const shootingUrl='https://booking.budapestshooting.eu/';
const bathUrl='https://tickets.szechenyibath.hu/partner/szechenyi';
const bathMap=maps('Széchenyi Thermal Bath, Állatkerti krt. 9–11, Budapest');
const vibe=v10.food.find(p=>p.name==='VIBE')!;
const spago=v10.food.find(p=>p.name==='Spago')!;
const duchess=v10.nightlife.find(p=>p.name==='The Duchess')!;
const whiteRaven=v10.nightlife.find(p=>p.name==='White Raven Skybar')!;
const rookie:DecisionOption={
  name:'Rookie Package × 4',description:'Selected working package for four complete beginners: 52 shots and 7 weapons per person.',
  price:'26,970 HUF/person · 107,880 HUF for 4',
  meta:'Preferred Friday slot ~14:00–15:00; exact time still needs booking. Valid ID required. Follow the instructor and safety briefing. Absolutely no alcohol before shooting.',
  bookingUrl:shootingUrl,mapUrl:maps('Budapest Shooting, Nagymező u. 37–39, 1065 Budapest'),
  links:[{label:'Package details',url:'https://budapestshooting.eu/en/packages/'}],
};
const optionalDriving={...v10.decisions[0].options[1],description:'Optional additional/alternative activity only; not in the active Friday schedule. It must not interfere with shooting, the apartment reset or VIBE.'};
const reservations:Reservation[]=[
  {id:'flights',title:'Flights',when:'17 & 21 Sep',state:'confirmed',label:'Confirmed',note:'Blue Bird BZ442 outbound and BZ441 return. Reconfirm flight status and return terminal before departure.',info:'flights'},
  {id:'apartment',title:'Apartment',when:'17–21 Sep · 4 adults',state:'confirmed',label:'Confirmed',note:'Velvet Sky Residence. Check-in from 15:00; expected arrival 17:30–18:00. Quiet hours 21:00–09:00; no parties or events.',info:'apartment'},
  {id:'access',title:'Apartment access',when:'Thu 17 Sep',state:'waiting',label:'Waiting for host',note:'Gabrielle was contacted on 16 Sep for the building entrance/code, lockbox location/code, directions inside the building and terrace privacy.',info:'apartment'},
  {id:'checkout',title:'Exact late-checkout time',when:'Mon 21 Sep',state:'waiting',label:'Waiting for host',note:'Late checkout is confirmed. The exact time has been requested and is still pending.',info:'apartment'},
  {id:'mazel',title:'Mazel Tov · table for 4',when:'Thu · ~19:30',state:'action',label:'Need to book',note:'Primary Thursday dinner, unless airport timing makes it impractical.',eventId:'1-3',bookingUrl:'https://mazeltov.hu/en/'},
  {id:'siesta',title:'La Siesta',when:'Thu · ~21:45 onwards',state:'later',label:'Recheck program',note:'Reconfirm Sep 17 program and entry. Cocktails, music and small-club atmosphere close to the apartment.',eventId:'1-4',bookingUrl:'https://www.lasiestaclub.hu/'},
  {id:'shooting',title:'Shooting · Rookie × 4',when:'Fri · ~14:00–15:00',state:'action',label:'Need to book',note:rookie.meta!,eventId:'2-2',bookingUrl:shootingUrl},
  {id:'vibe',title:'VIBE · Dinner & Entertainment',when:'Fri 18 Sep · 20:30 · 4 guests',state:'confirmed',label:'Confirmed',note:'Dinner can flow into cocktails, entertainment and music. Around 23:00, stay if the atmosphere is good or move to Instant-Fogas.',eventId:'2-4',bookingUrl:'https://vibebudapest.com/'},
  {id:'instant',title:'Instant-Fogas',when:'Fri · optional after VIBE',state:'handled',label:'Tickets reported handled',note:'Optional, not mandatory. VIBE may become the whole evening. Tickets reported as already handled by the group.',eventId:'2-5',bookingUrl:'https://instant-fogas.com/'},
  {id:'tati',title:'TATI brunch',when:'Sat · ~12:00',state:'later',label:'Optional reservation',note:'Not yet reserved. Keep brunch light and short enough to reach Széchenyi on time.',eventId:'3-1',bookingUrl:'https://tatibudapest.com/'},
  {id:'bath',title:'Széchenyi · Fast Track × 4',when:'Sat · ~13:30–14:00',state:'later',label:'Buy before Saturday',note:'Not purchased. Buy Thursday evening or Friday at the latest. Main social bath experience; not Private Spa / DaySPALM.',eventId:'3-2',bookingUrl:bathUrl},
  {id:'spago',title:'Spago · dinner for 4',when:'Sat 19 Sep · 20:00',state:'confirmed',label:'Confirmed',note:'Matild Palace, Váci u. 36. Premium dinner, followed by The Duchess in the same building if the rooftop request is accepted.',eventId:'3-4',bookingUrl:'https://www.spagobudapest.com/'},
  {id:'duchess',title:'The Duchess · 4 guests',when:'Sat · preferred 22:30',state:'waiting',label:'Request sent',note:'Awaiting email confirmation. Requested 22:30, flexible 22:00–23:00, after Spago; rooftop/view position, Saturday DJ/music atmosphere, minimum spend and deposit details. Not booked yet.',eventId:'3-5',bookingUrl:'https://theduchessbudapest.com/en/'},
  {id:'white-raven',title:'White Raven Skybar',when:'Sat · backup ~22:00–22:30',state:'backup',label:'Backup only',note:'First backup if Duchess cannot accommodate the group. Do not book while waiting, unless availability becomes tight. Confirm Skyline Sessions / DJ programming and closing time.',eventId:'3-5',bookingUrl:'https://whiteravenskybar.com/'},
  {id:'away',title:'W AWAY · massage × 4',when:'Sun · target ~14:00',state:'action',label:'Need to book',note:'Omorovicza Healing, 60 minutes each. Ask for four simultaneous or tightly staggered treatments and confirm included spa access.',eventId:'4-2',bookingUrl:'https://awayspa.wbudapest.com/treatments'},
  {id:'sunday-rooftop',title:'Sunday rooftop',when:'Sun · evening',state:'action',label:'Need to finalize',note:'Leo remains primary, but availability is uncertain and it is not confirmed. Resolve after W AWAY; High Note and 360 Bar are alternatives.',eventId:'4-4'},
  {id:'es',title:'ÉS Bisztró',when:'Mon · ~13:00–13:30',state:'optional',label:'Optional reservation',note:'Final lunch primary; no urgent reservation. Align with the confirmed late-checkout time.',eventId:'5-3',bookingUrl:v10.food.find(p=>p.name==='ÉS Bisztró')!.bookingUrl},
];
const actionOrder=['access','shooting','mazel','duchess','bath','away','sunday-rooftop','tati','flights'];
const days:TripDay[]=v10.days.map((day)=>{
  if(day.day===1)return {...day,items:day.items.map((e,i)=>i===1?{...e,detail:'Self check-in from 15:00. Access instructions requested from Gabrielle; still waiting. Quiet hours 21:00–09:00; no parties or events.'}:i===3?{...e,status:'CHECK',detail:'Target 21:45 onwards. Program and entry still need reconfirmation.'}:e)};
  if(day.day===2)return {...day,title:'Shooting, VIBE & nightlife',theme:'Brunch, shooting, apartment reset and VIBE.',summary:'Brunch → shooting → reset → VIBE 20:30 → optional Instant.',arc:['Brunch','Shooting','Reset','VIBE','Optional Instant'],items:[
    day.items[0],
    {...day.items[1],title:'Budapest Shooting · Rookie',note:'Rookie Package × 4 · 52 shots / 7 weapons each.',detail:rookie.meta,price:rookie.price,status:'TIME TBD'},
    {...day.items[2],time:'17:00',note:'Shower, rest and get dressed.',detail:'Protected reset from roughly 16:00–17:00 until 19:30. No parties/events. Quiet hours at the apartment are 21:00–09:00.'},
    {...day.items[3],time:'20:30',title:'VIBE · Dinner & Entertainment',location:'Széchenyi István tér 7–8',note:'Confirmed reservation for 4.',detail:'Stay for dinner, cocktails, entertainment and music. No need to leave immediately after dinner.',status:'CONFIRMED',statusTone:'locked',mapUrl:vibe.mapUrl,bookingUrl:'https://vibebudapest.com/',bookingLabel:'Venue'},
    {...day.items[4],time:'23:00',title:'Stay at VIBE or optional Instant',location:'VIBE / Instant-Fogas · decide together',note:'Assess the atmosphere and energy; staying at VIBE is equally part of the plan.',detail:'Instant-Fogas tickets reported handled. Optional move to Akácfa u. 49–51; recheck anniversary room schedule. Aim to finish around 00:30–01:00.',status:'HANDLED'},
    {...day.items[5],detail:'Keep the return quiet; apartment quiet hours 21:00–09:00.'},
  ]};
  if(day.day===3)return {...day,shortTitle:'Baths & rooftop',title:'Széchenyi, Spago & Duchess',theme:'Brunch, thermal baths, reset, Spago and rooftop.',summary:'TATI → Széchenyi → apartment reset → Spago 20:00 → Duchess ~22:30.',arc:['Brunch','Baths','Reset','Spago','Duchess'],items:[
    {...day.items[0],time:'12:00',note:'Keep brunch light and not too long before the baths.',detail:'TATI is primary, not yet reserved. Optional reservation for certainty.',status:'LATER',bookingUrl:'https://tatibudapest.com/'},
    {...day.items[1],title:'Széchenyi Thermal Bath',location:'Állatkerti krt. 9–11',note:'Fast Track × 4 for the main social bath experience.',detail:'Arrive ~13:30–14:00, leave ~17:00. Tickets not purchased: buy Thursday evening or Friday at the latest. Do not choose Private Spa / DaySPALM. Bring swimwear and flip-flops; check current towel and ticket inclusions.',price:'16,800 HUF/person · 67,200 HUF for 4 (working price)',status:'LATER',mapUrl:bathMap,bookingUrl:bathUrl,bookingLabel:'Official tickets'},
    {...day.items[3],time:'17:15',note:'Shower, recover and get ready for Spago and the rooftop.',detail:'Protected ~17:15–19:30 reset before dinner. No apartment parties/events; quiet hours 21:00–09:00.'},
    {...day.items[2],time:'20:00',title:'Spago · dinner for 4',location:'Matild Palace · Váci u. 36',note:'Confirmed Saturday dinner reservation at 20:00.',detail:'The Duchess is in the same Matild Palace building. Rooftop reservation is requested, not confirmed.',status:'CONFIRMED',statusTone:'locked',mapUrl:spago.mapUrl,bookingUrl:spago.bookingUrl,bookingLabel:'Venue'},
    {...day.items[4],time:'22:30',title:'The Duchess · request sent',location:'Matild Palace · Váci u. 36',note:'Primary rooftop: awaiting confirmation for 4.',detail:reservations.find(r=>r.id==='duchess')!.note,status:'WAITING',mapUrl:duchess.mapUrl,bookingUrl:duchess.bookingUrl},
    {...day.items[5],detail:'Finish naturally depending on venue and energy; return quietly during 21:00–09:00 apartment quiet hours.'},
  ]};
  if(day.day===4)return {...day,items:day.items.map((e,i)=>i===1?{...e,note:'Luxury recovery · 4 × Omorovicza Healing Massage, 60 minutes.',price:'~58,000 HUF/person · ~232,000 HUF for 4',status:'RESERVE'}:i===3?{...e,title:'Sunday rooftop · to finalize',note:'Leo remains primary, but availability is uncertain.',detail:'Resolve after W AWAY. Leo is not confirmed; High Note and 360 Bar are alternatives.',status:'CHOOSE'}:e)};
  if(day.day===5)return {...day,items:day.items.map((e,i)=>i===2?{...e,note:'Final lunch primary; no urgent reservation.',status:'OPTIONAL'}:e)};
  return day;
});
const decisions:Decision[]=[
  {...v10.decisions[0],note:'Rookie × 4 is the working choice. Reserve the exact Friday time. Hungaroring remains outside the active schedule.',options:[rookie,optionalDriving]},
  {id:'saturday-night',kicker:'Saturday · rooftop',title:'Rooftop backup',status:'WAITING',statusTone:'choice',note:'Wait for Duchess. White Raven is the first backup; only book if the primary fails or availability becomes tight.',options:[{...whiteRaven,meta:reservations.find(r=>r.id==='white-raven')!.note},...v10.nightlife.filter(p=>['360 Bar','High Note SkyBar'].includes(p.name)).map(p=>({...p,meta:`Lower-priority backup. ${p.meta??''}`}))]},
  v10.decisions.find(d=>d.id==='sunday-flow')!,
];
const bath:Place={name:'Széchenyi Thermal Bath',eyebrow:'SATURDAY · FAST TRACK × 4',description:'Large, social, iconic thermal baths. Main bath experience, not Private Spa / DaySPALM.',meta:'Target 13:30–14:00 until 17:00. Buy Thursday evening or Friday at latest; not yet purchased.',price:'~16,800 HUF/person · ~67,200 HUF for 4',mapUrl:bathMap,bookingUrl:bathUrl};

export const trip={
  ...v10,version:'v11',sourceUpdated:'16 September 2026',days,decisions,reservations,
  nextActions:actionOrder.map(id=>reservations.find(r=>r.id===id)!),
  base:{...v10.base,warning:'Access instructions requested from Gabrielle on 16 Sep; awaiting building entrance/code, lockbox location/code and directions inside the building.',rules:'Quiet hours 21:00–09:00. No parties or events; no loud music during quiet hours. Smoking only on the terrace. Terrace privacy still pending.',hostUpdate:'Host contacted on 16 Sep about access, exact Monday late-checkout time and terrace privacy. Host informed: 4 adults, no pets, arriving by plane at 16:35; house rules acknowledged.'},
  confirmedBookings:reservations.filter(r=>['confirmed','handled'].includes(r.state)),
  bookingPriorities:actionOrder.filter(id=>id!=='flights').map((id,i)=>{const r=reservations.find(b=>b.id===id)!;return {...r,priority:i+1,status:r.label,statusTone:'recommended' as const};}),
  highlights:[{name:'Budapest Shooting',eyebrow:'FRIDAY · ROOKIE × 4',description:rookie.description,meta:rookie.meta,price:rookie.price,mapUrl:rookie.mapUrl,bookingUrl:rookie.bookingUrl},...v10.highlights.filter(p=>!['Royal Spa','Budapest Shooting'].includes(p.name)),bath],
  food:v10.food.filter(p=>!['BiBo','Cut & Barrel','Borkonyha Winekitchen','Textúra','Stand'].includes(p.name)).map(p=>p.name==='VIBE'?{...p,eyebrow:'FRIDAY · CONFIRMED 20:30',description:'Dinner & Entertainment reservation for 4.',meta:reservations.find(r=>r.id==='vibe')!.note,price:undefined,bookingUrl:'https://vibebudapest.com/'}:p.name==='Spago'?{...p,eyebrow:'SATURDAY · CONFIRMED 20:00',description:'Confirmed dinner for 4 at Matild Palace.',meta:reservations.find(r=>r.id==='spago')!.note}:p.name==='TATI'?{...p,meta:'Target ~12:00; not yet reserved. Optional reservation.'}:p),
  nightlife:v10.nightlife.map(p=>p.name==='The Duchess'?{...p,eyebrow:'SATURDAY · REQUEST SENT',meta:reservations.find(r=>r.id==='duchess')!.note}:p.name==='White Raven Skybar'?{...p,eyebrow:'SATURDAY · FIRST BACKUP',meta:reservations.find(r=>r.id==='white-raven')!.note}:p.name==='Instant-Fogas'?{...p,eyebrow:'FRIDAY · OPTIONAL AFTER VIBE',meta:reservations.find(r=>r.id==='instant')!.note}:p.name==='Leo Rooftop'?{...p,eyebrow:'SUNDAY · TO RESOLVE',meta:reservations.find(r=>r.id==='sunday-rooftop')!.note}:p),
  budget:[{category:'Budapest Shooting · Rookie × 4',estimate:'26,970 HUF/person · 107,880 HUF total',note:'52 shots / 7 weapons per person. Working price; exact slot not booked.'},{category:'Széchenyi · Fast Track × 4',estimate:'16,800 HUF/person · 67,200 HUF total',note:'Working researched price. Buy Thu evening / Fri at latest; main bath, not Private Spa / DaySPALM.'},...v10.budget.filter(b=>['Hungaroring · optional','W AWAY · Omorovicza','Optional apartment parking'].includes(b.category))],
  essentials:[
    {title:'Apartment · waiting for Gabrielle',eyebrow:'WAITING',items:['Building entrance instructions/code','Lockbox location/code','Directions to the apartment inside the building','Exact Monday late-checkout time','Private or shared terrace/balcony']},
    {...v10.essentials[1],items:['Travel documents and valid ID for shooting','Swimwear and flip-flops for Széchenyi; check towel inclusions','Smart-casual clothes for VIBE, Spago and rooftops','Power bank, earplugs and comfortable shoes','Physical driving licence only if adding optional Hungaroring']},
    v10.essentials[2],
    {...v10.essentials[3],items:['4 adults, one groom; no food restrictions','Music: hip-hop, R&B, mainstream and reggaeton/Latin; techno is lower priority','Apartment quiet hours 21:00–09:00; no parties/events or loud music during quiet hours','Friday: enjoy VIBE after dinner; Instant-Fogas is optional','Saturday: baths → quiet reset → Spago → Duchess if confirmed','Sunday: luxury recovery and massage; rooftop choice still open']},
  ],
  verifyBeforeTrip:['Wait for Gabrielle: access, exact late-checkout time and terrace privacy','Book shooting: Rookie × 4, Friday ~14:00–15:00','Book Mazel Tov for Thursday ~19:30','Wait for Duchess; use White Raven if unavailable','Buy Széchenyi Fast Track × 4 Thursday evening / Friday latest','Book 4 W AWAY Omorovicza treatments and confirm included admission','Resolve Sunday rooftop after W AWAY','Optionally reserve TATI; recheck La Siesta program','Reconfirm BZ442 / BZ441 and BUD T2A before departure'],
  safety:['Absolutely no alcohol before shooting; valid ID and instructor safety briefing required.','Apartment quiet hours 21:00–09:00. No parties/events or loud music during quiet hours.','Keep phones and wallets secure in nightlife crowds.','Smoking only on the terrace.'],
  researchHistory:'FLAVA is not an active dinner candidate; its original concept reportedly changed format. Earlier dinner research is archived: VIBE and Spago are now confirmed. Removed activities are no longer in the active plan.',
};
