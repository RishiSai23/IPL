// file: src/components/PerformanceChart.tsx
import type { ReactElement } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

type RadarSeries = {
  dataKey: string;
  color?: string;
  name?: string;
  fillOpacity?: number;
  strokeWidth?: number;
};

interface PerformanceChartProps {
  type: "line" | "bar" | "radar";
  data: any[];
  dataKey?: string; // required for line/bar; optional for radar
  series?: RadarSeries[]; // for multi-series radar
  xAxisKey?: string;
  title?: string;
  color?: string; // fallback color
  height?: number;
}

const PerformanceChart = ({
  type,
  data,
  dataKey,
  series,
  xAxisKey = "name",
  title,
  color = "hsl(var(--primary))",
  height = 300,
}: PerformanceChartProps) => {
  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    boxShadow: "var(--shadow-card)",
  } as const;

  const renderChart = (): ReactElement => {
    switch (type) {
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xAxisKey} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey={dataKey!}
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        );

      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xAxisKey} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey={dataKey!} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case "radar": {
        const radarSeries =
          series && series.length > 0 ? series : dataKey ? [{ dataKey, color }] : [];
        return (
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey={xAxisKey}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <PolarRadiusAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              tickCount={6}
            />
            {radarSeries.map((s, idx) => (
              <Radar
                key={s.dataKey + idx}
                dataKey={s.dataKey}
                stroke={s.color || color}
                fill={s.color || color}
                fillOpacity={s.fillOpacity ?? 0.1}
                strokeWidth={s.strokeWidth ?? 2}
                name={s.name}
              />
            ))}
            <Tooltip contentStyle={tooltipStyle} />
          </RadarChart>
        );
      }

      default:
        // Should never happen given the union type, but guarantees non-null for TS
        return <div />;
    }
  };

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;