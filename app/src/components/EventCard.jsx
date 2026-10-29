import React from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EventCard({
  event,
  onSelectEvent,
  onQuickRsvp,
  isUserBooked = false,
  isAdmin = false
}) {
  const seatsLeft = event.getAvailableSeats ? event.getAvailableSeats() : Math.max(0, event.capacity - event.registeredCount);
  const isFull = seatsLeft <= 0;
  const fillPercentage = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  // Determine badge styling dynamically from Factory method
  const badgeClasses = event.getBadgeColor ? event.getBadgeColor() : 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Event Header Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Category Badge (from Factory) */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-lg border backdrop-blur-md shadow-xs ${badgeClasses}`}>
          {event.category}
        </span>

        {/* Seats Remaining Pill */}
        <div className="absolute top-3 right-3">
          {isFull ? (
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500 text-white shadow-xs flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Full
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500 text-white shadow-xs">
              {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
            </span>
          )}
        </div>

        {/* Title over gradient */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-indigo-200 transition-colors">
            {event.title}
          </h3>
          <p className="text-xs text-slate-200 font-medium line-clamp-1">{event.organizer}</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-4">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Meta Details */}
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="font-medium text-slate-700">{event.date}</span>
            <span className="text-slate-300">•</span>
            <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              Bookings: {event.registeredCount} / {event.capacity}
            </span>
            <span>{fillPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                fillPercentage >= 90
                  ? 'bg-rose-500'
                  : fillPercentage >= 70
                  ? 'bg-amber-500'
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
          <button
            onClick={() => onSelectEvent(event)}
            className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {isAdmin ? 'View Details (Admin)' : 'Details'}
          </button>

          {!isAdmin && (
            isUserBooked ? (
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Booked
              </button>
            ) : isFull ? (
              <button
                disabled
                className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-400 cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : (
              <button
                onClick={() => onQuickRsvp(event)}
                className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                Book Your Seat
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
