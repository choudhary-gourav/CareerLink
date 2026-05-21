const DEPLOYED_API_URL = "https://careerlink-3bgb.onrender.com";
const configuredApiUrl = process.env.REACT_APP_API_URL;
const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

const API_BASE_URL = configuredApiUrl || (isLocalhost ? "" : DEPLOYED_API_URL);

export function apiUrl(path) {
  return `${API_BASE_URL.replace(/\/$/, "")}${path}`;
}
