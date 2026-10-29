import React from 'react';
import { X, Ticket, Calendar, Clock, MapPin, Trash2, QrCode } from 'lucide-react';

export default function MyBookingsModal({
  isOpen,
  onClose,
  rsvps,
  onCancelRsvp
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">My Confirmed Tickets</h3>
              <p className="text-xs text-slate-500 font-medium">Your active campus event reservations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(85vh-8rem)] overflow-y-auto space-y-4">
          {rsvps.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Ticket className="w-12 h-12 mx-auto stroke-[1.2] mb-3 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No event reservations yet</p>
              <p className="text-xs text-slate-400 mt-1">Browse the campus feed and click 'RSVP Now' to secure your seat.</p>
            </div>
          ) : (
            rsvps.map((rsvp) => (
              <div 
                key={rsvp.id}
                className="relative bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-indigo-300 transition-all overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left accent strip */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600" />

                <div className="space-y-1 pl-2">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {rsvp.eventCategory || 'Campus Event'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800">{rsvp.eventTitle}</h4>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      {rsvp.eventDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      {rsvp.eventTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {rsvp.eventVenue}
                    </span>
                  </div>
                </div>

                {/* Right Ticket Barcode & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-2 shrink-0">
                  <div className="flex items-center gap-2 text-right">
                    <QrCode className="w-8 h-8 text-slate-700 p-1 bg-slate-100 rounded-lg" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Pass Code</p>
                      <p className="font-mono text-xs font-bold text-indigo-600">{rsvp.ticketCode}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this reservation and release your seat?')) {
                        onCancelRsvp(rsvp.id);
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 hover:underline pt-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Cancel Ticket</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total passes: <strong>{rsvps.length}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
