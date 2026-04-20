import { useState, useEffect, useMemo, useContext } from "react";
import { predictImage } from "../api/qualityApi";
import ReactCompareImage from "react-compare-image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { RealtimeContext } from "../context/RealtimeContext";

const Quality = () => {
  const { events } = useContext(RealtimeContext);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  /* ------------------ REALTIME EVENT LISTENER ------------------ */
  useEffect(() => {
    if (events && events.length > 0) {
      const latestEvent = events[0];

      if (latestEvent.type === "new_prediction") {
        setHistory((prev) => [latestEvent.data, ...prev]);
      }
    }
  }, [events]);

  /* ------------------ FILE HANDLER ------------------ */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);

    if (f) {
      setPreview(URL.createObjectURL(f));
      setResult(null);
    }
  };

  /* ------------------ PREDICTION ------------------ */
  const handleUpload = async () => {
    if (!file) {
      alert("Please select image first");
      return;
    }

    try {
      setLoading(true);

      const response = await predictImage(file);

      console.log("Prediction result:", response);

      const data = response;
setResult(data);
setHistory((prev) => [data, ...prev]);

    } catch (error) {

      console.error("UPLOAD ERROR:", error);

      if (error.response) {
        console.log("SERVER ERROR:", error.response.data);
        alert(error.response.data.error || "Server error");
      }

    } finally {
      setLoading(false);
    }
  };

  /* ------------------ KPI CALCULATIONS ------------------ */
  const defectRate = useMemo(() => {

    if (!history.length) return 0;

    const defects = history.filter((h) => h.defect).length;

    return ((defects / history.length) * 100).toFixed(1);

  }, [history]);

  /* ------------------ TREND DATA ------------------ */
  const trendData = useMemo(() => {

    return history.slice(0, 10).map((h, i) => ({
      name: i,
      confidence: Number(((h.confidence || 0) * 100).toFixed(1))
    }));

  }, [history]);

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold tracking-wide">
        🏭 Industrial AI Vision Control
      </h1>

      {/* KPI PANEL */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-[#0f172a] p-6 rounded-2xl shadow-xl border border-cyan-500/20">
          <h4>Total Inspections</h4>
          <p className="text-3xl font-bold">{history.length}</p>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-2xl shadow-xl border border-red-500/20">
          <h4>Defect Rate</h4>
          <p className="text-3xl font-bold text-red-400">{defectRate}%</p>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-2xl shadow-xl border border-green-500/20">
          <h4>System Status</h4>
          <p className="text-green-400 animate-pulse">● LIVE</p>
        </div>

      </div>

      {/* UPLOAD SECTION */}
      <div className="flex gap-4">
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-cyan-500 px-6 py-2 rounded-xl"
        >
          {loading ? "Analyzing..." : "Start Inspection"}
        </button>
      </div>

      {/* LIVE CAMERA */}
      <div>
        <h3 className="mb-2 font-semibold">📡 Live Production Camera</h3>

        <img
          src="http://localhost:5000/video_feed"
          alt="Live Feed"
          className="rounded-xl border border-cyan-500/20"
        />
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div>
          <h3 className="mb-2 font-semibold">📷 Selected Image</h3>

          <img
            src={preview}
            alt="preview"
            className="w-64 rounded-xl border"
          />
        </div>
      )}

      {/* HEATMAP COMPARISON */}
      {preview && result && (
        <div>

          <h3 className="mb-2 font-semibold">🎯 AI Defect Heatmap Compare</h3>

          <ReactCompareImage
            leftImage={preview}
            rightImage={`data:image/jpeg;base64,${result.heatmap}`}
          />

        </div>
      )}

      {/* RESULT PANEL */}
      {result && (
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-indigo-500/20">

          <h3 className="text-xl font-bold">
            {result.defect ? "🔴 DEFECT DETECTED" : "🟢 NORMAL"}
          </h3>

          <p>
            Confidence: {(result.confidence * 100).toFixed(1)}%
          </p>

          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="mt-4 bg-indigo-500 px-4 py-2 rounded-lg"
          >
            Toggle AI Reasoning
          </button>

          {showReasoning && (
            <div className="mt-4 bg-black/30 p-4 rounded-xl">
              {result.reasoning}
            </div>
          )}

        </div>
      )}

      {/* CONFIDENCE TREND */}
      <div className="bg-[#0f172a] p-6 rounded-2xl">

        <h3 className="mb-4 font-semibold">📈 Confidence Trend</h3>

        <div style={{ width: "100%", height: 250 }}>

          <ResponsiveContainer>

            <LineChart data={trendData}>

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#22c55e"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};

export default Quality;