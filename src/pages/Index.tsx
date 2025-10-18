import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/homepage";
import { useEffect } from "react";
import gsap from "gsap";

const Index = () => {
  useEffect(() => {
    // Subtle holographic grid animation
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

    // Floating glow animation
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
      {/* === Holographic Animated Background Layers === */}
      <div
        className="absolute inset-0 holo-glow"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(0,255,255,0.15), transparent 60%), radial-gradient(circle at 70% 70%, rgba(255,0,255,0.15), transparent 60%)",
          backgroundSize: "200% 200%",
          mixBlendMode: "screen",
          zIndex: 0,
        }}
      ></div>

      <div
        className="absolute inset-0 holo-grid"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          zIndex: 0,
        }}
      ></div>

      {/* === Top Navigation Bar === */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10"
      >
        <Navigation />
      </motion.div>

      {/* === Dashboard Section === */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        className="relative z-10"
      >
        <Dashboard />
      </motion.div>

      {/* === Ambient Center Glow === */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,255,255,0.08), transparent 70%)",
          mixBlendMode: "overlay",
        }}
      ></motion.div>
    </div>
  );
};

export default Index;
