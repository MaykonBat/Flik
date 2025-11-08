"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PAID_EVENT_FACTORY_ABI } from "../lib/abi";
import { getContractAddress } from "../lib/contracts";
import { useAccount } from "wagmi";
import { useState } from "react";

export interface CreatePaidEventContractParams {
  title: string;
  location: string;
  maxAttendees: number;
  description: string;
  tags: string[];
  startsAt: bigint;
  endsAt: bigint;
  price: bigint;
}

export function usePaidEventContract() {
  const { chainId } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const [isCreating, setIsCreating] = useState(false);

  console.log(" chainId", chainId);

  // Aguarda confirmação da transação
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createPaidEvent = async (params: CreatePaidEventContractParams) => {
    try {
      setIsCreating(true);

      const contractAddress = getContractAddress(
        chainId || 8453, // Default para Base Sepolia
        "PAID_EVENT_FACTORY"
      );

      console.log(" contractAddress", contractAddress);
      console.log(" params", params);
      console.log(" price", BigInt(params.price));
      writeContract({
        address: contractAddress,
        abi: PAID_EVENT_FACTORY_ABI,
        functionName: "createPaidEvent",
        args: [
          params.title,
          params.location,
          BigInt(params.maxAttendees),
          params.description,
          params.tags,
          params.startsAt,
          params.endsAt,
          BigInt(params.price),
        ],
        maxFeePerGas: BigInt(1000000000000000000),
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
    createPaidEvent,
    isPending: isPending || isConfirming || isCreating,
    isSuccess,
    hash,
    error,
  };
}
