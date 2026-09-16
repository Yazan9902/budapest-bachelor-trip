import assert from 'node:assert/strict';
import test from 'node:test';
import { trip } from '../app/trip-data-v11.ts';
import { getBudapestClock, getUpcomingStops, getDefaultDay, getStopDateLabel } from '../app/trip-clock.ts';

test('before the trip, Thursday and the arrival are first', () => {
  const now = new Date('2026-09-13T10:00:00Z');
  assert.equal(getDefaultDay(trip.days, now).day, 1);
  assert.equal(getUpcomingStops(trip.days, now)[0].item.title, 'Land in Budapest');
});
test('after midnight, the selected day follows the owning itinerary', () => {
  const beforeFridayEnds = new Date('2026-09-18T22:05:00Z');
  const afterFridayEnds = new Date('2026-09-18T22:31:00Z');
  assert.equal(getBudapestClock(beforeFridayEnds).dateKey, '2026-09-19');
  assert.equal(getDefaultDay(trip.days, beforeFridayEnds).day, 2);
  assert.equal(getDefaultDay(trip.days, afterFridayEnds).day, 3);
});
test('an after-midnight return keeps its itinerary day but uses the next date', () => {
  const now = new Date('2026-09-18T22:05:00Z');
  const next = getUpcomingStops(trip.days, now)[0];
  assert.equal(next.item.time, '00:30');
  assert.equal(next.day.day, 2);
  assert.equal(next.dateKey, '2026-09-19');
  assert.equal(getStopDateLabel(next, now), 'Today');
});
test('rooftop return remains part of Saturday after midnight', () => {
  const now = new Date('2026-09-19T22:30:00Z');
  const next = getUpcomingStops(trip.days, now)[0];
  assert.equal(next.item.title, 'Return to apartment');
  assert.equal(next.dateKey, '2026-09-20');
  assert.equal(getDefaultDay(trip.days, now).day, 3);
});
test('next stop advances after its scheduled start minute', () => {
  assert.equal(getUpcomingStops(trip.days, new Date('2026-09-17T14:35:00Z'))[0].item.title, 'Land in Budapest');
  assert.equal(getUpcomingStops(trip.days, new Date('2026-09-17T14:36:00Z'))[0].item.title, 'Apartment reset');
});
test('tomorrow is labelled using Budapest calendar days', () => {
  const now = new Date('2026-09-17T22:10:00+02:00');
  const nextMorning = getUpcomingStops(trip.days, now)[1];
  assert.equal(getStopDateLabel(nextMorning, now), 'Tomorrow');
});
test('after the last stop, no past event is presented as upcoming', () => {
  const now = new Date('2026-09-22T10:00:00Z');
  assert.equal(getUpcomingStops(trip.days, now).length, 0);
  assert.equal(getDefaultDay(trip.days, now).day, 5);
});
