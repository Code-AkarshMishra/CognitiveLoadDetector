import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="app-shell">
        <div className="app-container py-14 sm:py-20">
          <article className="surface-card mx-auto max-w-4xl p-6 sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <ShieldCheck size={24} aria-hidden="true" />
            </span>
            <p className="mt-6 section-kicker">Privacy</p>
            <h1 className="mt-3 text-4xl font-black text-[var(--foreground)] sm:text-5xl">
              Privacy Policy
            </h1>

            <div className="legal-prose mt-8">
              <section>
                <h2>Data Storage</h2>
                <p>
                  Webcam images and videos are not stored. Only extracted behavioral
                  features may be processed.
                </p>
              </section>

              <section>
                <h2>Processing Scope</h2>
                <p>
                  NeuroTrack focuses on keyboard, mouse, session activity and
                  fatigue-related feature signals during active analysis sessions.
                </p>
              </section>

              <section>
                <h2>User Control</h2>
                <p>
                  Users control when tracking begins and ends, and can review privacy
                  information before starting analysis.
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
