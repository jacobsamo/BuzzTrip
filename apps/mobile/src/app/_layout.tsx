import Providers from "@/components/providers";
import { Slot } from "expo-router";
import * as React from "react";
import "../lib/global.css";

export default function MainLayout() {
  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
