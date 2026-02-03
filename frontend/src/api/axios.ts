import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

// Add token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // store JWT after login
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
