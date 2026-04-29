import axios, { type AxiosInstance } from 'axios';
import { errorInterceptor, responseInterceptor } from './interceptors';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4000/public',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error),
);

export default api;
