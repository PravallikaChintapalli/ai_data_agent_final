import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Bot, Loader, BarChart3, Table, Lightbulb } from 'lucide-react'
import { AnalysisResult, DataRow } from '../types'
import { AIAgent } from '../services/aiAgent'
import ChartVisualization from './ChartVisualization'
import TableVisualization from './TableVisualization'
import InsightVisualization from './InsightVisualization'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  result?: AnalysisResult
  timestamp: Date
}

interface ChatInterfaceProps {
  data: DataRow[]
  columns: string[]
}

export default function ChatInterface({ data, columns }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI data analyst. You can ask me questions about your uploaded data in natural language. Try asking things like:\n\n• "What\'s the average value in the data?"\n• "Show me a breakdown by category"\n• "How many records are there?"\n• "What trends do you see?"',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const result = await AIAgent.processQuery(input.trim(), data, columns)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: this.generateResponseText(result),
        result,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your question. Please try rephrasing it or check if your data contains the information you\'re looking for.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateResponseText = (result: AnalysisResult): string => {
    switch (result.type) {
      case 'chart':
        return `I've created a visualization to answer your question. The chart shows the data distribution and patterns that match your query.`
      case 'table':
        return `Here are the results from your query. I've organized the data in a table format for easy review.`
      case 'insight':
        return `Based on my analysis of your data, I've identified some key insights that answer your question.`
      default:
        return `I've processed your question and prepared the results below.`
    }
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="w-5 h-5" />
      default:
        return <Bot className="w-5 h-5" />
    }
  }

  const renderResult = (result: AnalysisResult) => {
    switch (result.type) {
      case 'chart':
        return <ChartVisualization data={result.data} />
      case 'table':
        return <TableVisualization data={result.data} />
      case 'insight':
        return <InsightVisualization data={result.data} />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-[600px]">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">AI Data Analyst</h2>
        <p className="text-sm text-gray-600">Ask questions about your data in natural language</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {getMessageIcon(message.type)}
                </div>
                
                <div className={`rounded-lg px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-primary-500 text-white ml-3'
                    : 'bg-gray-50 text-gray-900 mr-3'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {message.result && (
                    <div className="mt-4">
                      {renderResult(message.result)}
                    </div>
                  )}
                  
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-3xl flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-gray-50 text-gray-900 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Analyzing your question...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your data..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  )
}
