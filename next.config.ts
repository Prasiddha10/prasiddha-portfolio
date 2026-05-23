import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // three.js + R3F bundles are large — transpile so tree-shaking works well
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  experimental: {
    optimizePackageImports: ["framer-motion", "@react-three/drei", "gsap"],
  },
};

export default nextConfig;
