"use client";

import { formatEther } from "viem";

interface TokenSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenSelect: (token: "ETH" | "USDC" | "USDT") => void;
  ticketPrice?: bigint;
}

export function TokenSelectionModal({
  isOpen,
  onClose,
  onTokenSelect,
  ticketPrice,
}: TokenSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Select Payment Token
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {ticketPrice !== undefined && (
          <p className="text-white/70 mb-6">
            Ticket Price:{" "}
            <span className="text-[#f7d954] font-semibold">
              ${Number(formatEther(ticketPrice))} USD
            </span>
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => onTokenSelect("ETH")}
            className="w-full bg-gradient-to-r from-blue-500/20 to-blue-500/10 border-2 border-blue-500/30 hover:border-blue-500/50 rounded-xl p-4 text-left transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-semibold text-lg">ETH</div>
                <div className="text-white/60 text-sm">Pay with Ethereum</div>
              </div>
              <div className="text-2xl">💎</div>
            </div>
          </button>

          <button
            onClick={() => onTokenSelect("USDC")}
            className="w-full bg-gradient-to-r from-green-500/20 to-green-500/10 border-2 border-green-500/30 hover:border-green-500/50 rounded-xl p-4 text-left transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-semibold text-lg">USDC</div>
                <div className="text-white/60 text-sm">Pay with USD Coin</div>
              </div>
              <div className="text-2xl">💵</div>
            </div>
          </button>

          <button
            onClick={() => onTokenSelect("USDT")}
            className="w-full bg-gradient-to-r from-purple-500/20 to-purple-500/10 border-2 border-purple-500/30 hover:border-purple-500/50 rounded-xl p-4 text-left transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-semibold text-lg">USDT</div>
                <div className="text-white/60 text-sm">Pay with Tether</div>
              </div>
              <div className="text-2xl">🪙</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
