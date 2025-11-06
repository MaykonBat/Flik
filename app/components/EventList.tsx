"use client";

import { Event } from "../types/event";
import { EventCard } from "./EventCard";
import { useEvents } from "../context/EventContext";
import styles from "./EventList.module.css";

interface EventListProps {
  currentUserFid?: number;
  filter?: "upcoming" | "past" | "all";
}

export function EventList({ currentUserFid, filter = "upcoming" }: EventListProps) {
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
    const eventDate = new Date(event.date);
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
      <div className={styles.container}>
        <div className={styles.loading}>Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>No events found</p>
          <p className={styles.emptySubtext}>
            {filter === "upcoming"
              ? "Be the first to create an event!"
              : "Check back later for new events."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
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

