import { useState } from "react";
import Navigation from "@/components/Navigation";
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

    if (target.type === "checkbox") {
      newValue = target.checked;
    } else if (target.type === "number") {
      newValue = Number(target.value);
    }

    setFormData({
      ...formData,
      [name]: newValue as never,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
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
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
          <h1 className="text-2xl font-semibold text-center mb-6">
            🏏 Player Performance Score Predictor
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="flex flex-col">
                <label className="capitalize mb-1 text-sm font-medium text-gray-700">
                  {key.replaceAll("_", " ")}
                </label>
                {typeof formData[key as keyof typeof formData] === "boolean" ? (
                  <input
                    type="checkbox"
                    name={key}
                    checked={formData[key as keyof typeof formData] as boolean}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type={
                      typeof formData[key as keyof typeof formData] === "number"
                        ? "number"
                        : "text"
                    }
                    name={key}
                    value={
                      typeof formData[key as keyof typeof formData] === "number"
                        ? (formData[key as keyof typeof formData] as number)
                        : (formData[key as keyof typeof formData] as string)
                    }
                    onChange={handleChange}
                    className="border rounded-lg p-2"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="col-span-2 bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
            >
              {loading ? "Predicting..." : "Get Performance Score"}
            </button>
          </form>

          {predictedScore !== null && (
            <div className="mt-6 text-center text-xl font-bold text-green-600">
              Predicted Performance Score: {predictedScore.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlayerScore;
