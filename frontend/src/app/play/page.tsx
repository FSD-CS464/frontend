"use client";
import { useEffect, useRef, useState } from "react";
import TopNav from "@/components/TopNav";
import { api } from "@/app/lib/api";

const GODOT_GAME_ORIGIN = "https://godot-deployment-ten.vercel.app";

const NEXTJS_APP_ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

const GODOT_GAME_PATH = "/godot-fsd.html";

export default function PlayPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user ID from backend
    api
      .get("/auth/me")
      .then((res) => {
        setCurrentUserId(res.data.id);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!currentUserId || !iframeRef.current) {
      return;
    }

    const handleLoad = () => {
      const iframeWindow = iframeRef.current?.contentWindow;
      const iframeElement = iframeRef.current;
      
      if (iframeWindow && iframeElement) {
        console.log("Iframe loaded, sending UID...");
        
        const targetOrigin = GODOT_GAME_ORIGIN;
        console.log("Sending postMessage to origin:", targetOrigin);

        try {
          // Send the UID via postMessage
          iframeWindow.postMessage(
            {
              type: "AUTH_INIT",
              uid: currentUserId,
              senderOrigin: NEXTJS_APP_ORIGIN,
            },
            targetOrigin
          );
          console.log("postMessage sent successfully to", targetOrigin);
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
  }, [currentUserId]);

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