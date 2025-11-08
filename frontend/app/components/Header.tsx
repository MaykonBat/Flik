"use client";

import Image from "next/image";
import { WalletSection } from "./WalletSection";

interface HeaderProps {
  currentUserName: string | undefined;
  error: string | null;
}

export function Header({ currentUserName, error }: HeaderProps) {
  return (
    <header className="mb-8 flex  w-full justify-between items-center">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-8 mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
            <Image
              src="/FlikLogo.png"
              alt="Flik Logo"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(247,217,84,0.4)]"
              priority
            />
          </div>
          <div className="flex-1">
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight mb-2 bg-gradient-to-br from-[#f7d954] via-white to-[#f7d954] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(247,217,84,0.5)]">
              Flik
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-white/80 font-medium">
              The Champion of Events on Farcaster
            </p>
            {currentUserName && (
              <p className="text-sm text-white/60 mt-1">
                Welcome,{" "}
                <span className="text-[#f7d954] font-semibold">
                  {currentUserName}
                </span>
                !
              </p>
            )}
          </div>
        </div>
      </div>
      {error && (
        <div
          className="bg-[rgba(255,107,107,0.1)] border-2 border-[rgba(255,107,107,0.3)] text-[#ff6b6b] px-4 py-3 rounded-lg text-sm mt-4 text-center backdrop-blur-md"
          role="alert"
        >
          {error}
        </div>
      )}
      <WalletSection />
    </header>
  );
}
