import { useState } from "react";
import { predictHybrid } from "../api/hybridApi";

const Hybrid = () => {
  const [form, setForm] = useState({
    temperature: "",
    pressure: "",
    vibration: "",
    load: "",
    humidity: "",
  });

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Upload image");
      return;
    }

    try {
      setLoading(true);

      const res = await predictHybrid(form, file);

      setResult(res);

    } catch (err) {
      console.error("Hybrid error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Hybrid AI Risk Analysis</h1>

      <div className="grid grid-cols-2 gap-4">
        {Object.keys(form).map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            onChange={handleChange}
            className="bg-[#0b1220] p-3 rounded-xl border border-white/10"
          />
        ))}
      </div>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="bg-[#0b1220] p-3 rounded-xl border border-white/10"
      />

      <button
        onClick={handleSubmit}
        className="bg-purple-500 px-6 py-3 rounded-xl"
      >
        {loading ? "Analyzing..." : "Run Hybrid Analysis"}
      </button>

      {result && (
        <div className="bg-[#0b1220] p-6 rounded-xl space-y-3">
          <p>Sensor Risk: {result.sensor_risk}</p>
          <p>Image Risk: {result.image_risk}</p>
          <p className="text-xl font-bold">
            Final Risk Score: {result.final_risk}
          </p>
          <p>Severity: {result.severity}</p>
        </div>
      )}
    </div>
  );
};

export default Hybrid;