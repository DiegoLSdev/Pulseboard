export default function Loading() {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6"
      aria-busy="true"
      aria-label="Loading your projects"
    >
      <div className="h-8 w-40 animate-pulse rounded-md bg-black/10 dark:bg-white/10" />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl bg-black/5 dark:bg-white/5"
          />
        ))}
      </div>

      <div className="mt-10 h-6 w-28 animate-pulse rounded-md bg-black/10 dark:bg-white/10" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-xl bg-black/5 dark:bg-white/5"
          />
        ))}
      </div>
    </main>
  );
}