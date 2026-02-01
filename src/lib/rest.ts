import { AUTHORIZATION } from '../domain/credentials';

export async function get<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: headers() });
  return await toTypedResponse(response);
}

export async function remove<T>(url: string, body?: BodyInit | null): Promise<T> {
  const response = await fetch(url, { method: 'DELETE', headers: headers(), body });
  return await toTypedResponse(response);
}

export async function post<T>(url: string, body?: BodyInit | null): Promise<T> {
  const response = await fetch(url, { method: 'POST', headers: headers(), body });
  return await toTypedResponse(response);
}

export async function removeVoid(url: string, body?: BodyInit | null): Promise<void> {
  const response = await fetch(url, { method: 'DELETE', headers: headers(), body });
  if (!response.ok) {
    return Promise.reject(new Error(response.statusText));
  }
}

export async function postVoid(url: string, body?: BodyInit | null): Promise<void> {
  const response = await fetch(url, { method: 'POST', headers: headers(), body });
  if (!response.ok) {
    return Promise.reject(new Error(response.statusText));
  }
}

function toTypedResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  } else {
    return Promise.reject(new Error(response.statusText));
  }
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
