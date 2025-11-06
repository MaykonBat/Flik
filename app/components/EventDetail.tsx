"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Event } from "../types/event";
import styles from "./EventDetail.module.css";

interface EventDetailProps {
  eventId: string;
  currentUserFid?: number;
  onRsvp?: (eventId: string) => void;
  onCancelRsvp?: (eventId: string) => void;
}

export function EventDetail({ eventId, currentUserFid, onRsvp, onCancelRsvp }: EventDetailProps) {
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
      <div className={styles.container}>
        <div className={styles.loading}>Loading event...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || "Event not found"}</div>
        <button onClick={() => router.back()} className={styles.backButton}>
          Go Back
        </button>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();
  const isUserAttending = currentUserFid ? event.attendees.includes(currentUserFid) : false;
  const isFull = event.maxAttendees ? event.attendees.length >= event.maxAttendees : false;
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
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        ← Back
      </button>

      {event.imageUrl && (
        <div className={styles.imageContainer}>
          <img src={event.imageUrl} alt={event.title} className={styles.image} />
        </div>
      )}

      <article className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>{event.title}</h1>
            {event.category && (
              <span className={styles.category}>{event.category}</span>
            )}
          </div>
          {event.creatorName && (
            <p className={styles.creator}>
              Created by <strong>{event.creatorName}</strong>
            </p>
          )}
        </header>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>📅</span>
            <div>
              <span className={styles.metaLabel}>Date & Time</span>
              <span className={styles.metaValue}>{formatDate(eventDate)}</span>
            </div>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>📍</span>
            <div>
              <span className={styles.metaLabel}>Location</span>
              <span className={styles.metaValue}>{event.location}</span>
            </div>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>👥</span>
            <div>
              <span className={styles.metaLabel}>Attendees</span>
              <span className={styles.metaValue}>
                {event.attendees.length}
                {event.maxAttendees && ` / ${event.maxAttendees}`}
              </span>
            </div>
          </div>
          {event.price !== undefined && (
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>💰</span>
              <div>
                <span className={styles.metaLabel}>Price</span>
                <span className={styles.metaValue}>
                  {event.price === 0 ? "Free" : `${event.price} USDC`}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.description}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p>{event.description}</p>
        </div>

        {!isPastEvent && (
          <div className={styles.actions}>
            <button
              className={`${styles.rsvpButton} ${isUserAttending ? styles.rsvpButtonActive : ""} ${!canRsvp && !isUserAttending ? styles.rsvpButtonDisabled : ""}`}
              onClick={isUserAttending ? handleCancelRsvp : handleRsvp}
              disabled={!canRsvp && !isUserAttending}
              aria-label={isUserAttending ? "Cancel RSVP" : "RSVP to event"}
            >
              {isUserAttending ? "✓ Going" : isFull ? "Event Full" : "RSVP to Event"}
            </button>
          </div>
        )}

        {isPastEvent && (
          <div className={styles.pastEvent}>
            <p>This event has already passed.</p>
          </div>
        )}
      </article>
    </div>
  );
}

