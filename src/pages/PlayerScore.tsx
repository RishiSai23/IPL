import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { BarChart3, CloudSun, Sparkles, Trophy } from "lucide-react";
import { useState } from "react";

const PlayerScore = () => {
  const [formData, setFormData] = useState({
    player_name: "",
    role: "All-Rounder",
    match_format: "ODI",
    pitch_type: "Dry",
    venue_type: "Home",
    weather_condition: "Cloudy",
    opponent_strength: 10,
    batting_position: 1,
    wickets_fallen_before: 1,
    required_run_rate: 8.0,
    is_second_innings: true,
    match_stage: 1,
    match_pressure: 10,
    runs_scored: 0,
    balls_faced: 0,
    fours: 0,
    sixes: 0,
    wickets_taken: 0,
    overs_bowled: 0,
    economy_rate: 0,
    catches: 0,
    runouts: 0,
    stumpings: 0,
  });

  const [predictedScore, setPredictedScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const name = target.name as keyof typeof formData;
    let newValue: string | number | boolean = target.value;

    if (target.type === "checkbox") newValue = target.checked;
    else if (target.type === "number") newValue = Number(target.value);

    setFormData({ ...formData, [name]: newValue as never });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict/performance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Prediction failed");
      const data = await response.json();
      setPredictedScore(data.predicted_score);
    } catch (error) {
      console.error(error);
      setPredictedScore(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex justify-center items-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-2xl border border-orange-100 shadow-[0_8px_40px_rgba(255,165,0,0.15)] rounded-3xl p-10 w-full max-w-5xl"
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-500 bg-clip-text text-transparent mb-3">
              🏏 Player Performance Predictor
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Smart AI insights for player performance based on match context ⚡
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 1️⃣ Player Info */}
            <SectionCard
              title="1️⃣ Player & Match Info"
              icon={<Trophy className="text-orange-500" />}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <InputField
                  label="Player Name"
                  name="player_name"
                  value={formData.player_name}
                  onChange={handleChange}
                />
                <InputField
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                />
                <InputField
                  label="Match Format"
                  name="match_format"
                  value={formData.match_format}
                  onChange={handleChange}
                />
              </div>
            </SectionCard>

            {/* 2️⃣ Match Conditions */}
            <SectionCard
              title="2️⃣ Match Conditions"
              icon={<CloudSun className="text-blue-500" />}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <InputField
                  label="Pitch Type"
                  name="pitch_type"
                  value={formData.pitch_type}
                  onChange={handleChange}
                />
                <InputField
                  label="Venue Type"
                  name="venue_type"
                  value={formData.venue_type}
                  onChange={handleChange}
                />
                <InputField
                  label="Weather Condition"
                  name="weather_condition"
                  value={formData.weather_condition}
                  onChange={handleChange}
                />
                <InputField
                  label="Opponent Strength"
                  name="opponent_strength"
                  value={formData.opponent_strength}
                  onChange={handleChange}
                  type="number"
                />
              </div>
            </SectionCard>

            {/* 3️⃣ Live Situation */}
            <SectionCard
              title="3️⃣ Live Situation"
              icon={<BarChart3 className="text-indigo-500" />}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <InputField
                  label="Batting Position"
                  name="batting_position"
                  value={formData.batting_position}
                  onChange={handleChange}
                  type="number"
                />
                <InputField
                  label="Wickets Fallen Before"
                  name="wickets_fallen_before"
                  value={formData.wickets_fallen_before}
                  onChange={handleChange}
                  type="number"
                />
                <InputField
                  label="Required Run Rate"
                  name="required_run_rate"
                  value={formData.required_run_rate}
                  onChange={handleChange}
                  type="number"
                />
                <CheckboxField
                  label="Is Second Innings"
                  name="is_second_innings"
                  checked={formData.is_second_innings}
                  onChange={handleChange}
                />
                <InputField
                  label="Match Stage"
                  name="match_stage"
                  value={formData.match_stage}
                  onChange={handleChange}
                  type="number"
                />
                <InputField
                  label="Match Pressure"
                  name="match_pressure"
                  value={formData.match_pressure}
                  onChange={handleChange}
                  type="number"
                />
              </div>
            </SectionCard>

            {/* 4️⃣ Performance Stats */}
            <SectionCard
              title="4️⃣ Performance Stats"
              icon={<Sparkles className="text-pink-500" />}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                  "runs_scored",
                  "balls_faced",
                  "fours",
                  "sixes",
                  "wickets_taken",
                  "overs_bowled",
                  "economy_rate",
                  "catches",
                  "runouts",
                  "stumpings",
                ].map((key) => (
                  <InputField
                    key={key}
                    label={key
                      .replaceAll("_", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                    name={key}
                    value={(formData as any)[key]}
                    onChange={handleChange}
                    type="number"
                  />
                ))}
              </div>
            </SectionCard>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 via-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-orange-200/50 hover:shadow-orange-400/60 transition-all duration-300"
            >
              {loading ? "Predicting..." : "🚀 Predict Performance Score"}
            </motion.button>
          </form>

          {predictedScore !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 text-center text-3xl font-extrabold bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 bg-clip-text text-transparent"
            >
              🎯 Predicted Performance Score: {predictedScore.toFixed(2)}
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

/* --- Reusable Components --- */

const SectionCard = ({ title, icon, children }: any) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="bg-gradient-to-br from-white/70 to-orange-50/60 border border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all duration-300"
  >
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    {children}
  </motion.section>
);

const InputField = ({ label, name, value, onChange, type = "text" }: any) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none bg-white/80 hover:bg-white shadow-sm transition-all"
    />
  </div>
);

const CheckboxField = ({ label, name, checked, onChange }: any) => (
  <div className="flex items-center gap-2 mt-7">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-5 w-5 accent-orange-500 focus:ring-2 focus:ring-orange-400"
    />
    <label className="text-sm font-medium text-gray-700">{label}</label>
  </div>
);

export default PlayerScore;
