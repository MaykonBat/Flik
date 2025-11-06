"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Event, CreateEventInput } from "../types/event";

interface EventContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  createEvent: (event: CreateEventInput, creatorFid: number, creatorName?: string) => Promise<Event | null>;
  fetchEvents: () => Promise<void>;
  rsvpToEvent: (eventId: string, userFid: number) => Promise<boolean>;
  cancelRsvp: (eventId: string, userFid: number) => Promise<boolean>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (
    eventInput: CreateEventInput,
    creatorFid: number,
    creatorName?: string
  ): Promise<Event | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...eventInput,
          creatorFid,
          creatorName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      const data = await response.json();
      const newEvent = data.event;
      setEvents((prev) => [newEvent, ...prev]);
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
      console.error("Error creating event:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const rsvpToEvent = async (eventId: string, userFid: number): Promise<boolean> => {
    setError(null);
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userFid }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to RSVP");
      }

      // Refresh events to get updated attendee count
      await fetchEvents();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to RSVP");
      console.error("Error RSVPing to event:", err);
      return false;
    }
  };

  const cancelRsvp = async (eventId: string, userFid: number): Promise<boolean> => {
    setError(null);
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userFid }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel RSVP");
      }

      // Refresh events to get updated attendee count
      await fetchEvents();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel RSVP");
      console.error("Error canceling RSVP:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        createEvent,
        fetchEvents,
        rsvpToEvent,
        cancelRsvp,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
}

