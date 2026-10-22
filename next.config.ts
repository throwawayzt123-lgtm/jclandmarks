import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Tailwind output is small (~18 KB); shipping it inside the HTML removes
    // the render-blocking stylesheet request on first visit.
    inlineCss: true,
  },
};

export default nextConfig;
