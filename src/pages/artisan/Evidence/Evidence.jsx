import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { EvidenceList } from '../../../components/evidence/EvidenceList/EvidenceList'
import { EvidenceUploader } from '../../../components/evidence/EvidenceUploader/EvidenceUploader'
import { Loader } from '../../../components/common/Loader/Loader'
import { Modal } from '../../../components/common/Modal/Modal'
import { Button } from '../../../components/common/Button/Button'
import { Select } from '../../../components/common/Select/Select'
import { evidenceApi } from '../../../services/evidenceApi'
import { productApi } from '../../../services/productApi'
import toast from 'react-hot-toast'
import './Evidence.css'

export const Evidence = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [evidence, setEvidence] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const productId = params.get('productId')
    if (productId) {
      setSelectedProductId(productId)
    }
  }, [location])

  useEffect(() => {
    fetchData()
  }, [selectedProductId])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch products for selector
      const productsResponse = await productApi.list()
      setProducts(productsResponse.data || [])
      
      // Fetch evidence
      const evidenceResponse = await evidenceApi.list(selectedProductId)
      setEvidence(evidenceResponse.data || [])
      
      setError(null)
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('Failed to load evidence')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (files) => {
    if (!selectedProductId) {
      toast.error('Please select a product first')
      return
    }

    setUploading(true)
    try {
      const fileList = files.map(f => f.file)
      const response = await evidenceApi.upload(selectedProductId, fileList)
      toast.success(`Successfully uploaded ${files.length} file(s)`)
      await fetchData()
      setShowUploadModal(false)
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed'
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await evidenceApi.delete(id)
      toast.success('Evidence deleted successfully')
      await fetchData()
    } catch (error) {
      const message = error.response?.data?.message || 'Delete failed'
      toast.error(message)
    }
  }

  const handleView = (id) => {
    const item = evidence.find(e => e.id === id)
    if (item?.url) {
      window.open(item.url, '_blank')
    }
  }

  const productOptions = [
    { value: '', label: 'All Products' },
    ...products.map(p => ({ value: p.id, label: p.name })),
  ]

  if (loading) {
    return <Loader fullPage message="Loading evidence..." />
  }

  if (error) {
    return (
      <div className="evidence-error">
        <span className="evidence-error-icon">⚠️</span>
        <h3>Failed to Load Evidence</h3>
        <p>{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="evidence-page">
      <PageHeader
        title="Evidence Management"
        subtitle="Upload and manage supporting evidence for your products"
        actions={
          <Button
            variant="accent"
            onClick={() => setShowUploadModal(true)}
          >
            + Upload Evidence
          </Button>
        }
      />

      <div className="evidence-filters">
        <div className="evidence-filter-select">
          <Select
            label="Filter by Product"
            options={productOptions}
            value={selectedProductId || ''}
            onChange={(value) => setSelectedProductId(value || null)}
          />
        </div>
        {selectedProductId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedProductId(null)}
          >
            Clear Filter
          </Button>
        )}
      </div>

      <EvidenceList
        evidence={evidence}
        onDelete={handleDelete}
        onView={handleView}
        onUpload={() => setShowUploadModal(true)}
        title="Your Evidence"
        emptyMessage="No evidence uploaded yet"
        emptyActionText="Upload Evidence"
        cardSize="md"
        layout="grid"
      />

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Evidence"
        size="lg"
      >
        <div className="evidence-upload-modal">
          <div className="evidence-upload-modal-content">
            <div className="evidence-upload-modal-product-select">
              <label className="evidence-upload-modal-label">
                Select Product
              </label>
              <Select
                options={productOptions.filter(p => p.value)}
                value={selectedProductId || ''}
                onChange={(value) => setSelectedProductId(value)}
                placeholder="Choose a product"
                required
              />
            </div>

            <p className="evidence-upload-modal-info">
              Upload supporting evidence for your product verification.
              Accepted formats: Images, Videos, PDFs (max 20MB each)
            </p>

            <EvidenceUploader
              onUpload={handleUpload}
              maxFiles={10}
              maxSize={20 * 1024 * 1024}
              accept="image/*,video/*,application/pdf"
              loading={uploading}
              label="Drop your evidence files here"
            />

            <div className="evidence-upload-modal-actions">
              <Button
                variant="ghost"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}