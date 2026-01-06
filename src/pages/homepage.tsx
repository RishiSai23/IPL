import { motion } from "framer-motion";

const Homepage = () => {
  return (
    <div className="bg-black text-white">
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-semibold tracking-tight"
        >
          PULSE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9 }}
          className="mt-6 max-w-2xl text-xl text-gray-300 leading-relaxed"
        >
          A context-aware cricket scouting and decision-support platform
          designed for domestic selectors and performance teams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.9 }}
          className="mt-8 text-sm text-gray-400 tracking-wide"
        >
          Syed Mushtaq Ali Trophy · Real match data · Explainable logic
        </motion.div>

        {/* Subtle scroll cue (no layout impact) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{
            delay: 1.2,
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs text-gray-500 tracking-widest"
        >
          SCROLL ↓
        </motion.div>
      </section>

      {/* ================= INTELLIGENCE PILLARS ================= */}
      <section className="px-6 md:px-20 py-20 max-w-7xl mx-auto border-t border-gray-800">
        <div className="mb-14 text-gray-400 tracking-wide text-sm">
          CORE INTELLIGENCE
        </div>

        <div className="grid md:grid-cols-3 gap-14">
          <div>
            <h3 className="text-lg font-medium text-teal-400 tracking-wide">
              Pressure-aware evaluation
            </h3>
            <p className="mt-3 text-gray-400 leading-relaxed">
              Performances are scored based on match situation — not raw
              aggregates. Knockouts, chases, collapses, and context matter.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-teal-400 tracking-wide">
              Opposition-adjusted context
            </h3>
            <p className="mt-3 text-gray-400 leading-relaxed">
              Runs and spells are weighted by opposition quality to avoid
              stat-padding and surface true readiness.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-teal-400 tracking-wide">
              Explainable selection logic
            </h3>
            <p className="mt-3 text-gray-400 leading-relaxed">
              Every score can be broken down, justified, and defended — no
              black-box intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* ================= DATA STRIP ================= */}
      <section className="px-6 md:px-20 py-6 max-w-7xl mx-auto border-t border-gray-800 text-xs text-gray-500 tracking-wide">
        Data source: Official domestic scorecards · Seasons: 2025–26 · Teams:
        Tamil Nadu, Kerala
      </section>

      {/* ================= SYSTEM FLOW ================= */}
      <section className="px-6 md:px-20 py-20 max-w-7xl mx-auto border-t border-gray-800">
        <h2 className="text-lg font-medium mb-10 tracking-wide">
          HOW THE SYSTEM WORKS
        </h2>

        <div className="space-y-4 text-gray-400 text-sm">
          <div>Scorecard-level match data</div>
          <div className="ml-4">↓ Context tagging</div>
          <div className="ml-8">↓ Explainable scoring engine</div>
          <div className="ml-12">↓ Selection-ready intelligence</div>
        </div>
      </section>

      
    </div>
  );
};

export default Homepage;
