import Header from "@/pages/Header";

import HeroSection from "@/components/home/HeroSection";
import IntelligenceSection from "@/components/home/IntelligenceSection";
import MethodologySection from "@/components/home/MethodologySection";
import StatsSection from "@/components/home/StatsSection";
import PlayerGridSection from "@/components/home/PlayerGrid";
import FooterSection from "@/components/home/FooterSection";

const Homepage = () => {
  return (
    <div className="bg-black text-white">
      <Header />

      {/* offset for fixed header */}
      <div className="h-16" />

      <section id="home" className="scroll-mt-24">
        <HeroSection />
      </section>

      <section id="intelligence" className="scroll-mt-24">
        <IntelligenceSection />
      </section>

      <section id="stats" className="scroll-mt-24">
        <StatsSection />
      </section>

      <section id="players" className="scroll-mt-24">
        <PlayerGridSection />
      </section>

      <section id="methodology" className="scroll-mt-24">
        <MethodologySection />
      </section>

      <FooterSection />
    </div>
  );
};

export default Homepage;
