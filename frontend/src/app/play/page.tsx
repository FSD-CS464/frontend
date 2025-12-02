"use client";
import { useEffect, useRef, useState } from "react";
import TopNav from "@/components/TopNav";
import { api } from "@/app/lib/api";
import { useHabitStore } from "@/store/habits";

const GODOT_GAME_ORIGIN = "https://godot-deployment-ten.vercel.app";

const NEXTJS_APP_ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

const GODOT_GAME_PATH = "/godot-fsd.html";

export default function PlayPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { fetchEnergyAndMood } = useHabitStore();

  useEffect(() => {
    // Fetch user ID and access token
    Promise.all([
      api.get("/auth/me").then((res) => res.data.id),
      api.get("/auth/token").then((res) => res.data.access_token),
    ])
      .then(([userId, token]) => {
        setCurrentUserId(userId);
        setAccessToken(token);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!currentUserId || !accessToken || !iframeRef.current) {
      return;
    }

    const handleLoad = () => {
      const iframeWindow = iframeRef.current?.contentWindow;
      const iframeElement = iframeRef.current;
      
      if (iframeWindow && iframeElement) {
        const targetOrigin = GODOT_GAME_ORIGIN;

        try {
          // Send the UID and JWT token via postMessage
          iframeWindow.postMessage(
            {
              type: "AUTH_INIT",
              uid: currentUserId,
              access_token: accessToken,
              senderOrigin: NEXTJS_APP_ORIGIN,
            },
            targetOrigin
          );
        } catch (error) {
          console.error("Error sending postMessage:", error);
        }
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleLoad);

      if (iframe.contentWindow) {
        handleLoad();
      }
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleLoad);
      }
    };
  }, [currentUserId, accessToken]);

  // Refresh energy and mood when page becomes visible (e.g., returning from games)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Add a small delay to ensure backend has processed the game save
        setTimeout(() => {
          fetchEnergyAndMood();
        }, 500);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Also refresh when component unmounts (user navigates away)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // Refresh when leaving the play page
      fetchEnergyAndMood();
    };
  }, [fetchEnergyAndMood]);

  if (loading) {
    return (
      <main>
        <TopNav />
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-8">
            <p className="text-neutral-600">Loading...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!currentUserId) {
    return (
      <main>
        <TopNav />
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-8">
            <p className="text-neutral-600">Please log in to play the minigame.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <TopNav />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-4">Play</h1>
        <p className="text-neutral-600 mb-6">Mini-games and rewards.</p>
        <iframe
          ref={iframeRef}
          src={`${GODOT_GAME_ORIGIN}${GODOT_GAME_PATH}`}
          sandbox="allow-scripts allow-same-origin"
          style={{ width: "100%", height: "447px", border: "none" }}
          className="rounded-lg"
        />
      </section>
    </main>
  );
}