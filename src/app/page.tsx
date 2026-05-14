import { BugReportForm } from "@/components/BugReportForm";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header className="space-y-3 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Group 2 API
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Report a bug
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted">
            Found something broken? Send a report to our team. No account is
            required, and we will keep your draft if the service is unavailable.
          </p>
        </header>

        <BugReportForm />
      </div>
    </main>
  );
}
