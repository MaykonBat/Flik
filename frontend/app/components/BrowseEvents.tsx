"use client";

import { useGetAllEvents } from "../hooks/useGetAllEvents";
import Link from "next/link";
import { useMemo } from "react";

interface BrowseEventsProps {
  currentUserFid: number | undefined;
}

export function BrowseEvents({}: BrowseEventsProps) {
  const { events, isLoading, isError } = useGetAllEvents();

  // Organizar eventos em seções
  const { upcomingEvents, allEvents } = useMemo(() => {
    const now = Date.now() / 1000;
    const upcoming = events.filter((event) => Number(event.timestamp) > now);
    return {
      upcomingEvents: upcoming,
      allEvents: events,
    };
  }, [events]);

  if (isLoading) {
    return (
      <div className="w-full py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#f7d954] border-t-transparent mb-4"></div>
        <p className="text-white/80 text-lg">Loading events...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full py-8">
        <div className="bg-[rgba(255,107,107,0.1)] border-2 border-[rgba(255,107,107,0.3)] rounded-2xl p-8 text-center">
          <p className="text-[#ff6b6b] text-lg font-semibold mb-2">
            Error loading events
          </p>
          <p className="text-white/60 text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  if (allEvents.length === 0) {
    return (
      <div className="w-full py-12">
        <div className="bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-4">No events yet</h3>
          <p className="text-white/70 text-lg mb-6">
            Be the first to create an amazing event on Flik!
          </p>
          <p className="text-white/50 text-sm">
            Create events, connect people, and be part of the Farcaster
            community
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4 space-y-12">
      {upcomingEvents.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-[#f7d954] to-transparent rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Upcoming Events
            </h2>
            <div className="flex-1 h-1 bg-gradient-to-r from-transparent to-white/10 rounded-full"></div>
            <span className="bg-[#f7d954]/20 text-[#f7d954] px-3 py-1 rounded-full text-sm font-semibold">
              {upcomingEvents.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 md:gap-6">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id.toString()}
                href={`/${event.eventAddress}`}
                className="group bg-white/5 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/10 hover:border-[#f7d954]/50 transition-all hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(247,217,84,0.2)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#f7d954] transition-colors flex-1">
                    {event.title}
                  </h3>
                  <span className="bg-[#f7d954]/20 text-[#f7d954] px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ml-2">
                    Soon
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {event.tags.length > 3 && (
                    <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/50">
                      +{event.tags.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">
                    {new Date(
                      Number(event.timestamp) * 1000
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[#f7d954] font-semibold group-hover:translate-x-1 transition-transform inline-block">
                    View details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {allEvents.length > upcomingEvents.length && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              All Events
            </h2>
            <div className="flex-1 h-1 bg-gradient-to-r from-transparent to-white/10 rounded-full"></div>
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
              {allEvents.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 md:gap-6">
            {allEvents.map((event) => (
              <Link
                key={event.id.toString()}
                href={`/${event.eventAddress}`}
                className="group bg-white/5 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/10 hover:border-white/30 transition-all hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#f7d954] transition-colors flex-1">
                    {event.title}
                  </h3>
                </div>
                <p className="text-white/50 text-xs mb-3 font-mono">
                  {event.eventAddress.slice(0, 6)}...
                  {event.eventAddress.slice(-4)}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {event.tags.length > 3 && (
                    <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/50">
                      +{event.tags.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">
                    {new Date(
                      Number(event.timestamp) * 1000
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-white/70 font-semibold group-hover:text-[#f7d954] group-hover:translate-x-1 transition-all inline-block">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
