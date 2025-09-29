import React from 'react'
import { motion } from 'framer-motion'
import { FileSpreadsheet, BarChart3, Database, TrendingUp } from 'lucide-react'

interface DataOverviewProps {
  fileName: string
  rowCount: number
  columnCount: number
  fileSize: number
  dataQualityScore: number
  columns: string[]
}

export default function DataOverview({
  fileName,
  rowCount,
  columnCount,
  fileSize,
  dataQualityScore,
  columns
}: DataOverviewProps) {
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getQualityLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Improvement'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 mb-6"
    >
      <div className="flex items-center mb-6">
        <FileSpreadsheet className="w-6 h-6 text-primary-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Dataset Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">File Name</p>
              <p className="text-blue-900 font-semibold truncate" title={fileName}>
                {fileName}
              </p>
            </div>
            <FileSpreadsheet className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-blue-700 text-xs mt-1">{formatFileSize(fileSize)}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Rows</p>
              <p className="text-green-900 font-semibold text-xl">
                {rowCount.toLocaleString()}
              </p>
            </div>
            <Database className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Columns</p>
              <p className="text-purple-900 font-semibold text-xl">{columnCount}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Data Quality</p>
              <p className="text-orange-900 font-semibold text-xl">{dataQualityScore}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getQualityColor(dataQualityScore)}`}>
            {getQualityLabel(dataQualityScore)}
          </span>
        </motion.div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Available Columns</h3>
        <div className="flex flex-wrap gap-2">
          {columns.map((column, index) => (
            <motion.span
              key={column}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
            >
              {column}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
