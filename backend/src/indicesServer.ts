import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Cache for indices data
let indicesCache: any[] = [];
let lastFetch = 0;
const CACHE_DURATION = 30000; // 30 seconds

async function fetchIndicesData() {
  const now = Date.now();
  if (now - lastFetch < CACHE_DURATION && indicesCache.length > 0) {
    return indicesCache;
  }

  try {
    const sheetUrl = process.env.GOOGLE_INDICES_SHEET_URL || 'https://docs.google.com/spreadsheets/d/1fZPztlpXcuUy-AY8yHk1HfjrUuBdAxtBdLb6nyui8yM/export?format=csv&gid=0';
    const response = await fetch(sheetUrl);
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    indicesCache = lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        const index: any = {};
        headers.forEach((header, idx) => {
          index[header] = values[idx]?.trim() || '';
        });
        return index;
      })
      .filter(index => index.Symbol || index.symbol);
    
    lastFetch = now;
    console.log(`Fetched ${indicesCache.length} indices from Google Sheets`);
    return indicesCache;
  } catch (error) {
    console.error('Error fetching indices:', error);
    return indicesCache;
  }
}

app.get('/api/indices', async (req, res) => {
  try {
    const indices = await fetchIndicesData();
    res.json({ success: true, count: indices.length, data: indices });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch indices' });
  }
});

app.get('/api/index/:symbol', async (req, res) => {
  try {
    const indices = await fetchIndicesData();
    const index = indices.find(i => 
      (i.Symbol || i.symbol) === req.params.symbol
    );
    
    if (index) {
      res.json({ success: true, data: index });
    } else {
      res.status(404).json({ success: false, error: 'Index not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch index' });
  }
});

app.listen(PORT, () => {
  console.log(`📊 Indices Server running on port ${PORT}`);
});
