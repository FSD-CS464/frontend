// Ensure the package runs and attaches Pose to window in the browser.
import "@mediapipe/pose";

// Re-export Pose under a named ESM export so pose-detection's ESM import works.
const Pose = typeof window !== "undefined" ? (window as any).Pose : undefined;
export { Pose };
