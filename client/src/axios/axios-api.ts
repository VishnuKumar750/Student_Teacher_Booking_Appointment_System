import axios from "axios";

// create axios instance
const api = axios.create({
  baseURL: "http://localhost:4000/api/v1/",
  timeout: 10000,
  withCredentials: true,
  maxContentLength: 2000,
  maxBodyLength: 2000,
});

// create axios interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);

export default api;
