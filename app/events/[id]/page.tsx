"use client";

import { useParams } from "next/navigation";
import { EventProvider, useEvents } from "../../context/EventContext";
import { EventDetail } from "../../components/EventDetail";
import { useQuickAuth, useMiniKit } from "@coinbase/onchainkit/minikit";

interface AuthResponse {
  success: boolean;
  user?: {
    fid: number;
    issuedAt?: number;
    expiresAt?: number;
  };
  message?: string;
}

function EventDetailContent() {
  const params = useParams();
  const eventId = params.id as string;
  const { context } = useMiniKit();
  const { rsvpToEvent, cancelRsvp } = useEvents();

  const { data: authData } = useQuickAuth<AuthResponse>("/api/auth", {
    method: "GET",
  });

  const currentUserFid = authData?.user?.fid;

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

