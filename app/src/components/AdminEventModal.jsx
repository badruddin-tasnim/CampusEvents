import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Sparkles, Check, AlertCircle, Trash2 } from 'lucide-react';
import EventFactory from '../patterns/EventFactory.js';

export default function AdminEventModal({
  isOpen,
  onClose,
  onSave,
  onDeleteEvent,
  eventToEdit
}) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    description: '',
    date: '',
    time: '10:00 AM',
    venue: '',
    capacity: 100,
    organizer: 'Dept of CSE, RUET',
    imageUrl: '',
    speaker: '',
    prerequisites: '',
    performers: '',
    teamSize: 1,
    materialsRequired: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || '',
        category: eventToEdit.category || 'Academic',
        description: eventToEdit.description || '',
        date: eventToEdit.date || '',
        time: eventToEdit.time || '10:00 AM',
        venue: eventToEdit.venue || '',
        capacity: eventToEdit.capacity || 100,
        organizer: eventToEdit.organizer || 'Dept of CSE, RUET',
        imageUrl: eventToEdit.imageUrl || '',
        speaker: eventToEdit.speaker || '',
        prerequisites: eventToEdit.prerequisites || '',
        performers: Array.isArray(eventToEdit.performers) ? eventToEdit.performers.join(', ') : '',
        teamSize: eventToEdit.teamSize || 1,
        materialsRequired: Array.isArray(eventToEdit.materialsRequired) ? eventToEdit.materialsRequired.join(', ') : ''
      });
    } else {
      setFormData({
        title: '',
        category: 'Academic',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        venue: 'RUET Central Auditorium',
        capacity: 100,
        organizer: 'Dept of CSE, RUET',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        speaker: 'Dr. Al-Mamun (Professor, CSE RUET)',
        prerequisites: 'Open to all RUET students',
        performers: '',
        teamSize: 1,
        materialsRequired: ''
      });
    }
    setError('');
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Pre-validation using the Factory Pattern
    const payload = {
      ...formData,
      capacity: Number(formData.capacity),
      teamSize: Number(formData.teamSize),
      materialsRequired: formData.materialsRequired ? formData.materialsRequired.split(',').map(s => s.trim()) : [],
      performers: formData.performers ? formData.performers.split(',').map(s => s.trim()) : []
    };

    const dummyInst = EventFactory.createEvent(formData.category, payload);
    const validation = dummyInst.validate();
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    try {
      setSubmitting(true);
      await onSave(payload, eventToEdit?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">
              {eventToEdit ? 'Edit Campus Event' : 'Create New Campus Event'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">Administrator Event Management Control</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(85vh-10rem)] overflow-y-auto">
          
          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Event Category (Factory Pattern Variant)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EventFactory.getAvailableCategories().filter(c => c !== 'General').map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    formData.category === cat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. RUET Tech Fiesta 2026"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief overview and schedule details..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Date, Time, Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="10:00 AM"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Seat Quota *</label>
              <input
                type="number"
                name="capacity"
                min="1"
                required
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Venue & Organizer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Venue *</label>
              <input
                type="text"
                name="venue"
                required
                value={formData.venue}
                onChange={handleChange}
                placeholder="RUET Auditorium / Lab 3"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organizer Club / Dept</label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="Dept of CSE / Computer Club"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Category-Specific Form Fields (Polymorphism) */}
          {formData.category === 'Academic' && (
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
              <label className="block text-[11px] font-bold text-blue-900 uppercase">Speaker / Guest Lecturer</label>
              <input
                type="text"
                name="speaker"
                value={formData.speaker}
                onChange={handleChange}
                placeholder="e.g. Dr. Md. Al-Mamun"
                className="w-full px-3 py-1.5 text-xs bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {formData.category === 'Workshop' && (
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 space-y-2">
              <label className="block text-[11px] font-bold text-amber-900 uppercase">Materials Required (Comma separated)</label>
              <input
                type="text"
                name="materialsRequired"
                value={formData.materialsRequired}
                onChange={handleChange}
                placeholder="Laptop, Python 3.10+, VS Code"
                className="w-full px-3 py-1.5 text-xs bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          )}

          {formData.category === 'Sports' && (
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
              <label className="block text-[11px] font-bold text-emerald-900 uppercase">Team Size (Players)</label>
              <input
                type="number"
                name="teamSize"
                min="1"
                value={formData.teamSize}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              {eventToEdit && onDeleteEvent && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${eventToEdit.title}"?`)) {
                      onDeleteEvent(eventToEdit.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-300 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Event</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{submitting ? 'Saving...' : eventToEdit ? 'Save Changes' : 'Publish Event'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
