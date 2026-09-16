import { trip } from './trip-data-v11.ts';
import type { Decision, Place } from './trip-data';
import { buildSchedule, getBudapestClock, type ScheduledStop } from './trip-clock.ts';

export const dayNames = ['Arrival', 'Shooting & VIBE', 'Baths, Spago & rooftop', 'Relaxed Sunday', 'Departure day'];
export const dayContexts = ['Apartment · dinner · drinks', 'Rookie × 4 · VIBE 20:30 · optional Instant', 'Széchenyi · reset · Spago 20:00 · Duchess', 'Brunch · massage · rooftop to finalize', 'Shopping · lunch · bags · airport'];
export type Event = ScheduledStop & { id: string; endMinute: number; decision?: Decision };
const decisionIds: Record<string, string> = { '2-2':'friday-activity', '3-5':'saturday-night', '4-2':'sunday-flow', '4-4':'sunday-flow' };
export const events: Event[] = buildSchedule(trip.days).map((stop, index, all) => {
  const id = `${stop.day.day}-${stop.day.items.indexOf(stop.item) + 1}`;
  const following = all[index + 1];
  // Keep a scheduled activity visible until the next stop in its itinerary.
  // The final stop has no known end: allow one hour, without claiming completion.
  const endMinute = following?.day.day === stop.day.day ? following.minuteKey : stop.minuteKey + 60;
  return { ...stop, id, endMinute, decision: trip.decisions.find(d => d.id === decisionIds[id]) };
});

export function liveTrip(now: Date) {
  const clock = getBudapestClock(now);
  const phase = clock.dateKey < trip.startDate ? 'before' : clock.dateKey > trip.endDate ? 'after' : 'during';
  const current = phase === 'during' ? events.find(e => e.minuteKey <= clock.minuteKey && e.endMinute > clock.minuteKey) : undefined;
  const next = events.find(e => e.minuteKey > clock.minuteKey);
  const day = current?.day ?? trip.days.find(d => d.date === clock.dateKey) ?? (phase === 'before' ? trip.days[0] : trip.days[4]);
  const focus = current ?? next;
  const later = focus ? events.filter(e => e.day.day === focus.day.day && e.minuteKey > focus.minuteKey).slice(0,3) : [];
  const daysUntil = Math.max(0, Math.ceil((Date.parse(trip.startDate) - Date.parse(clock.dateKey)) / 86_400_000));
  return { phase, current, next, focus, later, day, clock, daysUntil, tomorrow: !current && next && next.day.day !== day.day };
}

export function essentialStatus(event: Event) {
  const reservation=trip.reservations.find(r=>r.eventId===event.id);
  if(reservation) return reservation.label;
  if (event.item.status === 'HANDLED') return 'Tickets handled';
  if (event.item.status === 'TIME TBD') return 'Time to confirm';
  if (event.decision && event.decision.id !== 'sunday-flow') return 'Option';
  if (['BOOK','RESERVE','MUST BOOK'].includes(event.item.status)) return 'Reservation needed';
  if (event.item.status === 'CONFIRM') return 'To confirm';
  return null;
}

export function essentialState(event:Event) {
  return trip.reservations.find(r=>r.eventId===event.id)?.state;
}

export function eventResearch(event: Event) {
  const keywords: Record<string,string[]> = {
    '1-3':['Mazel Tov'], '1-4':['La Siesta'], '2-1':['VINYL & WOOD','Cirkusz Café'], '2-2':['Budapest Shooting','Hungaroring'],
    '2-4':['VIBE'], '2-5':['Instant-Fogas'], '3-1':['TATI','Twentysix'], '3-2':['Széchenyi Thermal Bath'],
    '3-4':['Spago'], '3-5':['The Duchess','White Raven Skybar','360 Bar','High Note SkyBar'], '4-1':['Cirkusz Café','Franziska Pest'],
    '4-2':['AWAY Spa','Aria Harmony Spa'], '4-4':['Leo Rooftop','High Note SkyBar','360 Bar'], '5-3':['ÉS Bisztró'],
  };
  return [...trip.highlights,...trip.food,...trip.nightlife].filter(p => keywords[event.id]?.includes(p.name));
}

export type MapCategory = 'Food' | 'Night' | 'Activities' | 'Spa';
export type SavedPlace = Place & { id: string; category: MapCategory; eventIds: string[]; coords?: [number, number] };
// Coordinates below are resolved from public OpenStreetMap venues; no private accommodation geocoding.
export const coordinates: Record<string,[number,number]> = {
  Hungaroring: [47.582649,19.2500236],
  'Mazel Tov':[47.5002309,19.0656161], 'VINYL & WOOD':[47.4980355,19.0647251],
  'Széchenyi Thermal Bath':[47.5184354,19.0825223],
  TATI:[47.4981214,19.0691053],
  'Instant-Fogas':[47.5005267,19.0655234], 'AWAY Spa':[47.5019396,19.0593022],
  'Leo Rooftop':[47.4987627,19.0401730], BiBo:[47.4967030,19.0492859],
  VIBE:[47.5008240,19.0473408], 'ÉS Bisztró':[47.4970308,19.0520833],
  'Franziska Pest':[47.4970198,19.0600195], 'High Note SkyBar':[47.4998527,19.0535890],
  '360 Bar':[47.5036383,19.0616335],
};
const unique = new Map<string,SavedPlace>();
const sources: {items: Place[]; category: MapCategory}[] = [
  {items:trip.highlights, category:'Activities'}, {items:trip.food, category:'Food'}, {items:trip.nightlife, category:'Night'},
];
for (const {items,category} of sources) for (const place of items) {
  const match = events.filter(e => eventResearch(e).some(p => p.name === place.name));
  const existing = unique.get(place.name);
  unique.set(place.name,{...existing,...place,id:place.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),
    category:/\bspa\b|Thermal Bath/i.test(place.name) ? 'Spa' : existing?.category ?? category,
    eventIds:[...new Set([...(existing?.eventIds ?? []),...match.map(e => e.id)])],coords:coordinates[place.name]});
}
export const savedPlaces = [...unique.values()];

export const previewTimes: Record<string,string> = {
  before:'2026-09-14T10:00:00+02:00', friday:'2026-09-18T15:30:00+02:00',
  saturday:'2026-09-19T22:00:00+02:00', late:'2026-09-19T02:00:00+02:00', after:'2026-09-22T10:00:00+02:00',
};
