import axios from "axios";

const api = axios.create({
  baseURL: "https://youtube-clone-mern-ers8.onrender.com/api",
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("yt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;