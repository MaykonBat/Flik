/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReadContracts } from "wagmi";
import { EVENT_ABI, PAID_EVENT_ABI } from "../lib/abi";
import { useEffect, useState } from "react";

interface EventDetails {
  title: string;
  description: string;
  location: string;
  maxAttendees: bigint;
  price?: bigint;
  attendeesCount: bigint;
  startsAt: bigint;
  endsAt: bigint;
  tags: string[];
  owner: string;
  eventCanceled: boolean;
  eventEnded: boolean;
  isUserAttendee: boolean;
  isUserStaff: boolean;
  isPaidEvent: boolean;
}

export function useEventDetails(
  contractAddress: string,
  userAddress?: string
) {
  const [isPaidEvent, setIsPaidEvent] = useState<boolean | null>(null);

  // First, detect if it's a paid event
  const { data: detectionData } = useReadContracts({
    contracts: [
      {
        address: contractAddress as `0x${string}`,
        abi: PAID_EVENT_ABI as any,
        functionName: "ticketPriceUSD",
      },
    ],
  });

  useEffect(() => {
    if (detectionData?.[0]) {
      setIsPaidEvent(detectionData[0].status === "success");
    }
  }, [detectionData]);

  // Fetch all event data
  const abi = isPaidEvent ? PAID_EVENT_ABI : EVENT_ABI;

  const contracts = isPaidEvent !== null ? [
    {
      address: contractAddress as `0x${string}`,
      abi: abi as any,
      functionName: "title" as const,
    },
    {
      address: contractAddress as `0x${string}`,
      abi: abi as any,
      functionName: "description" as const,
    },
    {
      address: contractAddress as `0x${string}`,
      abi: abi as any,
      functionName: "location" as const,
    },
    {
      address: contractAddress as `0x${string}`,
      abi: abi as any,
      functionName: "maxAttendees" as const,
    },
    {
      address: contractAddress as `0x${string}`,
      abi: abi as any,
      functionName: "attendeesCount" as const,
    },
    {
      address: contractAddress as `0x${string}`,
      abi: abi as any,
      functionName: "startsAt" as const,
    },
    {
      address: contractAddress as `0x${string}`,
      abi: abi as any,
      functionName: "endsAt" as const,
    },
    {
      address: contractAddress as `0x${string}`,
      abi: EVENT_ABI as any,
      functionName: "getTags" as const,
    },
    {
      address: contractAddress as `0x${string}`,
      abi: abi as any,
      functionName: "owner" as const,
    },
    {
      address: contractAddress as `0x${string}`,
      abi: abi as any,
      functionName: "eventCanceled" as const,
    },
    {
      address: contractAddress as `0x${string}`,
      abi: abi as any,
      functionName: "eventEnded" as const,
    },
    ...(userAddress ? [
      {
        address: contractAddress as `0x${string}`,
        abi: abi as any,
        functionName: "isAttendee" as const,
        args: [userAddress] as const,
      },
      {
        address: contractAddress as `0x${string}`,
        abi: abi as any,
        functionName: "isStaff" as const,
        args: [userAddress] as const,
      },
    ] : []),
    ...(isPaidEvent ? [
      {
        address: contractAddress as `0x${string}`,
        abi: PAID_EVENT_ABI as any,
        functionName: "ticketPriceUSD" as const,
      },
    ] : []),
  ] : [];

  const { data, isLoading, refetch } = useReadContracts({
    contracts: contracts as any,
    query: {
      enabled: isPaidEvent !== null,
    },
  });

  // Debug logging
  useEffect(() => {
    if (data) {
      console.log("📊 Multicall results:", {
        isPaidEvent,
        dataLength: data.length,
        results: data.map((d, i) => ({
          index: i,
          status: d?.status,
          hasResult: !!d?.result,
        })),
      });
    }
  }, [data, isPaidEvent]);

  const eventDetails: EventDetails | null =
    data && isPaidEvent !== null && data.length > 0
      ? {
          title: ((data as any)[0]?.result as string) || "",
          description: ((data as any)[1]?.result as string) || "",
          location: ((data as any)[2]?.result as string) || "",
          maxAttendees: ((data as any)[3]?.result as bigint) || BigInt(0),
          attendeesCount: ((data as any)[4]?.result as bigint) || BigInt(0),
          startsAt: ((data as any)[5]?.result as bigint) || BigInt(0),
          endsAt: ((data as any)[6]?.result as bigint) || BigInt(0),
          tags: ((data as any)[7]?.result as string[]) || [],
          owner: ((data as any)[8]?.result as string) || "",
          eventCanceled: ((data as any)[9]?.result as boolean) || false,
          eventEnded: ((data as any)[10]?.result as boolean) || false,
          isUserAttendee: userAddress
            ? (((data as any)[11]?.result as boolean) || false)
            : false,
          isUserStaff: userAddress
            ? (((data as any)[12]?.result as boolean) || false)
            : false,
          price:
            isPaidEvent && (data as any)[userAddress ? 13 : 11]?.result
              ? ((data as any)[userAddress ? 13 : 11]?.result as bigint)
              : undefined,
          isPaidEvent,
        }
      : null;

  return {
    eventDetails,
    isLoading: isLoading || isPaidEvent === null,
    refetch,
  };
}
