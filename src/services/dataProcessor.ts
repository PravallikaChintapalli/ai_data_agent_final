import * as XLSX from 'xlsx'
import { DataRow } from '../types'

export class DataProcessor {
  static async processExcelFile(file: File): Promise<{
    data: DataRow[]
    columns: string[]
    sheetNames: string[]
    metadata: {
      fileName: string
      fileSize: number
      rowCount: number
      columnCount: number
      dataQualityScore: number
    }
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          
          // Get the first sheet or find the most relevant sheet
          const sheetName = this.findBestSheet(workbook)
          const worksheet = workbook.Sheets[sheetName]
          
          // Convert to JSON with header row detection
          let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
          
          // Clean and process the data
          const processed = this.cleanAndStructureData(jsonData)
          
          const metadata = {
            fileName: file.name,
            fileSize: file.size,
            rowCount: processed.data.length,
            columnCount: processed.columns.length,
            dataQualityScore: this.calculateDataQualityScore(processed.data, processed.columns)
          }
          
          resolve({
            data: processed.data,
            columns: processed.columns,
            sheetNames: workbook.SheetNames,
            metadata
          })
        } catch (error) {
          reject(new Error(`Failed to process Excel file: ${error}`))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  private static findBestSheet(workbook: XLSX.WorkBook): string {
    const sheetNames = workbook.SheetNames
    
    // Prioritize sheets with more data
    let bestSheet = sheetNames[0]
    let maxCells = 0
    
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName]
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1')
      const cellCount = (range.e.r - range.s.r + 1) * (range.e.c - range.s.c + 1)
      
      if (cellCount > maxCells) {
        maxCells = cellCount
        bestSheet = sheetName
      }
    }
    
    return bestSheet
  }

  private static cleanAndStructureData(rawData: any[][]): {
    data: DataRow[]
    columns: string[]
  } {
    if (rawData.length === 0) {
      return { data: [], columns: [] }
    }

    // Find header row (first non-empty row with string values)
    let headerRowIndex = 0
    for (let i = 0; i < Math.min(5, rawData.length); i++) {
      if (this.isLikelyHeaderRow(rawData[i])) {
        headerRowIndex = i
        break
      }
    }

    // Extract and clean column names
    const headerRow = rawData[headerRowIndex] || []
    const columns = this.cleanColumnNames(headerRow)
    
    // Process data rows
    const dataRows = rawData.slice(headerRowIndex + 1)
    const cleanedData: DataRow[] = []

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      if (this.isEmptyRow(row)) continue

      const cleanedRow: DataRow = {}
      
      for (let j = 0; j < columns.length; j++) {
        const value = row[j]
        cleanedRow[columns[j]] = this.cleanCellValue(value)
      }
      
      cleanedData.push(cleanedRow)
    }

    return {
      data: cleanedData,
      columns: columns.filter(col => col.trim() !== '')
    }
  }

  private static isLikelyHeaderRow(row: any[]): boolean {
    if (!row || row.length === 0) return false
    
    const nonEmptyValues = row.filter(cell => cell !== null && cell !== undefined && cell !== '')
    if (nonEmptyValues.length === 0) return false
    
    // Check if most values are strings (likely column names)
    const stringValues = nonEmptyValues.filter(cell => typeof cell === 'string')
    return stringValues.length / nonEmptyValues.length > 0.7
  }

  private static cleanColumnNames(headerRow: any[]): string[] {
    return headerRow.map((cell, index) => {
      if (cell === null || cell === undefined || cell === '') {
        return `Column_${index + 1}`
      }
      
      return String(cell)
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50)
    })
  }

  private static cleanCellValue(value: any): any {
    if (value === null || value === undefined || value === '') {
      return null
    }
    
    // Handle Excel date serial numbers
    if (typeof value === 'number' && value > 25000 && value < 50000) {
      try {
        const date = XLSX.SSF.parse_date_code(value)
        return new Date(date.y, date.m - 1, date.d).toISOString().split('T')[0]
      } catch (e) {
        return value
      }
    }
    
    // Clean string values
    if (typeof value === 'string') {
      const cleaned = value.trim()
      
      // Try to parse as number
      if (!isNaN(Number(cleaned)) && cleaned !== '') {
        const num = Number(cleaned)
        return Number.isInteger(num) ? num : parseFloat(num.toFixed(6))
      }
      
      // Try to parse as boolean
      if (cleaned.toLowerCase() === 'true') return true
      if (cleaned.toLowerCase() === 'false') return false
      
      return cleaned
    }
    
    return value
  }

  private static isEmptyRow(row: any[]): boolean {
    if (!row || row.length === 0) return true
    return row.every(cell => cell === null || cell === undefined || cell === '')
  }

  private static calculateDataQualityScore(data: DataRow[], columns: string[]): number {
    if (data.length === 0) return 0

    let totalCells = data.length * columns.length
    let validCells = 0
    let consistentTypes = 0

    // Check each column for data quality
    for (const column of columns) {
      const columnValues = data.map(row => row[column]).filter(val => val !== null && val !== undefined)
      validCells += columnValues.length

      // Check type consistency
      if (columnValues.length > 0) {
        const firstType = typeof columnValues[0]
        const sameTypeCount = columnValues.filter(val => typeof val === firstType).length
        if (sameTypeCount / columnValues.length > 0.8) {
          consistentTypes++
        }
      }
    }

    const completenessScore = (validCells / totalCells) * 100
    const consistencyScore = (consistentTypes / columns.length) * 100
    
    return Math.round((completenessScore + consistencyScore) / 2)
  }
}
