export function setAuth(user, token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
}
export function getUser() {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
}
export function getToken() {
    return localStorage.getItem("token");
}
export function isAuthed() {
    return !!getToken();
}
export function clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}
