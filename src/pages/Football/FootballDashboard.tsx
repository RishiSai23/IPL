import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Zap,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Calendar,
  UserPlus,
  Dumbbell,
} from "lucide-react";
import Navigation from "@/components/Navigation";
const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Top Speed",
      value: "34.6 km/h",
      icon: Zap,
      color: "from-emerald-500 to-green-600",
    },
    {
      title: "Pass Accuracy",
      value: "87%",
      icon: Target,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Stamina Index",
      value: "92",
      icon: Activity,
      color: "from-lime-500 to-green-600",
    },
    {
      title: "Distance Covered",
      value: "10.4 km",
      icon: TrendingUp,
      color: "from-green-600 to-emerald-700",
    },
    {
      title: "Goals Scored",
      value: "14",
      icon: Trophy,
      color: "from-emerald-600 to-green-700",
    },
    {
      title: "Assists",
      value: "9",
      icon: Users,
      color: "from-green-500 to-lime-600",
    },
  ];

  const upcomingMatches = [
    { team1: "Arsenal", team2: "Man City", date: "Oct 25, 7:30 PM" },
    { team1: "Liverpool", team2: "Chelsea", date: "Oct 28, 6:45 PM" },
    { team1: "Barcelona", team2: "Real Madrid", date: "Nov 2, 8:00 PM" },
  ];

  // Example static flashcards (replace with actual flashcards as needed)
  const flashcards = [
    {
      question: "Which player has the highest number of assists?",
      answer: "Kevin De Bruyne",
    },
    {
      question: "What is a hat-trick?",
      answer: "Scoring 3 goals in a match",
    },
    {
      question: "Minimum players needed to start a match?",
      answer: "7 players",
    },
  ];

  // handlers removed (unused)

  const handlePhysicalTest = () => {
    navigate("/football/physical-test");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#0a0a0a] text-foreground mt-8">
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                className="glass-card rounded-xl p-6 glow-green-hover cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} glow-green`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Activity className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.div>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Flashcards Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-primary" />
              Football Flashcards
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcards.map((card, idx) => (
                <div
                  key={idx}
                  className="glass-card p-6 rounded-xl glow-green-hover"
                >
                  <p className="font-semibold text-foreground mb-2">
                    {card.question}
                  </p>
                  <div className="bg-secondary/50 rounded p-3 border border-border text-muted-foreground text-md">
                    {card.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compare and Test Buttons Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              onClick={() => {
                navigate("/comparison");
              }}
              className="flex items-center gap-2 glass-card rounded-xl p-4 glow-green-hover text-lg font-semibold transition-all duration-200"
            >
              <Users className="w-6 h-6 text-primary" />
              Compare Two Players
            </Button>
            <Button
              onClick={handlePhysicalTest}
              className="flex items-center gap-2 glass-card rounded-xl p-4 glow-green-hover text-lg font-semibold transition-all duration-200"
            >
              <Dumbbell className="w-6 h-6 text-primary" />
              Physical Test
            </Button>
          </div>

          {/* Upcoming Matches */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="glass-card rounded-xl p-6 glow-green"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Upcoming Matches</h2>
            </div>
            <div className="space-y-4">
              {upcomingMatches.map((match, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  whileHover={{
                    x: 8,
                    transition: { duration: 0.2 },
                  }}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border hover:border-primary transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary glow-green" />
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {match.team1} vs {match.team2}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {match.date}
                      </p>
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
