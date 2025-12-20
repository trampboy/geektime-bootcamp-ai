// Project Alpha - Axios 配置
import axios from 'axios';

/**
 * Axios 实例
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 */
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证 token 等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    const message = error.response?.data?.error?.message || '请求失败';
    console.error('API Error:', message);
    // TODO: 在 Phase 4 中添加 Toast 通知
    return Promise.reject(error);
  }
);

export default api;
