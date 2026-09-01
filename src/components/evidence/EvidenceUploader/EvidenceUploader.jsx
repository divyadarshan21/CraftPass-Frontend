import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatFileSize } from '../../../utils/formatters'
import { Button } from '../../common/Button/Button'
import './EvidenceUploader.css'

export const EvidenceUploader = ({
  onUpload,
  onRemove,
  accept = 'image/*,video/*,application/pdf',
  maxFiles = 10,
  maxSize = 20 * 1024 * 1024, // 20MB
  label = 'Upload Evidence',
  existingFiles = [],
  loading = false,
}) => {
  const [files, setFiles] = useState(existingFiles || [])
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState({})

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      const reasons = fileRejections.map(rejection => {
        const error = rejection.errors[0]
        return `${rejection.file.name}: ${error?.message || 'Invalid file'}`
      })
      setError(reasons.join(', '))
      return
    }

    const totalFiles = files.length + acceptedFiles.length
    if (totalFiles > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed. You have ${files.length} already.`)
      return
    }

    const validFiles = acceptedFiles.filter(file => {
      if (file.size > maxSize) {
        setError(`File ${file.name} exceeds ${maxSize / (1024 * 1024)}MB limit`)
        return false
      }
      return true
    })

    const newFiles = validFiles.map(file => ({
      file,
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0,
    }))

    setFiles(prev => [...prev, ...newFiles])
    setError('')

    if (onUpload) {
      // Simulate upload progress
      newFiles.forEach((newFile, index) => {
        const fileIndex = files.length + index
        simulateUpload(fileIndex, newFile, () => {
          onUpload(newFile)
        })
      })
    }
  }, [files, maxFiles, maxSize, onUpload])

  const simulateUpload = (index, file, callback) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles(prev => {
          const updated = [...prev]
          if (updated[index]) {
            updated[index] = { ...updated[index], status: 'uploaded', progress: 100 }
          }
          return updated
        })
        if (callback) callback()
        return
      }
      setFiles(prev => {
        const updated = [...prev]
        if (updated[index]) {
          updated[index] = { ...updated[index], progress: Math.min(progress, 99) }
        }
        return updated
      })
    }, 200)
  }

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    if (onRemove) {
      onRemove(id)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - files.length,
    disabled: loading || files.length >= maxFiles,
  })

  const getFileIcon = (file) => {
    if (!file) return '📄'
    if (file.type?.startsWith('image/')) return '🖼️'
    if (file.type?.startsWith('video/')) return '🎬'
    if (file.type === 'application/pdf') return '📄'
    return '📎'
  }

  const isImageFile = (file) => {
    return file.type?.startsWith('image/') || 
           (file.name && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name))
  }

  return (
    <div className="evidence-uploader">
      <div
        {...getRootProps()}
        className={`evidence-uploader-dropzone ${isDragActive ? 'active' : ''} ${error ? 'error' : ''} ${files.length >= maxFiles ? 'full' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="evidence-uploader-content">
          <span className="evidence-uploader-icon">📁</span>
          <p>{isDragActive ? 'Drop files here' : label}</p>
          <span className="evidence-uploader-hint">
            {files.length >= maxFiles 
              ? `Maximum ${maxFiles} files reached` 
              : `Drag & drop or click to browse (${files.length}/${maxFiles})`}
          </span>
          <span className="evidence-uploader-accept">
            Accepted: {accept.split(',').join(', ')}
          </span>
        </div>
      </div>

      {error && <p className="evidence-uploader-error">{error}</p>}

      {loading && (
        <div className="evidence-uploader-loading">
          <div className="spinner" />
          <span>Uploading files...</span>
        </div>
      )}

      {files.length > 0 && (
        <ul className="evidence-uploader-list">
          {files.map((file, index) => (
            <li key={file.id || index} className="evidence-uploader-item">
              <div className="evidence-uploader-item-preview">
                {isImageFile(file) && file.file && URL.createObjectURL ? (
                  <img 
                    src={URL.createObjectURL(file.file)} 
                    alt={file.name}
                    className="evidence-uploader-item-thumbnail"
                  />
                ) : (
                  <span className="evidence-uploader-item-icon">
                    {getFileIcon(file)}
                  </span>
                )}
              </div>
              <div className="evidence-uploader-item-info">
                <span className="evidence-uploader-item-name">{file.name}</span>
                <span className="evidence-uploader-item-size">
                  {formatFileSize(file.size)}
                </span>
                {file.status === 'pending' && (
                  <div className="evidence-uploader-item-progress">
                    <div 
                      className="evidence-uploader-item-progress-bar" 
                      style={{ width: `${file.progress || 0}%` }}
                    />
                  </div>
                )}
                {file.status === 'uploaded' && (
                  <span className="evidence-uploader-item-status success">✓ Uploaded</span>
                )}
              </div>
              <button
                type="button"
                className="evidence-uploader-item-remove"
                onClick={() => removeFile(file.id)}
                disabled={file.status === 'uploading'}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}