"use client";
// react-scan must be imported before react
import { JSX, useEffect } from "react";
import { scan } from "react-scan";

export function ReactScan(): JSX.Element {
  useEffect(() => {
    scan({
      enabled: process.env.NODE_ENV === "development",
    });
  }, []);

  return <></>;
}
