import { motion } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import StatCard from "@/components/StatCard";
import PlayerCard from "@/components/PlayerCard";
import Navigation from "@/components/Navigation"; // <-- import your nav
import kohli from "@/assets/players/kohli.png";

const Homepage = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-title", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 });
      gsap.fromTo(".hero-subtitle", { y: 40, opacity: 0 }, { y: 0, opacity: 1, delay: 0.4, duration: 1.2 });
      gsap.fromTo(".hero-img", { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.8 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      
      {/* Navigation Bar */}
      <Navigation />  {/* <-- Add this at the top */}

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[90vh] flex flex-col justify-center items-center text-center z-10 pt-16">
        <motion.h1 className="hero-title text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          P.U.L.S.E
        </motion.h1>
        <motion.p className="hero-subtitle mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Enter the next era of cricket analytics — real-time performance, predictive AI insights, and player holograms.
        </motion.p>
        <motion.img src={kohli} alt="Virat Kohli" className="hero-img absolute bottom-0 right-0 md:right-20 w-[400px] md:w-[600px] object-contain opacity-90 drop-shadow-[0_0_60px_rgba(0,255,255,0.4)]" />
      </section>

      {/* Stats Section */}
      <section className="relative z-20 px-6 md:px-20 py-16 backdrop-blur-sm bg-white/5 rounded-t-3xl shadow-inner">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Performance Highlights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard title="Win Rate" value="82%" trend={{ value: 12, isPositive: true }} />
          <StatCard title="Avg Run Rate" value={9.2} trend={{ value: 0.8, isPositive: true }} />
          <StatCard title="Top Player" value="Virat Kohli" trend="🔥" />
          <StatCard title="Next Match" value="MI vs RCB" trend="Tomorrow" />
        </div>
      </section>

      {/* Players Section */}
      <section className="px-6 md:px-20 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Star Players
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
          <PlayerCard name="Virat Kohli" team="RCB" score={98} />
          <PlayerCard name="Rohit Sharma" team="MI" score={92} />
          <PlayerCard name="Hardik Pandya" team="MI" score={87} />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-8 border-t border-gray-800">
        © 2025 CricScout — Powered by AI Analytics
      </footer>
    </div>
  );
};

export default Homepage;
