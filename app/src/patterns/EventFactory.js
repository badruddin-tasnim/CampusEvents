/**
 * DESIGN PATTERN 2: FACTORY PATTERN (Creational Category)
 *
 * Problem Solved:
 * Encapsulates the instantiation logic of distinct campus event types (Academic,
 * Cultural, Sports, Workshop). Centralizes validation rules, default quotas, and custom
 * badge logic so UI components don't need to know concrete class details.
 *
 * Rejected Alternative:
 * Direct object literal instantiation with massive conditional switch/case blocks
 * duplicated across create/edit forms and display components. This violated the Open/Closed
 * Principle (OCP) and made extending with new event categories prone to bugs.
 */

// Base Class
export class CampusEvent {
  constructor(data = {}) {
    this.id = data.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.title = data.title || 'Untitled Campus Event';
    this.description = data.description || '';
    this.category = data.category || 'General';
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.time = data.time || '10:00 AM';
    this.venue = data.venue || 'RUET Central Auditorium';
    this.capacity = Number(data.capacity) || 50;
    this.registeredCount = Number(data.registeredCount) || 0;
    this.organizer = data.organizer || 'RUET Students Association';
    this.imageUrl = data.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
    this.tags = Array.isArray(data.tags) ? data.tags : [];
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  hasAvailableSeats() {
    return this.registeredCount < this.capacity;
  }

  getAvailableSeats() {
    return Math.max(0, this.capacity - this.registeredCount);
  }

  getBadgeColor() {
    return 'bg-gray-100 text-gray-800 border-gray-200';
  }

  validate() {
    if (!this.title || this.title.trim() === "") return { valid: false, message: 'Title cannot be empty string.' };
    if (this.capacity <= 0) return { valid: false, message: 'Capacity must be greater than zero.' };
    if (!this.venue.trim()) return { valid: false, message: 'Venue is required.' };
    return { valid: true };
  }
}

// Concrete Product 1: Academic Seminar / Conference
export class AcademicEvent extends CampusEvent {
  constructor(data = {}) {
    super(data);
    this.category = 'Academic';
    this.speaker = data.speaker || 'Guest Academician';
    this.prerequisites = data.prerequisites || 'Open to all RUET students';
    this.capacity = Number(data.capacity) || 120; // Default academic seminar capacity
  }

  getBadgeColor() {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }

  validate() {
    const base = super.validate();
    if (!base.valid) return base;
    if (!this.speaker.trim()) return { valid: false, message: 'Academic events require a speaker or instructor name.' };
    return { valid: true };
  }
}

// Concrete Product 2: Cultural Fest / Performance
export class CulturalEvent extends CampusEvent {
  constructor(data = {}) {
    super(data);
    this.category = 'Cultural';
    this.performers = Array.isArray(data.performers) ? data.performers : ['RUET Cultural Club'];
    this.dressCode = data.dressCode || 'Traditional / Semi-formal';
    this.capacity = Number(data.capacity) || 300; // Large hall
  }

  getBadgeColor() {
    return 'bg-purple-50 text-purple-700 border-purple-200';
  }
}

// Concrete Product 3: Sports Tournament / Meet
export class SportsEvent extends CampusEvent {
  constructor(data = {}) {
    super(data);
    this.category = 'Sports';
    this.teamSize = data.teamSize !== undefined ? Number(data.teamSize) : 1;
    this.tournamentType = data.tournamentType || 'Knockout';
    this.capacity = Number(data.capacity) || 80;
  }

  getBadgeColor() {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  validate() {
    const base = super.validate();
    if (!base.valid) return base;
    if (this.teamSize < 1) return { valid: false, message: 'Team size must be at least 1 player.' };
    return { valid: true };
  }
}

// Concrete Product 4: Technical Workshop / Hands-on Bootcamp
export class WorkshopEvent extends CampusEvent {
  constructor(data = {}) {
    super(data);
    this.category = 'Workshop';
    this.materialsRequired = Array.isArray(data.materialsRequired) ? data.materialsRequired : ['Laptop with Node.js / VS Code'];
    this.certificateProvided = data.certificateProvided ?? true;
    this.capacity = Number(data.capacity) || 40; // Lab seating limitation
  }

  getBadgeColor() {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
}

// The Factory
export class EventFactory {
  static createEvent(category = 'General', data = {}) {
    const cat = (category || '').toLowerCase().trim();
    switch (cat) {
      case 'academic':
        return new AcademicEvent(data);
      case 'cultural':
        return new CulturalEvent(data);
      case 'sports':
        return new SportsEvent(data);
      case 'workshop':
        return new WorkshopEvent(data);
      default:
        return new CampusEvent(data);
    }
  }

  static getAvailableCategories() {
    return ['Academic', 'Cultural', 'Sports', 'Workshop', 'General'];
  }
}

export default EventFactory;
