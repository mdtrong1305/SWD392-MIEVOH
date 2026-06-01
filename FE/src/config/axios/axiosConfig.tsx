import axios from 'axios'
import { API_BASE_URL } from '../constant/constant.tsx'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add request interceptor to automatically attach authorization header
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('accessToken')
    if (token && config.headers) {
      // Set both standard headers for maximum compatibility
      config.headers.token = token
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {
    console.error('Error reading token from localStorage', e)
  }
  return config
})

export default api
