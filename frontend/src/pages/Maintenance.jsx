import { useState, useEffect, useMemo } from "react";
import { predictSensor } from "../api/maintenanceApi";
import RiskGauge from "../components/dashboard/RiskGauge";
import API from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Maintenance = () => {

  const [form, setForm] = useState({
    temperature: "",
    pressure: "",
    vibration: "",
    load: "",
    humidity: "",
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [liveRisk, setLiveRisk] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/history");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {

    socket.on("sensor_update", (data) => {

      if (!liveMode) return;

      setForm({
        temperature: data.temperature,
        pressure: 50,
        vibration: data.vibration,
        load: data.system_load,
        humidity: 40
      });

      setLiveRisk(data.risk_level / 100);

    });

    return () => socket.off("sensor_update");

  }, [liveMode]);

  const validateForm = () => {

    let newErrors = {};

    Object.keys(form).forEach((key) => {

      if (!form[key]) newErrors[key] = "Required";
      else if (isNaN(form[key])) newErrors[key] = "Must be numeric";

    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async () => {

    if (!validateForm()) return;

    try {

      setLoading(true);

      const response = await predictSensor(form);

      setResult(response);

      toast.success("Prediction Completed Successfully");

      fetchHistory();

    } catch (err) {

      toast.error("Prediction Failed");

    } finally {

      setLoading(false);

    }

  };


  const latestRisk = liveMode
    ? liveRisk || 0
    : result?.risk_level || 0;

  const previousRisk =
    history.length > 1
      ? history[1].failure_probability
      : latestRisk;

  const trendingUp = latestRisk > previousRisk;

  const smoothedRisk = useMemo(() => {

    if (history.length < 3) return latestRisk;

    const recent = history.slice(0, 3);

    const sum = recent.reduce(
      (acc, item) => acc + item.failure_probability,
      0
    );

    return sum / 3;

  }, [history, latestRisk]);

  const riskPercent = (latestRisk * 100).toFixed(2);
  const smoothPercent = (smoothedRisk * 100).toFixed(2);
  const healthScore = (100 - smoothedRisk * 100).toFixed(1);

  const calculateETTF = () => {

    if (!result && !liveMode) return null;

    return Math.max(1, Math.round((1 - smoothedRisk) * 100));

  };

  const renderAction = () => {

    if (smoothedRisk > 0.7 && trendingUp)
      return (
        <p className="text-red-500 font-bold">
          Immediate Shutdown Recommended
        </p>
      );

    if (smoothedRisk > 0.7)
      return (
        <p className="text-red-500 font-bold">
          High Risk — Monitor Closely
        </p>
      );

    if (smoothedRisk > 0.4)
      return (
        <p className="text-yellow-400 font-bold">
          Schedule Maintenance Soon
        </p>
      );

    return (
      <p className="text-green-400 font-bold">
        System Healthy
      </p>
    );

  };

  return (

    <div className="space-y-10">

      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold">
        Predictive Maintenance
      </h1>

      {/* LIVE MODE */}

      <div className="flex items-center gap-4">

        <label className="text-lg flex items-center gap-2">

          Live Sensor Mode

          {liveMode && (
            <span className="animate-pulse text-green-400 text-sm">
              ● LIVE
            </span>
          )}

        </label>

        <input
          type="checkbox"
          checked={liveMode}
          onChange={() => setLiveMode(!liveMode)}
          className="w-5 h-5"
        />

      </div>

      {/* FORM */}

      <div className="bg-[#111827] p-6 rounded-2xl space-y-4">

        <div className="grid md:grid-cols-2 gap-4">

          {Object.keys(form).map((key) => (

            <div key={key}>

              <input
                name={key}
                value={form[key]}
                onChange={handleChange}
                placeholder={key}
                disabled={liveMode}
                className="bg-[#0b1220] p-3 rounded-xl w-full border border-white/10"
              />

              {errors[key] && (
                <p className="text-red-400 text-sm">
                  {errors[key]}
                </p>
              )}

            </div>

          ))}

        </div>

        {!liveMode && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            {loading ? "Predicting..." : "Predict Risk"}
          </button>
        )}

      </div>

      {/* RESULT */}

      {(result || liveMode) && (

        <div className="grid md:grid-cols-2 gap-6">

          {/* Risk Score */}

          <div className="bg-[#111827] p-6 rounded-2xl">

            <h2 className="text-xl font-semibold mb-4">
              Risk Score
            </h2>

            <RiskGauge risk={smoothedRisk * 100} />

            <p className="mt-4 text-lg">
              Raw Risk: {riskPercent}%
            </p>

            <p className="text-lg font-semibold mt-2">
              Smoothed Risk: {smoothPercent}%
            </p>

            <p className="text-lg font-semibold mt-2">
              Health Score: {healthScore}
            </p>

            {/* Progress Bar */}

            <div className="mt-4 w-full bg-gray-700 rounded-full h-3">

              <div
                className="h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${smoothPercent}%`,
                  background:
                    smoothedRisk > 0.7
                      ? "#ef4444"
                      : smoothedRisk > 0.4
                      ? "#f59e0b"
                      : "#22c55e",
                }}
              />

            </div>

            <p className="mt-4 text-cyan-400 font-semibold">
              Estimated Time to Failure: {calculateETTF()} hours
            </p>

          </div>

          {/* Recommended Action */}

          <div className="bg-[#111827] p-6 rounded-2xl">

            <h2 className="text-xl font-semibold mb-4">
              Recommended Action
            </h2>

            {renderAction()}

          </div>

        </div>

      )}

      {/* RISK TREND */}

      {history.length > 0 && (

        <div className="bg-[#111827] p-6 rounded-2xl">

          <h2 className="text-xl font-semibold mb-4">
            Risk Trend (Historical Comparison)
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={history}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="timestamp" />

              <YAxis
                domain={[0, 1]}
                tickFormatter={(v) =>
                  `${(v * 100).toFixed(0)}%`
                }
              />

              <Tooltip
                formatter={(value) =>
                  `${(value * 100).toFixed(2)}%`
                }
              />

              <Line
                type="monotone"
                dataKey="failure_probability"
                stroke="#3b82f6"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      )}

    </div>

  );

};

export default Maintenance;