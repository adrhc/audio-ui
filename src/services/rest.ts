import { AUTHORIZATION } from '../domain/credentials';

export function get<T>(url: string): Promise<T> {
  return fetch(url, { headers: headers() }).then((response) => {
    if (!response.ok) {
      return Promise.reject(new Error(response.statusText));
    }
    return response.json() as Promise<T>;
  });
}

export function remove(url: string, body?: BodyInit | null): Promise<void> {
  return fetch(url, { method: 'DELETE', headers: headers(), body }).then((response) => {
    if (!response.ok) {
      return Promise.reject(new Error(response.statusText));
    }
  });
}

export function post<T>(url: string, body?: BodyInit | null): Promise<T> {
  return fetch(url, {
    method: 'POST',
    headers: headers(),
    body,
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(new Error(response.statusText));
    }
    return response.json() as Promise<T>;
  });
}

export function postVoid(url: string, body?: BodyInit | null): Promise<void> {
  return fetch(url, {
    method: 'POST',
    headers: headers(),
    body,
  }).then((response) => {
    if (!response.ok) {
      return Promise.reject(new Error(response.statusText));
    }
  });
}

function headers() {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (AUTHORIZATION) {
    return { ...headers, Authorization: AUTHORIZATION };
  } else {
    return headers;
  }
}
