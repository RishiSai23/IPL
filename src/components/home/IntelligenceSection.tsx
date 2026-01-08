import { motion } from "framer-motion";

const IntelligenceSection = () => {
  return (
    <section
      id="intelligence"
      className="scroll-mt-20 px-6 md:px-20 py-28 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="mb-14">
        <div className="text-xs tracking-widest text-teal-400 mb-3">
          METHODOLOGY
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold">
          How <span className="text-teal-400">PULSE</span> evaluates players
        </h2>
        <p className="mt-4 max-w-3xl text-gray-400">
          A transparent breakdown of the scoring dimensions that power
          selection intelligence.
        </p>
      </div>

      <div className="space-y-10">

        {/* FINAL SCORE */}
        <Card title="Final Score" right="0–100 scale">
          <p className="text-gray-400 text-sm max-w-3xl">
            The composite evaluation metric that combines all scoring dimensions
            into a single defensible number. This is the primary ranking signal
            used in selection contexts.
          </p>

          <div className="mt-6 space-y-2">
            <ScoreRow label="Excellent" width="90%" color="bg-teal-400" />
            <ScoreRow label="Good" width="70%" color="bg-green-500" />
            <ScoreRow label="Average" width="45%" color="bg-yellow-400" />
            <ScoreRow label="Below avg" width="25%" color="bg-orange-500" />
          </div>
        </Card>

        {/* PRESSURE SCORE */}
        <Card title="Pressure Score">
          <p className="text-gray-400 text-sm max-w-3xl mb-6">
            Measures performance in high-stakes situations. For batters:
            contributions when the team is under pressure. For bowlers:
            effectiveness in death overs and breakthrough moments.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="text-teal-400 mb-3">Batter pressure contexts</h4>
              <ul className="space-y-2 text-gray-400 list-disc ml-5">
                <li>Team 3+ wickets down early</li>
                <li>Chasing with required rate above 8</li>
                <li>Match-defining partnerships</li>
              </ul>
            </div>

            <div>
              <h4 className="text-teal-400 mb-3">Bowler pressure contexts</h4>
              <ul className="space-y-2 text-gray-400 list-disc ml-5">
                <li>Death overs (16–20 T20, 45–50 ODI)</li>
                <li>Breaking established partnerships</li>
                <li>Defending low totals</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* CONSISTENCY SCORE */}
        <Card title="Consistency Score">
          <p className="text-gray-400 text-sm max-w-3xl mb-6">
            Evaluates variance in performance across matches. A player who
            delivers 40–60 regularly scores higher than one who alternates
            between extremes. Penalizes volatility, rewards reliability.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-sm">
            <div>
              <div className="text-gray-500 mb-2">High consistency example</div>
              <BarGraph bars={8} color="bg-teal-400" />
            </div>

            <div>
              <div className="text-gray-500 mb-2">Low consistency example</div>
              <BarGraph bars={8} color="bg-yellow-500" random />
            </div>
          </div>
        </Card>

        {/* OPPOSITION QUALITY */}
        <Card title="Opposition Quality Score">
          <p className="text-gray-400 text-sm max-w-3xl mb-6">
            Weights performance based on the strength of opposition faced. Runs
            against top-tier bowling attacks carry more weight than runs against
            weaker units.
          </p>

          <div className="space-y-4 text-sm">
            <Tier label="Tier 1" width="100%" weight="1.5× weight" />
            <Tier label="Tier 2" width="75%" weight="1.2× weight" />
            <Tier label="Tier 3" width="55%" weight="1.0× weight" />
          </div>
        </Card>

        {/* EXPLAINABILITY */}
        <Card highlight>
          <h4 className="text-teal-400 mb-3">On explainability</h4>
          <p className="text-gray-400 text-sm max-w-4xl">
            Every number in PULSE traces back to real match data. There are no
            hidden weights or opaque adjustments. When a selector asks “why does
            this player score 82?”, the answer is decomposable into the four
            dimensions above — intelligence you can defend in any selection
            meeting.
          </p>
        </Card>
      </div>
    </section>
  );
};

export default IntelligenceSection;

/* ----------------- REUSABLE UI ----------------- */

const Card = ({
  title,
  right,
  highlight,
  children,
}: {
  title?: string;
  right?: string;
  highlight?: boolean;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className={`rounded-xl border ${
      highlight
        ? "border-teal-400/30 bg-teal-400/5"
        : "border-white/10 bg-black/40"
    } p-6`}
  >
    {title && (
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {right && <span className="text-teal-400 text-sm">{right}</span>}
      </div>
    )}
    {children}
  </motion.div>
);

const ScoreRow = ({
  label,
  width,
  color,
}: {
  label: string;
  width: string;
  color: string;
}) => (
  <div>
    <div className="flex justify-between text-xs text-gray-500 mb-1">
      <span>{label}</span>
    </div>
    <div className="h-1.5 bg-white/10 rounded">
      <div className={`h-1.5 ${color} rounded`} style={{ width }} />
    </div>
  </div>
);

const BarGraph = ({
  bars,
  color,
  random,
}: {
  bars: number;
  color: string;
  random?: boolean;
}) => (
  <div className="flex gap-1 h-12 items-end">
    {Array.from({ length: bars }).map((_, i) => (
      <div
        key={i}
        className={`${color} rounded-sm`}
        style={{
          width: "12%",
          height: random ? `${20 + Math.random() * 60}%` : "80%",
          opacity: 0.8,
        }}
      />
    ))}
  </div>
);

const Tier = ({
  label,
  width,
  weight,
}: {
  label: string;
  width: string;
  weight: string;
}) => (
  <div>
    <div className="flex justify-between text-xs text-gray-500 mb-1">
      <span>{label}</span>
      <span>{weight}</span>
    </div>
    <div className="h-2 bg-white/10 rounded">
      <div className="h-2 bg-teal-400 rounded" style={{ width }} />
    </div>
  </div>
);
