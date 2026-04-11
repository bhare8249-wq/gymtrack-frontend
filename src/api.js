const BASE = process.env.REACT_APP_API_URL || "http://localhost:3001";

function getToken() {
  try { return localStorage.getItem("gymtrack-token"); } catch { return null; }
}

function setToken(t) {
  try { localStorage.setItem("gymtrack-token", t); } catch {}
}

function clearToken() {
  try { localStorage.removeItem("gymtrack-token"); } catch {}
}

async function request(method, path, body) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401) {
    clearToken();
    window.dispatchEvent(new Event("gymtrack-logout"));
    throw new Error("Session expired");
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Request failed");
  return json;
}

export const api = {
  get:    (path)        => request("GET",    path),
  post:   (path, body)  => request("POST",   path, body),
  put:    (path, body)  => request("PUT",    path, body),
  delete: (path)        => request("DELETE", path),
  setToken,
  clearToken,
  getToken,
};
