import axios, { type AxiosInstance } from 'axios';
import { errorInterceptor, responseInterceptor } from './interceptors';

const api: AxiosInstance = axios.create({
  baseURL: 'https://testeinteractiplay.duckdns.org/public',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error),
);

export default api;
