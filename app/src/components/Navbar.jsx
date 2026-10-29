import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Ticket, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  PlusCircle, 
  Bell, 
  UserCheck 
} from 'lucide-react';
import { authService } from '../services/authService.js';
import { eventService } from '../services/eventService.js';
import { eventBus } from '../patterns/EventBus.js';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onOpenAuth,
  onOpenAdminNewEvent,
  onOpenMyBookings,
  activeTab,
  setActiveTab
}) {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    // Observer pattern: Listen for auth state changes
    const unsubAuth = eventBus.subscribe('AUTH_STATE_CHANGED', (user) => {
      setCurrentUser(user);
      updateBookingCount(user);
    });

    // Observer pattern: Listen for RSVP updates
    const unsubRsvp = eventBus.subscribe('RSVP_CONFIRMED', () => {
      updateBookingCount(authService.getCurrentUser());
    });

    const unsubCancel = eventBus.subscribe('RSVP_CANCELLED', () => {
      updateBookingCount(authService.getCurrentUser());
    });

    updateBookingCount(currentUser);

    return () => {
      unsubAuth();
      unsubRsvp();
      unsubCancel();
    };
  }, []);

  const updateBookingCount = async (user) => {
    if (user?.uid) {
      const rsvps = await eventService.getUserReservations(user.uid);
      setBookingCount(rsvps.length);
    } else {
      setBookingCount(0);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setActiveTab('events');
  };

  const categories = ['All', 'Academic', 'Cultural', 'Sports', 'Workshop'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('events')} 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-900 to-slate-900 bg-clip-text text-transparent">
                  CampusEvents
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  RUET
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Campus Event Management System</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hackathons, seminars, sports, fests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Action Buttons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser?.role === 'admin' ? (
              <>
                <button
                  onClick={() => setActiveTab(activeTab === 'admin' ? 'events' : 'admin')}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                    activeTab === 'admin'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </button>

                <button
                  onClick={onOpenAdminNewEvent}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">New Event</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenMyBookings}
                className="relative flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
              >
                <Ticket className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">My Tickets</span>
                {bookingCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                    {bookingCount}
                  </span>
                )}
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <img
                  src={currentUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.displayName}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                />
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-bar: Category Tabs & Mobile Search */}
        <div className="py-2.5 flex items-center justify-between border-t border-slate-100 overflow-x-auto gap-2 no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Rajshahi University of Engineering & Technology
          </div>
        </div>
      </div>
    </header>
  );
}
