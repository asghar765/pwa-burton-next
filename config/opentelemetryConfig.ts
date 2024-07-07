// pwa-burton-next/config/opentelemetryConfig.ts
import { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web/build/src/WebTracerProvider';
export const initTracing = () => {
  const provider = new BasicTracerProvider();
  const webTracerProvider = new WebTracerProvider();

  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  provider.register();

  webTracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  webTracerProvider.register();

  console.log("OpenTelemetry Tracing Initialized");
};