import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { getReportData, downloadCSV } from "../api/reportApi";

const tabs = [
  "Maintenance Analytics",
  "Quality Analytics",
  "Hybrid Summary",
  "System Performance",
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [trendData, setTrendData] = useState([]);

  // Fetch report data
  const fetchReports = async () => {
    try {
      const data = await getReportData(startDate, endDate);
      setTrendData(data);
    } catch (err) {
      console.error("Report fetch error", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">

      {/* Title */}
      <h1 className="text-2xl font-bold">Reports & Analytics</h1>

      {/* Tabs */}
      <div className="flex gap-3 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg border ${
              activeTab === tab
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white/5 border-white/10 text-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap bg-white/5 p-4 rounded-xl border border-white/10">

        <div>
          <label className="text-sm text-gray-400">Start Date</label>
          <input
            type="date"
            className="block mt-1 bg-black/40 border border-white/10 rounded-lg p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">End Date</label>
          <input
            type="date"
            className="block mt-1 bg-black/40 border border-white/10 rounded-lg p-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* CSV Download */}
        <div className="flex items-end">
          <button
            onClick={() => downloadCSV(startDate, endDate)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Trend Graph */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">

        <h2 className="text-lg font-semibold mb-4">
          Failure Risk Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="final_risk"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* Analytics Content */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">

        {activeTab === "Maintenance Analytics" && (
          <p className="text-gray-300">
            Maintenance failure trends and downtime analytics.
          </p>
        )}

        {activeTab === "Quality Analytics" && (
          <p className="text-gray-300">
            Defect detection statistics and product quality reports.
          </p>
        )}

        {activeTab === "Hybrid Summary" && (
          <p className="text-gray-300">
            Combined machine health and product quality insights.
          </p>
        )}

        {activeTab === "System Performance" && (
          <p className="text-gray-300">
            Model accuracy, inference latency, and system health metrics.
          </p>
        )}

      </div>

    </div>
  );
};

export default Reports;