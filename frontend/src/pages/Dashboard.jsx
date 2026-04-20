import { useEffect, useState, useContext } from "react";
import SummaryCard from "../components/dashboard/SummaryCard";
import LiveChart from "../components/dashboard/LiveChart";
import RiskGauge from "../components/dashboard/RiskGauge";
import Loader from "../components/common/Loader";
import { getLiveData } from "../api/dashboardApi";
import { RealtimeContext } from "../context/RealtimeContext";

const Dashboard = () => {
  const { liveStats, events, connectionStatus } = useContext(RealtimeContext);

  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLiveData();
        setApiData(response);
        setError(null);
      } catch (err) {
        console.log("API Fallback Failed");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (liveStats) {
      setLastUpdated(new Date());
      setError(null);
    }
  }, [liveStats]);

  const liveData = liveStats || apiData;

  const showError =
    !loading &&
    !liveStats &&
    !apiData &&
    connectionStatus !== "connected";

  const realtimeAlerts = events
    ?.filter((e) => e.type === "ALERT")
    ?.map((e) => e.message);

  return (
    <div className="space-y-12 p-8 min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0b1220] to-[#0a0f1c]">

      {/* KPI SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <SummaryCard title="Active Machines" value={liveData?.active_machines ?? 0} />
        <SummaryCard title="High Risk Units" value={liveData?.high_risk_units ?? 0} />
        <SummaryCard title="Defects Today" value={liveData?.defects_today ?? 0} />
        <SummaryCard title="Downtime Saved" value={`${liveData?.downtime_saved ?? 0} hrs`} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT SIDE */}
        <div className="col-span-12 xl:col-span-8">
          <div className="bg-[#0b1220] border border-blue-500/20 rounded-2xl p-6 shadow-lg">

            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-sky-400">
                Live Temperature Monitoring
              </h2>

              <div className="flex items-center gap-3 text-xs">
                <span className={`flex items-center gap-1 ${
                  connectionStatus === "connected"
                    ? "text-green-400"
                    : "text-red-400"
                }`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${
                    connectionStatus === "connected"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}></span>
                  {connectionStatus === "connected" ? "Live" : "Disconnected"}
                </span>

                {lastUpdated && (
                  <span className="text-gray-400">
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            {loading && <Loader />}

            {showError && (
              <p className="text-red-500 text-center font-medium">
                ⚠ Unable to fetch live sensor data
              </p>
            )}

            {!loading && liveData && (
              <LiveChart temperature={liveData?.temperature} />
            )}

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-12 xl:col-span-4 space-y-6">

          {/* RISK GAUGE */}
          <div className="bg-gradient-to-br from-[#0b1220] to-[#0e1628] border border-yellow-500/20 rounded-3xl p-8 flex flex-col items-center shadow-[0_0_40px_rgba(255,193,7,0.08)] transition-all duration-500">
            <h2 className="text-lg font-semibold mb-6 text-yellow-400 tracking-wide">
              Overall Risk Score
            </h2>

            <RiskGauge risk={Number(liveData?.risk_level ?? 0)} />
          </div>

          {/* ALERT + HEALTH */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-[#0e1628] border border-red-500/20 rounded-3xl p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4 text-red-400 tracking-wide">
                Recent Alerts
              </h2>

              <div className="space-y-3 text-sm">
                {realtimeAlerts?.length > 0 ? (
                  realtimeAlerts.map((alert, index) => (
                    <p key={index} className="text-red-300">
                      ⚠ {alert}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400">No active alerts</p>
                )}
              </div>
            </div>

            <div className="bg-[#0e1628] border border-green-500/20 rounded-3xl p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4 text-green-400 tracking-wide">
                System Health
              </h2>

              <div className="space-y-3 text-sm">
                <p className="text-green-400">
                  ✔ Database {liveData?.db_status ? "Connected" : "Disconnected"}
                </p>
                <p className="text-green-400">
                  ✔ Sensor Stream {connectionStatus === "connected" ? "Active" : "Inactive"}
                </p>
                <p className="text-yellow-400">
                  ⚠ {liveData?.warnings ?? 0} Machine Warning
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* PERFORMANCE */}
      <div className="bg-[#0b1220] border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-6 text-indigo-400">
          Performance Metrics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-400">Avg Temperature</p>
            <p className="text-white font-semibold">
              {liveData?.avg_temperature ?? "--"}°C
            </p>
          </div>
          <div>
            <p className="text-gray-400">Avg Vibration</p>
            <p className="text-white font-semibold">
              {liveData?.avg_vibration ?? "--"} mm/s
            </p>
          </div>
          <div>
            <p className="text-gray-400">System Load</p>
            <p className="text-white font-semibold">
              {liveData?.system_load ?? "--"}%
            </p>
          </div>
          <div>
            <p className="text-gray-400">Efficiency Score</p>
            <p className="text-green-400 font-semibold">
              {liveData?.efficiency_score ?? "--"}%
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;