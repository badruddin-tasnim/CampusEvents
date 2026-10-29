import FirebaseConfigManager from '../patterns/FirebaseSingleton.js';
import EventFactory from '../patterns/EventFactory.js';
import { eventBus } from '../patterns/EventBus.js';
import { INITIAL_EVENTS, INITIAL_ANNOUNCEMENTS } from './mockData.js';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

const STORAGE_KEY_EVENTS = 'campussync_events_ruet_v1';
const STORAGE_KEY_RSVPS = 'campussync_rsvps_ruet_v1';
const STORAGE_KEY_ANNOUNCEMENTS = 'campussync_announcements_ruet_v1';

export class EventService {
  constructor() {
    this.firebase = FirebaseConfigManager.getInstance();
    this.initializeLocalStorage();
  }

  // Safe fallback storage initializer
  initializeLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (!localStorage.getItem(STORAGE_KEY_EVENTS)) {
        localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(INITIAL_EVENTS));
      }
      if (!localStorage.getItem(STORAGE_KEY_RSVPS)) {
        localStorage.setItem(STORAGE_KEY_RSVPS, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS)) {
        localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
      }
    }
  }

  /**
   * Fetch all events
   */
  async getAllEvents() {
    if (this.firebase.isLive() && this.firebase.getDb()) {
      try {
        const querySnapshot = await getDocs(collection(this.firebase.getDb(), 'events'));
        if (!querySnapshot.empty) {
          const list = [];
          querySnapshot.forEach(docSnap => {
            const raw = { id: docSnap.id, ...docSnap.data() };
            list.push(EventFactory.createEvent(raw.category, raw));
          });
          return list;
        }
      } catch (err) {
        console.warn('Firestore fetch failed, reading from local persistence:', err.message);
      }
    }

    // Local persistent storage fallback
    const rawList = typeof window !== 'undefined' && window.localStorage
      ? JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTS) || '[]')
      : INITIAL_EVENTS;

    return rawList.map(item => EventFactory.createEvent(item.category, item));
  }

  /**
   * Get single event by ID
   */
  async getEventById(id) {
    const events = await this.getAllEvents();
    return events.find(e => e.id === id) || null;
  }

  /**
   * Create a new campus event (Uses EventFactory)
   */
  async createEvent(eventData) {
    // Instantiate via Factory Pattern
    const newEvent = EventFactory.createEvent(eventData.category, eventData);
    const validation = newEvent.validate();
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    if (this.firebase.isLive() && this.firebase.getDb()) {
      try {
        await setDoc(doc(this.firebase.getDb(), 'events', newEvent.id), { ...newEvent });
      } catch (err) {
        console.warn('Firestore write failed, saving to local store:', err.message);
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTS) || '[]');
      existing.unshift({ ...newEvent });
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(existing));
    }

    // Observer notification
    eventBus.publish('EVENT_CREATED', newEvent);
    return newEvent;
  }

  /**
   * Update an existing event
   */
  async updateEvent(id, updatedFields) {
    const current = await this.getEventById(id);
    if (!current) throw new Error('Event not found.');

    const merged = { ...current, ...updatedFields };
    const updatedEvent = EventFactory.createEvent(merged.category, merged);

    if (this.firebase.isLive() && this.firebase.getDb()) {
      try {
        await updateDoc(doc(this.firebase.getDb(), 'events', id), { ...updatedEvent });
      } catch (err) {
        console.warn('Firestore update failed, updating local store:', err.message);
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTS) || '[]');
      const index = existing.findIndex(e => e.id === id);
      if (index !== -1) {
        existing[index] = { ...updatedEvent };
        localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(existing));
      }
    }

    eventBus.publish('EVENT_UPDATED', updatedEvent);
    return updatedEvent;
  }

  /**
   * Delete an event
   */
  async deleteEvent(id) {
    if (this.firebase.isLive() && this.firebase.getDb()) {
      try {
        await deleteDoc(doc(this.firebase.getDb(), 'events', id));
      } catch (err) {
        console.warn('Firestore delete failed, deleting from local store:', err.message);
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTS) || '[]');
      const filtered = existing.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(filtered));
    }

    eventBus.publish('EVENT_DELETED', { id });
    return true;
  }

  /**
   * Reserve a spot / RSVP for an event
   */
  async reserveSpot(eventId, user) {
    if (!user || !user.uid) {
      throw new Error('Authentication required to RSVP.');
    }

    const event = await this.getEventById(eventId);
    if (!event) throw new Error('Event does not exist.');

    if (!event.hasAvailableSeats()) {
      throw new Error('Event is at full capacity. No seats available.');
    }

    const userRsvps = await this.getUserReservations(user.uid);
    const alreadyBooked = userRsvps.some(r => r.eventId === eventId);
    if (alreadyBooked) {
      throw new Error('You have already reserved a ticket for this event.');
    }

    const reservation = {
      id: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      eventId,
      eventTitle: event.title,
      eventVenue: event.venue,
      eventDate: event.date,
      eventTime: event.time,
      eventCategory: event.category,
      userId: user.uid,
      userName: user.displayName || user.email.split('@')[0],
      userEmail: user.email,
      ticketCode: `RUET-${Math.floor(100000 + Math.random() * 900000)}`,
      bookedAt: new Date().toISOString(),
      status: 'CONFIRMED'
    };

    // Save reservation
    if (typeof window !== 'undefined' && window.localStorage) {
      const rsvps = JSON.parse(localStorage.getItem(STORAGE_KEY_RSVPS) || '[]');
      rsvps.unshift(reservation);
      localStorage.setItem(STORAGE_KEY_RSVPS, JSON.stringify(rsvps));
    }

    // Increment registeredCount on the event
    await this.updateEvent(eventId, {
      registeredCount: event.registeredCount + 1
    });

    // Notify observers
    eventBus.publish('RSVP_CONFIRMED', reservation);
    return reservation;
  }

  /**
   * Cancel an existing reservation
   */
  async cancelReservation(reservationId, user) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const rsvps = JSON.parse(localStorage.getItem(STORAGE_KEY_RSVPS) || '[]');
      const target = rsvps.find(r => r.id === reservationId && r.userId === user.uid);
      if (!target) throw new Error('Reservation not found or unauthorized.');

      const remaining = rsvps.filter(r => r.id !== reservationId);
      localStorage.setItem(STORAGE_KEY_RSVPS, JSON.stringify(remaining));

      // Decrement registered count on event
      const event = await this.getEventById(target.eventId);
      if (event && event.registeredCount > 0) {
        await this.updateEvent(target.eventId, {
          registeredCount: event.registeredCount - 1
        });
      }

      eventBus.publish('RSVP_CANCELLED', { reservationId, eventId: target.eventId });
      return true;
    }
    return false;
  }

  /**
   * Get all reservations for a specific user
   */
  async getUserReservations(userId) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const rsvps = JSON.parse(localStorage.getItem(STORAGE_KEY_RSVPS) || '[]');
      return rsvps.filter(r => r.userId === userId);
    }
    return [];
  }

  /**
   * Announcements Module
   */
  async getAnnouncements() {
    if (typeof window !== 'undefined' && window.localStorage) {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS) || '[]');
    }
    return INITIAL_ANNOUNCEMENTS;
  }

  async postAnnouncement(title, message, category = 'General') {
    const newAnnouncement = {
      id: `ann_${Date.now()}`,
      title,
      message,
      category,
      timestamp: 'Just now'
    };
    if (typeof window !== 'undefined' && window.localStorage) {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS) || '[]');
      list.unshift(newAnnouncement);
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(list));
    }
    eventBus.publish('NEW_ANNOUNCEMENT', newAnnouncement);
    return newAnnouncement;
  }
}

export const eventService = new EventService();
export default EventService;
