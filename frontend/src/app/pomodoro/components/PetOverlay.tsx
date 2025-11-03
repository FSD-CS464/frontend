"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../styles.module.css";

type OverlayMood = "neutral" | "happy" | "sad";

export default function PetOverlay() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const modelRef = useRef<"blazepose" | "movenet">("blazepose");
  const rafRef = useRef<number | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errMsg, setErrMsg] = useState("");
  const [mood, setMood] = useState<OverlayMood>("neutral");

  // Debug HUD
  const [dbg, setDbg] = useState({
    backend: "unknown",
    model: "blazepose",
    frames: 0,
    emptyFrames: 0,
    kps: 0,
    poses: 0,
    score: 0,
  });

  // --- helpers -------------------------------------------------------------

  const setCanvasSizeToVideo = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const drawHUD = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    message: string,
    color = "rgba(239,68,68,0.9)"
  ) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillRect(8, 8, 10, 10);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(26, 6, ctx.measureText(message).width + 14, 20);
    ctx.fillStyle = "#fff";
    ctx.fillText(message, 32, 20);
    ctx.restore();
  };

  const drawKeypoints = (ctx: CanvasRenderingContext2D, w: number, h: number, kps: any[]) => {
    ctx.save();
    ctx.fillStyle = "rgba(37,99,235,0.98)";
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2.5;
    for (const kp of kps) {
      if (!kp) continue;
      let x = Number(kp.x), y = Number(kp.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      // If normalized (0..1), scale to px
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) { x *= w; y *= h; }
      // Mirror x because we mirrored the video
      x = w - x;
      // draw big dot with outline for visibility
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  };  

  const isPresent = (poses: any[]) => {
    if (!poses?.length) return { present: false, kps: 0, score: 0 };
    const p = poses[0];
    const kps = Array.isArray(p?.keypoints) ? p.keypoints : [];
    const poseScore = Number(p?.score ?? 0);
    const avgKP =
      kps.length
        ? kps.reduce((s: number, kp: any) => s + Number(kp?.score ?? 0), 0) / kps.length
        : 0;
    const score = Number.isFinite(poseScore) && poseScore > 0 ? poseScore : avgKP;
    return { present: kps.length >= 5 && score > 0.2, kps: kps.length, score };
  };

  // --- lifecycle -----------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Import TFJS + try backends in order
        const tf = await import("@tensorflow/tfjs-core");
        const { setBackend, ready, getBackend, env } = tf as any;
        await import("@tensorflow/tfjs-backend-webgl");
        await import("@tensorflow/tfjs-converter");

        // Try webgl → wasm → cpu
        let backend = "cpu";
        try {
          await setBackend("webgl");
          await ready();
          backend = getBackend();
        } catch {
          // webgl failed → try wasm
          const wasm = await import("@tensorflow/tfjs-backend-wasm");
          // optional: set local WASM path if you host the files; otherwise tfjs uses CDN
          // (wasm as any).setWasmPaths("/tfjs");
          try {
            await setBackend("wasm");
            await ready();
            backend = getBackend();
          } catch {
            await setBackend("cpu");
            await ready();
            backend = getBackend();
          }
        }

        // Camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;

        const video = (videoRef.current = document.createElement("video"));
        video.srcObject = stream;
        video.playsInline = true;
        video.muted = true;
        await video.play();
        await new Promise<void>((res) => {
          if (video.readyState >= 2) return res();
          const on = () => { video.removeEventListener("loadeddata", on); res(); };
          video.addEventListener("loadeddata", on);
        });

        // Attach video element to the DOM (so you can see yourself)
        // const videoHost = document.querySelector(`.${styles.webcam}`) as HTMLElement | null;
        // if (videoHost) {
        //   videoHost.innerHTML = "";
        //   videoHost.appendChild(video);
        //   (video as any).style.width = "100%";
        //   (video as any).style.height = "100%";
        // }

        // Detector (start with BlazePose, fallback to MoveNet if blank frames)
        const pd = await import("@tensorflow-models/pose-detection");

        async function makeBlazePose() {
          modelRef.current = "blazepose";
          return pd.createDetector(pd.SupportedModels.BlazePose, {
            runtime: "tfjs",
            modelType: "full",
            enableSmoothing: true,
          } as any);
        }

        async function makeMoveNet() {
          modelRef.current = "movenet";
          return pd.createDetector(pd.SupportedModels.MoveNet, {
            modelType: "SinglePose.Lightning", // or "SinglePose.Thunder"
          } as any);
        }        

        let detector = await makeBlazePose();
        if (cancelled) { detector?.dispose?.(); return; }
        detectorRef.current = detector;

        // 5) Warm-up
        for (let i = 0; i < 2; i++) {
          await detectorRef.current.estimatePoses(video, { maxPoses: 1, flipHorizontal: true });
        }

        // 6) Render loop
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        setCanvasSizeToVideo(video, canvas);

        setStatus("ready");

        let frames = 0;
        let emptyFrames = 0;

        const loop = async () => {
          if (cancelled) return;
          setCanvasSizeToVideo(video, canvas);
          const w = canvas.width, h = canvas.height;

          // mirror-draw camera to canvas
          ctx.clearRect(0, 0, w, h);
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(video, -w, 0, w, h);
          ctx.restore();

          let poses: any[] = [];
          try {
            poses = await detectorRef.current.estimatePoses(video, {
              maxPoses: 1,
              flipHorizontal: false,
            });
          } catch (e) {
            console.warn("estimatePoses error; switching to MoveNet", e);
            detectorRef.current?.dispose?.();
            detectorRef.current = await makeMoveNet();
            poses = await detectorRef.current.estimatePoses(video, {
              maxPoses: 1,
              flipHorizontal: false,
            });
          }

          frames++;
          const { present, kps, score } = isPresent(poses);
          if (!present) {
            emptyFrames++;
            drawHUD(ctx, w, h, "No pose", "rgba(239,68,68,0.9)");
          } else {
            emptyFrames = 0;
            const k = Array.isArray(poses[0]?.keypoints) ? poses[0].keypoints : [];
            drawKeypoints(ctx, w, h, k);
            drawHUD(ctx, w, h, "Pose OK", "rgba(16,185,129,0.95)");
          }

          // Auto-fallback to MoveNet if BlazePose keeps failing
          if (modelRef.current === "blazepose" && frames >= 20 && emptyFrames >= 18) {
            console.warn("BlazePose returned too many empty frames; switching to MoveNet Lightning");
            detectorRef.current?.dispose?.();
            detectorRef.current = await makeMoveNet();
            frames = 0;
            emptyFrames = 0;
          }

          // Mood logic: if we saw a pose recently → neutral/happy; if not → sad
          setMood(present ? "neutral" : "sad");

          setDbg({
            backend,
            model: modelRef.current,
            frames,
            emptyFrames,
            kps,
            poses: poses.length || 0,
            score: Number.isFinite(score) ? Number(score) : 0,
          });

          rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
      } catch (e: any) {
        console.error(e);
        setStatus("error");
        setErrMsg(e?.message || "Unknown error");
      }
    })();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      detectorRef.current?.dispose?.();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.srcObject = null;
      }
    };
  }, []);

  const petSrc =
    mood === "happy"
      ? "/petanimation/happy2_idle.gif"
      : mood === "sad"
      ? "/petanimation/sad_idle.gif"
      : "/petanimation/happy_idle.gif";

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-[#111827]">Focus Camera</h2>
          {status === "ready" && (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1">
              <span className="size-2 rounded-full bg-emerald-500" />
              Live
            </span>
          )}
          {status === "loading" && (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-[#374151] bg-slate-100 rounded-full px-2.5 py-1">
              <span className="size-2 rounded-full bg-slate-400 animate-pulse" />
              Initializing…
            </span>
          )}
          {status === "error" && (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-rose-700 bg-rose-50 rounded-full px-2.5 py-1">
              <span className="size-2 rounded-full bg-rose-500" />
              Error
            </span>
          )}
        </div>
        <div className="text-xs text-[#6b7280]">On-device only • no uploads</div>
      </div>

      <div className={styles.cameraContainer + " rounded-xl overflow-hidden bg-slate-50 border border-slate-200"}>
        {/* We'll inject the <video> element here so styles.webcam can host it */}
        <div className={styles.webcam} />
        <canvas ref={canvasRef} className={styles.segmentation} />
        <img src={petSrc} alt="Pet" className={styles.petOverlay} />
      </div>

      <div className="mt-2 text-[11px] text-slate-500">
        backend: {dbg.backend} • model: {dbg.model} • frames: {dbg.frames} • empty: {dbg.emptyFrames} • poses: {dbg.poses} • kps: {dbg.kps} • score: {dbg.score.toFixed(2)}
      </div>

      <p className="text-xs text-[#6b7280] mt-3">
        Tip: stay on camera to keep the bunny happy. Go off camera and it gets lonely 😢
      </p>
    </div>
  );
}
