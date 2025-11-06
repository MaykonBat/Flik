"use client";

import { useComposeCast } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../../minikit.config";
import styles from "./page.module.css";

export default function Success() {
  // Hook must be called unconditionally
  const composeCast = useComposeCast();
  const composeCastAsync = composeCast?.composeCastAsync;

  // Safe access to config
  const appName = minikitConfig?.miniapp?.name || "Event Platform";
  const appNameUpper = appName.toUpperCase();

  const handleShare = async () => {
    if (!composeCastAsync) {
      alert(
        "Share functionality is not available. Please use this app in the Base App or Farcaster."
      );
      return;
    }

    try {
      const text = `Yay! I just joined ${appNameUpper}! `;

      const result = await composeCastAsync({
        text: text,
        embeds: [process.env.NEXT_PUBLIC_URL || ""],
      });

      // result.cast can be null if user cancels
      if (result?.cast) {
        console.log("Cast created successfully:", result.cast.hash);
      } else {
        console.log("User cancelled the cast");
      }
    } catch (error) {
      console.error("Error sharing cast:", error);
      alert("Failed to share. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} type="button">
        ✕
      </button>

      <div className={styles.content}>
        <div className={styles.successMessage}>
          <div className={styles.checkmark}>
            <div className={styles.checkmarkCircle}>
              <div className={styles.checkmarkStem}></div>
              <div className={styles.checkmarkKick}></div>
            </div>
          </div>

          <h1 className={styles.title}>Welcome to the {appNameUpper}!</h1>

          <p className={styles.subtitle}>
            You&apos;re in! We&apos;ll notify you as soon as we launch.
            <br />
            Get ready to experience the future of onchain marketing.
          </p>

          <button onClick={handleShare} className={styles.shareButton}>
            SHARE
          </button>
        </div>
      </div>
    </div>
  );
}
