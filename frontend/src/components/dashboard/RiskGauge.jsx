import toast from "react-hot-toast";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from "recharts";
import { useEffect, useState } from "react";

const RiskGauge = ({ risk = 0 }) => {
  const [alertShown, setAlertShown] = useState(false);

  // 🔥 Convert probability (0–1) to percentage (0–100)
  const percentage = Number(risk) || 0;

  // 🚨 Toast logic
  useEffect(() => {
    if (percentage > 80 && !alertShown) {
      toast.error("⚠ CRITICAL SYSTEM RISK DETECTED", {
        duration: 5000
      });
      setAlertShown(true);
    }

    if (percentage <= 80) {
      setAlertShown(false);
    }
  }, [percentage, alertShown]);

  const status =
    percentage > 80
      ? "CRITICAL"
      : percentage > 50
      ? "WARNING"
      : "STABLE";

  const color =
    percentage > 80
      ? "#ef4444"
      : percentage > 50
      ? "#f59e0b"
      : "#22c55e";

  const data = [
    {
      name: "Risk",
      value: percentage,
      fill: color
    }
  ];

  return (
    <div
      className={`relative w-full h-[280px] flex items-center justify-center
      rounded-3xl p-6 transition-all duration-500
      ${
        percentage > 80
          ? "shadow-red-500/30 shadow-lg"
          : percentage > 50
          ? "shadow-yellow-500/20 shadow-lg"
          : "shadow-green-500/20 shadow-lg"
      }`}
    >
      <RadialBarChart
        width={260}
        height={200}
        cx={130}
        cy={150}
        innerRadius="65%"
        outerRadius="95%"
        barSize={18}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          tick={false}
        />
        <RadialBar
          minAngle={15}
          background={{ fill: "rgba(255,255,255,0.05)" }}
          clockWise
          dataKey="value"
        />
      </RadialBarChart>

      <div
        className="absolute bottom-10 text-5xl font-extrabold transition-all duration-500"
        style={{ color }}
      >
        {percentage.toFixed(1)}%
      </div>

      <div className="absolute bottom-2 text-xs tracking-widest text-gray-400">
        {status}
      </div>
    </div>
  );
};

export default RiskGauge;