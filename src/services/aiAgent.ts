import { AnalysisResult, DataRow, ChartData, TableData, InsightData } from '../types'

export class AIAgent {
  private static openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY

  static async processQuery(
    question: string,
    data: DataRow[],
    columns: string[]
  ): Promise<AnalysisResult> {
    try {
      // Generate SQL query based on natural language
      const sqlQuery = await this.generateSQLQuery(question, columns)
      
      // Execute query on data
      const queryResult = this.executeQuery(sqlQuery, data, columns)
      
      // Determine result type and format
      const resultType = this.determineResultType(question, queryResult)
      
      let formattedResult: ChartData | TableData | InsightData
      
      switch (resultType) {
        case 'chart':
          formattedResult = this.formatAsChart(queryResult, question)
          break
        case 'insight':
          formattedResult = this.formatAsInsight(queryResult, question)
          break
        default:
          formattedResult = this.formatAsTable(queryResult, question)
      }
      
      return {
        type: resultType,
        data: formattedResult,
        sql_query: sqlQuery,
        confidence_score: this.calculateConfidenceScore(question, queryResult)
      }
    } catch (error) {
      console.error('AI processing error:', error)
      return {
        type: 'insight',
        data: {
          type: 'summary',
          title: 'Analysis Error',
          description: 'I encountered an issue processing your question. Please try rephrasing or check your data format.',
          confidence: 0.1
        } as InsightData,
        confidence_score: 0.1
      }
    }
  }

  private static async generateSQLQuery(question: string, columns: string[]): Promise<string> {
    // This is a simplified implementation. In production, you'd use OpenAI API or similar
    const lowercaseQuestion = question.toLowerCase()
    const availableColumns = columns.map(col => col.toLowerCase())
    
    // Basic pattern matching for common queries
    if (lowercaseQuestion.includes('average') || lowercaseQuestion.includes('mean')) {
      const numericColumns = this.findNumericColumns(availableColumns)
      if (numericColumns.length > 0) {
        return `SELECT AVG(${numericColumns[0]}) as average FROM data`
      }
    }
    
    if (lowercaseQuestion.includes('count') || lowercaseQuestion.includes('how many')) {
      return `SELECT COUNT(*) as count FROM data`
    }
    
    if (lowercaseQuestion.includes('sum') || lowercaseQuestion.includes('total')) {
      const numericColumns = this.findNumericColumns(availableColumns)
      if (numericColumns.length > 0) {
        return `SELECT SUM(${numericColumns[0]}) as total FROM data`
      }
    }
    
    if (lowercaseQuestion.includes('group by') || lowercaseQuestion.includes('breakdown')) {
      const categoryColumn = this.findCategoryColumn(availableColumns)
      const numericColumn = this.findNumericColumns(availableColumns)[0]
      if (categoryColumn && numericColumn) {
        return `SELECT ${categoryColumn}, COUNT(*) as count FROM data GROUP BY ${categoryColumn}`
      }
    }
    
    // Default: show all data
    return `SELECT * FROM data LIMIT 100`
  }

  private static findNumericColumns(columns: string[]): string[] {
    return columns.filter(col => 
      col.includes('amount') || 
      col.includes('price') || 
      col.includes('cost') || 
      col.includes('value') || 
      col.includes('quantity') ||
      col.includes('number') ||
      col.includes('count')
    )
  }

  private static findCategoryColumn(columns: string[]): string | null {
    const categoryKeywords = ['category', 'type', 'status', 'region', 'department', 'group', 'class']
    return columns.find(col => 
      categoryKeywords.some(keyword => col.includes(keyword))
    ) || columns[0] || null
  }

  private static executeQuery(sqlQuery: string, data: DataRow[], columns: string[]): any[] {
    // Simplified query execution - in production, use a proper SQL engine
    if (sqlQuery.includes('AVG(')) {
      const column = this.extractColumnFromQuery(sqlQuery)
      const numericValues = data
        .map(row => parseFloat(row[column]))
        .filter(val => !isNaN(val))
      const average = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length
      return [{ average: Math.round(average * 100) / 100 }]
    }
    
    if (sqlQuery.includes('COUNT(*)')) {
      return [{ count: data.length }]
    }
    
    if (sqlQuery.includes('SUM(')) {
      const column = this.extractColumnFromQuery(sqlQuery)
      const total = data
        .map(row => parseFloat(row[column]))
        .filter(val => !isNaN(val))
        .reduce((sum, val) => sum + val, 0)
      return [{ total: Math.round(total * 100) / 100 }]
    }
    
    if (sqlQuery.includes('GROUP BY')) {
      const groupColumn = this.extractGroupByColumn(sqlQuery)
      const groups: { [key: string]: number } = {}
      
      data.forEach(row => {
        const key = row[groupColumn]
        groups[key] = (groups[key] || 0) + 1
      })
      
      return Object.entries(groups).map(([key, count]) => ({
        [groupColumn]: key,
        count
      }))
    }
    
    // Default: return limited data
    return data.slice(0, 100)
  }

  private static extractColumnFromQuery(query: string): string {
    const match = query.match(/(?:AVG|SUM)\(([^)]+)\)/)
    return match ? match[1] : ''
  }

  private static extractGroupByColumn(query: string): string {
    const match = query.match(/GROUP BY ([^,\s]+)/)
    return match ? match[1] : ''
  }

  private static determineResultType(question: string, result: any[]): 'chart' | 'table' | 'insight' {
    const lowercaseQuestion = question.toLowerCase()
    
    if (lowercaseQuestion.includes('chart') || 
        lowercaseQuestion.includes('graph') || 
        lowercaseQuestion.includes('plot') ||
        lowercaseQuestion.includes('visualize')) {
      return 'chart'
    }
    
    if (lowercaseQuestion.includes('insight') || 
        lowercaseQuestion.includes('trend') || 
        lowercaseQuestion.includes('analysis') ||
        result.length === 1 && Object.keys(result[0]).length <= 2) {
      return 'insight'
    }
    
    return 'table'
  }

  private static formatAsChart(result: any[], question: string): ChartData {
    if (result.length === 0) {
      return {
        type: 'bar',
        data: [],
        title: 'No Data',
        description: 'No data available for the requested analysis'
      }
    }

    const keys = Object.keys(result[0])
    
    // For grouped data
    if (keys.length === 2 && keys.includes('count')) {
      const categoryKey = keys.find(k => k !== 'count') || keys[0]
      return {
        type: 'bar',
        data: result.map(item => ({
          name: item[categoryKey],
          value: item.count
        })),
        xAxis: categoryKey,
        yAxis: 'count',
        title: `Distribution by ${categoryKey}`,
        description: `Showing count distribution across different ${categoryKey} values`
      }
    }
    
    // Default bar chart
    return {
      type: 'bar',
      data: result.slice(0, 20).map((item, index) => ({
        name: `Item ${index + 1}`,
        value: Object.values(item)[0] as number
      })),
      title: 'Data Visualization',
      description: 'Chart representation of your data'
    }
  }

  private static formatAsTable(result: any[], question: string): TableData {
    if (result.length === 0) {
      return {
        columns: [],
        rows: [],
        title: 'No Results',
        description: 'No data found for your query'
      }
    }

    const columns = Object.keys(result[0])
    
    return {
      columns,
      rows: result.slice(0, 100),
      title: 'Query Results',
      description: `Showing ${Math.min(result.length, 100)} records${result.length > 100 ? ' (first 100 shown)' : ''}`
    }
  }

  private static formatAsInsight(result: any[], question: string): InsightData {
    if (result.length === 0) {
      return {
        type: 'summary',
        title: 'No Data Available',
        description: 'No data was found for your query. Please check your question or data.',
        confidence: 0.1
      }
    }

    const firstResult = result[0]
    const keys = Object.keys(firstResult)
    const values = Object.values(firstResult)

    if (keys.includes('average')) {
      return {
        type: 'summary',
        title: 'Average Analysis',
        description: `The average value is ${firstResult.average}`,
        value: firstResult.average,
        confidence: 0.9
      }
    }

    if (keys.includes('count')) {
      return {
        type: 'summary',
        title: 'Count Analysis',
        description: `Total count is ${firstResult.count} records`,
        value: firstResult.count,
        confidence: 0.95
      }
    }

    if (keys.includes('total')) {
      return {
        type: 'summary',
        title: 'Sum Analysis',
        description: `The total sum is ${firstResult.total}`,
        value: firstResult.total,
        confidence: 0.9
      }
    }

    return {
      type: 'summary',
      title: 'Analysis Complete',
      description: `Found ${result.length} result${result.length === 1 ? '' : 's'} for your query`,
      value: result.length,
      confidence: 0.8
    }
  }

  private static calculateConfidenceScore(question: string, result: any[]): number {
    if (result.length === 0) return 0.1
    
    const questionComplexity = question.split(' ').length
    const dataAvailability = result.length > 0 ? 0.8 : 0.1
    const specificityBonus = question.includes('show') || question.includes('find') ? 0.1 : 0
    
    return Math.min(0.95, dataAvailability + specificityBonus + (questionComplexity > 5 ? 0.1 : 0))
  }
}
