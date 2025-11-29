# 🚀 Quick Start - TradePro Elite

## Current Status
✅ Frontend is already running on http://localhost:8080

## To Start Backend (Choose One Option)

### Option 1: Basic Setup (Recommended)
Just start the stocks server to get stock data:

```bash
# Open a new terminal
cd backend
npm install
npm run stocks
```

This gives you:
- Stock data from Google Sheets (2176+ NSE stocks)
- Search functionality
- Individual stock details
- Running on port 3001

### Option 2: Full Setup
Start all servers for complete functionality:

```bash
# Terminal 1: Stocks Server
cd backend
npm install
npm run stocks

# Terminal 2: Indices Server
cd backend
npm run indices

# Terminal 3: Main Server with WebSocket
cd backend
npm run final
```

This gives you:
- Everything from Option 1
- Market indices data
- Real-time WebSocket updates
- Complete API gateway

## Test Your Setup

1. **Frontend**: http://localhost:8080
2. **Stocks API**: http://localhost:3001/api/stocks
3. **Indices API**: http://localhost:3002/api/indices (if running)
4. **Main Server**: http://localhost:3003/health (if running)

## What You Can Do Now

### Without Backend
- ✅ Browse all UI pages
- ✅ View components
- ✅ Test navigation
- ✅ See mock data

### With Stocks Server (Option 1)
- ✅ Everything above
- ✅ Fetch real stock data from Google Sheets
- ✅ Search stocks
- ✅ View stock details
- ✅ See 2176+ NSE stocks

### With Full Setup (Option 2)
- ✅ Everything above
- ✅ Market indices (NIFTY, SENSEX, etc.)
- ✅ Real-time updates via WebSocket
- ✅ Complete API functionality

## Troubleshooting

### "Port already in use"
- Frontend (8080): Stop the current dev server and restart
- Backend (3001/3002/3003): Change PORT in backend/.env

### "Module not found"
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### "Cannot fetch stocks"
- Check if backend is running
- Verify GOOGLE_SHEET_URL in backend/.env
- Check console for errors

## Next Steps After Setup

1. **Test Stock Data**
   - Go to Dashboard
   - Check if stocks are loading
   - Try search functionality

2. **Implement Authentication**
   - Set up Supabase auth flows
   - Add login/signup logic

3. **Connect Trading**
   - Link trading service to UI
   - Test buy/sell operations

4. **Add Real-time Updates**
   - Connect Socket.IO client
   - Implement live price updates

## Quick Commands Reference

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
cd backend
npm run stocks       # Stocks server only (Port 3001)
npm run indices      # Indices server only (Port 3002)
npm run final        # Main server (Port 3003)
npm run dev          # Basic dev server

# Database (Optional)
cd backend
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## File Structure Quick Reference

```
Your Project/
├── src/                    # Frontend source
│   ├── pages/             # All page components
│   ├── components/        # Reusable components
│   ├── services/          # API services (NEW)
│   ├── stores/            # State management
│   └── config/            # Configuration (NEW)
│
├── backend/               # Backend source (NEW)
│   ├── src/              # Server files
│   └── prisma/           # Database schema
│
├── .env                   # Frontend environment
├── SETUP_GUIDE.md        # Detailed setup guide
├── RECOVERY_STATUS.md    # What was recovered
└── PROJECT_ARCHITECTURE.md # Full architecture docs
```

---

**You're all set!** 🎉

The frontend is running. Start the backend when you're ready to fetch real stock data.
