import api from "./axiosConfig";

export const getReportData = async (startDate, endDate) => {
  const res = await api.get("/report", {
    params: {
      start: startDate,
      end: endDate,
    },
  });

  return res.data;
};

export const downloadCSV = (startDate, endDate) => {
  const token = localStorage.getItem("token");

  const query = `http://localhost:5000/api/export-csv?start=${startDate}&end=${endDate}`;

  fetch(query, {
    headers: {
      Authorization: token,
    },
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
};