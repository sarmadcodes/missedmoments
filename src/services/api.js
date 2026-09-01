import { API_BASE_URL, API_TIMEOUT_MS } from '../config/env';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './storage';

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// Concurrent 401s must not each fire their own refresh; they queue on this.
let refreshPromise = null;

const refreshAccessToken = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new ApiError('Not authenticated', 401, 'NO_REFRESH_TOKEN');

    const res = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      await clearTokens();
      throw new ApiError('Session expired', 401, 'REFRESH_FAILED');
    }

    const data = await res.json();
    await saveTokens(data);
    return data.accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

const rawRequest = async (path, { method = 'GET', body, token, signal } = {}) => {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  return { res, data };
};

/**
 * JSON request with bearer auth, one transparent refresh-and-retry on 401,
 * and a hard timeout.
 */
export const request = async (path, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    let token = options.auth === false ? null : await getAccessToken();
    let { res, data } = await rawRequest(path, {
      ...options,
      token,
      signal: controller.signal,
    });

    if (res.status === 401 && options.auth !== false) {
      token = await refreshAccessToken();
      ({ res, data } = await rawRequest(path, {
        ...options,
        token,
        signal: controller.signal,
      }));
    }

    if (!res.ok) {
      throw new ApiError(
        data?.message || `Request failed (${res.status})`,
        res.status,
        data?.code,
      );
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError('The request timed out', 408, 'TIMEOUT');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
};

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
