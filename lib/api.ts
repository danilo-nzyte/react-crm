/**
 * HTTP client for API requests with JWT authentication
 * Handles common request/response processing and error handling
 */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// Base API URL from environment variable
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

/**
 * Request interceptor to inject JWT token from localStorage
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common error scenarios
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("auth_token");
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

/**
 * API client with typed request/response methods
 */
export const api = {
  /**
   * GET request with type parameters
   * @param url - API endpoint
   * @param config - Optional axios config
   * @returns Promise with typed response data
   */
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient
      .get<T, AxiosResponse<T>>(url, config)
      .then((res) => res.data);
  },

  /**
   * POST request with type parameters
   * @param url - API endpoint
   * @param data - Request payload
   * @param config - Optional axios config
   * @returns Promise with typed response data
   */
  post: <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return apiClient
      .post<T, AxiosResponse<T>, D>(url, data, config)
      .then((res) => res.data);
  },

  /**
   * PUT request with type parameters
   * @param url - API endpoint
   * @param data - Request payload
   * @param config - Optional axios config
   * @returns Promise with typed response data
   */
  put: <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return apiClient
      .put<T, AxiosResponse<T>, D>(url, data, config)
      .then((res) => res.data);
  },

  /**
   * PATCH request with type parameters
   * @param url - API endpoint
   * @param data - Request payload
   * @param config - Optional axios config
   * @returns Promise with typed response data
   */
  patch: <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return apiClient
      .patch<T, AxiosResponse<T>, D>(url, data, config)
      .then((res) => res.data);
  },

  /**
   * DELETE request with type parameters
   * @param url - API endpoint
   * @param config - Optional axios config
   * @returns Promise with typed response data
   */
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient
      .delete<T, AxiosResponse<T>>(url, config)
      .then((res) => res.data);
  },
};

export default api;
