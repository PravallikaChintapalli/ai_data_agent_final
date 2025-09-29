import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, Brain, BarChart3 } from 'lucide-react'
import FileUpload from './components/FileUpload'
import DataOverview from './components/DataOverview'
import ChatInterface from './components/ChatInterface'
import { DataProcessor } from './services/dataProcessor'
import { DataRow } from './types'

interface ProcessedData {
  data: DataRow[]
  columns: string[]
  metadata: {
    fileName: string
    fileSize: number
    rowCount: number
    columnCount: number
    dataQualityScore: number
  }
}

function App() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true)
    setError(null)

    try {
      const result = await DataProcessor.processExcelFile(file)
      setProcessedData({
        data: result.data,
        columns: result.columns,
        metadata: result.metadata
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNewFile = () => {
    setProcessedData(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Data Agent</h1>
                <p className="text-sm text-gray-600">Intelligent Excel Data Analysis Platform</p>
              </div>
            </div>
            
            {processedData && (
              <button
                onClick={handleNewFile}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Upload New File
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!processedData ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Database className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Upload Your Excel File
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  Upload any Excel file and start asking complex business questions in natural language. 
                  Our AI agent will analyze your data and provide insights with visualizations.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Database className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Data Processing</h3>
                    <p className="text-sm text-gray-600">
                      Handles any Excel format, cleans messy data, and identifies column structures automatically
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Natural Language Queries</h3>
                    <p className="text-sm text-gray-600">
                      Ask questions in plain English like "What's the average sales by region?" or "Show trends over time"
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Visualizations</h3>
                    <p className="text-sm text-gray-600">
                      Get instant charts, tables, and insights that help you understand your data better
                    </p>
                  </motion.div>
                </div>
              </div>

              <FileUpload 
                onFileUpload={handleFileUpload}
                isProcessing={isProcessing}
                error={error}
              />
            </motion.div>
          ) : (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <DataOverview
                fileName={processedData.metadata.fileName}
                rowCount={processedData.metadata.rowCount}
                columnCount={processedData.metadata.columnCount}
                fileSize={processedData.metadata.fileSize}
                dataQualityScore={processedData.metadata.dataQualityScore}
                columns={processedData.columns}
              />
              
              <ChatInterface
                data={processedData.data}
                columns={processedData.columns}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Built with React, TypeScript, and advanced AI capabilities. 
              Submit to: <a href="mailto:vikas@bulba.app" className="text-primary-600 hover:text-primary-700 font-medium">vikas@bulba.app</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
