import { createContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export const RealtimeContext = createContext();

export const RealtimeProvider = ({ children }) => {
  const socketRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [liveStats, setLiveStats] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  useEffect(() => {
    socketRef.current = io(
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
      {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 2000,
      }
    );

    const socket = socketRef.current;

    socket.on("connect", () => {
      setConnectionStatus("connected");
      console.log("✅ Socket Connected");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
      console.log("❌ Socket Disconnected");
    });

    socket.on("system_event", (data) => {
      setEvents((prev) => [data, ...prev.slice(0, 50)]);
    });

    socket.on("sensor_update", (data) => {
      setLiveStats(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <RealtimeContext.Provider
      value={{
        events,
        liveStats,
        connectionStatus,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};