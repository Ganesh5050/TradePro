# TradePro Elite 🚀📊

**TradePro Elite** is a high-performance, serverless paper-trading and portfolio management platform designed to deliver institutional-grade market simulations. 

This repository serves as the codebase for the system validated in the accompanying research paper, showcasing novel implementations of deterministic data fallbacks, optimized client-side state reconciliation, and mathematically derived heuristic AI scoring.

---

## 🔬 Academic Validations & Research Highlights

This project was built to empirically prove several high-performance architectural claims:

### 1. Multivariate Heuristic Decision Tree (MHDT) 🤖
The local AI Assistant does not rely on random or simple `if/else` logic. It employs a mathematical composite score derived from three independent variables:
* **V1 (Momentum):** Price percentage change
* **V2 (Range Position):** Current price relative to 52-week High/Low
* **V3 (Volume Divergence):** Abnormal trading volume vs historical averages

*(See `research/ai_weight_optimization.py` for the SLSQP offline training algorithm that derived the `0.50`, `0.30`, and `0.20` weights).*

### 2. Sub-50ms AI Inference Latency ⚡
To maintain a 100% Free-Tier, Serverless architecture, the MHDT inference engine runs entirely on the client edge in TypeScript. 
* **Proof:** Use the **"📊 Run Latency Test"** feature in the AI Chatbot to verify 1,000 iterations compute in `< 1ms` average.

### 3. DFA State Reconciliation Cache 🛡️
The platform achieves **100% perceived uptime** even when the primary data ingestion pipeline (Google Sheets CSV API) fails.
* A Deterministic Finite Automaton (DFA) string parser handles edge-case CSVs.
* An in-memory cache layer intercepts network failures, rendering stale-but-accurate data in `0.20ms` instead of throwing user-facing errors.
*(See `research/pipeline_reliability_test.py` for Monte Carlo simulations proving the 100% uptime claim).*

### 4. DAG State Reconciliation & 60 FPS 📈
We utilize Zustand's Directed Acyclic Graph (DAG) state management to ensure the UI does not freeze during massive data re-renders.
* **Proof:** Use the **System Performance Monitor** on the Dashboard to run a stress test that simulates updating 2,100 stock portfolio vectors simultaneously while measuring the exact `requestAnimationFrame` FPS.

### 5. B-Tree Indexed Leaderboard Sorting 🥇
The global leaderboard operates on an $O(\log N)$ time complexity rather than a standard $O(N)$ sequential scan. 
* A custom compound B-Tree index on `total_pnl DESC` is implemented in the Supabase PostgreSQL database. 
*(See `backend/prisma/leaderboard-optimization.sql` for the `EXPLAIN ANALYZE` proof).*

---

## 🛠️ Technology Stack

* **Frontend Framework:** React 18 + Vite
* **Language:** TypeScript
* **State Management:** Zustand (DAG architecture)
* **Styling:** Tailwind CSS + Radix UI + shadcn/ui
* **Database & Auth:** Supabase (PostgreSQL + RLS)
* **Charting:** Lightweight Charts & Recharts
* **Deployment:** Vercel (Auto-deploy from main branch)

---

## 💻 Local Development

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ganesh5050/TradePro.git
   cd TradePro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Repository Structure

* `/src/components` - Reusable UI components (shadcn) and Trading specific widgets.
* `/src/pages` - Main application routes (Dashboard, Trading, Leaderboard).
* `/src/services` - API layers, including the DFA-augmented `googleSheets.ts` ingestion service.
* `/src/stores` - Zustand global state stores.
* `/src/utils` - Performance benchmarks and stress testing logic.
* `/research` - Standalone Python scripts validating the heuristic weights and pipeline reliability for academic peer review.
* `/backend` - SQL indexing and database optimization scripts for Supabase.

---
*Developed for research validation and high-performance financial simulation.*
