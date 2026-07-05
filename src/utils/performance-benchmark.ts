/**
 * Utility helper to measure execution latency and performance statistics of functions.
 * Useful for academic validation of AI inference speeds and parsing runtimes.
 */

export interface BenchmarkResult {
  iterations: number;
  totalTimeMs: number;
  avgTimeMs: number;
  minTimeMs: number;
  maxTimeMs: number;
  p95TimeMs: number;
}

export function runBenchmark(
  fn: () => void,
  iterations: number = 1000
): BenchmarkResult {
  const times: number[] = [];
  const startTotal = performance.now();

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    times.push(end - start);
  }

  const endTotal = performance.now();
  const totalTimeMs = endTotal - startTotal;

  // Sort times for percentile calculation
  times.sort((a, b) => a - b);

  const sum = times.reduce((acc, t) => acc + t, 0);
  const avgTimeMs = sum / iterations;
  const minTimeMs = times[0];
  const maxTimeMs = times[times.length - 1];
  
  // 95th percentile
  const p95Index = Math.floor(iterations * 0.95);
  const p95TimeMs = times[p95Index];

  return {
    iterations,
    totalTimeMs,
    avgTimeMs,
    minTimeMs,
    maxTimeMs,
    p95TimeMs,
  };
}
