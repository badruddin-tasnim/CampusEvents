import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Megaphone, 
  Users, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  Send 
} from 'lucide-react';
import { eventService } from '../services/eventService.js';

export default function AdminDashboard({
  events,
  onOpenCreateModal,
  onOpenEditModal,
  onViewEvent,
  onDeleteEvent
}) {
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcementCategory, setAnnouncementCategory] = useState('Urgent');
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // Compute metrics
  const totalEvents = events.length;
  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
  const totalBooked = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
  const fillRate = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;

    try {
      setPosting(true);
      await eventService.postAnnouncement(announcementTitle, announcementMsg, announcementCategory);
      setAnnouncementTitle('');
      setAnnouncementMsg('');
      setPostSuccess(true);
      setTimeout(() => setPostSuccess(false), 3000);
    } catch (err) {
      alert('Error posting announcement: ' + err.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Metrics */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            RUET Campus Administrator Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Event Management & Attendance Control
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Create academic seminars, manage student seat quotas, publish campus-wide bulletins, and track live RSVP attendance across all university departments.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
              <Calendar className="w-4 h-4" /> Total Events
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1">{totalEvents}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
              <Users className="w-4 h-4" /> RSVPs Booked
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1">{totalBooked}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
              <TrendingUp className="w-4 h-4" /> Total Capacity
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1">{totalCapacity}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Fill Rate
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1">{fillRate}%</p>
          </div>
        </div>
      </div>

      {/* Grid: Events Table + Broadcast Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Events Management Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">Campus Events Directory</h2>
              <p className="text-xs text-slate-500 font-medium">Manage and audit all listed departmental events</p>
            </div>
            <button
              onClick={onOpenCreateModal}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Event Title</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Registered / Seats</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pl-2 font-semibold text-slate-800 max-w-xs truncate">
                      {evt.title}
                      <span className="block text-[11px] font-normal text-slate-400">{evt.venue}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {evt.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 font-medium whitespace-nowrap">
                      {evt.date}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">{evt.registeredCount} / {evt.capacity}</span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full" 
                            style={{ width: `${Math.min(100, (evt.registeredCount / evt.capacity) * 100)}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-2 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewEvent(evt)}
                          title="Preview Details"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenEditModal(evt)}
                          title="Edit Event"
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${evt.title}"?`)) {
                              onDeleteEvent(evt.id);
                            }
                          }}
                          title="Delete Event"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Broadcast Announcement Module (1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Post Announcement</h3>
                <p className="text-[11px] text-slate-400">Broadcast updates to all students</p>
              </div>
            </div>

            {postSuccess && (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Bulletin broadcasted to EventBus!</span>
              </div>
            )}

            <form onSubmit={handlePostAnnouncement} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Priority</label>
                <select
                  value={announcementCategory}
                  onChange={(e) => setAnnouncementCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Urgent">Urgent / Important</option>
                  <option value="Info">General Info</option>
                  <option value="Venue">Venue / Schedule Change</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hackathon Schedule Update"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Message</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Write clear instructions for attendees..."
                  value={announcementMsg}
                  onChange={(e) => setAnnouncementMsg(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={posting}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{posting ? 'Broadcasting...' : 'Broadcast Bulletin'}</span>
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Powered by <strong>Observer Pattern (EventBus)</strong>: Triggers instant UI state refreshes for active clients.
          </div>
        </div>

      </div>

    </div>
  );
}
