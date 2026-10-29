import { describe, it, expect, vi, beforeEach } from 'vitest';

// MOCKING EXTERNAL DEPENDENCY: Firebase Firestore Database & Network calls
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
import FirebaseConfigManager from '../patterns/FirebaseSingleton.js';

describe('EventService with Dependency Mocks Suite', () => {
  let service;

  beforeEach(() => {
    window.localStorage.clear();
    service = new EventService();
  });

  it('should create a new event using EventFactory and persist it', async () => {
    const eventPayload = {
      title: 'Robotics Bootcamp 2026',
      category: 'Workshop',
      capacity: 30,
      venue: 'Robotics Lab',
      date: '2026-11-12'
    };

    const created = await service.createEvent(eventPayload);
    expect(created.id).toBeDefined();
    expect(created.title).toBe('Robotics Bootcamp 2026');
    expect(created.category).toBe('Workshop');
    expect(created.capacity).toBe(30);

    const fetched = await service.getEventById(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched.title).toBe('Robotics Bootcamp 2026');
  });

  it('should successfully reserve a spot and generate an authentic ticket reference code', async () => {
    const event = await service.createEvent({
      title: 'Inter-Dept Chess Championship',
      category: 'Sports',
      capacity: 16,
      venue: 'Student Lounge',
      date: '2026-11-18'
    });

    const studentUser = {
      uid: 'student_123',
      email: 'student.2203001@ruet.ac.bd',
      displayName: 'Tasnim'
    };

    const reservation = await service.reserveSpot(event.id, studentUser);
    expect(reservation).toBeDefined();
    expect(reservation.status).toBe('CONFIRMED');
    expect(reservation.ticketCode).toMatch(/^RUET-\d{6}$/);

    // Verify event registeredCount was incremented by 1
    const updatedEvent = await service.getEventById(event.id);
    expect(updatedEvent.registeredCount).toBe(1);
    expect(updatedEvent.getAvailableSeats()).toBe(15);
  });

  it('should reject duplicate reservations for the same student on the same event', async () => {
    const event = await service.createEvent({
      title: 'Cybersecurity Seminar',
      category: 'Academic',
      capacity: 100,
      speaker: 'Guest Hacker',
      venue: 'Auditorium'
    });

    const user = { uid: 'stud_456', email: 'alice@ruet.ac.bd' };

    // First reservation succeeds
    await service.reserveSpot(event.id, user);

    // Second reservation must fail
    await expect(service.reserveSpot(event.id, user)).rejects.toThrow(
      /already reserved a ticket/i
    );
  });

  it('should reject reservations when event capacity is fully booked', async () => {
    const event = await service.createEvent({
      title: 'Exclusive Coding Roundtable',
      category: 'Academic',
      capacity: 1,
      registeredCount: 1, // Full capacity reached
      speaker: 'Professor',
      venue: 'Lab 1'
    });

    const user = { uid: 'stud_789', email: 'bob@ruet.ac.bd' };

    await expect(service.reserveSpot(event.id, user)).rejects.toThrow(
      /full capacity/i
    );
  });
});
