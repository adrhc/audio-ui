import { AUTHORIZATION } from '../domain/credentials';

export function get<T>(url: string): Promise<T> {
  return fetch(url, { headers: headers() }).then((response) => toTypedResponse(response));
}

export function remove<T>(url: string, body?: BodyInit | null): Promise<T> {
  return fetch(url, { method: 'DELETE', headers: headers(), body }).then((response) =>
    toTypedResponse(response)
  );
}

export function post<T>(url: string, body?: BodyInit | null): Promise<T> {
  return fetch(url, { method: 'POST', headers: headers(), body }).then((response) =>
    toTypedResponse(response)
  );
}

function toTypedResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

export function removeVoid(url: string, body?: BodyInit | null): Promise<void> {
  return fetch(url, { method: 'DELETE', headers: headers(), body }).then((response) => {
    if (!response.ok) {
      return Promise.reject(new Error(response.statusText));
    }
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
