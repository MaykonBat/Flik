"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { EVENT_ABI } from "../lib/abi";
import Link from "next/link";

interface EventDetails {
  title: string;
  description: string;
  location: string;
  maxAttendees: bigint;
  attendeesCount: bigint;
  startsAt: bigint;
  endsAt: bigint;
  tags: string[];
  owner: string;
  eventCanceled: boolean;
  eventEnded: boolean;
  isUserAttendee: boolean;
  isUserStaff: boolean;
}

export default function EventPageDetails({
  params,
}: {
  params: { contractAddress: string };
}) {
  const { contractAddress } = params;
  const { address, isConnected } = useAccount();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { writeContract, data: hash, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read all event details
  const { data: title } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: "title",
  });

  const { data: description } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: "description",
  });

  const { data: location } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: "location",
  });

  const { data: maxAttendees } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: "maxAttendees",
  });

  const { data: attendeesCount, refetch: refetchAttendeesCount } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: "attendeesCount",
  });

  const { data: startsAt } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: "startsAt",
  });

  const { data: endsAt } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: "endsAt",
  });

  const { data: tags } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: "getTags",
  });

  const { data: owner } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: "owner",
  });

  const { data: eventCanceled } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: "eventCanceled",
  });

  const { data: eventEnded } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: "eventEnded",
  });

  const { data: isUserAttendee, refetch: refetchIsAttendee } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: "isAttendee",
    args: address ? [address] : undefined,
  });

  const { data: isUserStaff } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: EVENT_ABI,
    functionName: "isStaff",
    args: address ? [address] : undefined,
  });

  // Combine all data into eventDetails
  useEffect(() => {
    if (
      title !== undefined &&
      description !== undefined &&
      location !== undefined &&
      maxAttendees !== undefined &&
      attendeesCount !== undefined &&
      startsAt !== undefined &&
      endsAt !== undefined &&
      tags !== undefined &&
      owner !== undefined &&
      eventCanceled !== undefined &&
      eventEnded !== undefined
    ) {
      setEventDetails({
        title: title as string,
        description: description as string,
        location: location as string,
        maxAttendees: maxAttendees as bigint,
        attendeesCount: attendeesCount as bigint,
        startsAt: startsAt as bigint,
        endsAt: endsAt as bigint,
        tags: tags as string[],
        owner: owner as string,
        eventCanceled: eventCanceled as boolean,
        eventEnded: eventEnded as boolean,
        isUserAttendee: (isUserAttendee as boolean) || false,
        isUserStaff: (isUserStaff as boolean) || false,
      });
      setIsLoading(false);
    }
  }, [
    title,
    description,
    location,
    maxAttendees,
    attendeesCount,
    startsAt,
    endsAt,
    tags,
    owner,
    eventCanceled,
    eventEnded,
    isUserAttendee,
    isUserStaff,
  ]);

  // Refetch attendee status after transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      refetchIsAttendee();
      refetchAttendeesCount();
    }
  }, [isConfirmed, refetchIsAttendee, refetchAttendeesCount]);

  const handleJoinEvent = () => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: EVENT_ABI,
      functionName: "joinEvent",
    });
  };

  const handleLeaveEvent = () => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: EVENT_ABI,
      functionName: "leaveEvent",
    });
  };

  const handleCancelEvent = () => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: EVENT_ABI,
      functionName: "cancelEvent",
    });
  };

  const handleEndEvent = () => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: EVENT_ABI,
      functionName: "endEvent",
    });
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const isOwner = address && eventDetails?.owner && address.toLowerCase() === eventDetails.owner.toLowerCase();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white p-4 md:p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white/70">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!eventDetails) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white p-4 md:p-8">
        <div className="text-center py-12">
          <p className="text-[#ff6b6b]">Error loading event details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white p-4 md:p-8">
      {/* Header with Back Button */}
      <div className="w-full max-w-[1400px] mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-white/70 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Events
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
          {/* Event Status Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {eventDetails.eventCanceled && (
              <span className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-sm text-red-400 font-semibold">
                CANCELED
              </span>
            )}
            {eventDetails.eventEnded && (
              <span className="px-4 py-2 bg-gray-500/20 border border-gray-500/30 rounded-full text-sm text-gray-400 font-semibold">
                ENDED
              </span>
            )}
            {eventDetails.isUserAttendee && (
              <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-sm text-green-400 font-semibold">
                YOU&apos;RE ATTENDING
              </span>
            )}
            {eventDetails.isUserStaff && (
              <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-400 font-semibold">
                STAFF
              </span>
            )}
            {isOwner && (
              <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-400 font-semibold">
                OWNER
              </span>
            )}
          </div>

          {/* Event Title */}
          <h1 className="text-4xl font-bold text-white mb-4">
            {eventDetails.title}
          </h1>

          {/* Event Description */}
          <p className="text-white/80 text-lg mb-6">
            {eventDetails.description}
          </p>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Location */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 mr-3 mt-1 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p className="text-white/50 text-sm mb-1">Location</p>
                  <p className="text-white">{eventDetails.location}</p>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 mr-3 mt-1 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-white/50 text-sm mb-1">Event Schedule</p>
                  <p className="text-white text-sm">
                    Starts: {formatDate(eventDetails.startsAt)}
                  </p>
                  <p className="text-white text-sm">
                    Ends: {formatDate(eventDetails.endsAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Attendees */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 mr-3 mt-1 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div>
                  <p className="text-white/50 text-sm mb-1">Attendees</p>
                  <p className="text-white">
                    {eventDetails.attendeesCount.toString()} /{" "}
                    {eventDetails.maxAttendees.toString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Contract Address */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 mr-3 mt-1 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <p className="text-white/50 text-sm mb-1">Contract Address</p>
                  <p className="text-white font-mono text-sm break-all">
                    {contractAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {eventDetails.tags.length > 0 && (
            <div className="mb-8">
              <p className="text-white/50 text-sm mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {eventDetails.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-white/10 rounded-full text-sm text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {isConnected && !eventDetails.eventCanceled && !eventDetails.eventEnded && (
            <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
              {/* Join/Leave Event Buttons for regular users */}
              {!eventDetails.isUserAttendee ? (
                <button
                  onClick={handleJoinEvent}
                  disabled={isWritePending || isConfirming}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWritePending || isConfirming ? "Processing..." : "Join Event"}
                </button>
              ) : (
                <button
                  onClick={handleLeaveEvent}
                  disabled={isWritePending || isConfirming}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWritePending || isConfirming ? "Processing..." : "Leave Event"}
                </button>
              )}

              {/* Owner Actions */}
              {isOwner && (
                <>
                  <button
                    onClick={handleEndEvent}
                    disabled={isWritePending || isConfirming}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isWritePending || isConfirming ? "Processing..." : "End Event"}
                  </button>
                  <button
                    onClick={handleCancelEvent}
                    disabled={isWritePending || isConfirming}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isWritePending || isConfirming ? "Processing..." : "Cancel Event"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Transaction Status */}
          {hash && (
            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/70 text-sm">
                {isConfirming && "Waiting for confirmation..."}
                {isConfirmed && "Transaction confirmed!"}
              </p>
              <p className="text-white/50 text-xs mt-1 break-all">
                Hash: {hash}
              </p>
            </div>
          )}

          {/* Not Connected Message */}
          {!isConnected && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-yellow-400 text-sm">
                Please connect your wallet to interact with this event.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
