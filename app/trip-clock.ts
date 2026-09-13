import type { TimelineItem, TripDay } from './trip-data';

const MINUTES_PER_DAY = 1440;
const DAY_MS = 86_400_000;

/** Compare Budapest wall-clock minutes, independent of the phone's timezone. */
export function getBudapestClock(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Budapest', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const part = (name: string) => parts.find((value) => value.type === name)!.value;
  const dateKey = `${part('year')}-${part('month')}-${part('day')}`;
  const minutes = Number(part('hour')) * 60 + Number(part('minute'));
  return { dateKey, minutes, minuteKey: Date.parse(`${dateKey}T00:00:00Z`) / 60_000 + minutes };
}

export type ScheduledStop = {
  day: TripDay;
  item: TimelineItem;
  dateKey: string;
  minuteKey: number;
};

export function buildSchedule(days: TripDay[]): ScheduledStop[] {
  return days.flatMap((day) => {
    let previousMinutes = -1;
    let dayOffset = 0;
    return day.items.flatMap((item) => {
      const time = item.time.match(/^(\d{1,2}):(\d{2})/);
      if (!time) return [];
      const minutes = Number(time[1]) * 60 + Number(time[2]);
      // Items such as Friday's 00:30 return belong to Saturday's calendar date.
      if (minutes < previousMinutes) dayOffset += 1;
      previousMinutes = minutes;
      const midnight = Date.parse(`${day.date}T00:00:00Z`) + dayOffset * DAY_MS;
      return [{ day, item, dateKey: new Date(midnight).toISOString().slice(0,10), minuteKey: midnight / 60_000 + minutes }];
    });
  }).sort((a, b) => a.minuteKey - b.minuteKey);
}

export function getUpcomingStops(days: TripDay[], now: Date, limit = 3) {
  const { minuteKey } = getBudapestClock(now);
  return buildSchedule(days).filter((stop) => stop.minuteKey >= minuteKey).slice(0, limit);
}

export function getDefaultDay(days: TripDay[], now: Date) {
  const { dateKey, minuteKey } = getBudapestClock(now);
  const nextStop = buildSchedule(days).find((stop) => stop.minuteKey >= minuteKey);

  // After-midnight activities still belong to the night they were planned for.
  // Keep that itinerary day selected until its final scheduled stop begins.
  if (nextStop?.dateKey === dateKey && nextStop.day.date !== dateKey) return nextStop.day;

  return days.find((day) => day.date === dateKey) ?? (dateKey < days[0].date ? days[0] : days[days.length - 1]);
}

export function getStopDateLabel(stop: ScheduledStop, now: Date | null) {
  if (now) {
    const { dateKey } = getBudapestClock(now);
    if (dateKey === stop.dateKey) return 'Today';
    const gap = (Date.parse(`${stop.dateKey}T00:00:00Z`) - Date.parse(`${dateKey}T00:00:00Z`)) / 60_000;
    if (gap === MINUTES_PER_DAY) return 'Tomorrow';
  }
  return new Intl.DateTimeFormat('en-GB', { timeZone:'UTC', weekday:'short', day:'numeric', month:'short' }).format(new Date(`${stop.dateKey}T00:00:00Z`));
}
