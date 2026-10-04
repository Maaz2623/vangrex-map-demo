import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-600">
          Vangrex Map Experiment
        </div>

        <h1 className="text-5xl font-semibold tracking-tight">Todo Map Demo</h1>

        <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-500">
          A simple Todo application that we will use to experiment with
          machine-readable application mapping using Playwright.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Open Dashboard
        </Link>
      </div>
    </main>
  );
}
