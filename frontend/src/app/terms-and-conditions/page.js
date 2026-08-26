import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="app-shell">
        <div className="app-container py-14 sm:py-20">
          <article className="surface-card mx-auto max-w-4xl p-6 sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <FileText size={24} aria-hidden="true" />
            </span>
            <p className="mt-6 section-kicker">Terms</p>
            <h1 className="mt-3 text-4xl font-black text-[var(--foreground)] sm:text-5xl">
              Terms & Conditions
            </h1>

            <div className="legal-prose mt-8">
              <section>
                <h2>Use of NeuroTrack</h2>
                <p>
                  By using NeuroTrack, you agree to provide consent for behavioral
                  data collection during active sessions.
                </p>
              </section>

              <section>
                <h2>Active Sessions</h2>
                <p>
                  Analysis occurs during user-controlled sessions. Users can stop a
                  session at any time.
                </p>
              </section>

              <section>
                <h2>Responsible Interpretation</h2>
                <p>
                  NeuroTrack provides cognitive load and fatigue indicators intended
                  to support awareness and reflection.
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
