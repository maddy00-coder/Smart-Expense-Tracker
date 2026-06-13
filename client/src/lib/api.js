import axios from 'axios';

const DEFAULT_API_URL = 'http://localhost:5001/api';

function normalizeBaseUrl(url) {
  const trimmed = (url || DEFAULT_API_URL).trim();
  const withoutTrailingSlashes = trimmed.replace(/\/+$/, '');

  return withoutTrailingSlashes.endsWith('/api')
    ? withoutTrailingSlashes
    : `${withoutTrailingSlashes}/api`;
}

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL: API_BASE_URL
});

function normalizeApiPath(url) {
  const value = String(url).trim();

  if (!value) {
    return '';
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return withLeadingSlash.replace(/^\/api(?=\/|$)/, '') || '';
}

api.interceptors.request.use((config) => {
  if (config.url) {
    config.url = normalizeApiPath(config.url);
  }
  return config;
});

export function getApiErrorMessage(error, fallback = 'Request failed') {
  if (!error?.response) {
    return fallback;
  }
  return error.response?.data?.message || fallback;
}

export function isNetworkError(error) {
  return Boolean(error) && !error.response;
}

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
