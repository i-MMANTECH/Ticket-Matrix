// Emmanuel Aro's project submission for evaluation.
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas text-ink p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-400">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-ink-500 max-w-md text-center">
        The ticket or page you are looking for does not exist or has been
        removed.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center bg-ink text-white px-4 py-2 text-sm hover:bg-ink-700"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
