"use client";

import { useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

interface AuthUserData {
  fid: number;
  issuedAt?: number;
  expiresAt?: number;
}

interface AuthResponse {
  success: boolean;
  user?: AuthUserData;
  message?: string;
}

export function useFarcasterAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<AuthUserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get backend origin from environment or use current origin
  const getBackendOrigin = () => {
    if (typeof window === "undefined") return "";
    return process.env.NEXT_PUBLIC_URL || window.location.origin;
  };

  const signIn = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if SDK is available
      if (!sdk) {
        throw new Error(
          "Farcaster SDK is not available. Make sure you're running this app in the Base App or Farcaster."
        );
      }

      if (!sdk.quickAuth) {
        throw new Error(
          "Quick Auth is not available. Make sure you're running this app in the Base App or Farcaster."
        );
      }

      // Step 1: Get JWT token from Farcaster Quick Auth
      let tokenResult;
      try {
        tokenResult = await sdk.quickAuth.getToken();
        console.log("Token result:", tokenResult);
      } catch (tokenError) {
        console.error("Error getting token:", tokenError);
        throw new Error(
          `Failed to get token: ${
            tokenError instanceof Error ? tokenError.message : "Unknown error"
          }`
        );
      }

      // Handle different response structures
      // According to docs, getToken() returns { token: string }
      let authToken: string | null = null;

      if (typeof tokenResult === "object" && tokenResult !== null) {
        if ("token" in tokenResult) {
          authToken = (tokenResult as { token: string }).token;
        } else if ("result" in tokenResult) {
          // Handle case where result might be nested
          const result = (
            tokenResult as { result?: { token?: string } | string }
          ).result;
          authToken =
            typeof result === "string"
              ? result
              : (result as { token?: string })?.token || null;
        }
      } else if (typeof tokenResult === "string") {
        authToken = tokenResult;
      }

      if (!authToken || typeof authToken !== "string") {
        console.error("Invalid token result structure:", tokenResult);
        throw new Error(
          "Failed to get authentication token. Invalid response structure."
        );
      }

      setToken(authToken);

      // Step 2: Use the token to authenticate with backend
      // sdk.quickAuth.fetch automatically adds Authorization header
      const backendUrl = `${getBackendOrigin()}/api/auth`;

      const response = await sdk.quickAuth.fetch(backendUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Authentication failed" }));
        throw new Error(
          errorData.message || `Authentication failed: ${response.status}`
        );
      }

      const data: AuthResponse = await response.json();

      if (data.success && data.user) {
        setUserData(data.user);
      } else {
        throw new Error(data.message || "Authentication failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Authentication failed";
      setError(errorMessage);
      setToken(null);
      setUserData(null);
      console.error("Authentication failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setUserData(null);
    setError(null);
  }, []);

  return {
    token,
    userData,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!token && !!userData,
  };
}
