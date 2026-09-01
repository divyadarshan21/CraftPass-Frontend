import api from './api'
import { API_ENDPOINTS } from '../config/config'

export const verificationApi = {
  // Get pending products for verifier
  getPending: () => 
    api.get(API_ENDPOINTS.verifier.pending),
  
  // Get product details for verification
  getProduct: (id) => 
    api.get(API_ENDPOINTS.verifier.get(id)),
  
  // Approve product
  approve: (id, remarks = '') => 
    api.post(API_ENDPOINTS.verifier.approve(id), { remarks }),
  
  // Reject product
  reject: (id, remarks = '') => 
    api.post(API_ENDPOINTS.verifier.reject(id), { remarks }),
  
  // Request correction
  correction: (id, remarks = '') => 
    api.post(API_ENDPOINTS.verifier.correction(id), { remarks }),
}