import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { BookOpen, Camera, Keyboard, MousePointer2 } from "lucide-react";

const docs = [
  {
    icon: Keyboard,
    title: "Keyboard Signals",
    text: "NeuroTrack collects keyboard behavior such as key presses, backspaces and typing rhythm.",
  },
  {
    icon: MousePointer2,
    title: "Mouse Signals",
    text: "Mouse movement, clicks and idle time help estimate engagement and fatigue risk.",
  },
  {
    icon: Camera,
    title: "Fatigue Features",
    text: "Camera checks run briefly at the start and at selected intervals to assess frame quality and attention cues.",
  },
];

const criteria = [
  {
    title: "Reading",
    description: "Steady attention, low idle time and calm focus are the main indicators.",
  },
  {
    title: "Writing",
    description: "Typing pace, backspaces and pauses are the main indicators.",
  },
  {
    title: "Coding",
    description: "Typing rhythm, mouse navigation and pauses together estimate productivity.",
  },
  {
    title: "Lecture",
    description: "Passive attention and sustained focus are the main indicators.",
  },
  {
    title: "Designing",
    description: "Cursor movement and visual exploration are the main indicators.",
  },
  {
    title: "Reporting",
    description: "Typing consistency, document work rhythm and pauses estimate productivity.",
  },
];

export default function DocumentationPage() {
  return (
    <>
      <Navbar />
      <main className="app-shell">
        <div className="app-container py-14 sm:py-20">
          <section className="mx-auto max-w-4xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <BookOpen size={24} aria-hidden="true" />
            </span>
            <p className="mt-6 section-kicker">Documentation</p>
            <h1 className="mt-3 text-4xl font-black text-[var(--foreground)] sm:text-5xl">
              Documentation
            </h1>
            <p className="mt-5 text-lg text-[var(--text-secondary)]">
              NeuroTrack collects keyboard, mouse and fatigue-related behavioral
              signals for analysis.
            </p>
          </section>

          <section className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
            {docs.map(({ icon: Icon, title, text }) => (
              <article key={title} className="surface-card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--primary)]">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-lg font-black text-[var(--foreground)]">
                  {title}
                </h2>
                <p className="mt-3 text-sm text-[var(--text-secondary)]">{text}</p>
              </article>
            ))}
          </section>

          <section className="mx-auto mt-10 max-w-4xl rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-[var(--foreground)]">How productivity is judged</h2>
            <p className="mt-3 text-[var(--text-secondary)]">
              Each activity uses a different balance of typing, mouse movement, idle time and fatigue signals.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {criteria.map(({ title, description }) => (
                <article key={title} className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                  <h3 className="text-lg font-black text-[var(--foreground)]">{title}</h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
