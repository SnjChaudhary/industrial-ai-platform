import { useContext } from "react";
import { RealtimeContext } from "../../context/RealtimeContext";

const AlertsPanel = () => {
  const { events } = useContext(RealtimeContext);

  const alerts = events.filter((e) => e.type === "ALERT");

  return (
    <div className="bg-gradient-to-r from-red-600/10 to-red-500/10 
    backdrop-blur-xl p-6 rounded-2xl border border-red-500/20 shadow-lg">

      <h3 className="text-lg font-semibold mb-4 text-red-400">
        Recent Alerts
      </h3>

      <div className="space-y-2 text-red-300">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <p key={index}>⚠ {alert.message}</p>
          ))
        ) : (
          <p className="text-gray-400">No active alerts</p>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;