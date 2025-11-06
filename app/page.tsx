"use client";
import { useState, useEffect } from "react";
import { useQuickAuth, useMiniKit } from "@coinbase/onchainkit/minikit";
import { EventProvider } from "./context/EventContext";
import { EventList } from "./components/EventList";
import { CreateEventForm } from "./components/CreateEventForm";
import styles from "./page.module.css";

interface AuthResponse {
  success: boolean;
  user?: {
    fid: number;
    issuedAt?: number;
    expiresAt?: number;
  };
  message?: string;
}

type View = "events" | "create";

function HomeContent() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const [view, setView] = useState<View>("events");

  const { data: authData, isLoading: isAuthLoading } =
    useQuickAuth<AuthResponse>("/api/auth", { method: "GET" });

  // Initialize the miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const currentUserFid = authData?.user?.fid;
  const currentUserName = context?.user?.displayName;

  const handleCreateSuccess = () => {
    setView("events");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Event Platform</h1>
        <p className={styles.subtitle}>
          {context?.user?.displayName
            ? `Welcome, ${context.user.displayName}!`
            : "Discover and create events on Farcaster"}
        </p>
      </header>

      <nav className={styles.nav}>
        <button
          className={`${styles.navButton} ${
            view === "events" ? styles.navButtonActive : ""
          }`}
          onClick={() => setView("events")}
          aria-label="View events"
        >
          📅 Browse Events
        </button>
        <button
          className={`${styles.navButton} ${
            view === "create" ? styles.navButtonActive : ""
          }`}
          onClick={() => setView("create")}
          aria-label="Create event"
        >
          ➕ Create Event
        </button>
      </nav>

      <main className={styles.main}>
        {view === "events" && (
          <div className={styles.eventsView}>
            <EventList currentUserFid={currentUserFid} filter="upcoming" />
          </div>
        )}

        {view === "create" && (
          <div className={styles.createView}>
            {isAuthLoading ? (
              <div className={styles.loading}>Loading...</div>
            ) : !authData?.success || !currentUserFid ? (
              <div className={styles.authRequired}>
                <p>Please authenticate to create events</p>
              </div>
            ) : (
              <CreateEventForm
                creatorFid={currentUserFid}
                creatorName={currentUserName}
                onSuccess={handleCreateSuccess}
                onCancel={() => setView("events")}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <EventProvider>
      <HomeContent />
    </EventProvider>
  );
}
