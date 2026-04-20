import API from "./api";

export const getLiveData = async () => {
  const res = await API.get("/dashboard/live");
  return res.data;
};