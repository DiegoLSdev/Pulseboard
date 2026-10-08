"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Same as the API cache, so every refresh brings fresh data. */
const INTERVAL_MS = 5 * 60 * 1000;

/**
 Re-renders the current page on the server every 5 minutes while the tab is visible. 
 * It draws nothing on screen.*/

export function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      // A tab in the background does not need fresh numbers.
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, INTERVAL_MS);

    // Stop the timer when the page is closed or left.
    return () => clearInterval(id);
  }, [router]);

  return null;
}