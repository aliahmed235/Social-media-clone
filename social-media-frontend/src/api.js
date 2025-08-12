// src/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000", // your Laravel server
    headers: { Accept: "application/json" },
});

// Simple token storage
export const setToken = (t) => {
    localStorage.setItem("token", t);
    api.defaults.headers.common.Authorization = `Bearer ${t}`;
};

export const getToken = () => localStorage.getItem("token");

// Load token on refresh (if present)
const existing = getToken();
if (existing) api.defaults.headers.common.Authorization = `Bearer ${existing}`;

export default api;
