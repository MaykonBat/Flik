"use client";

import { EventList } from "./EventList";

interface BrowseEventsProps {
  currentUserFid: number | undefined;
}

export function BrowseEvents({ currentUserFid }: BrowseEventsProps) {
  return (
    <div className="w-full">
      <EventList currentUserFid={currentUserFid} filter="upcoming" />
    </div>
  );
}
