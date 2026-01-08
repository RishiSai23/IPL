import { motion } from "framer-motion";

const metrics = [
  {
    title: "Pressure-adjusted runs",
    description:
      "Runs weighted by match situation, wickets in hand, and chase difficulty.",
    value: 82,
    color: "bg-teal-400",
  },
  {
    title: "Opponent-weighted wickets",
    description:
      "Wickets adjusted for batting quality and phase of play.",
    value: 68,
    color: "bg-cyan-400",
  },
  {
    title: "Consistency index",
    description:
      "Rewards repeatable performance and penalizes volatility.",
    value: 74,
    color: "bg-emerald-400",
  },
];

const StatsSection = () => {
  return (
    <section
      id="metrics"
      className="px-6 md:px-20 py-24 max-w-7xl mx-auto border-t border-white/10"
    >
      {/* Section heading */}
      <div className="mb-14">
        <h2 className="text-2xl font-semibold mb-2">Key Metrics</h2>
        <p className="text-gray-400 text-sm max-w-xl">
          Core indicators used to evaluate impact, difficulty, and reliability —
          beyond traditional aggregates.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid md:grid-cols-3 gap-10">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-black/40 p-6 backdrop-blur"
          >
            {/* Title */}
            <h3 className="text-lg font-medium mb-2 text-white">
              {metric.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-6">
              {metric.description}
            </p>

            {/* Graph / progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Relative strength</span>
                <span>{metric.value}/100</span>
              </div>

              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className={`h-full ${metric.color}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
