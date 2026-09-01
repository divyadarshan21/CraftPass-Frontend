import api from './api'
import { API_ENDPOINTS } from '../config/config'

export const evidenceApi = {
  // Upload evidence with file to Cloudinary
  upload: (productId, file, type, title) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type || 'IMAGE')
    formData.append('title', title || 'Evidence')
    
    return api.post(API_ENDPOINTS.evidence.upload(productId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        return percentCompleted
      },
    })
  },
  
  // Add evidence using URL
  addEvidence: (productId, data) => 
    api.post(API_ENDPOINTS.evidence.list(productId), data),
  
  // Get evidence for a product
  list: (productId) => 
    api.get(API_ENDPOINTS.evidence.list(productId)),
  
  // Delete evidence
  delete: (id) => 
    api.delete(API_ENDPOINTS.evidence.delete(id)),
  
  // Update evidence
  update: (id, data) => 
    api.put(API_ENDPOINTS.evidence.update(id), data),
}