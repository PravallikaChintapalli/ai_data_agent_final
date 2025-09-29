export interface Dataset {
  id: string
  user_id: string
  name: string
  file_name: string
  columns: string[]
  row_count: number
  data_quality_score: number
  created_at: string
  updated_at: string
}

export interface Query {
  id: string
  dataset_id: string
  user_id: string
  question: string
  sql_query: string
  result_type: 'table' | 'chart' | 'insight'
  result_data: any
  confidence_score: number
  created_at: string
}

export interface DataRow {
  [key: string]: any
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area'
  data: any[]
  xAxis?: string
  yAxis?: string
  title: string
  description?: string
}

export interface TableData {
  columns: string[]
  rows: DataRow[]
  title: string
  description?: string
}

export interface InsightData {
  type: 'trend' | 'correlation' | 'anomaly' | 'summary'
  title: string
  description: string
  value?: number | string
  confidence: number
}

export interface AnalysisResult {
  type: 'table' | 'chart' | 'insight'
  data: ChartData | TableData | InsightData
  sql_query?: string
  confidence_score: number
}
