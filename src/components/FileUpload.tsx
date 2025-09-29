import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatFileSize } from '../lib/utils'

interface FileUploadProps {
  onFileUpload: (file: File) => void
  isProcessing?: boolean
  error?: string | null
}

export default function FileUpload({ onFileUpload, isProcessing = false, error = null }: FileUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadStatus('idle')
      onFileUpload(file)
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive && !isDragReject 
            ? 'border-primary-500 bg-primary-50' 
            : isDragReject 
            ? 'border-red-400 bg-red-50' 
            : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-25'
          }
          ${isProcessing ? 'cursor-not-allowed opacity-60' : ''}
        `}
        whileHover={!isProcessing ? { scale: 1.02 } : {}}
        whileTap={!isProcessing ? { scale: 0.98 } : {}}
      >
        <input {...getInputProps()} disabled={isProcessing} />
        
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 mb-4 relative">
                <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing your file...</h3>
              <p className="text-gray-600">Analyzing data structure and quality</p>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              {isDragReject ? (
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              ) : uploadStatus === 'success' ? (
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              ) : (
                <div className="relative mb-4">
                  <FileSpreadsheet className="w-16 h-16 text-primary-500" />
                  <Upload className="w-6 h-6 text-primary-600 absolute -top-1 -right-1 bg-white rounded-full p-1" />
                </div>
              )}
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isDragActive 
                  ? (isDragReject ? 'File type not supported' : 'Drop your Excel file here')
                  : 'Upload Excel File'
                }
              </h3>
              
              <p className="text-gray-600 mb-4">
                {isDragReject 
                  ? 'Please upload .xlsx, .xls, or .csv files only'
                  : 'Drag and drop your Excel file here, or click to browse'
                }
              </p>
              
              {!isDragReject && (
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Supported formats: .xlsx, .xls, .csv</span>
                  <span>•</span>
                  <span>Max size: 50MB</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
          >
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
