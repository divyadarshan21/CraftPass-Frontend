import api from './api'
import { API_ENDPOINTS } from '../config/config'

export const productApi = {
  // Get products for the authenticated user
  list: (params) => 
    api.get(API_ENDPOINTS.products.list, { params }),
  
  // Create a new product
  create: (data) => 
    api.post(API_ENDPOINTS.products.create, data),
  
  // Get product by ID
  get: (id) => 
    api.get(API_ENDPOINTS.products.get(id)),
  
  // Update product
  update: (id, data) => 
    api.put(API_ENDPOINTS.products.update(id), data),
  
  // Delete product
  delete: (id) => 
    api.delete(API_ENDPOINTS.products.delete(id)),
  
  // Submit product for verification
  submit: (id) => 
    api.post(API_ENDPOINTS.products.submit(id)),
}