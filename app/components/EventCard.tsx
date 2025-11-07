/* eslint-disable @next/next/no-img-element */
"use client";

import { Event } from "../types/event";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: Event;
  currentUserFid?: number;
  onRsvp?: (eventId: string) => void;
  onCancelRsvp?: (eventId: string) => void;
}

export function EventCard({
  event,
  currentUserFid,
  onRsvp,
  onCancelRsvp,
}: EventCardProps) {
  const router = useRouter();
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();
  const isUserAttending = currentUserFid
    ? event.attendees.includes(currentUserFid)
    : false;
  const isFull = event.maxAttendees
    ? event.attendees.length >= event.maxAttendees
    : false;
  const canRsvp = !isPastEvent && !isFull && !isUserAttending;

  const handleCardClick = () => {
    router.push(`/events/${event.id}`);
  };

  const handleRsvpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUserAttending && onCancelRsvp) {
      onCancelRsvp(event.id);
    } else if (onRsvp) {
      onRsvp(event.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <article
      className="bg-white/5 border-2 border-white/10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 backdrop-blur-[10px] flex flex-col hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      {event.imageUrl && (
        <div className="w-full h-[200px] overflow-hidden bg-white/5">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl font-bold text-white m-0 flex-1 leading-tight">{event.title}</h3>
          {event.category && (
            <span className="bg-[rgba(247,217,84,0.2)] text-[#f7d954] px-3 py-1 rounded-xl text-xs font-semibold uppercase whitespace-nowrap">{event.category}</span>
          )}
        </div>

        <p className="text-white/70 text-sm leading-relaxed m-0 line-clamp-2">{event.description}</p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-sm mr-1">📅</span>
            <span className="text-white/80">{formatDate(eventDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-sm mr-1">📍</span>
            <span className="text-white/80">{event.location}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-sm">
              👥 {event.attendees.length}
              {event.maxAttendees && ` / ${event.maxAttendees}`}
            </span>
          </div>

          {event.price && (
            <div className="text-[#f7d954] font-semibold text-sm">💰 {event.price} USDC</div>
          )}

          {!isPastEvent && (
            <button
              className={`px-6 py-2 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300 whitespace-nowrap ${
                isUserAttending
                  ? "bg-[#f7d954] text-black border-2 border-[#f7d954] hover:bg-[#f5d73a] hover:border-[#f5d73a] hover:scale-105"
                  : !canRsvp && !isUserAttending
                  ? "opacity-50 cursor-not-allowed bg-[rgba(247,217,84,0.2)] text-[#f7d954] border-2 border-[rgba(247,217,84,0.3)]"
                  : "bg-[rgba(247,217,84,0.2)] text-[#f7d954] border-2 border-[rgba(247,217,84,0.3)] hover:bg-[rgba(247,217,84,0.3)] hover:border-[rgba(247,217,84,0.5)] hover:scale-105"
              }`}
              onClick={handleRsvpClick}
              disabled={!canRsvp && !isUserAttending}
              aria-label={isUserAttending ? "Cancel RSVP" : "RSVP to event"}
            >
              {isUserAttending ? "✓ Going" : isFull ? "Full" : "RSVP"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
