"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="rounded-xl border border-dashed border-black/15 p-8 text-center dark:border-white/20">
        <h1 className="text-lg font-semibold">Could not load your analytics</h1>
        <p className="mx-auto mt-2 max-w-prose text-sm opacity-70">
          Check that the VERCEL_TOKEN environment variable is set and that the
          token has not expired. If the token is fine, the Vercel API may be
          temporarily unavailable.
        </p>
        <button
          onClick={() => retry()}
          className="mt-5 rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Try again
        </button>
      </div>
    </main>
  );
}