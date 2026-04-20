import API from "./api";

export const predictSensor = async ({
  temperature,
  pressure,
  vibration,
  load,
  humidity,
}) => {
  const response = await API.post("/predict/sensor", {
    temperature,
    pressure,
    vibration,
    load,
    humidity,
  });

  return response.data;
};