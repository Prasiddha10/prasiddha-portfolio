"use client";

import { MotionConfig } from "framer-motion";
import LenisProvider from "./LenisProvider";
import BackgroundFX from "../ui/BackgroundFX";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LenisProvider>
        <BackgroundFX />
        {children}
      </LenisProvider>
    </MotionConfig>
  );
}
