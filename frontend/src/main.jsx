import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SensorProvider } from "./context/SensorContext";
import { RealtimeProvider } from "./context/RealtimeContext"; // ✅ NEW
import { Toaster } from "react-hot-toast";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <RealtimeProvider> {/* ✅ Added Here */}
        <SensorProvider>
          <>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#0b1220",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)"
                }
              }}
            />
          </>
        </SensorProvider>
      </RealtimeProvider>
    </AuthProvider>
  </BrowserRouter>
);