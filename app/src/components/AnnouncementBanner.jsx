import React, { useState, useEffect } from 'react';
import { Megaphone, X, Bell } from 'lucide-react';
import { eventService } from '../services/eventService.js';
import { eventBus } from '../patterns/EventBus.js';

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [closedIds, setClosedIds] = useState([]);

  useEffect(() => {
    // Load initial announcements
    eventService.getAnnouncements().then(setAnnouncements);

    // Observer: Listen for newly posted announcements via EventBus
    const unsub = eventBus.subscribe('NEW_ANNOUNCEMENT', (newAnn) => {
      setAnnouncements(prev => [newAnn, ...prev]);
    });

    return () => unsub();
  }, []);

  const visibleAnnouncements = announcements.filter(a => !closedIds.includes(a.id));
  if (visibleAnnouncements.length === 0) return null;

  const current = visibleAnnouncements[0];

  return (
    <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="p-1 rounded-lg bg-white/20 text-white shrink-0">
            <Megaphone className="w-4 h-4 animate-bounce" />
          </span>
          <div className="text-xs truncate">
            <span className="font-bold mr-2 uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-white/20 text-[10px]">
              {current.category || 'Announcement'}
            </span>
            <span className="font-semibold text-white/95">{current.title}:</span>
            <span className="text-indigo-100 ml-1.5 font-normal">{current.message}</span>
          </div>
        </div>

        <button
          onClick={() => setClosedIds([...closedIds, current.id])}
          className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
