"use client";

import { useEffect } from "react";
import { chargerMoteur } from "@/lib/moteur";

export default function PrechargerIA() {
  useEffect(() => {
    chargerMoteur().catch(() => {});
  }, []);
  return null;
}
