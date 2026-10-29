import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(),
    getDocs: vi.fn().mockResolvedValue({
      empty: false,
      forEach: (cb) => {
        cb({
          id: 'mock_evt_1',
          data: () => ({
            title: 'Mocked Hackathon',
            category: 'Academic',
            capacity: 50,
            registeredCount: 10,
            venue: 'RUET CSE Lab',
            date: '2026-11-20'
          })
        });
      }
    }),
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn().mockResolvedValue({}),
    updateDoc: vi.fn().mockResolvedValue({}),
    deleteDoc: vi.fn().mockResolvedValue({}),
    query: vi.fn(),
    where: vi.fn()
  };
});

import { EventService } from '../services/eventService.js';

describe('EventService Comprehensive Suite', () => {
  let service;

  beforeEach(() => {
    window.localStorage.clear();
    service = new EventService();
  });

  it('should create an event, retrieve all events, and fetch by id', async () => {
    const created = await service.createEvent({
      title: 'AI Symposium',
      category: 'Academic',
      capacity: 70,
      venue: 'Auditorium'
    });

    const all = await service.getAllEvents();
    expect(all.length).toBeGreaterThan(0);

    const single = await service.getEventById(created.id);
    expect(single.title).toBe('AI Symposium');
  });

  it('should update an event successfully', async () => {
    const created = await service.createEvent({
      title: 'Original Title',
      category: 'Workshop',
      capacity: 30,
      venue: 'Lab A'
    });

    const updated = await service.updateEvent(created.id, {
      title: 'Updated Title',
      capacity: 35
    });

    expect(updated.title).toBe('Updated Title');
    expect(updated.capacity).toBe(35);
  });

  it('should delete an event from storage', async () => {
    const created = await service.createEvent({
      title: 'Temporary Event',
      category: 'Sports',
      capacity: 20,
      venue: 'Ground'
    });

    await service.deleteEvent(created.id);
    const fetched = await service.getEventById(created.id);
    expect(fetched).toBeNull();
  });

  it('should cancel an existing RSVP reservation and release seat count', async () => {
    const event = await service.createEvent({
      title: 'Cricket Cup',
      category: 'Sports',
      capacity: 22,
      registeredCount: 5,
      venue: 'Playground'
    });

    const user = { uid: 'usr_player1', email: 'cricket@ruet.ac.bd' };
    const rsvp = await service.reserveSpot(event.id, user);

    const updatedBefore = await service.getEventById(event.id);
    expect(updatedBefore.registeredCount).toBe(6);

    const cancelled = await service.cancelReservation(rsvp.id, user);
    expect(cancelled).toBe(true);

    const updatedAfter = await service.getEventById(event.id);
    expect(updatedAfter.registeredCount).toBe(5);
  });

  it('should broadcast announcements to listeners', async () => {
    const ann = await service.postAnnouncement('Urgent Notice', 'Hall 2 shift', 'Urgent');
    expect(ann.id).toBeDefined();
    expect(ann.title).toBe('Urgent Notice');

    const allAnn = await service.getAnnouncements();
    expect(allAnn.some(a => a.title === 'Urgent Notice')).toBe(true);
  });
});
