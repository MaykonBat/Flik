import { Event } from "../types/event";

// In-memory storage (replace with database in production)
// This is a simple implementation for MVP
let events: Event[] = [];

export function getAllEvents(): Event[] {
  return [...events];
}

export function getEventById(id: string): Event | undefined {
  return events.find((e) => e.id === id);
}

export function createEvent(event: Event): Event {
  events.push(event);
  return event;
}

export function updateEvent(updatedEvent: Event): boolean {
  const index = events.findIndex((e) => e.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = updatedEvent;
    return true;
  }
  return false;
}

export function deleteEvent(id: string): boolean {
  const index = events.findIndex((e) => e.id === id);
  if (index !== -1) {
    events.splice(index, 1);
    return true;
  }
  return false;
}

