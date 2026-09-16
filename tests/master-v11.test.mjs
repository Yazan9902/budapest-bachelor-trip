import assert from 'node:assert/strict';
import test from 'node:test';
import { trip } from '../app/trip-data-v11.ts';
import { events, liveTrip, essentialStatus, savedPlaces } from '../app/dashboard-model.ts';

test('v11 preserves confirmed flight and apartment logistics',()=>{
  assert.equal(trip.groupSize,4);
  assert.match(trip.arrival.flight,/BZ442/);
  assert.equal(trip.arrival.departureTime,'14:00');
  assert.equal(trip.departure.arrivalTime,'23:00');
  assert.match(trip.departure.terminal,/T2A/);
  assert.match(trip.base.checkIn,/15:00/);
  assert.match(trip.base.checkOut,/Late checkout confirmed/);
  assert.equal(trip.base.host,'Gabrielle');
});
test('removed activities are absent from active schedule, places and choices',()=>{
  const active=JSON.stringify([trip.days,trip.decisions,trip.bookingPriorities,trip.highlights,trip.food,trip.nightlife]);
  assert.doesNotMatch(active,/Sparty|Royal Spa|VadQuad|Cold War Park|Dobrumba|FLAVA|three treatments|three massages|Terminal 2B/);
  assert.equal(trip.decisions.find(d=>d.id==='saturday-dinner'),undefined);
  assert.equal(trip.decisions.find(d=>d.id==='friday-dinner'),undefined);
});
test('Saturday flows from bath to reset to confirmed dinner then pending rooftop',()=>{
  assert.deepEqual(trip.days[2].items.slice(1,5).map(e=>e.title),['Széchenyi Thermal Bath','Apartment reset','Spago · dinner for 4','The Duchess · request sent']);
  const live=liveTrip(new Date('2026-09-19T22:45:00+02:00'));
  assert.equal(live.focus.id,'3-5');
  assert.equal(live.focus.decision.id,'saturday-night');
});
test('shooting stays unreserved and optional driving stays out of the timed schedule',()=>{
  assert.equal(essentialStatus(events.find(e=>e.id==='2-2')),'Need to book');
  assert.equal(trip.days[1].items.filter(i=>/Hungaroring/.test(i.title)).length,0);
  assert.equal(trip.decisions.find(d=>d.id==='friday-activity').options.length,2);
  assert.equal(essentialStatus(events.find(e=>e.id==='2-5')),'Tickets reported handled');
  assert.match(trip.days[1].items[1].price,/107,880/);
});
test('booking shortcuts and map-place schedule links resolve',()=>{
  for(const booking of trip.reservations) assert.ok(booking.info||events.find(e=>e.id===booking.eventId),booking.title);
  assert.equal(events.find(e=>e.id==='5-3').item.title,'ÉS Bisztró');
  assert.equal(events.find(e=>e.id==='5-5').item.title,'Leave for the airport');
  for(const p of savedPlaces) for(const id of p.eventIds) assert.ok(events.find(e=>e.id===id));
  assert.equal(savedPlaces.find(p=>p.name==='Spago').category,'Food');
  assert.ok(savedPlaces.find(p=>p.name==='The Duchess').eventIds.includes('3-5'));
});
test('reservations distinguish actual confirmations, waiting and intentional later tasks',()=>{
  assert.equal(essentialStatus(events.find(e=>e.id==='2-4')),'Confirmed');
  assert.equal(events.find(e=>e.id==='2-4').item.time,'20:30');
  assert.equal(essentialStatus(events.find(e=>e.id==='3-4')),'Confirmed');
  assert.equal(events.find(e=>e.id==='3-4').item.time,'20:00');
  assert.equal(essentialStatus(events.find(e=>e.id==='3-5')),'Request sent');
  assert.equal(essentialStatus(events.find(e=>e.id==='3-2')),'Buy before Saturday');
  assert.deepEqual(trip.nextActions.slice(0,4).map(r=>r.id),['access','shooting','mazel','duchess']);
  assert.match(trip.base.rules,/21:00–09:00/);
  assert.match(trip.base.rules,/No parties/);
});
test('overnight rooftop return retains Saturday ownership',()=>{
  const live=liveTrip(new Date('2026-09-20T01:15:00+02:00'));
  assert.equal(live.day.day,3);
  assert.equal(live.current.item.title,'Return to apartment');
});
