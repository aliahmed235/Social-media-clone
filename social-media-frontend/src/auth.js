const TOKEN_KEY = 'ACCESS_TOKEN';
const USER_KEY = 'AUTH_USER';

export function setAuth(user, token){
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function getToken(){ return localStorage.getItem(TOKEN_KEY); }
export function clearToken(){ localStorage.removeItem(TOKEN_KEY); }
export function getUser(){
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
    catch{ return null; }
}
export function clearUser(){ localStorage.removeItem(USER_KEY); }
export function isAuthed(){ return Boolean(getToken()); }
