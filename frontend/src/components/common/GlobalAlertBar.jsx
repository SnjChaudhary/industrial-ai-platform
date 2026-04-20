import { useContext, useEffect, useState } from "react";
import { RealtimeContext } from "../../context/RealtimeContext";

const GlobalAlertBar = () => {
  const { events } = useContext(RealtimeContext);
  const [visibleAlert, setVisibleAlert] = useState(null);

  useEffect(() => {
    const critical = events.find(e => e.severity === "HIGH");

    if (critical) {
      setVisibleAlert(critical);

      const timer = setTimeout(() => {
        setVisibleAlert(null);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [events]);

  if (!visibleAlert) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-red-600 text-white 
    p-4 flex justify-between items-center z-50 
    shadow-lg animate-slideDown">

      <div className="font-medium">
        🚨 Critical Alert: {visibleAlert.message}
      </div>

      <button
        onClick={() => setVisibleAlert(null)}
        className="text-white font-bold text-lg"
      >
        ✕
      </button>
    </div>
  );
};

export default GlobalAlertBar;