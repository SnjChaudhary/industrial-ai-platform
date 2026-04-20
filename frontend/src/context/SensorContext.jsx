// src/context/Sensor.jsx
import { createContext, useContext, useState } from "react";

const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState(null);

  return (
    <SensorContext.Provider value={{ sensorData, setSensorData }}>
      {children}
    </SensorContext.Provider>
  );
};

export const useSensor = () => {
  return useContext(SensorContext);
};
