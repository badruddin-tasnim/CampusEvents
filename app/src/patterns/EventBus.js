/**
 * DESIGN PATTERN 3: OBSERVER PATTERN (Behavioral Category)
 *
 * Problem Solved:
 * Enables decoupled, reactive communication between unrelated UI components.
 * For example, when a student RSVPs to an event, the seat counter on the EventCard,
 * the ticket counter badge in the Navbar, and the global Announcement tray automatically
 * react and update without hardcoded dependencies between components.
 *
 * Rejected Alternative:
 * Direct component callbacks or heavy prop-drilling across multi-level component trees.
 * Passing handlers 5 levels down caused unnecessary re-renders and tightly coupled
 * components to each other's internal state.
 */

class EventBus {
  constructor() {
    if (EventBus._instance) {
      return EventBus._instance;
    }
    this.events = new Map();
    EventBus._instance = this;
  }

  static getInstance() {
    if (!EventBus._instance) {
      EventBus._instance = new EventBus();
    }
    return EventBus._instance;
  }

  /**
   * Subscribe an observer callback to a topic
   * @param {string} eventName
   * @param {Function} callback
   * @returns {Function} unsubscribe function
   */
  subscribe(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(callback);

    // Return unsubscribe function for easy cleanup in useEffect
    return () => {
      const subscribers = this.events.get(eventName);
      if (subscribers) {
        this.events.set(
          eventName,
          subscribers.filter(sub => sub !== callback)
        );
      }
    };
  }

  /**
   * Publish an event to all subscribed observers
   * @param {string} eventName
   * @param {any} payload
   */
  publish(eventName, payload) {
    const subscribers = this.events.get(eventName);
    if (subscribers && subscribers.length > 0) {
      subscribers.forEach(callback => {
        try {
          callback(payload);
        } catch (err) {
          console.error(`Observer error in listener for ${eventName}:`, err);
        }
      });
    }
  }

  /**
   * Helper to clear listeners (useful in test teardown)
   */
  clear() {
    this.events.clear();
  }

  static resetInstance() {
    EventBus._instance = null;
  }
}

export const eventBus = EventBus.getInstance();
export default EventBus;
