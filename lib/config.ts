/**
 * Application configuration
 * These values can be overridden via environment variables
 */

// Data refresh configuration
export const DATA_REFRESH_CONFIG = {
  // Default refresh interval in milliseconds
  // Can be overridden with NEXT_PUBLIC_DATA_REFRESH_INTERVAL_MS environment variable
  defaultInterval: parseInt(process.env.NEXT_PUBLIC_DATA_REFRESH_INTERVAL_MS || '300000', 10), // 5 minutes default

  // Minimum allowed refresh interval (1 minute) - prevents too frequent requests
  minInterval: 60 * 1000, // 1 minute

  // Maximum allowed refresh interval (30 minutes) - prevents too infrequent updates
  maxInterval: 30 * 60 * 1000, // 30 minutes

  // Refresh immediately if data is older than this (stale threshold)
  staleThreshold: parseInt(process.env.NEXT_PUBLIC_DATA_STALE_THRESHOLD_MS || '300000', 10), // 5 minutes default

  // Refresh on tab visibility change
  refreshOnVisibility: process.env.NEXT_PUBLIC_REFRESH_ON_VISIBILITY !== 'false', // true by default
};

/**
 * Get the configured refresh interval, clamped between min and max
 */
export function getRefreshInterval(): number {
  const interval = DATA_REFRESH_CONFIG.defaultInterval;
  return Math.max(
    DATA_REFRESH_CONFIG.minInterval,
    Math.min(DATA_REFRESH_CONFIG.maxInterval, interval),
  );
}

/**
 * Get the stale threshold for data freshness check
 */
export function getStaleThreshold(): number {
  return DATA_REFRESH_CONFIG.staleThreshold;
}

/**
 * Check if refresh on visibility is enabled
 */
export function shouldRefreshOnVisibility(): boolean {
  return DATA_REFRESH_CONFIG.refreshOnVisibility;
}
