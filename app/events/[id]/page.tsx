"use client";

import { useParams } from "next/navigation";
import { EventProvider, useEvents } from "../../context/EventContext";
import { EventDetail } from "../../components/EventDetail";
import { useFarcasterAuth } from "../../hooks/useFarcasterAuth";

function EventDetailContent() {
  const params = useParams();
  const eventId = params.id as string;
  const { rsvpToEvent, cancelRsvp } = useEvents();
  const { userData } = useFarcasterAuth();

  const currentUserFid = userData?.fid;

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

  return (
    <EventDetail
      eventId={eventId}
      currentUserFid={currentUserFid}
      onRsvp={handleRsvp}
      onCancelRsvp={handleCancelRsvp}
    />
  );
}

export default function EventDetailPage() {
  return (
    <EventProvider>
      <EventDetailContent />
    </EventProvider>
  );
}
