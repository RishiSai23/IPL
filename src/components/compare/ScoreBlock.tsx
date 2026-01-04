import React from "react";

type ScoreBlockProps = {
  title: string;
  score: number;
  highlight?: boolean;
};

const getLevel = (score: number) => {
  if (score <= 30) return "low";
  if (score <= 60) return "medium";
  return "high";
};

const getLabel = (title: string, score: number) => {
  const level = getLevel(score);

  const labels: Record<string, Record<string, string>> = {
    "Pressure Handling": {
      low: "Struggles in chases",
      medium: "Handles pressure in phases",
      high: "Performs under pressure",
    },
    "Base Skill": {
      low: "Limited shot-making",
      medium: "Technically sound",
      high: "Strong shot-making",
    },
    "Consistency": {
      low: "Highly inconsistent",
      medium: "Moderate consistency",
      high: "Reliable contributions",
    },
    "Opposition Quality": {
      low: "Weak vs strong teams",
      medium: "Mixed vs strong teams",
      high: "Strong vs Tier-A teams",
    },
  };

  return labels[title]?.[level] ?? "";
};

const getBarColor = (score: number) => {
  if (score <= 30) return "#e74c3c"; // red
  if (score <= 60) return "#f39c12"; // amber
  return "#2ecc71"; // green
};

const ScoreBlock: React.FC<ScoreBlockProps> = ({
  title,
  score,
  highlight = false,
}) => {
  const barColor = getBarColor(score);
  const label = getLabel(title, score);

  return (
    <div
      style={{
        ...styles.container,
        border: highlight ? "1px solid #facc15" : "1px solid transparent",
        boxShadow: highlight
          ? "0 0 0 1px rgba(250,204,21,0.4)"
          : "none",
      }}
    >
      {highlight && (
        <div style={styles.badge}>Key Differentiator</div>
      )}

      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        <span style={styles.score}>{Math.round(score)}/100</span>
      </div>

      <div style={styles.barBackground}>
        <div
          style={{
            ...styles.barFill,
            width: `${score}%`,
            backgroundColor: barColor,
          }}
        />
      </div>

      <div style={styles.label}>{label}</div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "#0f172a",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "12px",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: "-8px",
    right: "8px",
    background: "#facc15",
    color: "#000",
    fontSize: "10px",
    fontWeight: 700,
    padding: "2px 6px",
    borderRadius: "4px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
  },
  title: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#e5e7eb",
  },
  score: {
    fontSize: "13px",
    color: "#cbd5f5",
  },
  barBackground: {
    height: "8px",
    width: "100%",
    backgroundColor: "#334155",
    borderRadius: "4px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: "4px",
  },
  label: {
    marginTop: "6px",
    fontSize: "12px",
    color: "#94a3b8",
  },
};

export default ScoreBlock;
