
import axios from 'axios';

export const createAuthorizationTokenHeader = () => {
  const token = localStorage.getItem('wmg-token');
  if (token) {
    return { 'Authorization': 'Bearer ' + token };
  } else {
    return {};
  }
};

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  // 在发送请求之前，动态地设置Authorization头部
  const authHeader = createAuthorizationTokenHeader();
  Object.keys(authHeader).forEach((key) => {
    config.headers.set(key, (authHeader as { [key: string]: string })[key]);
  });
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
