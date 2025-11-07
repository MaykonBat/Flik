"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { eventABI } from "../lib/abi";
import { getContractAddress } from "../lib/contracts";
import { useAccount } from "wagmi";
import { useState } from "react";

export interface CreateEventContractParams {
  title: string;
  location: string;
  maxAttendees: number;
  description: string;
  tags: string[];
  startsAt: bigint;
  endsAt: bigint;
}

export function useEventContract() {
  const { chainId } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const [isCreating, setIsCreating] = useState(false);

  console.log(" chainId", chainId);

  // Aguarda confirmação da transação
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createPublicEvent = async (params: CreateEventContractParams) => {
    try {
      setIsCreating(true);

      const contractAddress = getContractAddress(
        chainId || 8453, // Default para Base Sepolia
        "EVENT_FACTORY"
      );

      writeContract({
        address: contractAddress,
        abi: eventABI,
        functionName: "createPublicEvent",
        args: [
          params.title,
          params.location,
          BigInt(params.maxAttendees),
          params.description,
          params.tags,
          params.startsAt,
          params.endsAt,
        ],
      });

      return hash;
    } catch (err) {
      console.error("Error creating event on contract:", err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createPublicEvent,
    isPending: isPending || isConfirming || isCreating,
    isSuccess,
    hash,
    error,
  };
}
