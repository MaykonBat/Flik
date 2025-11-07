"use client";

import {
  Avatar,
  Name,
  Address,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";

export function WalletSection() {
  const { chain } = useAccount();

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 shadow-xl mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <span className="text-blue-400 text-lg">🔐</span>
          </div>
          <h2 className="text-lg font-semibold">Base Sepolia Account</h2>
        </div>
        {chain && (
          <div className="px-3 py-1 bg-blue-500/20 rounded-lg text-xs font-medium text-blue-300">
            {chain.name}
          </div>
        )}
      </div>

      <Wallet>
        <ConnectWallet className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl py-3 transition-all duration-200">
          <Avatar className="h-6 w-6" />
          <Name className="ml-2" />
        </ConnectWallet>
        <WalletDropdown className="rounded-2xl border border-white/20 bg-gray-900">
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar className="h-10 w-10" />
            <Name className="font-medium" />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownDisconnect className="hover:bg-gray-800" />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
