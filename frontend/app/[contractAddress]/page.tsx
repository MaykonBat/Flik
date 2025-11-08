"use client";

import { useEffect, use, useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { EVENT_ABI, PAID_EVENT_ABI } from "../lib/abi";
import Link from "next/link";
import { formatEther } from "viem";
import { useEventDetails } from "../hooks/useEventDetails";
import { TokenSelectionModal } from "../components/TokenSelectionModal";

export default function EventPageDetails({
  params,
}: {
  params: Promise<{ contractAddress: string }>;
}) {
  const { contractAddress } = use(params);
  const { address, isConnected } = useAccount();
  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [showTokenModal, setShowTokenModal] = useState(false);

  // Use multicall hook for all contract reads - MUCH FASTER!
  const { eventDetails, isLoading, refetch } = useEventDetails(
    contractAddress,
    address
  );
  console.log("eventDetails", eventDetails);

  // Get ETH amount for USD price (only for paid events)
  const { data: ethAmount } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: PAID_EVENT_ABI,
    functionName: "getETHAmountForUSD",
    args: eventDetails?.price ? [eventDetails.price] : undefined,
    query: {
      enabled: !!eventDetails?.isPaidEvent && !!eventDetails?.price,
    },
  });

  // Refetch after transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      refetch();
      setShowTokenModal(false);
    }
  }, [isConfirmed, refetch]);

  const handleJoinEvent = () => {
    if (!eventDetails) return;

    // For paid events, show token selection modal
    if (eventDetails.isPaidEvent) {
      setShowTokenModal(true);
    } else {
      // Free event - directly join
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: EVENT_ABI,
        functionName: "joinEvent",
      });
    }
  };

  const handleTokenSelect = (token: "ETH" | "USDC" | "USDT") => {
    if (!eventDetails?.isPaidEvent) return;

    setShowTokenModal(false);

    const functionName =
      token === "ETH"
        ? "joinWithETH"
        : token === "USDC"
        ? "joinWithUSDC"
        : "joinWithUSDT";

    console.log("ethAmount", ethAmount);
    if (token === "ETH" && ethAmount && typeof ethAmount === "bigint") {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: PAID_EVENT_ABI,
        functionName,
        value: ethAmount,
      });
    } else {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: PAID_EVENT_ABI,
        functionName,
      });
    }
  };

  const handleLeaveEvent = () => {
    if (!eventDetails) return;

    // Only free events can be left - paid events don't have refund mechanism
    if (!eventDetails.isPaidEvent) {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: EVENT_ABI,
        functionName: "leaveEvent",
      });
    }
  };

  const handleCancelEvent = () => {
    if (!eventDetails) return;

    const abi = eventDetails.isPaidEvent ? PAID_EVENT_ABI : EVENT_ABI;
    writeContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: "cancelEvent",
    });
  };

  const handleEndEvent = () => {
    if (!eventDetails) return;

    const abi = eventDetails.isPaidEvent ? PAID_EVENT_ABI : EVENT_ABI;
    writeContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: "endEvent",
    });
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const isOwner =
    address &&
    eventDetails?.owner &&
    address.toLowerCase() === eventDetails.owner.toLowerCase();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen text-white">
        <div className="text-center py-12 relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white/70">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!eventDetails) {
    return (
      <div className="flex flex-col min-h-screen text-white">
        <div className="text-center py-12 relative z-10">
          <p className="text-[#ff6b6b]">Error loading event details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-white">
      <div className="p-4 md:p-8 relative z-10">
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

              {/* Price - Only show for paid events */}
              {eventDetails.price !== undefined && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start">
                    <svg
                      className="size-5 mr-3 mt-1 text-white/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-white/50 text-sm mb-1">Ticket Price</p>
                      <p className="text-white font-semibold">
                        ${Number(formatEther(eventDetails.price))} USD
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                    <p className="text-white/50 text-sm mb-1">
                      Contract Address
                    </p>
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
            {isConnected &&
              !eventDetails.eventCanceled &&
              !eventDetails.eventEnded && (
                <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
                  {/* Join/Leave Event Buttons for regular users */}
                  {!eventDetails.isUserAttendee ? (
                    <button
                      onClick={handleJoinEvent}
                      disabled={isWritePending || isConfirming}
                      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isWritePending || isConfirming
                        ? "Processing..."
                        : eventDetails.price !== undefined
                        ? `Buy Ticket - $${
                            Number(formatEther(eventDetails.price)) / 1e18
                          } USD`
                        : "Join Event (Free)"}
                    </button>
                  ) : (
                    <>
                      {eventDetails.price === undefined && (
                        <button
                          onClick={handleLeaveEvent}
                          disabled={isWritePending || isConfirming}
                          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isWritePending || isConfirming
                            ? "Processing..."
                            : "Leave Event"}
                        </button>
                      )}
                      {eventDetails.price !== undefined && (
                        <div className="px-6 py-3 bg-green-500/20 border-2 border-green-500/50 text-green-400 rounded-xl font-semibold">
                          ✓ Ticket Purchased
                        </div>
                      )}
                    </>
                  )}

                  {/* Owner Actions */}
                  {isOwner && (
                    <>
                      <button
                        onClick={handleEndEvent}
                        disabled={isWritePending || isConfirming}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isWritePending || isConfirming
                          ? "Processing..."
                          : "End Event"}
                      </button>
                      <button
                        onClick={handleCancelEvent}
                        disabled={isWritePending || isConfirming}
                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isWritePending || isConfirming
                          ? "Processing..."
                          : "Cancel Event"}
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

        <TokenSelectionModal
          isOpen={showTokenModal && eventDetails?.isPaidEvent === true}
          onClose={() => setShowTokenModal(false)}
          onTokenSelect={handleTokenSelect}
          ticketPrice={eventDetails?.price}
        />
      </div>
    </div>
  );
}
