import axios from 'axios'
import { getToken, clearToken } from './auth.js'

const baseURL = (import.meta?.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api'
export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(r => r, (error) => {
    if (error?.response?.status === 401) {
        clearToken()
    }
    return Promise.reject(error)
})
