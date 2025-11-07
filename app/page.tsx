"use client";

import { useState, useEffect, useCallback } from "react";
import { useMiniKit, useAddFrame } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
// import { BrowseEvents } from "./components/BrowseEvents";
import { CreateEvent } from "./components/CreateEvent";
import { Header } from "./components/Header";
import { AddFrameButton } from "./components/AddFrameButton";
import { WalletSection } from "./components/WalletSection";
import { IdentitySection } from "./components/IdentitySection";
import { NavigationTabs } from "./components/NavigationTabs";
import { useFarcasterAuth } from "./hooks/useFarcasterAuth";
import { sdk } from "@farcaster/miniapp-sdk";

type View = "events" | "create";

export default function HomePage() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const { address, isConnected } = useAccount();
  const addFrame = useAddFrame();
  const [view, setView] = useState<View>("events");
  const [frameAdded, setFrameAdded] = useState(false);
  const { userData, error } = useFarcasterAuth();

  // Initialize the miniapp
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const initialize = async () => {
      try {
        // Always call SDK ready to hide splash screen
        // This must be called after the app is fully loaded
        // According to Farcaster docs: https://miniapps.farcaster.xyz/docs/getting-started#making-your-app-display
        await sdk.actions.ready();
        console.log("✅ SDK ready() called successfully");
      } catch (error) {
        console.error("❌ Error calling sdk.actions.ready():", error);
        // Continue even if ready() fails
      }

      // Mark frame as ready if not already
      if (!isFrameReady) {
        setFrameReady();
      }
    };

    initialize();
  }, [setFrameReady, isFrameReady]);

  const currentUserFid = userData?.fid;
  const currentUserName = context?.user?.displayName;

  const handleCreateSuccess = () => {
    setView("events");
  };

  const handleAddFrame = useCallback(async () => {
    const result = await addFrame();
    if (result) {
      setFrameAdded(true);
    }
  }, [addFrame]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white p-4 md:p-8">
      <Header currentUserName={currentUserName} error={error} />

      {context && !context.client.added && !frameAdded && (
        <AddFrameButton onAddFrame={handleAddFrame} />
      )}

      <WalletSection />

      {isConnected && <IdentitySection address={address} />}

      <NavigationTabs currentView={view} onViewChange={setView} />

      <main className="flex-1 w-full max-w-[1400px] mx-auto">
        {/* {view === "events" && <BrowseEvents currentUserFid={currentUserFid} />} */}

        {view === "create" && (
          <CreateEvent
            creatorFid={currentUserFid!}
            creatorName={currentUserName}
            onSuccess={handleCreateSuccess}
            onCancel={() => setView("events")}
          />
        )}
      </main>

      {/* Context Info - Minimalist design */}
      {context && (
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-4 border border-white/10 mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Farcaster ID</span>
            <span className="font-mono text-white/90">
              {currentUserFid || context?.user?.fid || "N/A"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
