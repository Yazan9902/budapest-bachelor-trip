'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, ChevronDown, ChevronRight, Circle, Compass, Copy, House, Info, MapPin, Navigation, Phone, Plane, Share2, Ticket, TramFront, Wallet, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { trip, type DecisionOption, type Reservation } from './trip-data-v11';
import { dayNames, dayContexts, events, eventResearch, essentialStatus, essentialState, liveTrip, previewTimes, savedPlaces, type Event, type SavedPlace } from './dashboard-model';
import './dashboard.css';

type Route = { page: 'today'|'schedule'|'map'|'info'|'event'; detail?: string };
const tabs = [{id:'today',label:'Today',Icon:Compass},{id:'schedule',label:'Schedule',Icon:CalendarDays},{id:'map',label:'Map',Icon:MapPin},{id:'info',label:'Info',Icon:Info}] as const;

function routeFromHash(): Route {
  const [page, detail] = window.location.hash.slice(1).split('/');
  if (page?.startsWith('day-')) return {page:'schedule',detail:page.slice(4)};
  if (page === 'timeline') return {page:'schedule'};
  if (page === 'highlights') return {page:'map'};
  if (page === 'decisions') return {page:'info',detail:'bookings'};
  if (page === 'essentials') return {page:'info',detail:({travel:'flights',stay:'apartment',tickets:'bookings',more:'useful'} as Record<string,string>)[detail]};
  return ['today','schedule','map','info','event'].includes(page) ? {page:page as Route['page'],detail} : {page:'today'};
}

function Action({href,children,primary=false,onClick}:{href?:string;children:ReactNode;primary?:boolean;onClick?:()=>void}) {
  return href ? <a className={`dash-action ${primary?'primary':''}`} href={href} target="_blank" rel="noreferrer">{children}</a>
    : <button className={`dash-action ${primary?'primary':''}`} onClick={onClick}>{children}</button>;
}
function Disclosure({title,children}:{title:string;children:ReactNode}) {
  return <details className="dash-disclosure"><summary>{title}<ChevronDown aria-hidden="true"/></summary><div>{children}</div></details>;
}
function Option({option}:{option:DecisionOption}) {
  return <Disclosure title={option.name}><p>{option.description}</p>{option.price&&<p className="dash-price">{option.price}</p>}{option.meta&&<p>{option.meta}</p>}{option.note&&<p>{option.note}</p>}<div className="dash-actions">{option.bookingUrl&&<Action href={option.bookingUrl}>Website <ArrowUpRight/></Action>}{option.mapUrl&&<Action href={option.mapUrl}>Directions <Navigation/></Action>}{option.links?.map(link=><Action key={link.url} href={link.url}>{link.label} <ArrowUpRight/></Action>)}</div></Disclosure>;
}

export default function TripDashboard() {
  const [route,setRoute] = useState<Route>({page:'today'});
  const [now,setNow] = useState<Date|null>(null);
  const [preview,setPreview] = useState('');
  const [notice,setNotice] = useState('');
  const noticeTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const [filter,setFilter] = useState('All');
  const [place,setPlace] = useState<SavedPlace|null>(null);
  const [addressSheet,setAddressSheet] = useState<'home'|'airport'|null>(null);
  const touch = useRef<{x:number;y:number}|null>(null);
  useEffect(()=>{
    const syncRoute=()=>setRoute(routeFromHash());
    const syncClock=()=>{
      const mode = ['localhost','127.0.0.1'].includes(location.hostname) ? new URLSearchParams(location.search).get('preview') ?? '' : '';
      setPreview(previewTimes[mode] ? mode : ''); setNow(new Date(previewTimes[mode] ?? Date.now()));
    };
    syncRoute(); syncClock();
    window.addEventListener('popstate',syncRoute); window.addEventListener('hashchange',syncRoute);
    window.addEventListener('focus',syncClock); document.addEventListener('visibilitychange',syncClock);
    const timer=setInterval(syncClock,30_000);
    return()=>{clearInterval(timer); if(noticeTimer.current)clearTimeout(noticeTimer.current);window.removeEventListener('popstate',syncRoute);window.removeEventListener('hashchange',syncRoute);window.removeEventListener('focus',syncClock);document.removeEventListener('visibilitychange',syncClock);};
  },[]);
  const live=liveTrip(now ?? new Date('2026-09-14T10:00:00+02:00'));
  const selectedDay=trip.days.find(d=>String(d.day)===route.detail || d.date===route.detail) ?? live.day;
  const selectedEvent=events.find(e=>e.id===route.detail);
  function go(page:Route['page'],detail?:string) {
    const hash=`#${page}${detail?'/'+detail:''}`;
    if(location.hash!==hash)history.pushState({},'',hash);
    setRoute({page,detail}); setPlace(null); setAddressSheet(null); window.scrollTo({top:0,behavior:'instant'});
    requestAnimationFrame(()=>document.getElementById('dash-title')?.focus({preventScroll:true}));
  }
  function notify(text:string) {setNotice(text);if(noticeTimer.current)clearTimeout(noticeTimer.current);noticeTimer.current=setTimeout(()=>setNotice(''),3500);}
  async function copy(text:string) {try{await navigator.clipboard.writeText(text);notify('Address copied');}catch{notify('Press and hold the address to copy it.');}}
  async function share() {const url=location.origin+location.pathname+location.hash;try{if(navigator.share)await navigator.share({title:trip.name,url});else{await navigator.clipboard.writeText(url);notify('Link copied');}}catch(error){if(!(error instanceof DOMException&&error.name==='AbortError'))notify('Use your browser’s share option.');}}
  const isBefore=live.phase==='before';
  const isAfter=live.phase==='after';
  const focus=live.focus;
  const bookingCounts={confirmed:trip.reservations.filter(r=>r.state==='confirmed').length,waiting:trip.reservations.filter(r=>r.state==='waiting').length,action:trip.reservations.filter(r=>r.state==='action').length};
  const activeDayNumber=Number(live.day.day);
  const filteredPlaces=useMemo(()=>savedPlaces.filter(p=>filter==='All'||filter==='Today'&&p.eventIds.some(id=>events.find(e=>e.id===id)?.day.day===activeDayNumber)||p.category===filter),[filter,activeDayNumber]);

  function openReservation(r:Reservation) {r.eventId?go('event',r.eventId):go('info',r.info??'bookings');}
  function BookingSummary() {return <button className="dash-booking-summary" onClick={()=>go('info','bookings')}><span><Ticket/><strong>Booking status</strong><ChevronRight/></span><span className="dash-booking-counts"><small><b>{bookingCounts.confirmed}</b> confirmed</small><small><b>{bookingCounts.waiting}</b> waiting</small><small><b>{bookingCounts.action}</b> to book / resolve</small></span></button>;}
  function ReservationList(records:Reservation[]) {return <div className="dash-card dash-reservations">{records.map(r=><details key={r.id}><summary><span><strong>{r.title}</strong><small>{r.when}</small><span className="dash-status" data-state={r.state}>{r.label}</span></span><ChevronDown/></summary><div><p>{r.note}</p><div className="dash-actions">{r.bookingUrl&&<Action primary href={r.bookingUrl}>{r.state==='action'?'Booking website':r.id==='bath'?'Official tickets':'Venue website'} <ArrowUpRight/></Action>}<Action onClick={()=>openReservation(r)}>Details <ChevronRight/></Action></div></div></details>)}</div>;}

  function EventDetail({event}:{event:Event}) {
    const status=essentialStatus(event);
    return <>
      <button className="dash-back" onClick={()=>go('schedule',String(event.day.day))}><ArrowLeft/> {event.day.dayLabel}</button>
      <div className="dash-page-heading"><p className="dash-eyebrow">{dayNames[event.day.day-1]}</p><h1 id="dash-title" tabIndex={-1}>{event.item.title}</h1><p>{event.day.dayLabel} · {event.item.time} · Budapest time</p>{status&&<span className="dash-status" data-state={essentialState(event)}>{status}</span>}</div>
      <div className="dash-actions">{event.item.mapUrl&&<Action primary href={event.item.mapUrl}>Directions <Navigation/></Action>}{event.item.bookingUrl&&<Action href={event.item.bookingUrl}>{event.item.bookingLabel??'Website'} <ArrowUpRight/></Action>}</div>
      <article className="dash-card dash-reading"><h2>Plan</h2><p>{event.item.note??event.item.location}</p>{event.item.price&&<><h2>Price</h2><p className="dash-price">{event.item.price}</p></>}{event.item.detail&&<><h2>Good to know</h2><p>{event.item.detail}</p></>}<h2>Location</h2><p>{event.item.location}</p></article>
      {event.decision&&<article className="dash-card dash-reading"><Disclosure title={`Options & alternatives (${event.decision.options.length})`}><p>{event.decision.note}</p>{event.decision.options.map(option=><Option key={option.name} option={option}/>)}</Disclosure></article>}
      {eventResearch(event).length>0&&<article className="dash-card dash-reading"><Disclosure title="Venue notes & research">{eventResearch(event).map((p,i)=><div className="dash-research" key={p.name+i}><h3>{p.name}</h3><p>{p.description}</p>{p.meta&&<p>{p.meta}</p>}{p.price&&<p className="dash-price">{p.price}</p>}{p.bookingUrl&&<Action href={p.bookingUrl}>Venue website <ArrowUpRight/></Action>}</div>)}</Disclosure></article>}
    </>;
  }

  function InfoContent() {
    const detail=route.detail;
    if(!detail) return <><div className="dash-page-heading"><p className="dash-eyebrow">The practical details</p><h1 id="dash-title" tabIndex={-1}>Trip info</h1></div><div className="dash-info-grid">{[
      {id:'flights',label:'Flights',sub:'Thu 16:35 arrival · Mon 18:45 departure',Icon:Plane},
      {id:'apartment',label:'Apartment',sub:trip.base.name,Icon:House},
      {id:'bookings',label:'Bookings & tickets',sub:'Reservations, choices & ticket links',Icon:Ticket},
      {id:'transport',label:'Getting around',sub:'Airport transfers & local transport',Icon:TramFront},
      {id:'useful',label:'Money & useful info',sub:'Budget, packing & trip notes',Icon:Wallet},
      {id:'emergency',label:'Emergency',sub:'Help & safety information',Icon:Phone},
    ].map(item=><button key={item.id} className="dash-info-row" onClick={()=>go('info',item.id)}><span className="dash-icon"><item.Icon/></span><span><strong>{item.label}</strong><small>{item.sub}</small></span><ChevronRight/></button>)}</div></>;
    return <><button className="dash-back" onClick={()=>go('info')}><ArrowLeft/> Trip info</button><div className="dash-page-heading"><h1 id="dash-title" tabIndex={-1}>{({flights:'Flights',apartment:'Apartment',bookings:'Bookings & tickets',transport:'Getting around',useful:'Money & useful info',emergency:'Emergency'} as Record<string,string>)[detail]??'Trip info'}</h1></div>
      {detail==='apartment'&&<><article className="dash-card dash-reading"><p className="dash-eyebrow">Booked · {trip.groupSize} guests</p><h2 className="dash-address-name">{trip.base.name}</h2><address>{trip.base.address}</address><div className="dash-actions"><Action primary href={trip.base.mapUrl}>Directions <Navigation/></Action><Action onClick={()=>copy(trip.base.address)}>Copy address <Copy/></Action></div><div className="dash-facts"><div><span>Check-in</span><strong>{trip.base.checkIn}</strong></div><div><span>Check-out</span><strong>{trip.base.checkOut}</strong></div></div><h2>Access · host {trip.base.host}</h2><p>{trip.base.warning}</p><p className="dash-callout">Quiet hours 21:00–09:00 · no parties or events.</p><Action href={trip.base.listingUrl}>Airbnb listing <ArrowUpRight/></Action></article><article className="dash-card dash-reading"><Disclosure title="Apartment details & rules"><p>{trip.base.listingName}</p><p>{trip.base.detail}</p><p>{trip.base.area}</p><p>{trip.base.rules}</p><p>{trip.base.parking}</p></Disclosure><Disclosure title="Waiting for the host"><p>{trip.base.hostUpdate}</p><ul>{trip.essentials[0].items.map(x=><li key={x}>{x}</li>)}</ul></Disclosure></article></>}
      {detail==='flights'&&<div className="dash-info-grid">{[trip.arrival,trip.departure].map((flight,index)=><article className="dash-card dash-reading" key={index}><p className="dash-eyebrow">{index?'Return':'Outbound'} · {flight.dateLabel}</p><div className="dash-flight-route"><strong>{index?'BUD':'TLV'}</strong><Plane/><strong>{index?'TLV':'BUD'}</strong></div><div className="dash-facts"><div><span>Departs · {index?'Budapest':'Tel Aviv'}</span><strong>{flight.departureTime}</strong></div><div><span>Arrives · {index?'Tel Aviv':'Budapest'}</span><strong>{flight.arrivalTime}</strong></div></div><p>{flight.flight}</p><small className="dash-muted">Times local to each airport · {flight.duration}</small>{index===1&&<p className="dash-callout">{trip.departure.leaveCity}</p>}<Disclosure title="Flight & transfer details"><p>{flight.terminal}</p>{index===0&&<p>{trip.arrival.transfer}</p>}<address>{flight.airportAddress}</address></Disclosure><div className="dash-actions"><Action primary href={flight.mapUrl}>Airport directions <Navigation/></Action><Action onClick={()=>copy(`${flight.airport}, ${flight.airportAddress}`)}>Copy address <Copy/></Action></div></article>)}</div>}
      {detail==='bookings'&&<><p className="dash-muted">Updated {trip.sourceUpdated}</p><div className="dash-status-legend">{([['confirmed','Confirmed'],['waiting','Waiting'],['action','Action needed'],['later','Buy / check later'],['backup','Backup']] as const).map(([state,label])=><span key={state} className="dash-status" data-state={state}>{label}</span>)}</div><div className="dash-section-label"><h2>Next actions</h2><span>In priority order</span></div>{ReservationList(trip.nextActions.filter(r=>r.id!=='flights'))}<div className="dash-section-label"><h2>Confirmed & handled</h2></div>{ReservationList(trip.confirmedBookings)}<div className="dash-section-label"><h2>Other checks & backups</h2></div>{ReservationList(trip.reservations.filter(r=>!trip.nextActions.some(a=>a.id===r.id)&&!trip.confirmedBookings.some(a=>a.id===r.id)))}</>}
      {detail==='transport'&&<><article className="dash-card dash-reading"><h2>Airport transfer</h2><p>{trip.arrival.transfer}</p><p className="dash-callout">Monday · {trip.departure.leaveCity}</p><div className="dash-actions"><Action primary href={trip.departure.mapUrl}>Airport directions <Navigation/></Action></div></article><article className="dash-card dash-reading"><h2>In the city</h2><ul>{trip.essentials[2].items.map(x=><li key={x}>{x}</li>)}</ul></article></>}
      {detail==='useful'&&<><article className="dash-card dash-reading"><Disclosure title="Budget estimates"><p>Working research estimates from master plan {trip.version} · {trip.sourceUpdated}. Reconfirm prices, hours and availability before booking.</p>{trip.budget.map(b=><div className="dash-research" key={b.category}><h3>{b.category}</h3><p className="dash-price">{b.estimate}</p><p>{b.note}</p></div>)}</Disclosure>{[trip.essentials[1],trip.essentials[3]].map(g=><Disclosure key={g.title} title={g.title}><ul>{g.items.map(x=><li key={x}>{x}</li>)}</ul></Disclosure>)}<Disclosure title="Before-trip checks"><ul>{trip.verifyBeforeTrip.map(x=><li key={x}>{x}</li>)}</ul></Disclosure><Disclosure title="Archived research"><p>{trip.researchHistory}</p><Action href="https://flava.hu/">FLAVA website <ArrowUpRight/></Action></Disclosure></article></>}
      {detail==='emergency'&&<article className="dash-card dash-reading"><h2>Emergency help</h2><p>For urgent police, ambulance or fire assistance.</p><a className="dash-action primary" href="tel:112"><Phone/> Call 112</a><Disclosure title="Safety notes"><ul>{trip.safety.map(x=><li key={x}>{x}</li>)}</ul></Disclosure><h2>Apartment address</h2><address>{trip.base.address}</address><Action onClick={()=>copy(trip.base.address)}>Copy address <Copy/></Action></article>}
    </>;
  }

  return <div className="dashboard">
    <header className={`dash-header${route.page==='today'?' dash-header-today':''}`}><button onClick={()=>go('today')} aria-label="Budapest trip today"><strong>Budapest<span className="dash-dot">.</span></strong><small>17–21 SEP · BACHELOR TRIP</small></button><button className="dash-share" onClick={share} aria-label="Share trip"><Share2/></button></header>
    <nav className="dash-nav" aria-label="Trip sections">{tabs.map(({id,label,Icon})=><button key={id} aria-current={(route.page===id||route.page==='event'&&id==='schedule')?'page':undefined} onClick={()=>go(id)}><Icon/><span>{label}</span></button>)}</nav>
    {preview&&<div className="dash-preview">Preview · {new Intl.DateTimeFormat('en-GB',{weekday:'long',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Budapest'}).format(now!)}<a href={location.pathname+'#today'}>Use live time <X/></a></div>}
    <main className={`dash-main dash-page-${route.page}`}>
    {route.page==='today'&&<>
      <section className="dash-today-hero" aria-labelledby="dash-title">
        <div className="dash-hero-art" style={{backgroundImage:"url('./budapest-hero-v2.webp')"}} aria-hidden="true"/>
        <div className="dash-hero-copy"><p>Bachelor trip</p><h1 id="dash-title" tabIndex={-1}>Budapest</h1><span>17–21 September 2026</span><small>{!now?'17–21 Sep':isBefore?`${live.daysUntil} ${live.daysUntil===1?'day':'days'} to go`:isAfter?'Trip schedule':`Day ${live.day.day} of 5`}</small></div>
        <button className="dash-hero-share" onClick={share} aria-label="Share trip"><Share2 aria-hidden="true"/></button>
      </section>
      <div className="dash-address-shortcuts" aria-label="Quick addresses">
        <button onClick={()=>setAddressSheet('home')} aria-label="Home address"><House aria-hidden="true"/><span>Home</span></button>
        <button onClick={()=>setAddressSheet('airport')} aria-label="Airport address"><Plane aria-hidden="true"/><span>Airport</span></button>
      </div>
      {!isBefore&&!isAfter&&<div className="dash-page-heading dash-today-heading"><p className="dash-eyebrow">{live.day.dayLabel} · Budapest time</p><h2>{dayNames[live.day.day-1]}</h2></div>}
      <div className="dash-today-grid"><section>
      {isBefore?<article className="dash-next dash-countdown"><div className="dash-next-top"><span>THURSDAY 17</span><Plane/></div><h2>Land in Budapest</h2><div className="dash-next-time">16:35<span>Budapest time</span></div><p>Ferenc Liszt Airport</p><div className="dash-actions"><Action primary onClick={()=>go('info','flights')}>Flight details <ChevronRight/></Action><Action onClick={()=>go('schedule','1')}>Thursday plan</Action></div></article>
      :isAfter?<article className="dash-card dash-reading"><Check/><h2>The trip schedule is saved.</h2><p>All activities, addresses and trip details are still here.</p><Action primary onClick={()=>go('schedule','1')}>View trip schedule <ChevronRight/></Action></article>
      :focus?<article className="dash-next"><div className="dash-next-top"><span>{live.current?'SCHEDULED NOW':live.tomorrow?'TOMORROW':'UP NEXT'}</span><span>{focus.day.dayLabel}</span></div><h2>{focus.item.title}</h2><div className="dash-next-time">{focus.item.time}<span>{focus.item.status==='TIME TBD'?'Provisional · Budapest':'Budapest time'}</span></div><p><MapPin/>{focus.item.location}</p>{essentialStatus(focus)&&<span className="dash-status" data-state={essentialState(focus)}>{essentialStatus(focus)}</span>}{focus.id==='5-5'&&<p>Leave the city at 15:30–15:45</p>}<div className="dash-actions">{focus.item.mapUrl&&<Action primary href={focus.item.mapUrl}>Directions <Navigation/></Action>}<Action onClick={()=>go('event',focus.id)}>Details <ChevronRight/></Action></div></article>:<article className="dash-card dash-reading"><h2>No more scheduled stops.</h2><Action onClick={()=>go('schedule')}>View schedule</Action></article>}
      {!isBefore&&!isAfter&&<><div className="dash-section-label"><h2>{live.tomorrow?'Tomorrow’s plan':'Later'}</h2><span>{focus?.day.dayLabel}</span></div><div className="dash-card dash-later">{live.later.length?live.later.map(e=><button key={e.id} onClick={()=>go('event',e.id)}><time>{e.item.time}</time><span>{e.item.title}</span><ChevronRight/></button>):<p>No later stops scheduled.</p>}</div><button className="dash-text-link" onClick={()=>go('schedule',String(focus?.day.day??live.day.day))}>View full {focus?.day.dayLabel.split(' ')[0]??'day'} schedule <ChevronRight/></button></>}
      </section><aside>
      {BookingSummary()}
      {isBefore?<><div className="dash-section-label"><h2>Next actions</h2></div><div className="dash-card dash-checklist">{trip.nextActions.slice(0,4).map(r=><button key={r.id} onClick={()=>openReservation(r)}><Circle className="dash-unresolved"/><span><strong>{r.title}</strong><span className="dash-status" data-state={r.state}>{r.label}</span></span><ChevronRight/></button>)}</div><button className="dash-text-link" onClick={()=>go('info','bookings')}>All bookings & next actions <ChevronRight/></button><Action primary onClick={()=>go('schedule','1')}>View trip schedule <CalendarDays/></Action></>:<><div className="dash-section-label"><h2>Trip essentials</h2></div><div className="dash-card dash-later"><button onClick={()=>go('info','flights')}><Plane/><span>Flights & airport</span><ChevronRight/></button><button onClick={()=>go('map')}><MapPin/><span>Saved places</span><ChevronRight/></button></div></>}
      </aside></div>
    </>}
    {route.page==='schedule'&&<>
      <div className="dash-page-heading"><p className="dash-eyebrow">17–21 September · {trip.groupSize} friends</p><h1 id="dash-title" tabIndex={-1}>Schedule</h1><p>Target times unless confirmed · Budapest time</p></div>
      <div className="dash-days" aria-label="Choose a day">{trip.days.map(d=><button key={d.day} aria-pressed={d.day===selectedDay.day} onClick={()=>go('schedule',String(d.day))}><span>{d.dayLabel.slice(0,3)}</span><strong>{d.date.slice(-2)}</strong>{d.date===live.clock.dateKey&&<small>Today</small>}</button>)}</div>
      <section className="dash-day-content" onTouchStart={e=>touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}} onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;touch.current=null;if(Math.abs(dx)>75&&Math.abs(dx)>Math.abs(dy)*1.8){const day=selectedDay.day+(dx<0?1:-1);if(day>=1&&day<=5)go('schedule',String(day));}}}>
        <div className="dash-day-heading"><p className="dash-eyebrow">DAY {selectedDay.day} OF 5</p><h2>{dayNames[selectedDay.day-1]}</h2><p>{dayContexts[selectedDay.day-1]}</p></div>
        <div className="dash-timeline">{events.filter(e=>e.day.day===selectedDay.day).map(e=><details key={e.id} className={live.focus?.id===e.id?'dash-event focused':'dash-event'}><summary><time>{e.item.time}</time><span className="dash-timeline-node"/><span className="dash-event-copy">{live.current?.id===e.id&&<small className="dash-current-label">Scheduled now</small>}<strong>{e.item.title}</strong><small>{e.item.location}</small>{essentialStatus(e)&&<span className="dash-status" data-state={essentialState(e)}>{essentialStatus(e)}</span>}</span><ChevronDown/></summary><div className="dash-event-expanded"><p>{e.item.note}</p><div className="dash-actions">{e.item.mapUrl&&<Action primary href={e.item.mapUrl}>Directions <Navigation/></Action>}<Action onClick={()=>go('event',e.id)}>Details <ChevronRight/></Action></div></div></details>)}</div>
      </section>
    </>}
    {route.page==='event'&&(selectedEvent?EventDetail({event:selectedEvent}):<><h1 id="dash-title">Activity not found</h1><Action onClick={()=>go('schedule')}>View schedule</Action></>)}
    {route.page==='map'&&<><div className="dash-page-heading"><p className="dash-eyebrow">Your saved places</p><h1 id="dash-title" tabIndex={-1}>Budapest map</h1></div><div className="dash-filters" aria-label="Filter places">{['All','Today','Food','Night','Activities','Spa'].map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</button>)}</div><div className="dash-map-layout"><div className="dash-map-frame"><TripMap places={filteredPlaces} onSelect={setPlace}/><div className="dash-map-footer"><span>Public trip venues</span><button onClick={()=>go('info','apartment')}><House/> Home address</button></div></div><div className="dash-map-list"><div className="dash-section-label"><h2>{filter==='Today'?live.day.dayLabel:'Saved places'}</h2><span>{filteredPlaces.length} places</span></div>{filteredPlaces.map(p=><button className="dash-place-row" key={p.id} onClick={()=>setPlace(p)}><span className="dash-icon"><MapPin/></span><span><strong>{p.name}</strong><small>{p.eyebrow}</small></span><ChevronRight/></button>)}</div></div></>}
    {route.page==='info'&&InfoContent()}
    </main>
    <Sheet open={!!addressSheet} onOpenChange={open=>!open&&setAddressSheet(null)}>
      <SheetContent side="bottom" className="dash-place-sheet dash-address-sheet">
        <SheetTitle>{addressSheet==='airport'?'Budapest Airport':trip.base.name}</SheetTitle>
        <SheetDescription>{addressSheet==='airport'?'Ferenc Liszt International Airport':'Apartment address'}</SheetDescription>
        <address>{addressSheet==='airport'?trip.arrival.airportAddress:trip.base.address}</address>
        <div className="dash-actions">
          <Action primary onClick={()=>copy(addressSheet==='airport'?`${trip.arrival.airport}, ${trip.arrival.airportAddress}`:trip.base.address)}>Copy address <Copy aria-hidden="true"/></Action>
          <Action href={addressSheet==='airport'?trip.arrival.mapUrl:trip.base.mapUrl}>Directions <Navigation aria-hidden="true"/></Action>
        </div>
        {notice&&<output className="dash-copy-feedback">{notice}</output>}
        <button className="dash-text-link" onClick={()=>go('info',addressSheet==='airport'?'flights':'apartment')}>{addressSheet==='airport'?'Flights & transfer details':'Apartment & access details'} <ChevronRight aria-hidden="true"/></button>
      </SheetContent>
    </Sheet>
    <Sheet open={!!place} onOpenChange={open=>!open&&setPlace(null)}><SheetContent side="bottom" className="dash-place-sheet"><SheetTitle>{place?.name}</SheetTitle><SheetDescription>{place?.eyebrow}</SheetDescription>{place&&<><p>{place.description}</p>{place.price&&<p className="dash-price">{place.price}</p>}<div className="dash-actions">{place.mapUrl&&<Action primary href={place.mapUrl}>Directions <Navigation/></Action>}{place.bookingUrl&&<Action href={place.bookingUrl}>Website <ArrowUpRight/></Action>}</div>{place.meta&&<Disclosure title="Venue details"><p>{place.meta}</p></Disclosure>}{place.eventIds.map(id=><button key={id} className="dash-text-link" onClick={()=>go('event',id)}>View in {events.find(e=>e.id===id)?.day.dayLabel.split(' ')[0]} schedule <ChevronRight/></button>)}</>}</SheetContent></Sheet>
    {notice&&!addressSheet&&<output className={`dash-toast${place?' dash-toast-over-sheet':''}`}>{notice}</output>}
  </div>;
}

function TripMap({places,onSelect}:{places:SavedPlace[];onSelect:(place:SavedPlace)=>void}) {
  const ref=useRef<HTMLDivElement>(null);
  const [unavailable,setUnavailable]=useState(false);
  useEffect(()=>{
    let disposed=false; let map:import('leaflet').Map|undefined;
    import('leaflet').then(L=>{
      if(disposed||!ref.current)return;
      map=L.map(ref.current,{scrollWheelZoom:false}).setView([47.505,19.06],13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map).on('tileerror',()=>setUnavailable(true));
      const points=places.filter(p=>p.coords);
      for(const p of points){const icon=L.divIcon({className:'dash-map-marker',html:'<span></span>',iconSize:[44,44],iconAnchor:[22,22]});L.marker(p.coords!,{icon,title:p.name,alt:p.name}).addTo(map).on('click',()=>onSelect(p));}
      if(points.length)map.fitBounds(L.latLngBounds(points.map(p=>p.coords!)),{padding:[30,30],maxZoom:14});
    }).catch(()=>setUnavailable(true));
    return()=>{disposed=true;map?.remove();};
  },[places,onSelect]);
  return <><div className="dash-map-canvas" ref={ref} aria-label="Map of saved Budapest venues"/>{unavailable&&<p className="dash-map-notice">Map tiles unavailable. The place list and Directions links still work.</p>}</>;
}
