import { describe, it, expect, vi, beforeEach } from 'vitest';
import EventBus, { eventBus } from '../patterns/EventBus.js';

describe('Design Pattern (Behavioral): EventBus Observer TDD Suite', () => {
  beforeEach(() => {
    eventBus.clear();
  });

  it('should deliver notifications to registered observer listeners when an event is published', () => {
    const observerMock = vi.fn();
    eventBus.subscribe('RSVP_CHANGED', observerMock);

    const payload = { eventId: 'evt_101', attendee: 'Badruddin', seatsLeft: 4 };
    eventBus.publish('RSVP_CHANGED', payload);

    expect(observerMock).toHaveBeenCalledTimes(1);
    expect(observerMock).toHaveBeenCalledWith(payload);
  });

  it('should stop delivering events after the observer unsubscribes', () => {
    const observerMock = vi.fn();
    const unsubscribe = eventBus.subscribe('ANNOUNCEMENT', observerMock);

    eventBus.publish('ANNOUNCEMENT', { text: 'Class cancelled' });
    expect(observerMock).toHaveBeenCalledTimes(1);

    // Call unsubscribe
    unsubscribe();

    eventBus.publish('ANNOUNCEMENT', { text: 'Class rescheduled' });
    expect(observerMock).toHaveBeenCalledTimes(1); // Not called second time
  });

  it('should support multiple independent observers on the same topic', () => {
    const observerA = vi.fn();
    const observerB = vi.fn();

    eventBus.subscribe('SEAT_UPDATE', observerA);
    eventBus.subscribe('SEAT_UPDATE', observerB);

    eventBus.publish('SEAT_UPDATE', { seats: 10 });

    expect(observerA).toHaveBeenCalledTimes(1);
    expect(observerB).toHaveBeenCalledTimes(1);
  });
});
