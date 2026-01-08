import { motion } from "framer-motion";
import Dashboard from "@/pages/homepage";
import Players from "@/pages/Players";
import { useEffect } from "react";
import gsap from "gsap";

const Index = () => {
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to(".holo-grid", {
      opacity: 0.3,
      duration: 6,
      ease: "sine.inOut",
    }).to(".holo-grid", {
      opacity: 0.6,
      duration: 6,
      ease: "sine.inOut",
    });

    gsap.to(".holo-glow", {
      duration: 15,
      repeat: -1,
      yoyo: true,
      backgroundPosition: "200% 200%",
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* === BACKGROUND LAYERS === */}
      <div
        className="absolute inset-0 holo-glow pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(0,255,255,0.15), transparent 60%), radial-gradient(circle at 70% 70%, rgba(255,0,255,0.15), transparent 60%)",
          backgroundSize: "200% 200%",
          mixBlendMode: "screen",
        }}
      />

      <div
        className="absolute inset-0 holo-grid pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* === CONTENT === */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-20"
      >
        {/* HERO / STORY */}
        <Dashboard />

        {/* SUBTLE SCROLL CUE (NO DEAD SPACE) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{
            delay: 0.6,
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="flex justify-center py-10 text-xs tracking-widest text-gray-500"
        >
          SCROLL ↓
        </motion.div>

        {/* PLAYER DATABASE — CONTINUOUS FLOW */}
        <Players />
      </motion.div>
    </div>
  );
};

export default Index;
