import API from "./api";

export const predictImage = async (file) => {

  const formData = new FormData();

  // IMPORTANT: name must match backend
  formData.append("file", file);

  const response = await API.post(
    "/predict/image",
    formData
  );

  return response.data;
};

export const getImageHistory = async () => {
  const response = await API.get("/image-history");
  return response.data;
};