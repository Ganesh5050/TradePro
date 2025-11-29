# TradePro Elite Backend

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update with your actual API keys:
```bash
cp .env.example .env
```

### 3. Database Setup (Optional - if using PostgreSQL)
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

### 4. Start Servers

#### Option 1: Main Production Server (Port 3003)
```bash
npm run final
```

#### Option 2: Individual Servers
```bash
# Stocks Server (Port 3001)
npm run stocks

# Indices Server (Port 3002)
npm run indices
```

#### Option 3: Development Server
```bash
npm run dev
```

## API Endpoints

### Stocks Server (Port 3001)
- `GET /api/stocks` - Get all stocks from Google Sheets
- `GET /api/stock/:symbol` - Get specific stock details
- `GET /api/search?q=query` - Search stocks

### Indices Server (Port 3002)
- `GET /api/indices` - Get all market indices
- `GET /api/index/:symbol` - Get specific index details

### Final Server (Port 3003)
- `GET /health` - Health check
- `GET /api/stocks` - Proxy to stocks data
- WebSocket support for real-time updates

## Features

- ✅ Google Sheets integration for 2176+ NSE stocks
- ✅ Real-time data caching (30-second intervals)
- ✅ Socket.IO for live updates
- ✅ PostgreSQL + Prisma ORM (optional)
- ✅ Supabase integration
- ✅ CORS enabled for frontend

## Notes

- The backend uses Google Sheets as the primary data source
- Data is cached for 30 seconds to reduce API calls
- Socket.IO enables real-time price updates
- Supabase handles authentication and user data
