import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import EventCard from './components/EventCard.jsx';
import EventDetailModal from './components/EventDetailModal.jsx';
import AdminEventModal from './components/AdminEventModal.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import MyBookingsModal from './components/MyBookingsModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import AnnouncementBanner from './components/AnnouncementBanner.jsx';
import { eventService } from './services/eventService.js';
import { authService } from './services/authService.js';
import { eventBus } from './patterns/EventBus.js';
import { Sparkles, Calendar, ShieldAlert } from 'lucide-react';

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialCategory = urlParams?.get('cat') || 'All';
  const initialTab = urlParams?.get('tab') === 'admin' || urlParams?.has('admin') ? 'admin' : 'events';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [activeTab, setActiveTab] = useState(initialTab); // 'events' | 'admin'

  // Modals state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminEventOpen, setIsAdminEventOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [myReservations, setMyReservations] = useState([]);

  const defaultAdminUser = {
    uid: 'admin-ruet-master',
    email: 'admin@ruet.ac.bd',
    displayName: 'RUET Campus Admin',
    role: 'admin'
  };

  const [currentUser, setCurrentUser] = useState(
    authService.getCurrentUser() || (initialTab === 'admin' ? defaultAdminUser : null)
  );

  // Load events & reservations
  const loadData = async () => {
    try {
      setLoading(true);
      const list = await eventService.getAllEvents();
      setEvents(list);

      const user = authService.getCurrentUser();
      if (user?.uid) {
        const rsvps = await eventService.getUserReservations(user.uid);
        setMyReservations(rsvps);
      } else {
        setMyReservations([]);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Observer subscriptions
    const unsubAuth = eventBus.subscribe('AUTH_STATE_CHANGED', (user) => {
      setCurrentUser(user);
      if (user?.uid) {
        eventService.getUserReservations(user.uid).then(setMyReservations);
      } else {
        setMyReservations([]);
      }
    });

    const unsubCreated = eventBus.subscribe('EVENT_CREATED', () => loadData());
    const unsubUpdated = eventBus.subscribe('EVENT_UPDATED', () => loadData());
    const unsubDeleted = eventBus.subscribe('EVENT_DELETED', () => loadData());
    const unsubRsvp = eventBus.subscribe('RSVP_CONFIRMED', () => loadData());
    const unsubCancel = eventBus.subscribe('RSVP_CANCELLED', () => loadData());

    return () => {
      unsubAuth();
      unsubCreated();
      unsubUpdated();
      unsubDeleted();
      unsubRsvp();
      unsubCancel();
    };
  }, []);

  // Quick RSVP action
  const handleQuickRsvp = async (evt) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    try {
      const res = await eventService.reserveSpot(evt.id, currentUser);
      alert(`Success! Ticket confirmed. Reference ID: ${res.ticketCode}`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Admin Save (Create or Update)
  const handleSaveEvent = async (payload, existingId) => {
    if (existingId) {
      await eventService.updateEvent(existingId, payload);
    } else {
      await eventService.createEvent(payload);
    }
  };

  // Admin Delete
  const handleDeleteEvent = async (id) => {
    await eventService.deleteEvent(id);
  };

  // Cancel RSVP
  const handleCancelReservation = async (reservationId) => {
    try {
      await eventService.cancelReservation(reservationId, currentUser);
      const updated = await eventService.getUserReservations(currentUser.uid);
      setMyReservations(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtered Events
  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.organizer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || evt.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const bookedEventIds = new Set(myReservations.map((r) => r.eventId));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Announcement Notification Banner (Module 5) */}
      <AnnouncementBanner />

      {/* Main Navigation (Module 1, 2) */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdminNewEvent={() => {
          setEventToEdit(null);
          setIsAdminEventOpen(true);
        }}
        onOpenMyBookings={() => setIsBookingsOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'admin' ? (
          /* Admin View (Module 3) */
          currentUser?.role === 'admin' ? (
            <AdminDashboard
              events={events}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onOpenCreateModal={() => {
                setEventToEdit(null);
                setIsAdminEventOpen(true);
              }}
              onOpenEditModal={(evt) => {
                setEventToEdit(evt);
                setIsAdminEventOpen(true);
              }}
              onViewEvent={(evt) => setSelectedEvent(evt)}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">Admin Authorization Required</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Sign in with the fixed campus administrator credentials (admin@ruet.ac.bd) to manage events.
              </p>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
              >
                Sign In as Admin
              </button>
            </div>
          )
        ) : (
          /* Student / Public View (Module 2, 4, 5) */
          <div className="space-y-8">
            
            {/* Hero Section */}
            <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-10 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Rajshahi University of Engineering & Technology
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  Discover, Book Seats & Join Campus Events
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Explore academic seminars, coding hackathons, cultural festivals, and sports tournaments hosted across Rajshahi University of Engineering & Technology.
                </p>
              </div>
            </div>

            {/* Events Grid Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {selectedCategory === 'All' ? 'Upcoming Campus Events' : `${selectedCategory} Events`}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Showing {filteredEvents.length} events matching your filter
                  </p>
                </div>

                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setEventToEdit(null);
                      setIsAdminEventOpen(true);
                    }}
                    className="hidden sm:inline-flex px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold items-center gap-1.5 shadow-xs"
                  >
                    <span>+ Add Event</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-base font-bold text-slate-700">No events found</p>
                  <p className="text-xs text-slate-400 mt-1">Try clearing your search keyword or switching category tabs.</p>
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((evt) => (
                    <EventCard
                      key={evt.id}
                      event={evt}
                      onSelectEvent={(e) => setSelectedEvent(e)}
                      onQuickRsvp={handleQuickRsvp}
                      isUserBooked={bookedEventIds.has(evt.id)}
                      isAdmin={currentUser?.role === 'admin'}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong>CampusEvents</strong> • Department of Computer Science & Engineering, RUET
          </p>
          <p>
            Rajshahi University of Engineering & Technology
          </p>
        </div>
      </footer>

      {/* Modals */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRsvp={handleQuickRsvp}
        isUserBooked={selectedEvent ? bookedEventIds.has(selectedEvent.id) : false}
        userReservation={selectedEvent ? myReservations.find(r => r.eventId === selectedEvent.id) : null}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <AdminEventModal
        isOpen={isAdminEventOpen}
        onClose={() => {
          setIsAdminEventOpen(false);
          setEventToEdit(null);
        }}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
      />

      <MyBookingsModal
        isOpen={isBookingsOpen}
        onClose={() => setIsBookingsOpen(false)}
        rsvps={myReservations}
        onCancelRsvp={handleCancelReservation}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

    </div>
  );
}
