import { motion } from "framer-motion";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative pt-32 pb-28 px-6 md:px-20 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-semibold tracking-tight"
        >
          PULSE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-6 max-w-2xl text-lg text-gray-300"
        >
          A context-aware cricket scouting and decision-support platform
          designed for domestic selectors and performance teams.
        </motion.p>

        <div className="mt-10 text-sm text-gray-400">
          Syed Mushtaq Ali Trophy · Real match data · Explainable logic
        </div>
      </section>

      {/* INTELLIGENCE PILLARS */}
      <section className="px-6 md:px-20 py-20 max-w-7xl mx-auto border-t border-gray-800">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-lg font-medium text-teal-400">
              Pressure-aware evaluation
            </h3>
            <p className="mt-3 text-gray-400 leading-relaxed">
              Performances are scored based on match situation — not raw
              aggregates. Knockouts, chases, collapses, and context matter.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-teal-400">
              Opposition-adjusted context
            </h3>
            <p className="mt-3 text-gray-400 leading-relaxed">
              Runs and spells are weighted by opposition quality to avoid
              stat-padding and surface true readiness.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-teal-400">
              Explainable selection logic
            </h3>
            <p className="mt-3 text-gray-400 leading-relaxed">
              Every score can be broken down, justified, and defended — no
              black-box intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* DATA CREDIBILITY STRIP */}
      <section className="px-6 md:px-20 py-10 max-w-7xl mx-auto border-t border-gray-800 text-sm text-gray-400">
        Data source: Official domestic scorecards · Seasons: 2025–26 · Teams:
        Tamil Nadu, Kerala
      </section>

      {/* DOMESTIC SNAPSHOT */}
      <section className="px-6 md:px-20 py-20 max-w-7xl mx-auto border-t border-gray-800">
        <h2 className="text-xl font-medium mb-10">
          Domestic performance snapshots
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <div>
              <div className="text-gray-200">Narayan Jagadeesan</div>
              <div className="text-sm text-gray-500">Tamil Nadu · Batter</div>
            </div>
            <div className="text-teal-400 font-medium">Final Score: 37</div>
          </div>

          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <div>
              <div className="text-gray-200">Rohan Kunnummal</div>
              <div className="text-sm text-gray-500">Kerala · Batter</div>
            </div>
            <div className="text-teal-400 font-medium">Final Score: 63</div>
          </div>
        </div>
      </section>

      {/* SYSTEM FLOW */}
      <section className="px-6 md:px-20 py-24 max-w-7xl mx-auto border-t border-gray-800">
        <h2 className="text-xl font-medium mb-12">How the system works</h2>

        <div className="space-y-6 text-gray-400">
          <div>Scorecard-level match data</div>
          <div className="ml-4">↓ Context tagging</div>
          <div className="ml-8">↓ Explainable scoring engine</div>
          <div className="ml-12">↓ Selection-ready intelligence</div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-20 py-20 max-w-7xl mx-auto border-t border-gray-800">
        <a
          href="/players"
          className="inline-block text-teal-400 text-lg font-medium hover:underline"
        >
          Enter the scouting console →
        </a>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-20 py-10 text-sm text-gray-500 border-t border-gray-800">
        Built for domestic cricket analysis. Explainable by design.
      </footer>
    </div>
  );
};

export default Homepage;
