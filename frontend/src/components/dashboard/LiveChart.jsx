import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  ReferenceLine,
} from "recharts";

const LiveChart = ({ temperature }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (temperature !== undefined && temperature !== null) {
      setData((prev) => {
        const lastTemp = prev.length ? prev[prev.length - 1].temp : temperature;

        // Smooth temperature change (industrial feel)
        const smoothTemp =
          lastTemp + (Number(temperature) - lastTemp) * 0.3;

        return [
          ...prev.slice(-40),
          {
            time: new Date().toLocaleTimeString(),
            temp: Number(smoothTemp.toFixed(2)),
          },
        ];
      });
    }
  }, [temperature]);

  return (
    <div className="relative h-[320px] bg-gradient-to-br from-[#071226] via-[#0a1930] to-[#0b1a33] rounded-2xl p-6 border border-cyan-500/10 shadow-[0_0_60px_rgba(34,211,238,0.08)]">

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>

          {/* Gradients */}
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.7}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>

            <linearGradient id="tempGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22d3ee"/>
              <stop offset="100%" stopColor="#06b6d4"/>
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />

          {/* X Axis */}
          <XAxis
            dataKey="time"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />

          {/* Y Axis */}
          <YAxis
            domain={[60, 90]}
            stroke="rgba(255,255,255,0.25)"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Warning Line */}
          <ReferenceLine
            y={85}
            stroke="#ef4444"
            strokeDasharray="4 4"
            label="High Temp"
          />

          <Tooltip
            formatter={(value) => [`${value} °C`, "Temperature"]}
            cursor={{ stroke: "#22d3ee", strokeWidth: 1 }}
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "none",
              borderRadius: "10px"
            }}
          />

          {/* Glow Area */}
          <Area
            type="linear"
            dataKey="temp"
            stroke="none"
            fill="url(#colorTemp)"
          />

          {/* Temperature Line */}
          <Line
            type="linear"
            dataKey="temp"
            stroke="url(#tempGradient)"
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
            animationDuration={400}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveChart;