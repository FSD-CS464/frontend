// frontend/frontend/next.config.ts
import type { NextConfig } from "next";
import path from "path";

const WEBPACK_ALIAS = {
  "@mediapipe/pose": path.resolve(__dirname, "src/shims/mediapipe-pose-shim.js"),
  // you can keep other aliases here if you add more
};

const TURBOPACK_ALIAS = {
  // IMPORTANT: must be a project-relative string, not an absolute path
  "@mediapipe/pose": "./src/shims/mediapipe-pose-shim.js",
};

const nextConfig: NextConfig = {

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    turbo: {
      resolveAlias: TURBOPACK_ALIAS,
    },
  },
  
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ...WEBPACK_ALIAS,
    };
    return config;
  },
};

export default nextConfig;
