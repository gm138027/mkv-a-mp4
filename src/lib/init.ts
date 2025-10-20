import { initializeCleanupScheduler } from './tasks/scheduler';
import { initializeStorageDirs } from './fs-utils';

const isServer = typeof window === 'undefined';
const isServerlessRuntime =
  isServer &&
  Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY ||
      process.env.CF_PAGES ||
      process.env.SERVERLESS
  );

let initialized = false;

export const initializeApp = (): void => {
  if (!isServer || initialized) {
    return;
  }

  if (isServerlessRuntime) {
    initialized = true;

    if (process.env.ENABLE_CLEANUP_SCHEDULER === 'true') {
      console.warn('[init] Serverless runtime detected, ignoring ENABLE_CLEANUP_SCHEDULER=true');
    }

    console.info('[init] Serverless runtime detected; skipping storage bootstrap and cleanup scheduler.');
    return;
  }

  console.log('[init] Bootstrapping application services...');

  try {
    initializeStorageDirs();
  } catch (error) {
    initialized = false;
    console.error('[init] Failed to prepare storage directories', error);
    throw error;
  }

  if (process.env.ENABLE_CLEANUP_SCHEDULER === 'true') {
    initializeCleanupScheduler();
  } else {
    console.log('[init] Cleanup scheduler disabled (set ENABLE_CLEANUP_SCHEDULER=true to enable)');
  }

  initialized = true;
  console.log('[init] Application services ready.');
};

if (isServer) {
  try {
    initializeApp();
  } catch (error) {
    console.error('[init] Application bootstrap failed', error);
  }
}
