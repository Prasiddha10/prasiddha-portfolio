"use client";

import LenisProvider from "./LenisProvider";
import BackgroundFX from "../ui/BackgroundFX";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <BackgroundFX />
      {children}
    </LenisProvider>
  );
}
