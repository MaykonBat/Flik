"use client";

import { useGetAllEvents } from "../hooks/useGetAllEvents";
import Link from "next/link";

interface BrowseEventsProps {
  currentUserFid: number | undefined;
}

export function BrowseEvents({}: BrowseEventsProps) {
  const { events, isLoading, isError } = useGetAllEvents();

  if (isLoading) {
    return (
      <div className="w-full py-4">
        <div className="text-center py-12 px-4 text-white/80">
          Loading events from contract...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full py-4">
        <div className="text-center py-12 px-4 text-[#ff6b6b]">
          Error loading events from contract
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full py-4">
        <div className="text-center py-12 px-4 text-white/80">
          <p>No events found on contract</p>
          <p className="text-white/50 text-sm mt-2">
            Be the first to create an event!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 md:gap-6 w-full">
        {events.map((event) => (
          <Link
            key={event.id.toString()}
            href={`/${event.eventAddress}`}
            className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all cursor-pointer hover:scale-[1.02] duration-200"
          >
            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
            <p className="text-white/70 text-sm mb-3">
              Contract: {event.eventAddress.slice(0, 6)}...{event.eventAddress.slice(-4)}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {event.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-white/50 text-xs">
              Created: {new Date(Number(event.timestamp) * 1000).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
