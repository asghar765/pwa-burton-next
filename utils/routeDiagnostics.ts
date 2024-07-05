import { trace, SpanStatusCode } from '@opentelemetry/api';

export const diagnoseRoute = (url: string, isSuccess: boolean) => {
  const tracer = trace.getTracer('pwa-app-route-diagnostic');

  tracer.startActiveSpan('RouteDiagnosis', (span) => {
    span.setAttribute('url', url);
    span.setStatus({ code: isSuccess ? SpanStatusCode.OK : SpanStatusCode.ERROR, message: isSuccess ? '' : 'Route issue detected' });

    try {
      console.log(isSuccess ? `Route ${url} is functional.` : `Issue detected in route ${url}.`);
    } catch (error) {
      console.error(`Error during route diagnostics for ${url}`, error.message, error.stack);
      span.recordException({
        name: 'RouteDiagnosticException',
        message: `Diagnostic error for route: ${url}`,
        stack: error.stack
      });
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    } finally {
      span.end();
    }
  });
};