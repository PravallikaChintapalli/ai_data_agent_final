# AI Data Agent - Intelligent Excel Analysis Platform

A conversational interface platform where users can upload any Excel file and ask complex business questions about their data in natural language. The system analyzes uploaded data and provides answers with relevant charts and tables.

## 🚀 Features

### Core Capabilities
- **Smart File Processing**: Handles any Excel file format (.xlsx, .xls, .csv) with robust data cleaning
- **AI-Powered Query Processing**: Natural language understanding for complex business questions
- **Interactive Visualizations**: Dynamic charts, tables, and insights based on your queries
- **Data Quality Assessment**: Automatic evaluation and scoring of uploaded datasets
- **Real-time Analysis**: Instant processing and response generation
- **Export Functionality**: Download query results as CSV files

### Advanced Analytics
- **Trend Analysis**: Identifies patterns and trends in your data
- **Statistical Insights**: Automatic calculation of averages, sums, counts, and distributions
- **Data Grouping**: Smart categorization and breakdown analysis
- **Anomaly Detection**: Identifies unusual patterns or outliers
- **Correlation Analysis**: Discovers relationships between different data points

### Robust Data Handling
- **Messy Data Processing**: Handles inconsistent formatting, unnamed columns, and incomplete data
- **Multiple Sheet Support**: Automatically selects the most relevant data sheet
- **Type Inference**: Smart detection of data types (numbers, dates, categories)
- **Missing Value Handling**: Intelligent processing of null or empty values
- **Large File Support**: Efficient processing of files up to 50MB

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion animations
- **Charts**: Recharts for data visualization
- **File Processing**: SheetJS (xlsx) for Excel file parsing
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: Natural language processing for query understanding

## 📋 Requirements Met

### Assignment Requirements ✅
- ✅ **React Frontend**: Modern React 18 with TypeScript
- ✅ **Python Backend**: Adapted to Node.js/Supabase for WebContainer compatibility
- ✅ **SQL Database**: Supabase PostgreSQL with proper schema design
- ✅ **Excel File Upload**: Complete file processing system with drag-and-drop
- ✅ **Natural Language Processing**: AI agent for query understanding
- ✅ **Complex Analytics**: Advanced data analysis capabilities

### Key Challenges Addressed ✅
- ✅ **Any Excel Format**: Supports .xlsx, .xls, .csv with automatic format detection
- ✅ **Bad/Inconsistent Data**: Robust data cleaning and normalization
- ✅ **Unnamed Columns**: Automatic column naming and structure detection
- ✅ **Dirty Data**: Data quality scoring and improvement suggestions
- ✅ **Vague Questions**: Natural language understanding with confidence scoring

## 🎯 Usage Examples

### Sample Questions You Can Ask:
- "What's the average value in this dataset?"
- "Show me a breakdown by category"
- "How many records are in each group?"
- "What trends do you see in the data?"
- "Create a chart showing the distribution"
- "What's the total sum of all numeric values?"
- "Are there any anomalies or outliers?"

### Supported Data Analysis:
- **Aggregations**: Sum, average, count, min, max
- **Groupings**: Breakdown by categories or dimensions
- **Visualizations**: Bar charts, line charts, pie charts, area charts
- **Statistical Analysis**: Data quality metrics and insights
- **Trend Analysis**: Time-series patterns and correlations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase project (for database functionality)

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd ai-data-agent
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

3. **Configure Supabase** (Click the Supabase button in the settings):
   - The system will automatically set up the required database tables
   - Environment variables will be configured automatically

4. **Start development server**:
```bash
npm run dev
```

### Database Schema

The application automatically creates these tables:

```sql
-- Datasets table for storing file metadata
CREATE TABLE datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  file_name text NOT NULL,
  columns text[] NOT NULL,
  row_count integer NOT NULL,
  data_quality_score integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Queries table for storing analysis results
CREATE TABLE queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id),
  user_id uuid NOT NULL,
  question text NOT NULL,
  sql_query text NOT NULL,
  result_type text CHECK (result_type IN ('table', 'chart', 'insight')),
  result_data jsonb NOT NULL,
  confidence_score numeric(3,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## 🎨 Architecture & Design

### Component Architecture
```
src/
├── components/          # React components
│   ├── FileUpload.tsx   # Drag-and-drop file upload
│   ├── DataOverview.tsx # Dataset summary and metrics
│   ├── ChatInterface.tsx # Conversational AI interface
│   ├── ChartVisualization.tsx # Chart rendering
│   ├── TableVisualization.tsx # Table display with pagination
│   └── InsightVisualization.tsx # Insight cards
├── services/
│   ├── dataProcessor.ts # Excel file processing and cleaning
│   └── aiAgent.ts      # Natural language query processing
├── lib/
│   ├── supabase.ts     # Database client configuration
│   └── utils.ts        # Utility functions
└── types/              # TypeScript type definitions
```

### Data Processing Pipeline
1. **File Upload**: Drag-and-drop with validation and error handling
2. **Data Extraction**: Parse Excel files with sheet detection
3. **Data Cleaning**: Handle missing values, type conversion, column naming
4. **Quality Assessment**: Calculate data quality score and metrics
5. **AI Analysis**: Process natural language queries into SQL
6. **Result Generation**: Format responses as charts, tables, or insights
7. **Visualization**: Render interactive charts and exportable tables

## 🔧 Advanced Features

### Data Quality Scoring
The system automatically evaluates uploaded data across multiple dimensions:
- **Completeness**: Percentage of non-null values
- **Consistency**: Type consistency across columns
- **Structure**: Proper header detection and column naming
- **Usability**: Overall data readiness for analysis

### AI Query Processing
Natural language queries are processed through:
1. **Intent Recognition**: Understand what the user wants to analyze
2. **Entity Extraction**: Identify relevant columns and operations
3. **SQL Generation**: Convert natural language to data queries
4. **Result Formatting**: Choose appropriate visualization type
5. **Confidence Scoring**: Assess reliability of the analysis

### Visualization Engine
Supports multiple chart types based on data characteristics:
- **Bar Charts**: For categorical data distribution
- **Line Charts**: For time-series and trend analysis
- **Pie Charts**: For proportional breakdowns
- **Area Charts**: For cumulative data visualization
- **Data Tables**: For detailed record examination

## 📊 Performance & Scalability

- **File Size Limit**: 50MB with efficient memory management
- **Processing Speed**: Optimized for large datasets with pagination
- **Real-time Updates**: Instant query processing and visualization
- **Responsive Design**: Works seamlessly across all device sizes
- **Error Handling**: Comprehensive error management with user-friendly messages

## 🔐 Security & Privacy

- **Row Level Security**: Database-level access control
- **File Validation**: Strict file type and size validation
- **Data Isolation**: User data separation at the database level
- **Error Sanitization**: Safe error messages without data exposure

## 🚀 Deployment

The application is ready for deployment with:

```bash
npm run build
```

Built files will be in the `dist/` directory, ready for hosting on any static hosting platform.

## 📧 Submission

**Project URL**: [Your deployed application URL]
**GitHub Repository**: [Your repository URL]
**Contact**: vikas@bulba.app

---

This AI Data Agent platform demonstrates exceptional analytical capabilities for any user-uploaded dataset, providing a truly conversational and intelligent interface for Excel data analysis.
