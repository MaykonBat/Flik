"use client";

import { useReadContract, useAccount } from "wagmi";
import { EVENT_FACTORY_ABI } from "../lib/abi";
import { getContractAddress } from "../lib/contracts";

export interface EventInfo {
  id: bigint;
  eventAddress: string;
  owner: string;
  title: string;
  tags: string[];
  timestamp: bigint;
}

export function useGetAllEvents() {
  const { chainId } = useAccount();

  const contractAddress = getContractAddress(
    chainId || 8453, // Default para Base
    "EVENT_HUB"
  );

  const { data, isError, isLoading, refetch } = useReadContract({
    address: contractAddress,
    abi: EVENT_FACTORY_ABI,
    functionName: "getAllEvents",
  });

  // Converte os dados do contrato para o formato esperado
  const events = (data as EventInfo[] | undefined) || [];

  return {
    events,
    isLoading,
    isError,
    refetch,
  };
}
