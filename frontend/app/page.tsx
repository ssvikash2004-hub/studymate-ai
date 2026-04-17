"use client";

import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import AppWorkspace from "@/components/AppWorkspace";

export default function Home() {
  const [started, setStarted] = useState(false);

  return started ? (
    <AppWorkspace />
  ) : (
    <LandingPage onStart={() => setStarted(true)} />
  );
}
