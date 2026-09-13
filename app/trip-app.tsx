'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
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
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { trip, type Place, type StatusTone, type TimelineItem, type TripDay } from './trip-data';

const DAY_MS = 86_400_000;

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

function getMinutes(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

function getUpcomingItem(day: TripDay, currentMinutes: number) {
  let previousMinutes = -1;
  let dayOffset = 0;

  const scheduled = day.items.map((item) => {
    const match = item.time.match(/(\d{1,2}):(\d{2})/);
    if (!match) return { item, minutes: Number.POSITIVE_INFINITY };

    const minutes = Number(match[1]) * 60 + Number(match[2]);
    if (minutes < previousMinutes && previousMinutes >= 18 * 60) dayOffset = 24 * 60;
    previousMinutes = minutes;
    return { item, minutes: minutes + dayOffset };
  });

  return scheduled.find((entry) => entry.minutes >= currentMinutes)?.item ?? day.items.at(-1)!;
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
  return <Sparkles aria-hidden="true" />;
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
    <div className="segmented-nav" aria-label={label}>
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
    </div>
  );
}

async function copyText(text: string) {
  if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
  await navigator.clipboard.writeText(text);
}

function StatusBadge({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  return <Badge className={`status-badge status-${tone}`}>{children}</Badge>;
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
        <h2 id={headingId}>{title}</h2>
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

function TimelineRow({ item }: { item: TimelineItem }) {
  return (
    <details className="timeline-row">
      <summary className="timeline-summary">
        <span className="timeline-time"><Clock3 aria-hidden="true" />{item.time}</span>
        <span className="timeline-copy">
          <StatusBadge tone={item.statusTone}>{item.status}</StatusBadge>
          <strong>{item.title}</strong>
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
  const [currentMinutes, setCurrentMinutes] = useState(-1);

  useEffect(() => {
    const syncClock = () => {
      const now = new Date();
      const nextTripState = getTripState(now);
      setTripState(nextTripState);
      setCurrentMinutes(getMinutes(now));
    };

    syncClock();
    const timer = window.setInterval(syncClock, 60_000);
    return () => window.clearInterval(timer);
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

      if (dayMatch) {
        setOpenDay(Number(dayMatch[1]));
        setActiveSection('timeline');
        return;
      }

      const views: AppView[] = ['home', 'timeline', 'decisions', 'highlights', 'essentials'];
      if (views.includes(hash as AppView)) {
        setOpenDay(null);
        setActiveSection(hash as AppView);
      }
    };

    syncFromLocation();
    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, []);

  function navigateTo(view: AppView, hash: string = view) {
    setActiveSection(view);
    window.history.pushState({}, '', `#${hash}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openTripDay(day: TripDay) {
    setOpenDay(day.day);
    navigateTo('timeline', `day-${day.day}`);
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

  const focusDay = tripState.activeDay ?? trip.days[0];
  const selectedDay = trip.days.find((day) => day.day === openDay);
  const spartyDecision = trip.decisions.find((decision) => decision.id === 'sparty-tier');
  const focusItem = tripState.activeDay
    ? getUpcomingItem(tripState.activeDay, currentMinutes)
    : trip.nextUp;
  const focusDayLabel = tripState.activeDay?.dayLabel ?? trip.nextUp.dayLabel;
  const focusActionLabel = tripState.phase === 'during'
    ? "Today's plan"
    : tripState.phase === 'before'
      ? 'First day plan'
      : 'Trip schedule';
  const planHeading = planView === 'decisions'
    ? {
        kicker: 'Plan',
        title: 'Choices',
      }
    : {
        kicker: 'Plan',
        title: 'Bookings',
      };
  const guideHeading: Record<GuideView, string> = {
    highlights: 'Highlights',
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

      {activeSection === 'home' ? (
        <div className="app-screen home-screen">
          <section className="hero app-hero" aria-labelledby="trip-title">
            <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
            <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

            <div className="hero-copy">
              <span className="app-date">{trip.dateLabel}</span>
              <h1 id="trip-title">{trip.name}</h1>
            </div>

            <div className="status-card">
              <div>
                <p>{tripState.eyebrow}</p>
                <strong>{tripState.value}</strong>
                <span>{tripState.detail}</span>
              </div>
              <span className="status-pulse" aria-hidden="true" />
            </div>

            <div className="hero-actions" aria-label="Quick actions">
              <Button className="primary-action" size="lg" onClick={() => openTripDay(focusDay)}>
                {focusActionLabel} <ArrowRight aria-hidden="true" />
              </Button>
              <Button className="icon-action" variant="outline" size="icon-lg" onClick={() => sharePayload(trip.name, `${trip.name} · ${trip.dateLabel}`)} aria-label="Share trip">
                <Share2 aria-hidden="true" />
              </Button>
            </div>
          </section>

          <div className="content-shell home-content">
            <section className="hot-links" aria-labelledby="hot-links-heading">
              <div className="hot-links-heading">
                <div>
                  <span>QUICK ACCESS</span>
                  <h2 id="hot-links-heading">Hot links</h2>
                </div>
                <Sparkles aria-hidden="true" />
              </div>

              <div className="hot-link-grid">
                <button className="hot-link-card hot-link-today" type="button" onClick={() => openTripDay(focusDay)}>
                  <span className="hot-link-icon"><CalendarDays aria-hidden="true" /></span>
                  <span className="hot-link-copy">
                    <small>{focusActionLabel}</small>
                    <strong>{focusDay.title}</strong>
                    <em>{focusDayLabel} · {focusItem.time} next</em>
                  </span>
                  <ArrowRight aria-hidden="true" className="hot-link-arrow" />
                </button>

                <a className="hot-link-card" href={trip.base.mapUrl} target="_blank" rel="noreferrer">
                  <span className="hot-link-icon"><Luggage aria-hidden="true" /></span>
                  <span className="hot-link-copy">
                    <small>Apartment</small>
                    <strong>{trip.base.name}</strong>
                    <em>Budapest 1075 · open in Maps</em>
                  </span>
                  <Navigation aria-hidden="true" className="hot-link-arrow" />
                </a>

                <a className="hot-link-card" href={trip.arrival.mapUrl} target="_blank" rel="noreferrer">
                  <span className="hot-link-icon"><Plane aria-hidden="true" /></span>
                  <span className="hot-link-copy">
                    <small>Airport</small>
                    <strong>{trip.arrival.airport}</strong>
                    <em>{trip.arrival.airportAddress}</em>
                  </span>
                  <Navigation aria-hidden="true" className="hot-link-arrow" />
                </a>

                <button className="hot-link-card" type="button" onClick={() => { setInfoView('travel'); navigateTo('essentials'); }}>
                  <span className="hot-link-icon"><TicketCheck aria-hidden="true" /></span>
                  <span className="hot-link-copy">
                    <small>Flights & transfers</small>
                    <strong>{trip.arrival.time} in · {trip.departure.time} out</strong>
                    <em>Open all travel details</em>
                  </span>
                  <ArrowRight aria-hidden="true" className="hot-link-arrow" />
                </button>
              </div>
            </section>

            <section className="home-now" aria-labelledby="home-now-heading">
              <div className="compact-heading">
                <h2 id="home-now-heading">{tripState.phase === 'during' ? 'Today' : 'Next'}</h2>
                <StatusBadge tone={focusItem.statusTone}>{focusItem.status}</StatusBadge>
              </div>
              <article className="next-card">
                <div className="next-time"><span>{focusDayLabel}</span><strong>{focusItem.time}</strong></div>
                <div className="next-copy"><h3>{focusItem.title}</h3></div>
                <LinkActions mapUrl={focusItem.mapUrl} bookingUrl={focusItem.bookingUrl} bookingLabel="Open" compact />
              </article>
            </section>
          </div>
        </div>
      ) : null}

      {activeSection === 'timeline' ? (
        <div className="content-shell app-screen">
          <section className="section-block app-panel" aria-labelledby="timeline-heading">
          <SectionHeading
            headingId="timeline-heading"
            kicker="Schedule"
            title="Trip days"
          />

          <div className="days-stack day-list">
            {trip.days.map((day) => (
              <button
                type="button"
                key={day.day}
                className="day-list-card"
                style={{ '--day-accent': day.accent } as CSSProperties}
                onClick={() => openTripDay(day)}
                aria-label={`Open ${day.dayLabel}: ${day.title}`}
              >
                <span className="day-status-dot" aria-hidden="true" />
                <span className="day-list-copy">
                  <small>{day.dayLabel} · {day.intensity}/10</small>
                  <strong>{day.title}</strong>
                </span>
                <span className="day-list-arrow" aria-hidden="true"><ChevronRight /></span>
              </button>
            ))}
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
            options={[{ id: 'decisions', label: 'Choices' }, { id: 'bookings', label: 'To book' }]}
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
            kicker="Guide"
            title={guideHeading[guideView]}
            side={<Sparkles aria-hidden="true" className="section-icon" />}
          />

          <SegmentedNav
            label="Guide categories"
            value={guideView}
            onChange={setGuideView}
            options={[
              { id: 'highlights', label: 'Best of' },
              { id: 'food', label: 'Eat' },
              { id: 'nightlife', label: 'Night' },
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
              <span>HOME BASE</span>
              <h3>{trip.base.name}</h3>
              <p>{trip.base.address}</p>
              <a href={trip.base.mapUrl} target="_blank" rel="noreferrer">
                Open base in Maps <Navigation aria-hidden="true" />
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
            kicker="Trip information"
            title={infoHeading[infoView]}
            side={<ShieldCheck aria-hidden="true" className="section-icon" />}
          />

          <SegmentedNav
            label="Trip information categories"
            value={infoView}
            onChange={setInfoView}
            options={[
              { id: 'travel', label: 'Flights' },
              { id: 'stay', label: 'Stay' },
              { id: 'tickets', label: 'Tickets' },
              { id: 'more', label: 'More' },
            ]}
          />

          {infoView === 'travel' ? <div className="travel-grid tab-panel">
            <article className="travel-card">
              <Plane aria-hidden="true" />
              <span>ARRIVAL · {trip.arrival.dateLabel}</span>
              <h3>{trip.arrival.time} · {trip.arrival.airport}</h3>
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
              <h3>{trip.departure.time} · {trip.departure.flight}</h3>
              <p>{trip.departure.airport}</p>
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
              <h3>{trip.base.address}</h3>
              <p>{trip.base.area}</p>
              <LinkActions
                mapUrl={trip.base.mapUrl}
                bookingUrl={trip.base.listingUrl}
                bookingLabel="Airbnb listing"
              />

              <details className="info-disclosure">
                <summary>What we know <ChevronDown aria-hidden="true" /></summary>
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
                <summary>Still needed <ChevronDown aria-hidden="true" /></summary>
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
              <small className="source-status">No purchased ticket or confirmation file is included in the trip source.</small>
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

      <Drawer
        open={Boolean(selectedDay)}
        onOpenChange={(open) => {
          if (!open) {
            setOpenDay(null);
            if (window.location.hash.startsWith('#day-')) {
              window.history.replaceState({}, '', '#timeline');
            }
          }
        }}
        showSwipeHandle
      >
        <DrawerContent className="day-drawer">
          {selectedDay ? (
            <div className="day-drawer-inner">
              <DrawerHeader className="day-drawer-header">
                <div>
                  <span>{selectedDay.dayLabel} · {selectedDay.intensity}/10</span>
                  <DrawerTitle>{selectedDay.title}</DrawerTitle>
                  <DrawerDescription>{selectedDay.summary}</DrawerDescription>
                </div>
                <DrawerClose className="day-drawer-close" aria-label="Close day schedule">
                  <X aria-hidden="true" />
                </DrawerClose>
              </DrawerHeader>

              <div className="day-drawer-scroll">
                <div className="day-drawer-timeline">
                  {selectedDay.items.map((item) => (
                    <TimelineRow item={item} key={`${item.time}-${item.title}`} />
                  ))}
                </div>
                <Button variant="outline" className="share-day" onClick={() => shareDay(selectedDay)}>
                  <Share2 aria-hidden="true" /> Share {selectedDay.dayLabel}
                </Button>
              </div>
            </div>
          ) : null}
        </DrawerContent>
      </Drawer>

      {shareNotice ? <output className="share-notice" aria-live="polite">{shareNotice}</output> : null}
    </main>
  );
}
