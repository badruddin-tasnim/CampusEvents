import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  GraduationCap, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Star, 
  Send,
  Ticket
} from 'lucide-react';

export default function EventDetailModal({
  event,
  onClose,
  onRsvp,
  isUserBooked,
  userReservation,
  currentUser,
  onOpenAuth
}) {
  const [reviews, setReviews] = useState([
    { id: 1, user: 'Tashfik (CSE 21)', rating: 5, comment: 'Attended the last edition. Super informative session for competitive programmers!' },
    { id: 2, user: 'Nafisa (EEE 22)', rating: 5, comment: 'Great campus initiative. Looking forward to attending the hands-on segment.' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  if (!event) return null;

  const seatsLeft = event.getAvailableSeats ? event.getAvailableSeats() : Math.max(0, event.capacity - event.registeredCount);
  const isFull = seatsLeft <= 0;

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const rev = {
      id: Date.now(),
      user: currentUser ? (currentUser.displayName || currentUser.email) : 'RUET Student',
      rating: newRating,
      comment: newComment.trim()
    };
    setReviews([rev, ...reviews]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 w-full bg-slate-900">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-5 left-6 right-6">
            <span className="inline-block px-3 py-1 mb-2 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm">
              {event.category}
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {event.title}
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Organized by: {event.organizer}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[calc(85vh-16rem)] overflow-y-auto">
          
          {/* Key Quick Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Date</p>
                <p className="font-semibold">{event.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Time</p>
                <p className="font-semibold">{event.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700 col-span-2 sm:col-span-1">
              <Users className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Seats</p>
                <p className="font-semibold">{event.registeredCount} / {event.capacity} booked</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700 col-span-2 sm:col-span-3 pt-2 border-t border-slate-200/60">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Venue</p>
                <p className="font-semibold">{event.venue}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About This Event</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Polymorphic Category Details (Engineered via Factory Pattern) */}
          {event.category === 'Academic' && (
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs space-y-2">
              <div className="flex items-center gap-2 text-blue-900 font-bold">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Academic Session Info</span>
              </div>
              <p><strong className="text-slate-700">Distinguished Speaker:</strong> {event.speaker || 'RUET Faculty Panel'}</p>
              <p><strong className="text-slate-700">Eligibility / Prerequisites:</strong> {event.prerequisites || 'Open to all engineering students'}</p>
            </div>
          )}

          {event.category === 'Workshop' && (
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Hands-on Lab Guidelines</span>
              </div>
              <p><strong className="text-slate-700">Required Items:</strong> {Array.isArray(event.materialsRequired) ? event.materialsRequired.join(', ') : 'Laptop & charger'}</p>
              <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Award className="w-4 h-4" /> Official RUET E-Certificate provided upon completion
              </p>
            </div>
          )}

          {event.category === 'Sports' && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span>Tournament Details</span>
              </div>
              <p><strong className="text-slate-700">Team Size:</strong> {event.teamSize || 1} players per registration</p>
              <p><strong className="text-slate-700">Format:</strong> {event.tournamentType || 'Direct Knockout'}</p>
            </div>
          )}

          {/* User Booking Status or Ticket Display */}
          {isUserBooked && userReservation && (
            <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border-2 border-indigo-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <Ticket className="w-5 h-5 text-indigo-600" />
                  <span>Your Confirmed Ticket</span>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-600 text-white">
                  Active Pass
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-indigo-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Booking Reference</p>
                  <p className="font-mono font-extrabold text-sm text-indigo-700">{userReservation.ticketCode}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Attendee Name</p>
                  <p className="font-semibold text-xs text-slate-700">{userReservation.userName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
                  <p className="font-bold text-xs text-emerald-600">CONFIRMED</p>
                </div>
              </div>
            </div>
          )}

          {/* Attendees Feedback & Reviews Module */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Attendee Reviews & Q&A</span>
              <span className="text-slate-500 font-normal">({reviews.length} comments)</span>
            </h4>

            {/* Submit Comment */}
            <form onSubmit={handleAddReview} className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-500 font-medium">Your Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share feedback or ask organizers a question..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-2.5">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{rev.user}</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            {seatsLeft > 0 ? `${seatsLeft} spots open` : 'Event sold out'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Close
            </button>

            {!currentUser ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
              >
                Sign In to RSVP
              </button>
            ) : isUserBooked ? (
              <button
                disabled
                className="px-4 py-2 text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-1.5 cursor-default"
              >
                <CheckCircle2 className="w-4 h-4" /> Already Registered
              </button>
            ) : isFull ? (
              <button
                disabled
                className="px-4 py-2 text-xs font-semibold bg-slate-200 text-slate-400 rounded-xl cursor-not-allowed"
              >
                Registration Closed
              </button>
            ) : (
              <button
                onClick={() => onRsvp(event)}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
              >
                Confirm Spot (One-Click)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
