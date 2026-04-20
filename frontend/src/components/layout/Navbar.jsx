import { useLocation } from "react-router-dom";
import { useContext } from "react"; // ✅ NEW
import { RealtimeContext } from "../../context/RealtimeContext"; // ✅ NEW
import NotificationBell from "../common/NotificationBell";

const Navbar = () => {
  const location = useLocation();
  const { connectionStatus } = useContext(RealtimeContext); // ✅ NEW

  const pageName =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname.replace("/", "").toUpperCase();

  return (
    <div className="flex items-center gap-6">

      {/* 👤 User Name */}
      <span className="text-green-400 text-xs">
        Sanjay Chaudhary
      </span>

      {/* 🔌 Real-Time Connection Indicator */}
      <div className="flex items-center gap-2 text-xs">
        <span
          className={`w-2 h-2 rounded-full ${
            connectionStatus === "connected"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        />
        <span className="capitalize text-gray-300">
          {connectionStatus}
        </span>
      </div>

      {/* 🔔 Notifications */}
      <NotificationBell />

      {/* 👤 Avatar */}
      <div
        className="w-8 h-8 bg-blue-500 rounded-full 
        flex items-center justify-center text-sm font-bold"
      >
        S
      </div>
    </div>
  );
};

export default Navbar;