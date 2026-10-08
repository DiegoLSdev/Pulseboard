import { getPassword } from "@/lib/auth";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = Boolean(getPassword());

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">Pulseboard</h1>

      {configured ? (
        <form action={login} className="mt-6 flex flex-col gap-3">
          <label htmlFor="password" className="text-sm opacity-70">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            className="rounded-md border border-black/15 bg-transparent px-3 py-2 dark:border-white/20"
          />
          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              Wrong password. Try again.
            </p>
          )}
          <button
            type="submit"
            className="mt-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            Sign in
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm opacity-70">
          This dashboard is locked because no password is configured. Set the
          DASHBOARD_PASSWORD environment variable and redeploy.
        </p>
      )}
    </main>
  );
}