import axios, { AxiosInstance } from 'axios';

export class ApiClient {
  readonly http: AxiosInstance;

  constructor(baseURL = process.env.NEXT_PUBLIC_API_BASE) {
    this.http = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false,
    });
    this.http.interceptors.response.use(
      r => r,
      err => Promise.reject(new Error(err?.response?.data?.error || err.message || 'Request failed'))
    );
  }
}
