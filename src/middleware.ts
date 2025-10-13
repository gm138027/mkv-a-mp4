import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './lib/i18n/types';

/**
 * Next.js Middleware
 * 
 * 功能：
 * 1. 语言自动检测：根据浏览器语言自动跳转到合适的语言版本
 * 2. HTTPS强制（如果需要在应用层处理）
 * 
 * 注意：
 * - 仅在根路径 (/) 进行语言检测
 * - 使用cookie避免重复重定向
 * - 用户手动切换语言后不再自动重定向
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // =====================================
  // 1. 语言自动检测（仅在根路径）
  // =====================================
  if (pathname === '/') {
    // 检查是否已经进行过语言检测（避免重复重定向）
    const localeDetected = request.cookies.get('locale-detected');
    
    if (!localeDetected) {
      // 获取浏览器语言偏好
      const acceptLanguage = request.headers.get('accept-language') || '';
      
      // 解析第一个语言代码（格式：zh-CN,zh;q=0.9,en;q=0.8）
      const browserLang = acceptLanguage
        .split(',')[0]           // 取第一个
        .split('-')[0]           // 去除地区代码（en-US -> en）
        .toLowerCase();
      
      // 查找是否支持该语言
      const matchedLocale = SUPPORTED_LOCALES.find(
        (locale) => locale.code.toLowerCase() === browserLang
      );
      
      // 如果浏览器语言不是默认语言，且我们支持该语言，重定向
      if (matchedLocale && matchedLocale.code !== DEFAULT_LOCALE) {
        const response = NextResponse.redirect(
          new URL(`/${matchedLocale.code}`, request.url)
        );
        
        // 设置cookie，30天内不再自动检测
        response.cookies.set('locale-detected', 'true', {
          maxAge: 60 * 60 * 24 * 30, // 30天
          path: '/',
          sameSite: 'lax',
        });
        
        return response;
      }
      
      // 即使没有重定向，也设置cookie（避免后续每次访问都检测）
      const response = NextResponse.next();
      response.cookies.set('locale-detected', 'true', {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'lax',
      });
      
      return response;
    }
  }
  
  // =====================================
  // 2. HTTPS 强制（可选，通常由托管平台处理）
  // =====================================
  // 如果您的托管平台（如Vercel/Cloudflare）已经处理HTTPS重定向，
  // 可以注释掉这段代码。
  //
  // const proto = request.headers.get('x-forwarded-proto');
  // if (proto === 'http') {
  //   return NextResponse.redirect(
  //     `https://${request.headers.get('host')}${request.nextUrl.pathname}${request.nextUrl.search}`,
  //     301
  //   );
  // }
  
  // 继续处理请求
  return NextResponse.next();
}

/**
 * Middleware配置
 * 
 * matcher: 指定哪些路径需要运行middleware
 * - '/' : 根路径（用于语言检测）
 * - '/:path*' : 所有路径（如果需要HTTPS强制）
 */
export const config = {
  matcher: [
    '/',
    // 如果需要在所有路径强制HTTPS，取消下面的注释：
    // '/:path*',
  ],
};
