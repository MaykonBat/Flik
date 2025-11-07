"use client";

import { EventCard } from "./EventCard";
import { useEvents } from "../context/EventContext";

interface EventListProps {
  currentUserFid?: number;
  filter?: "upcoming" | "past" | "all";
}

export function EventList({
  currentUserFid,
  filter = "upcoming",
}: EventListProps) {
  const { events, loading, error, rsvpToEvent, cancelRsvp } = useEvents();

  const handleRsvp = async (eventId: string) => {
    if (!currentUserFid) {
      alert("Please authenticate to RSVP");
      return;
    }
    await rsvpToEvent(eventId, currentUserFid);
  };

  const handleCancelRsvp = async (eventId: string) => {
    if (!currentUserFid) {
      return;
    }
    await cancelRsvp(eventId, currentUserFid);
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date || "");
    const now = new Date();

    if (filter === "upcoming") {
      return eventDate >= now;
    } else if (filter === "past") {
      return eventDate < now;
    }
    return true; // "all"
  });

  if (loading) {
    return (
      <div className="w-full py-4">
        <div className="text-center py-12 px-4 text-white/80">
          Loading events...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-4">
        <div className="text-center py-12 px-4 text-[#ff6b6b]">
          Error: {error}
        </div>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="w-full py-4">
        <div className="text-center py-12 px-4 text-white/80">
          <p>No events found</p>
          <p className="text-white/50 text-sm mt-2">
            {filter === "upcoming"
              ? "Be the first to create an event!"
              : "Check back later for new events."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 md:gap-6 w-full">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            currentUserFid={currentUserFid}
            onRsvp={handleRsvp}
            onCancelRsvp={handleCancelRsvp}
          />
        ))}
      </div>
    </div>
  );
}
