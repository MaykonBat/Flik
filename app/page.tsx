"use client";
import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { EventProvider } from "./context/EventContext";
import { EventList } from "./components/EventList";
import { CreateEventForm } from "./components/CreateEventForm";
import { useFarcasterAuth } from "./hooks/useFarcasterAuth";
import styles from "./page.module.css";

type View = "events" | "create";

function HomeContent() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const [view, setView] = useState<View>("events");
  const { userData, loading, error, signIn, signOut, isAuthenticated } =
    useFarcasterAuth();

  // Initialize the miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const currentUserFid = userData?.fid;
  const currentUserName = context?.user?.displayName;

  const handleCreateSuccess = () => {
    setView("events");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Event Platform</h1>
            <p className={styles.subtitle}>
              {currentUserName
                ? `Welcome, ${currentUserName}!`
                : "Discover and create events on Farcaster"}
            </p>
          </div>
          <div className={styles.authSection}>
            {!isAuthenticated ? (
              <button
                onClick={signIn}
                className={styles.signInButton}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            ) : (
              <div className={styles.authInfo}>
                <span className={styles.authStatus}>
                  ✓ FID: {currentUserFid}
                </span>
                <button onClick={signOut} className={styles.signOutButton}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
        {error && (
          <div className={styles.authError} role="alert">
            {error}
          </div>
        )}
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
            {loading ? (
              <div className={styles.loading}>Authenticating...</div>
            ) : !isAuthenticated ? (
              <div className={styles.authRequired}>
                <h3 className={styles.authTitle}>Authentication Required</h3>
                <p className={styles.authMessage}>
                  Please sign in to create events using Farcaster Quick Auth.
                </p>
                <button
                  onClick={signIn}
                  className={styles.authButton}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In with Farcaster"}
                </button>
                {error && (
                  <p className={styles.authErrorText}>Error: {error}</p>
                )}
              </div>
            ) : (
              <CreateEventForm
                creatorFid={currentUserFid!}
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
