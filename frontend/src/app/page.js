import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import WhatWeMeasureSection from "@/components/home/WhatWeMeasureSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <WhatWeMeasureSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}