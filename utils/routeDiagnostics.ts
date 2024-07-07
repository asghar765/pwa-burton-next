import { trace, SpanStatusCode } from '@opentelemetry/api';
import { auth } from '../config/firebaseConfig';

export const diagnoseRoute = (url: string, isSuccess: boolean) => {
  const tracer = trace.getTracer('pwa-app-route-diagnostic');

  tracer.startActiveSpan('RouteDiagnosis', (span) => {
    span.setAttribute('url', url);
    span.setStatus({ code: isSuccess ? SpanStatusCode.OK : SpanStatusCode.ERROR, message: isSuccess ? '' : 'Route issue detected' });

    try {
      console.log(isSuccess ? `Route ${url} is functional.` : `Issue detected in route ${url}.`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error during route diagnostics for ${url}`, error.message, error.stack);
        span.recordException({
          name: 'RouteDiagnosticException',
          message: `Diagnostic error for route: ${url}`,
          stack: error.stack
        });
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      } else {
        console.error(`Error during route diagnostics for ${url}`, error);
        span.recordException({
          name: 'RouteDiagnosticException',
          message: `Diagnostic error for route: ${url}`,
        });
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Unknown error occurred' });
      }
    } finally {
      span.end();
    }
  });
};
