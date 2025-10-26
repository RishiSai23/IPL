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
      const response = await fetch("http://127.0.0.1:8000/predict/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

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
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#120b2e] to-[#0a0a0a] flex justify-center items-center p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-b from-[#0a0a0a]/80 via-[#1a1240]/70 to-[#0a0a0a]/90 border border-cyan-500/30 rounded-3xl p-10 w-full max-w-5xl shadow-[0_0_30px_rgba(0,255,255,0.15)] backdrop-blur-lg"
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_10px_rgba(255,0,255,0.4)]">
              🏏 Player Performance Predictor
            </h1>
            <p className="text-cyan-200/70 text-sm md:text-base">
              Smart AI insights for player performance based on match context ⚡
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 1️⃣ Player Info */}
            <SectionCard
              title="1️⃣ Player & Match Info"
              icon={<Trophy className="text-purple-400" />}
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
              icon={<CloudSun className="text-cyan-400" />}
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
              icon={<BarChart3 className="text-blue-400" />}
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
              icon={<Sparkles className="text-pink-400" />}
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
              className="w-full py-3 rounded-xl font-semibold tracking-wide bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,255,0.4)] transition-all duration-300"
            >
              {loading ? "Predicting..." : "🚀 Predict Performance Score"}
            </motion.button>
          </form>

          {/* Predicted Score */}
          {predictedScore !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 text-center text-3xl font-extrabold bg-gradient-to-r from-green-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,200,0.5)]"
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
    className="bg-gradient-to-b from-[#0d0d1a]/70 to-[#1b0e33]/60 border border-cyan-400/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,0,255,0.2)] transition-all duration-300"
  >
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h2 className="text-lg font-semibold text-cyan-300">{title}</h2>
    </div>
    {children}
  </motion.section>
);

/* 🧩 Dark Mode Input Field */
const InputField = ({ label, name, value, onChange, type = "text" }: any) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-cyan-300 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label}`}
      className="border border-cyan-400/30 rounded-lg p-2 bg-[#0f0f1a] text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 focus:outline-none shadow-sm transition-all"
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
      className="h-5 w-5 accent-cyan-500 focus:ring-2 focus:ring-purple-500"
    />
    <label className="text-sm font-medium text-cyan-300">{label}</label>
  </div>
);

export default PlayerScore;
