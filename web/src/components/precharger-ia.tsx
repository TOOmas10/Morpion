"use client";

import { useEffect } from "react";
import { prechargerMoteur } from "@/lib/moteur";

export default function PrechargerIA() {
  useEffect(() => prechargerMoteur(), []);
  return null;
}
