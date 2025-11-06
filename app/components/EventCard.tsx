"use client";

import { Event } from "../types/event";
import styles from "./EventCard.module.css";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: Event;
  currentUserFid?: number;
  onRsvp?: (eventId: string) => void;
  onCancelRsvp?: (eventId: string) => void;
}

export function EventCard({ event, currentUserFid, onRsvp, onCancelRsvp }: EventCardProps) {
  const router = useRouter();
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();
  const isUserAttending = currentUserFid ? event.attendees.includes(currentUserFid) : false;
  const isFull = event.maxAttendees ? event.attendees.length >= event.maxAttendees : false;
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
    <article className={styles.card} onClick={handleCardClick} role="button" tabIndex={0}>
      {event.imageUrl && (
        <div className={styles.imageContainer}>
          <img src={event.imageUrl} alt={event.title} className={styles.image} />
        </div>
      )}
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{event.title}</h3>
          {event.category && (
            <span className={styles.category}>{event.category}</span>
          )}
        </div>

        <p className={styles.description}>{event.description}</p>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>📅</span>
            <span className={styles.metaValue}>{formatDate(eventDate)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>📍</span>
            <span className={styles.metaValue}>{event.location}</span>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.attendees}>
            <span className={styles.attendeesCount}>
              👥 {event.attendees.length}
              {event.maxAttendees && ` / ${event.maxAttendees}`}
            </span>
          </div>

          {event.price && (
            <div className={styles.price}>
              💰 {event.price} USDC
            </div>
          )}

          {!isPastEvent && (
            <button
              className={`${styles.rsvpButton} ${isUserAttending ? styles.rsvpButtonActive : ""} ${!canRsvp && !isUserAttending ? styles.rsvpButtonDisabled : ""}`}
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

