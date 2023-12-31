import axios from "axios";
import Cookies from "js-cookie";
const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api/",
  withCredentials: true,
});

function setupAxiosClientInterceptors() {
  const token = Cookies.get("user");
  if (token) {
    axiosClient.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}
setupAxiosClientInterceptors();
export default axiosClient;
