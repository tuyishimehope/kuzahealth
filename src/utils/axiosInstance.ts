import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL_DEV;

export const axiosInstance = (() => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem('token'); 
      if (token) {
        const parsedToken = JSON.parse(token);
        config.headers['Authorization'] = `Bearer ${parsedToken}`;
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );

  return instance;
})();
