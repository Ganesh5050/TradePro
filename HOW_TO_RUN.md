# TradePro Elite - How to Run

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

## Installation

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

## Running the Project

### Start Frontend
Open a terminal and run:
```bash
npm run dev
```
Frontend will be available at: **http://localhost:8080/**

### Start Backend
Open a **new terminal** and run:
```bash
cd backend
npx tsx watch src/server.ts
```
Backend will be available at: **http://localhost:3001/**

## Quick Start (Both Servers)

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npx tsx watch src/server.ts
```

## Access the Application
Once both servers are running, open your browser and go to:
- **Frontend**: http://localhost:8080/
- **Backend API**: http://localhost:3001/

## Features
- ✅ Real-time stock market data (NSE/BSE)
- ✅ Paper trading with ₹10,00,000 virtual money
- ✅ Portfolio management
- ✅ Live dashboard with 2000+ stocks
- ✅ Transaction history
- ✅ Leaderboards and achievements
- ✅ Learning resources (patterns, strategies)
- ✅ Sector analysis and heat maps

## Tech Stack
- **Frontend**: React + TypeScript + Vite + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Real-time**: WebSocket

## Troubleshooting

### Port Already in Use
If you get a port error, the server might already be running. Check and kill the process:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables
Make sure you have `.env` files configured:
- Root `.env` for frontend
- `backend/.env` for backend

---

**Made with ❤️ for Indian traders**
