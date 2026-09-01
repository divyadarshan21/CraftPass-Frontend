import api from './api'
import { API_ENDPOINTS } from '../config/config'

export const passportApi = {
  // Get public passport by slug
  get: (slug) => 
    api.get(API_ENDPOINTS.passport.get(slug)),
}