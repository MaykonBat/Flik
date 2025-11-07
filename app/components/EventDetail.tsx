/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Event } from "../types/event";

interface EventDetailProps {
  eventId: string;
  currentUserFid?: number;
  onRsvp?: (eventId: string) => void;
  onCancelRsvp?: (eventId: string) => void;
}

export function EventDetail({
  eventId,
  currentUserFid,
  onRsvp,
  onCancelRsvp,
}: EventDetailProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const data = await response.json();
        setEvent(data.event);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRsvp = () => {
    if (!currentUserFid) {
      alert("Please authenticate to RSVP");
      return;
    }
    if (onRsvp) {
      onRsvp(eventId);
    }
  };

  const handleCancelRsvp = () => {
    if (!currentUserFid) {
      return;
    }
    if (onCancelRsvp) {
      onCancelRsvp(eventId);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[900px] mx-auto py-8 px-4">
        <div className="text-center py-12 px-4 text-white/80 text-lg">Loading event...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="w-full max-w-[900px] mx-auto py-8 px-4">
        <div className="text-center py-12 px-4 text-[#ff6b6b] text-lg">{error || "Event not found"}</div>
        <button 
          onClick={() => router.back()} 
          className="bg-white/10 border-2 border-white/20 text-white px-6 py-3 rounded-lg cursor-pointer text-base font-semibold mb-8 transition-all duration-300 backdrop-blur-[10px] hover:bg-white/15 hover:border-white/30 hover:-translate-x-1"
        >
          Go Back
        </button>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();
  const isUserAttending = currentUserFid
    ? event.attendees.includes(currentUserFid)
    : false;
  const isFull = event.maxAttendees
    ? event.attendees.length >= event.maxAttendees
    : false;
  const canRsvp = !isPastEvent && !isFull && !isUserAttending;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="w-full max-w-[900px] mx-auto py-8 px-4 md:px-4">
      <button 
        onClick={() => router.back()} 
        className="bg-white/10 border-2 border-white/20 text-white px-6 py-3 rounded-lg cursor-pointer text-base font-semibold mb-8 transition-all duration-300 backdrop-blur-[10px] hover:bg-white/15 hover:border-white/30 hover:-translate-x-1"
      >
        ← Back
      </button>

      {event.imageUrl && (
        <div className="w-full h-[400px] md:h-[400px] rounded-2xl overflow-hidden mb-8 bg-white/5">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <article className="bg-white/5 border-2 border-white/10 rounded-2xl p-8 md:p-8 backdrop-blur-[10px]">
        <header className="mb-8">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h1 className="text-4xl md:text-[2.5rem] font-bold text-white m-0 leading-tight flex-1">{event.title}</h1>
            {event.category && (
              <span className="bg-[rgba(247,217,84,0.2)] text-[#f7d954] px-4 py-2 rounded-xl text-sm font-semibold uppercase whitespace-nowrap self-start">{event.category}</span>
            )}
          </div>
          {event.creatorName && (
            <p className="text-white/70 text-base m-0">
              Created by <strong className="text-white font-semibold">{event.creatorName}</strong>
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 mb-8 p-6 bg-white/3 rounded-xl">
          <div className="flex items-start gap-4">
            <span className="text-2xl flex-shrink-0">📅</span>
            <div className="flex flex-col gap-1">
              <span className="text-white/60 text-xs uppercase tracking-wider font-semibold">Date & Time</span>
              <span className="text-white text-base font-medium">{formatDate(eventDate)}</span>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-2xl flex-shrink-0">📍</span>
            <div className="flex flex-col gap-1">
              <span className="text-white/60 text-xs uppercase tracking-wider font-semibold">Location</span>
              <span className="text-white text-base font-medium">{event.location}</span>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-2xl flex-shrink-0">👥</span>
            <div className="flex flex-col gap-1">
              <span className="text-white/60 text-xs uppercase tracking-wider font-semibold">Attendees</span>
              <span className="text-white text-base font-medium">
                {event.attendees.length}
                {event.maxAttendees && ` / ${event.maxAttendees}`}
              </span>
            </div>
          </div>
          {event.price !== undefined && (
            <div className="flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">💰</span>
              <div className="flex flex-col gap-1">
                <span className="text-white/60 text-xs uppercase tracking-wider font-semibold">Price</span>
                <span className="text-white text-base font-medium">
                  {event.price === 0 ? "Free" : `${event.price} USDC`}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">About</h2>
          <p className="text-white/80 text-lg leading-relaxed m-0">{event.description}</p>
        </div>

        {!isPastEvent && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <button
              className={`w-full py-4 px-8 rounded-xl font-bold text-lg cursor-pointer transition-all duration-300 uppercase tracking-wide ${
                isUserAttending
                  ? "bg-[#f7d954] text-black border-2 border-[#f7d954] hover:bg-[#f5d73a] hover:border-[#f5d73a] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(247,217,84,0.3)]"
                  : !canRsvp && !isUserAttending
                  ? "opacity-50 cursor-not-allowed bg-[rgba(247,217,84,0.2)] text-[#f7d954] border-2 border-[rgba(247,217,84,0.3)]"
                  : "bg-[rgba(247,217,84,0.2)] text-[#f7d954] border-2 border-[rgba(247,217,84,0.3)] hover:bg-[rgba(247,217,84,0.3)] hover:border-[rgba(247,217,84,0.5)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(247,217,84,0.3)]"
              }`}
              onClick={isUserAttending ? handleCancelRsvp : handleRsvp}
              disabled={!canRsvp && !isUserAttending}
              aria-label={isUserAttending ? "Cancel RSVP" : "RSVP to event"}
            >
              {isUserAttending
                ? "✓ Going"
                : isFull
                ? "Event Full"
                : "RSVP to Event"}
            </button>
          </div>
        )}

        {isPastEvent && (
          <div className="mt-8 p-6 bg-[rgba(255,107,107,0.1)] border-2 border-[rgba(255,107,107,0.2)] rounded-xl text-center text-white/80">
            <p className="m-0">This event has already passed.</p>
          </div>
        )}
      </article>
    </div>
  );
}
