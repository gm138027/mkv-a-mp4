import { cleanupExpiredTasks } from './cleanup';
import { CLEANUP_INTERVAL_MINUTES } from '@/lib/config';

/**
 * Periodic cleanup scheduler.
 * Responsible for running background sweeps that delete expired artefacts.
 */
class CleanupScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  start() {
    if (this.isRunning) {
      console.log('[cleanup] scheduler already running');
      return;
    }

    console.log(`[cleanup] starting scheduler (interval: ${CLEANUP_INTERVAL_MINUTES} minutes)`);
    this.isRunning = true;

    // Kick off an immediate sweep so the first cycle happens without delay.
    void this.runCleanup();

    this.intervalId = setInterval(() => {
      void this.runCleanup();
    }, CLEANUP_INTERVAL_MINUTES * 60 * 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log('[cleanup] scheduler stopped');
  }

  private async runCleanup() {
    try {
      console.log('[cleanup] running scheduled sweep');
      await cleanupExpiredTasks();
    } catch (error) {
      console.error('[cleanup] scheduled sweep failed', error);
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalMinutes: CLEANUP_INTERVAL_MINUTES,
    };
  }
}

// Singleton instance shared across the process.
export const cleanupScheduler = new CleanupScheduler();

let shutdownHooksRegistered = false;

export const initializeCleanupScheduler = () => {
  const shouldStart = process.env.ENABLE_CLEANUP_SCHEDULER === 'true';

  if (!shouldStart) {
    console.log('[cleanup] scheduler disabled (set ENABLE_CLEANUP_SCHEDULER=true to enable)');
    return;
  }

  cleanupScheduler.start();

  if (shutdownHooksRegistered) {
    return;
  }

  const gracefulShutdown = () => {
    console.log('[cleanup] shutting down scheduler');
    cleanupScheduler.stop();
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
  shutdownHooksRegistered = true;
};
