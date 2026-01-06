import CompareHero from "./CompareHero";
import MetricRow from "./MetricRow";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface Props {
  player1: any;
  player2: any;
  mode: "batting" | "bowling";
}

export default function CompareSection({ player1, player2, mode }: Props) {
  const diffs: [string, number][] = [
    ["pressure", Math.abs(player1.stats.pressureScore - player2.stats.pressureScore)],
    ["base skill", Math.abs(player1.stats.baseSkillScore - player2.stats.baseSkillScore)],
    ["consistency", Math.abs(player1.stats.consistencyScore - player2.stats.consistencyScore)],
    ["opposition quality", Math.abs(
      player1.stats.oppositionQualityScore -
      player2.stats.oppositionQualityScore
    )],
  ];

  const [winningMetricKey, winningMetricDiff] =
    diffs.sort((a, b) => b[1] - a[1])[0];

  const winner =
    player1.stats.finalScore > player2.stats.finalScore ? player1 : player2;

  const loser = winner === player1 ? player2 : player1;

  return (
    <section className="space-y-12">
      <CompareHero player1={player1} player2={player2} />

      <div className="space-y-4">
        <MetricRow
          title="Pressure"
          leftScore={Math.round(player1.stats.pressureScore)}
          rightScore={Math.round(player2.stats.pressureScore)}
          highlight={winningMetricKey === "pressure"}
        />
        <MetricRow
          title="Base Skill"
          leftScore={Math.round(player1.stats.baseSkillScore)}
          rightScore={Math.round(player2.stats.baseSkillScore)}
          highlight={winningMetricKey === "base skill"}
        />
        <MetricRow
          title="Consistency"
          leftScore={Math.round(player1.stats.consistencyScore)}
          rightScore={Math.round(player2.stats.consistencyScore)}
          highlight={winningMetricKey === "consistency"}
        />
        <MetricRow
          title="Opposition Quality"
          leftScore={Math.round(player1.stats.oppositionQualityScore)}
          rightScore={Math.round(player2.stats.oppositionQualityScore)}
          highlight={winningMetricKey === "opposition quality"}
        />
      </div>

      <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 border border-cyan-500/30 rounded-2xl">
        <CardContent className="py-10 px-8 text-center space-y-5">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Trophy className="text-cyan-400" size={28} />
            </div>
          </div>

          <h2 className="text-2xl font-extrabold tracking-wide">
            Recommended Pick
          </h2>

          <div className="text-3xl font-bold text-purple-400">
            {winner.name}
          </div>

          <p className="text-gray-300 max-w-2xl mx-auto">
            {winner.name} is preferred over {loser.name} due to a clear advantage
            in <span className="text-yellow-400 font-semibold">
              {winningMetricKey}
            </span>{" "}
            under <span className="text-cyan-400 font-semibold">{mode}</span>{" "}
            conditions.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
