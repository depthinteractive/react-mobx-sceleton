import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
  baseURL: 'http://localhost:5000/api/v1',
  url: 'graphql',
  method: 'POST',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}
const Axios: AxiosInstance = axios.create(config);
export default Axios;