import { motion } from "framer-motion";
import stadiumVideo from "@/assets/cricket-stadium-video.mp4";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src={stadiumVideo} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 min-h-screen flex flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-semibold"
        >
          Cricket scouting,<br />
          <span className="text-teal-400">made defensible.</span>
        </motion.h1>

        <p className="mt-6 max-w-3xl text-gray-300 text-lg">
          PULSE evaluates domestic cricketers through pressure-aware,
          opposition-adjusted metrics.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
