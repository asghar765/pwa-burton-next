import { NextRequest, NextResponse } from 'next/server';
import { trace, SpanStatusCode, diag } from '@opentelemetry/api';
import { initTracing } from '../config/opentelemetryConfig';
import logger from '../utils/logger';
import { auth } from '../config/firebaseConfig';

initTracing();

export function middleware(request: NextRequest) {
    const tracer = trace.getTracer('pwa-app-route-logger-and-verifier');

  return tracer.startActiveSpan('RouteVerification', { attributes: { url: request.url } }, async (span) => {
    try {
      logger.info(`Route accessed: ${request.url}`);
      // Simulate verification of theme context by checking session storage, which is a placeholder approach
      const theme = request.cookies.get('theme')?.value || 'light'; // Assume the theme is stored in a cookie
      logger.info(`Current theme verified during route access: ${theme}`);
      span.setAttribute('theme', theme);
      span.setStatus({ code: SpanStatusCode.OK });

      // Verifying route structure
      if (!verifyRouteStructure(request.url)) {
        logger.warn(`Accessed route structure verification failed for URL: ${request.url}`);
        span.addEvent(`Route structure verification failed for ${request.url}`);
      }

      return NextResponse.next();
    } catch (error: any) {
      const errorMessage = `Error during routing: ${request.url}, Error: ${error.message}`;
      logger.error(errorMessage);
      diag.error(error.message, error.stack);
      span.recordException({
        name: 'RouteError',
        message: errorMessage,
        stack: error.stack,
      });
      span.setStatus({ code: SpanStatusCode.ERROR, message: errorMessage });

      return NextResponse.next();
    } finally {
      span.end();
    }
  });
}

function verifyRouteStructure(url: string) {
  // Ideally, this function should consider the project's actual route configuration,
  // including dynamic routes. It should be capable of handling query parameters, hashes, and dynamic path segments.
  // Simulating pattern matching against a set of predefined acceptable routes, including dynamic segments, for demonstration purposes.
  const routes = [
    '/',
    '/dashboard',
    '/registration/[id]',
    '/contact',
    '/admin/dashboard'
  ];

  // This simplified placeholder logic demonstrates how we might start to verify known patterns, including dynamic segments.
  const isKnownRoute = routes.some((route) => {
    if (route.includes('[id]')) {
      const baseRoute = route.split('[id]')[0];
      return url.startsWith(baseRoute);
    }
    return url === route || url.startsWith(route + '?') || url.startsWith(route + '#');
  });

  return isKnownRoute;
}
