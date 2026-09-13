'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  House,
  Copy,
  ChevronDown,
  ChevronRight,
  Clock3,
  ExternalLink,
  Gauge,
  Luggage,
  Map as MapIcon,
  MapPin,
  Navigation,
  Plane,
  Share2,
  ShieldCheck,
  Sparkles,
  TicketCheck,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { trip, type Place, type StatusTone, type TimelineItem, type TripDay } from './trip-data';
import { buildSchedule, getBudapestClock, getDefaultDay, getStopDateLabel, getUpcomingStops } from './trip-clock';

const DAY_MS = 86_400_000;

function localDateKey(date: Date) {
  return getBudapestClock(date).dateKey;
}

function getTripState(now = new Date()) {
  const today = localDateKey(now);
  const activeDay = trip.days.find((day) => day.date === today);

  if (activeDay) {
    return {
      phase: 'during' as const,
      activeDay,
      eyebrow: `Day ${activeDay.day} · ${activeDay.dayLabel}`,
      value: activeDay.shortTitle,
      detail: `${activeDay.items.length} scheduled items`,
    };
  }

  if (today < trip.startDate) {
    const start = new Date(`${trip.startDate}T00:00:00`);
    const current = new Date(`${today}T00:00:00`);
    const days = Math.max(1, Math.ceil((start.getTime() - current.getTime()) / DAY_MS));
    return {
      phase: 'before' as const,
      activeDay: undefined,
      eyebrow: 'Before trip',
      value: `${days} ${days === 1 ? 'day' : 'days'}`,
      detail: `Land at ${trip.arrival.time} · ${trip.arrival.dateLabel}`,
    };
  }

  return {
    phase: 'after' as const,
    activeDay: undefined,
    eyebrow: 'Trip ended',
    value: trip.dateLabel,
    detail: 'Schedule and trip details',
  };
}

type TripState = ReturnType<typeof getTripState>;

const initialTripState: TripState = {
  phase: 'before',
  activeDay: undefined,
  eyebrow: 'Trip status',
  value: trip.dateLabel,
  detail: `${trip.arrival.dateLabel} → ${trip.departure.dateLabel}`,
};

function BottomNavIcon({ id }: { id: string }) {
  if (id === 'timeline') return <CalendarDays aria-hidden="true" />;
  if (id === 'decisions') return <TicketCheck aria-hidden="true" />;
  if (id === 'highlights') return <MapIcon aria-hidden="true" />;
  if (id === 'essentials') return <Luggage aria-hidden="true" />;
  return <House aria-hidden="true" />;
}

type AppView = 'home' | 'timeline' | 'decisions' | 'highlights' | 'essentials';
type PlanView = 'decisions' | 'bookings';
type GuideView = 'highlights' | 'food' | 'nightlife' | 'map';
type InfoView = 'travel' | 'stay' | 'tickets' | 'more';

function SegmentedNav<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="segmented-nav">
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          className={value === option.id ? 'active' : ''}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}

async function copyText(text: string) {
  if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
  await navigator.clipboard.writeText(text);
}

function StatusBadge({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  const labels: Record<string, string> = {
    LOCKED: 'Planned', 'MUST BOOK': 'To book', BOOK: 'To book', RESERVE: 'To book',
    RECOMMENDED: 'Suggested', 'CHOOSE ONE': 'Choose', 'MUST DECIDE': 'Choose',
    FLEX: 'Flexible', PROTECTED: 'Reserved time', TARGET: 'Approx.', BUFFER: 'Extra time',
  };
  const label = typeof children === 'string'
    ? labels[children] ?? children.toLowerCase().replace(/^./, (letter) => letter.toUpperCase())
    : children;
  return <Badge className={`status-badge status-${tone}`}>{label}</Badge>;
}

function SectionHeading({
  headingId,
  kicker,
  title,
  note,
  side,
}: {
  headingId: string;
  kicker: string;
  title: string;
  note?: string;
  side?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="section-index">{kicker}</p>
        <h1 id={headingId} tabIndex={-1}>{title}</h1>
        {note ? <p className="section-note">{note}</p> : null}
      </div>
      {side}
    </div>
  );
}

function LinkActions({
  mapUrl,
  bookingUrl,
  bookingLabel = 'Open',
  compact = false,
}: {
  mapUrl?: string;
  bookingUrl?: string;
  bookingLabel?: string;
  compact?: boolean;
}) {
  if (!mapUrl && !bookingUrl) return null;

  return (
    <div className={`link-actions${compact ? ' link-actions-compact' : ''}`}>
      {mapUrl ? (
        <a href={mapUrl} target="_blank" rel="noreferrer" aria-label="Open location in Google Maps">
          <Navigation aria-hidden="true" />
          {!compact ? <span>Map</span> : null}
        </a>
      ) : null}
      {bookingUrl ? (
        <a href={bookingUrl} target="_blank" rel="noreferrer" aria-label={`Open ${bookingLabel}`}>
          <ExternalLink aria-hidden="true" />
          {!compact ? <span>{bookingLabel}</span> : null}
        </a>
      ) : null}
    </div>
  );
}

function PlaceCard({ place }: { place: Place }) {
  return (
    <details className="place-card">
      <summary className="place-card-summary">
        <span className="place-card-copy">
          <small>{place.eyebrow}</small>
          <strong>{place.name}</strong>
        </span>
        {place.status && place.statusTone ? (
          <StatusBadge tone={place.statusTone}>{place.status}</StatusBadge>
        ) : null}
        <span className="place-card-chevron"><ChevronDown aria-hidden="true" /></span>
      </summary>
      <div className="place-card-details">
        <p>{place.description}</p>
        {place.meta ? <span className="place-meta">{place.meta}</span> : null}
        {place.price ? <strong className="place-price">{place.price}</strong> : null}
        <LinkActions mapUrl={place.mapUrl} bookingUrl={place.bookingUrl} bookingLabel="Details" />
      </div>
    </details>
  );
}

function TimelineRow({ item, isNext = false }: { item: TimelineItem; isNext?: boolean }) {
  return (
    <details className={`timeline-row${isNext ? ' next-timeline-row' : ''}`}>
      <summary className="timeline-summary">
        <span className="timeline-time"><Clock3 aria-hidden="true" />{item.time}</span>
        <span className="timeline-copy">
          <StatusBadge tone={item.statusTone}>{item.status}</StatusBadge>
          <strong>{item.title}</strong>
          {isNext ? <span className="next-item-label">Up next</span> : null}
          <span className="timeline-location"><MapPin aria-hidden="true" />{item.location}</span>
        </span>
        <span className="timeline-chevron"><ChevronDown aria-hidden="true" /></span>
      </summary>
      <div className="timeline-details">
        {item.note ? <p>{item.note}</p> : null}
        {item.detail ? <small>{item.detail}</small> : null}
        {item.price ? <strong>{item.price}</strong> : null}
        <LinkActions
          mapUrl={item.mapUrl}
          bookingUrl={item.bookingUrl}
          bookingLabel={item.bookingLabel}
        />
      </div>
    </details>
  );
}

export default function Home() {
  const [tripState, setTripState] = useState<TripState>(initialTripState);
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [openDecision, setOpenDecision] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AppView>('home');
  const [planView, setPlanView] = useState<PlanView>('decisions');
  const [guideView, setGuideView] = useState<GuideView>('highlights');
  const [infoView, setInfoView] = useState<InfoView>('travel');
  const [shareNotice, setShareNotice] = useState('');
  const [clockNow, setClockNow] = useState<Date | null>(null);

  useEffect(() => {
    const syncClock = () => {
      const now = new Date();
      const nextTripState = getTripState(now);
      setTripState(nextTripState);
      setClockNow(now);
    };

    syncClock();
    const timer = window.setInterval(syncClock, 60_000);
    window.addEventListener('focus', syncClock);
    document.addEventListener('visibilitychange', syncClock);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', syncClock);
      document.removeEventListener('visibilitychange', syncClock);
    };
  }, []);

  useEffect(() => {
    const syncFromLocation = () => {
      const hash = window.location.hash.slice(1);
      const dayMatch = hash.match(/^day-(\d)$/);

      if (!hash) {
        setOpenDay(null);
        setActiveSection('home');
        return;
      }

      if (dayMatch && trip.days.some((day) => day.day === Number(dayMatch[1]))) {
        setOpenDay(Number(dayMatch[1]));
        setActiveSection('timeline');
        return;
      }

      if (hash.startsWith('essentials/')) {
        const target = hash.split('/')[1] as InfoView;
        if (['travel', 'stay', 'tickets', 'more'].includes(target)) {
          setInfoView(target);
          setActiveSection('essentials');
          return;
        }
      }

      const views: AppView[] = ['home', 'timeline', 'decisions', 'highlights', 'essentials'];
      if (views.includes(hash as AppView)) {
        setOpenDay(null);
        setActiveSection(hash as AppView);
      }
    };

    syncFromLocation();
    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('hashchange', syncFromLocation);
    return () => {
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener('hashchange', syncFromLocation);
    };
  }, []);

  function navigateTo(view: AppView, hash: string = view) {
    if (view === 'timeline' && hash === 'timeline') setOpenDay(null);
    setActiveSection(view);
    const nextHash = `#${hash}`;
    if (window.location.hash !== nextHash) window.history.pushState({}, '', nextHash);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const headingIds: Record<AppView, string> = {
      home: 'trip-title', timeline: 'timeline-heading', decisions: 'decisions-heading',
      highlights: 'highlights-heading', essentials: 'essentials-heading',
    };
    window.setTimeout(() => document.getElementById(headingIds[view])?.focus({ preventScroll: true }), 0);
  }

  function openTripDay(day: TripDay) {
    setOpenDay(day.day);
    navigateTo('timeline', `day-${day.day}`);
  }

  function openInfo(view: InfoView) {
    setInfoView(view);
    navigateTo('essentials', 'essentials/' + view);
  }

  async function copyLocation(label: string, address: string) {
    try {
      await copyText(address);
      setShareNotice(`${label} address copied`);
    } catch {
      setShareNotice('Select the address to copy it.');
    }
    window.setTimeout(() => setShareNotice(''), 2800);
  }

  async function sharePayload(title: string, text: string, hash = '') {
    const url = `${window.location.origin}${window.location.pathname}${hash}`;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await copyText(`${text}\n${url}`);
      setShareNotice('Link copied — drop it in the group chat.');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareNotice('Copy the address from your browser to share it.');
    }

    window.setTimeout(() => setShareNotice(''), 2800);
  }

  function shareDay(day: TripDay) {
    const plan = day.items.map((item) => `${item.time} ${item.title}`).join(' → ');
    return sharePayload(`${day.dayLabel} · ${day.title}`, `${day.dayLabel}: ${plan}`, `#day-${day.day}`);
  }

  const focusDay = clockNow ? getDefaultDay(trip.days, clockNow) : trip.days[0];
  const selectedDay = trip.days.find((day) => day.day === openDay) ?? focusDay;
  const spartyDecision = trip.decisions.find((decision) => decision.id === 'sparty-tier');
  const upcomingStops = clockNow ? getUpcomingStops(trip.days, clockNow) : buildSchedule(trip.days).slice(0, 3);
  const nextStop = upcomingStops[0];
  const planHeading = planView === 'decisions'
    ? {
        kicker: 'Plan',
        title: 'Decisions',
      }
    : {
        kicker: 'Plan',
        title: 'Bookings',
      };
  const guideHeading: Record<GuideView, string> = {
    highlights: 'Activities',
    food: 'Food',
    nightlife: 'Nightlife',
    map: 'Map',
  };
  const infoHeading: Record<InfoView, string> = {
    travel: 'Flights',
    stay: 'Apartment',
    tickets: 'Tickets',
    more: 'Checklist',
  };

  return (
    <main className="trip-shell">
      <nav className="bottom-nav" aria-label="Trip sections">
        {trip.navigation.map((item) => (
          <button
            className={`${activeSection === item.id ? 'active' : ''}${item.id === 'timeline' ? ' nav-primary' : ''}`.trim()}
            aria-current={activeSection === item.id ? 'page' : undefined}
            key={item.id}
            type="button"
            onClick={() => navigateTo(item.id as AppView)}
          >
            <BottomNavIcon id={item.id} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>


      <header className={`app-masthead${activeSection === 'home' ? ' home-masthead' : ''}`}>
        {activeSection === 'home' ? <>
          <div className="budapest-backdrop" style={{backgroundImage:"url('./budapest-hero-v2.webp')"}} aria-hidden="true" />
          <div className="hero-identity">
            <p>Bachelor trip</p><h1>Budapest</h1><p>17–21 September 2026</p>
            <span className="countdown-pill">{!clockNow ? trip.dateLabel : tripState.phase === 'before' ? tripState.value + ' to go' : tripState.phase === 'during' ? `Day ${focusDay.day} of 5` : 'Trip ended'}</span>
          </div>
        </> : <button className="wordmark" onClick={() => navigateTo('home')} aria-label="Budapest trip home">
          <span className="wordmark-icon"><MapPin aria-hidden="true" /></span>
          <span>Budapest<small>17–21 September 2026</small></span>
        </button>}
        <Button variant="outline" size="icon" className="share-top" onClick={() => sharePayload(trip.name, trip.dateLabel)} aria-label="Share trip">
          <Share2 aria-hidden="true" />
        </Button>
      </header>

      {activeSection === 'home' ? (
        <div className="content-shell app-screen home-screen">
          <section className="home-overview" aria-labelledby="trip-title">
            <h2 className="sr-only" id="trip-title">What’s next</h2>
            <div className="next-home-panel">
              {nextStop ? <>
                <button className="next-stop-card" onClick={() => openTripDay(nextStop.day)}>
                  <span className="next-stop-label"><Clock3 aria-hidden="true" /> What’s next</span>
                  <span className="next-stop-top"><span>{getStopDateLabel(nextStop, clockNow)} · Budapest time</span><strong>{nextStop.item.time}</strong></span>
                  <strong className="next-stop-name">{nextStop.item.title}</strong>
                  <span className="next-stop-location"><MapPin aria-hidden="true" />{nextStop.item.location}</span>
                  <span className="next-stop-footer">Open schedule <ChevronRight aria-hidden="true" /></span>
                </button>
              </> : <div className="next-empty"><CalendarDays aria-hidden="true" /><h3>No upcoming activities</h3><button onClick={() => navigateTo('timeline')}>Open schedule <ChevronRight aria-hidden="true" /></button></div>}
            </div>
            <div className="home-day-strip" aria-label="Open a trip day">
              {trip.days.map((day) => <button key={day.day} className={day.day === focusDay.day ? 'focus-day' : ''} onClick={() => openTripDay(day)} aria-label={`Open ${day.dayLabel}`}>
                <span>{day.dayLabel.slice(0,3)}</span><strong>{day.date.slice(-2)}</strong>
              </button>)}
            </div>
          </section>
          <section className="quick-section" aria-labelledby="quick-heading">
            <div className="compact-heading"><h2 id="quick-heading">Addresses</h2><span>Copy or open</span></div>
            <div className="quick-grid">
              <article className="quick-card address-card apartment-address-card">
                <div className="address-card-top">
                  <span className="quick-icon"><House aria-hidden="true" /></span>
                  <div className="address-actions">
                    <button type="button" title="Copy address" onClick={() => copyLocation('Apartment', trip.base.address)} aria-label="Copy apartment address"><Copy aria-hidden="true" /></button>
                    <a href={trip.base.mapUrl} target="_blank" rel="noreferrer" title="Open in Maps" aria-label="Open apartment in Maps"><Navigation aria-hidden="true" /></a>
                  </div>
                </div>
                <small>Apartment</small><strong>{trip.base.name}</strong><address>1075 Budapest, Hungary</address>
              </article>
              <article className="quick-card address-card airport-address-card">
                <div className="address-card-top">
                  <span className="quick-icon"><Plane aria-hidden="true" /></span>
                  <div className="address-actions">
                    <button type="button" title="Copy address" onClick={() => copyLocation('Airport', `${trip.arrival.airport}, ${trip.arrival.airportAddress}`)} aria-label="Copy airport address"><Copy aria-hidden="true" /></button>
                    <a href={trip.arrival.mapUrl} target="_blank" rel="noreferrer" title="Open in Maps" aria-label="Open airport in Maps"><Navigation aria-hidden="true" /></a>
                  </div>
                </div>
                <small>Airport · BUD</small><strong>Ferenc Liszt Airport</strong><address>{trip.arrival.airportAddress}</address>
              </article>
            </div>
            <div className="travel-shortcuts" aria-label="Travel details">
            <button className="utility-row" onClick={() => openInfo('travel')}>
              <span className="utility-icon"><Plane aria-hidden="true" /></span><span><strong>Flights & transfers</strong><small>{trip.arrival.time} arrival · {trip.departure.time} departure</small></span><ChevronRight aria-hidden="true" />
            </button>
            <div className="shortcut-pair">
              <button onClick={() => openInfo('stay')}><House aria-hidden="true" /> Apartment <ChevronRight aria-hidden="true" /></button>
              <button onClick={() => openInfo('tickets')}><TicketCheck aria-hidden="true" /> Tickets <ChevronRight aria-hidden="true" /></button>
            </div>
            </div>
          </section>
        </div>
      ) : null}

      {activeSection === 'timeline' ? (
        <div className="content-shell app-screen">
          <section className="section-block app-panel" aria-labelledby="timeline-heading">
            <SectionHeading headingId="timeline-heading" kicker="17–21 September" title="Daily schedule" />
            <div className="day-picker" aria-label="Choose a day">
              {trip.days.map((day) => (
                <button key={day.day} type="button" className={selectedDay.day === day.day ? 'selected' : ''} aria-pressed={selectedDay.day === day.day} aria-label={day.dayLabel} onClick={() => openTripDay(day)}>
                  <span>{day.dayLabel.slice(0,3)}</span><strong>{day.date.slice(-2)}</strong>
                  <small>{day.day === tripState.activeDay?.day ? 'Today' : `Day ${day.day}`}</small>
                </button>
              ))}
            </div>
            <div className="day-overview-card">
              <div className="schedule-heading">
                <div><p className="section-index">Day {selectedDay.day} of {trip.days.length}</p><h3>{selectedDay.title}</h3></div>
                <Button variant="outline" size="icon" className="share-top" onClick={() => shareDay(selectedDay)} aria-label="Share this day"><Share2 aria-hidden="true" /></Button>
              </div>
              <p className="schedule-meta"><CalendarDays aria-hidden="true" /> {selectedDay.dayLabel} <span>·</span> <Clock3 aria-hidden="true" /> Budapest time <span>·</span> {selectedDay.items.length} activities</p>
            </div>
            {tripState.activeDay && selectedDay.day !== tripState.activeDay.day ? <button className="back-to-today" onClick={() => navigateTo('timeline')}><CalendarDays aria-hidden="true" /> Back to today</button> : null}
            <div className="schedule-list" key={selectedDay.day}>
              {selectedDay.items.map((item) => <TimelineRow item={item} isNext={nextStop?.item === item} key={item.time + item.title} />)}
            </div>
          </section>
        </div>
      ) : null}

      {activeSection === 'decisions' ? (
        <div className="content-shell app-screen">
          <section className="section-block app-panel" aria-labelledby="decisions-heading">
          <SectionHeading
            headingId="decisions-heading"
            kicker={planHeading.kicker}
            title={planHeading.title}
            side={<Gauge aria-hidden="true" className="section-icon" />}
          />

          <SegmentedNav
            label="Plan categories"
            value={planView}
            onChange={setPlanView}
            options={[{ id: 'decisions', label: 'Decisions' }, { id: 'bookings', label: 'To book' }]}
          />

          {planView === 'decisions' ? <div className="decision-stack tab-panel">
            {trip.decisions.map((decision) => (
              <Collapsible
                className="decision-card"
                key={decision.id}
                open={openDecision === decision.id}
                onOpenChange={(open) => setOpenDecision(open ? decision.id : null)}
              >
                <CollapsibleTrigger className="decision-trigger">
                  <div>
                    <span>{decision.kicker}</span>
                    <h3>{decision.title}</h3>
                  </div>
                  <div className="decision-trigger-side">
                    <StatusBadge tone={decision.statusTone}>{decision.status}</StatusBadge>
                    <span className="day-chevron"><ChevronDown aria-hidden="true" /></span>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="decision-options">
                  <p className="decision-detail-note">{decision.note}</p>
                  {decision.options.map((option) => (
                    <details className="option-card" key={option.name}>
                      <summary className="option-summary">
                        <span className="option-summary-copy">
                          {option.label ? <small>{option.label}</small> : null}
                          <strong>{option.name}</strong>
                        </span>
                        {option.price ? <span className="option-summary-price">{option.price}</span> : null}
                        <ChevronDown aria-hidden="true" />
                      </summary>
                      <div className="option-details">
                        <p>{option.description}</p>
                        {option.meta ? <small>{option.meta}</small> : null}
                        {option.note ? <em>{option.note}</em> : null}
                        <LinkActions mapUrl={option.mapUrl} bookingUrl={option.bookingUrl} bookingLabel="Details" />
                      </div>
                    </details>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div> : null}

          {planView === 'bookings' ? <div className="booking-board tab-panel">
            {trip.bookingPriorities.map((booking) => (
              <details className="booking-item" key={booking.priority}>
                <summary className="booking-row">
                  <span className="booking-number">{String(booking.priority).padStart(2, '0')}</span>
                  <span className="booking-copy">
                    <small>{booking.when}</small>
                    <strong>{booking.title}</strong>
                  </span>
                  <span className="booking-side">
                    <StatusBadge tone={booking.statusTone}>{booking.status}</StatusBadge>
                    <ChevronDown aria-hidden="true" />
                  </span>
                </summary>
                <div className="booking-details">
                  <p>{booking.note}</p>
                  {booking.bookingUrl ? (
                    <a href={booking.bookingUrl} target="_blank" rel="noreferrer">
                      Open booking <ArrowUpRight aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </details>
            ))}
          </div> : null}
        </section>
        </div>
      ) : null}

      {activeSection === 'highlights' ? (
        <div className="content-shell app-screen">
          <section className="section-block app-panel" aria-labelledby="highlights-heading">
          <SectionHeading
            headingId="highlights-heading"
            kicker="Places"
            title={guideHeading[guideView]}
            side={<Sparkles aria-hidden="true" className="section-icon" />}
          />

          <SegmentedNav
            label="Places categories"
            value={guideView}
            onChange={setGuideView}
            options={[
              { id: 'highlights', label: 'Activities' },
              { id: 'food', label: 'Food' },
              { id: 'nightlife', label: 'Nightlife' },
              { id: 'map', label: 'Map' },
            ]}
          />

          {guideView === 'highlights' ? <div className="place-grid highlights-grid tab-panel">
            {trip.highlights.map((place) => <PlaceCard place={place} key={place.name} />)}
          </div> : null}

          {guideView === 'food' ? <div className="place-grid tab-panel">
            {trip.food.map((place) => <PlaceCard place={place} key={place.name} />)}
          </div> : null}

          {guideView === 'nightlife' ? <div className="place-grid tab-panel">
            {trip.nightlife.map((place) => <PlaceCard place={place} key={place.name} />)}
          </div> : null}

          {guideView === 'map' ? <div className="tab-panel"><div className="map-panel">
            <div className="map-orbit map-orbit-a" aria-hidden="true" />
            <div className="map-orbit map-orbit-b" aria-hidden="true" />
            <div className="map-copy">
              <span>APARTMENT</span>
              <h3>{trip.base.name}</h3>
              <p>{trip.base.address}</p>
              <a href={trip.base.mapUrl} target="_blank" rel="noreferrer">
                Open apartment in Maps <Navigation aria-hidden="true" />
              </a>
            </div>
            <MapPin aria-hidden="true" className="map-pin-hero" />
          </div>

          <div className="map-spot-grid">
            {trip.mapSpots.map((spot) => (
              <a href={spot.mapUrl} target="_blank" rel="noreferrer" key={spot.name}>
                <span>{spot.name}</span>
                <strong>{spot.label}</strong>
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
          </div></div> : null}
        </section>
        </div>
      ) : null}

      {activeSection === 'essentials' ? (
        <div className="content-shell app-screen">
          <section className="section-block app-panel" aria-labelledby="essentials-heading">
          <SectionHeading
            headingId="essentials-heading"
            kicker="Travel details"
            title={infoHeading[infoView]}
            side={<ShieldCheck aria-hidden="true" className="section-icon" />}
          />

          <SegmentedNav
            label="Travel categories"
            value={infoView}
            onChange={openInfo}
            options={[
              { id: 'travel', label: 'Flights' },
              { id: 'stay', label: 'Apartment' },
              { id: 'tickets', label: 'Tickets' },
              { id: 'more', label: 'Checklist' },
            ]}
          />

          {infoView === 'travel' ? <div className="travel-grid tab-panel">
            <article className="travel-card">
              <Plane aria-hidden="true" />
              <span>ARRIVAL · {trip.arrival.dateLabel}</span>
              <div className="flight-route"><span>TLV <small>Tel Aviv</small></span><Plane aria-hidden="true" /><span>BUD <small>Budapest</small></span></div><h3>{trip.arrival.time}<small>Arrival · local time</small></h3>
              <p>{trip.arrival.flight}</p>
              <address>{trip.arrival.airportAddress}</address>
              <details className="travel-details">
                <summary>Transfer details</summary>
                <small>{trip.arrival.transfer}</small>
              </details>
              <a className="travel-link" href={trip.arrival.mapUrl} target="_blank" rel="noreferrer">
                Airport map <Navigation aria-hidden="true" />
              </a>
            </article>
            <article className="travel-card departure-card">
              <Plane aria-hidden="true" />
              <span>DEPARTURE · {trip.departure.dateLabel}</span>
              <div className="flight-route"><span>BUD <small>Budapest</small></span><Plane aria-hidden="true" /><span>TLV <small>Tel Aviv</small></span></div><h3>{trip.departure.time}<small>Departure · local time</small></h3>
              <p>{trip.departure.flight}</p>
              <address>{trip.departure.airportAddress}</address>
              <details className="travel-details">
                <summary>Departure details</summary>
                <small>{trip.departure.terminal}</small>
                <small>{trip.departure.leaveCity}</small>
              </details>
              <a className="travel-link" href={trip.departure.mapUrl} target="_blank" rel="noreferrer">
                Terminal map <Navigation aria-hidden="true" />
              </a>
            </article>
          </div> : null}

          {infoView === 'stay' ? <div className="tab-panel">
            <article className="stay-card">
              <div className="info-status-row">
                <span>APARTMENT</span>
                <StatusBadge tone="locked">ADDRESS ADDED</StatusBadge>
              </div>
              <Luggage aria-hidden="true" className="stay-icon" />
              <h3>{trip.base.name}</h3><address>Budapest, 1075, Hungary</address>
              <p>{trip.base.area}</p>
              <LinkActions
                mapUrl={trip.base.mapUrl}
                bookingUrl={trip.base.listingUrl}
                bookingLabel="Airbnb listing"
              />
              <button className="copy-address" onClick={() => copyLocation('Apartment', trip.base.address)}><Copy aria-hidden="true" /> Copy address</button>

              <details className="info-disclosure">
                <summary>Apartment details <ChevronDown aria-hidden="true" /></summary>
                <ul>
                  <li>{trip.base.address}</li>
                  <li>Rooftop apartment</li>
                  <li>3 bedrooms</li>
                  <li>Full kitchen</li>
                  <li>3 AC units</li>
                  <li>{trip.base.area}</li>
                </ul>
              </details>
              <details className="info-disclosure alert-disclosure">
                <summary>Details to confirm <ChevronDown aria-hidden="true" /></summary>
                <ul>{trip.essentials[0].items.map((item) => <li key={item}>{item}</li>)}</ul>
              </details>
            </article>
          </div> : null}

          {infoView === 'tickets' ? <div className="tab-panel">
            <article className="ticket-card">
              <div className="info-status-row">
                <span>SPARTY · SAT 19 SEP</span>
                <StatusBadge tone="core">NOT BOOKED</StatusBadge>
              </div>
              <TicketCheck aria-hidden="true" className="ticket-icon" />
              <h3>Sparty at Széchenyi</h3>
              <p>21:30–02:00 · Állatkerti krt. 9–11</p>

              <div className="ticket-options">
                {spartyDecision?.options.map((option) => (
                  <details key={option.name}>
                    <summary>
                      <span>{option.name}</span>
                      <strong>{option.price}</strong>
                      <ChevronDown aria-hidden="true" />
                    </summary>
                    <p>{option.description}</p>
                    {option.note ? <small>{option.note}</small> : null}
                  </details>
                ))}
              </div>

              <a className="ticket-link" href="https://spartybooking.com/landing-2026-sep/" target="_blank" rel="noreferrer">
                Compare tickets <ArrowUpRight aria-hidden="true" />
              </a>
              <small className="source-status">Tickets still need to be purchased.</small>
            </article>
          </div> : null}

          {infoView === 'more' ? <div className="tab-panel disclosure-stack">
            {trip.essentials.slice(1).map((group) => (
              <details className="info-disclosure standalone-disclosure" key={group.title}>
                <summary>{group.title} <ChevronDown aria-hidden="true" /></summary>
                <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </details>
            ))}

            <details className="info-disclosure standalone-disclosure">
              <summary>Budget <ChevronDown aria-hidden="true" /></summary>
              <div className="budget-grid nested-budget">
                {trip.budget.map((item) => (
                  <article key={item.category}>
                    <span>{item.category}</span>
                    <strong>{item.estimate}</strong>
                    <p>{item.note}</p>
                  </article>
                ))}
              </div>
            </details>

            <details className="info-disclosure standalone-disclosure">
              <summary>Final checks <ChevronDown aria-hidden="true" /></summary>
              <ul>{trip.verifyBeforeTrip.map((item) => <li key={item}>{item}</li>)}</ul>
            </details>

            <details className="info-disclosure standalone-disclosure">
              <summary>Safety <ChevronDown aria-hidden="true" /></summary>
              <ul>{trip.safety.map((item) => <li key={item}>{item}</li>)}</ul>
            </details>
          </div> : null}
        </section>
        </div>
      ) : null}

      {shareNotice ? <output className="share-notice" aria-live="polite">{shareNotice}</output> : null}
    </main>
  );
}
