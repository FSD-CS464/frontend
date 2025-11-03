"use client";

import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl"; // or '@tensorflow/tfjs-backend-webgpu' if you prefer
import { createDetector, SupportedModels, type BlazePoseTfjsModelConfig } from "@tensorflow-models/pose-detection";

let detectorPromise: ReturnType<typeof createDetector> | null = null;

export async function getPoseDetector() {
  if (!detectorPromise) {
    // ensure backend ready
    const backend = tf.getBackend();
    if (backend !== "webgl" && backend !== "webgpu") {
      await tf.setBackend("webgl");
      await tf.ready();
    }

    const cfg: BlazePoseTfjsModelConfig = {
      runtime: "tfjs",
      modelType: "full",
      enableSmoothing: true,
      // enableSegmentation: false, // optional
    };

    detectorPromise = createDetector(SupportedModels.BlazePose, cfg);
  }
  return detectorPromise;
}
