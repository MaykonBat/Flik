"use client";

import { Avatar, Name, Badge, Identity } from "@coinbase/onchainkit/identity";

interface IdentitySectionProps {
  address: `0x${string}` | undefined;
}

export function IdentitySection({ address }: IdentitySectionProps) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 shadow-xl mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
          <span className="text-purple-400 text-lg">✨</span>
        </div>
        <h2 className="text-lg font-semibold">Onchain Identity</h2>
      </div>

      <Identity address={address} className="flex items-center gap-3">
        <Avatar className="h-12 w-12 ring-2 ring-purple-500/30" />
        <div className="flex-1">
          <Name className="text-lg font-medium" />
          <Badge className="mt-1" />
        </div>
      </Identity>
    </div>
  );
}
