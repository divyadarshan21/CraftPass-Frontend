import api from './api'
import { API_ENDPOINTS } from '../config/config'

export const authApi = {
  login: (email, password) => 
    api.post(API_ENDPOINTS.auth.login, { email, password }),
  
  register: (data) => 
    api.post(API_ENDPOINTS.auth.register, data),
  
  logout: () => 
    api.post(API_ENDPOINTS.auth.logout),
  
  getMe: () => 
    api.get(API_ENDPOINTS.auth.me),
  
  updateProfile: (data) => 
    api.put(API_ENDPOINTS.auth.updateProfile, data),
  
  changePassword: (data) => 
    api.post(API_ENDPOINTS.auth.changePassword, data),
}