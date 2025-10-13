/**
 * Web Vitals 性能监控
 * 追踪 Core Web Vitals 指标
 */

import type { Metric } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed(): string {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const conn = (navigator as any).connection;
    return conn?.effectiveType || 'unknown';
  }
  return 'unknown';
}

export function sendToAnalytics(metric: Metric) {
  // 仅在生产环境发送
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Web Vitals]', metric.name, metric.value);
    return;
  }

  const body = {
    dsn: process.env.NEXT_PUBLIC_ANALYTICS_ID || 'development',
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };

  // 使用 sendBeacon 确保数据发送（即使页面关闭）
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, JSON.stringify(body));
  } else {
    fetch(vitalsUrl, {
      body: JSON.stringify(body),
      method: 'POST',
      keepalive: true,
    }).catch(console.error);
  }
}

/**
 * 报告 Web Vitals 指标
 * 可以集成 Google Analytics 或其他分析工具
 */
export function reportWebVitals(metric: Metric) {
  // 开发环境：输出到控制台
  if (process.env.NODE_ENV === 'development') {
    const { name, value, rating } = metric;
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(value),
      rating,
    });
  }

  // 生产环境：发送到分析服务
  // sendToAnalytics(metric);

  // 可以集成 Google Analytics
  // window.gtag?.('event', metric.name, {
  //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  //   event_label: metric.id,
  //   non_interaction: true,
  // });
}
