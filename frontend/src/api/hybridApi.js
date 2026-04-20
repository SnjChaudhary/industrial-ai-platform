import axiosInstance from "./axiosConfig";

export const predictHybrid = async (sensorData, selectedFile) => {
  const formData = new FormData();

  Object.keys(sensorData).forEach((key) => {
    formData.append(key, sensorData[key]);
  });

  formData.append("image", selectedFile);

  const response = await axiosInstance.post(
    "/predict/hybrid",
    formData
  );

  return response.data;
};