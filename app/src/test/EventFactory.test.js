import { describe, it, expect } from 'vitest';
import EventFactory, {
  AcademicEvent,
  CulturalEvent,
  SportsEvent,
  WorkshopEvent,
  CampusEvent
} from '../patterns/EventFactory.js';

describe('Design Pattern (Creational): EventFactory TDD Suite', () => {
  it('should instantiate an AcademicEvent with default capacity and speaker attributes', () => {
    const event = EventFactory.createEvent('Academic', {
      title: 'CSE Research Colloquium',
      speaker: 'Dr. Md. Al-Mamun',
      capacity: 120
    });

    expect(event).toBeInstanceOf(AcademicEvent);
    expect(event).toBeInstanceOf(CampusEvent);
    expect(event.category).toBe('Academic');
    expect(event.speaker).toBe('Dr. Md. Al-Mamun');
    expect(event.capacity).toBe(120);
    expect(event.getBadgeColor()).toContain('blue');
  });

  it('should instantiate a WorkshopEvent with materials and certificate status', () => {
    const event = EventFactory.createEvent('Workshop', {
      title: 'React & Vite Mastery',
      materialsRequired: ['Laptop', 'VS Code'],
      certificateProvided: true
    });

    expect(event).toBeInstanceOf(WorkshopEvent);
    expect(event.category).toBe('Workshop');
    expect(event.certificateProvided).toBe(true);
    expect(event.materialsRequired).toContain('Laptop');
    expect(event.getBadgeColor()).toContain('amber');
  });

  it('should instantiate a SportsEvent and validate minimum team size', () => {
    const validSportsEvent = EventFactory.createEvent('Sports', {
      title: 'Inter-Year Badminton Cup',
      teamSize: 2
    });
    expect(validSportsEvent).toBeInstanceOf(SportsEvent);
    expect(validSportsEvent.validate().valid).toBe(true);

    const invalidSportsEvent = EventFactory.createEvent('Sports', {
      title: 'Badminton',
      teamSize: 0
    });
    expect(invalidSportsEvent.validate().valid).toBe(false);
    expect(invalidSportsEvent.validate().message).toMatch(/team size/i);
  });

  it('should correctly calculate available seats and full capacity status', () => {
    const event = EventFactory.createEvent('Cultural', {
      title: 'Spring Acoustic Gala',
      capacity: 50,
      registeredCount: 48
    });

    expect(event).toBeInstanceOf(CulturalEvent);
    expect(event.hasAvailableSeats()).toBe(true);
    expect(event.getAvailableSeats()).toBe(2);

    // Fill the remaining seats
    event.registeredCount = 50;
    expect(event.hasAvailableSeats()).toBe(false);
    expect(event.getAvailableSeats()).toBe(0);
  });
});
