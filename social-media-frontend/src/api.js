import axios from "axios";

// Prefer Vite proxy in dev (no CORS). Fallback to env/base for prod.
const baseURL =
    (import.meta.env.MODE === "development" ? "/api" : null) ||
    import.meta.env.VITE_API_BASE ||
    "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL,
    headers: { Accept: "application/json" },
});

// Attach Sanctum Personal Access Token
api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem("token");
    cfg.headers = cfg.headers ?? {};
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

// Basic global error handling
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const s = err?.response?.status;
        if (s === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        if (s === 403) alert("Forbidden");
        return Promise.reject(err);
    }
);

export default api;
