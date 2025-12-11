import type { Metric } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((wv: any) => {
      wv.getCLS?.(onPerfEntry);
      wv.getFID?.(onPerfEntry);
      wv.getFCP?.(onPerfEntry);
      wv.getLCP?.(onPerfEntry);
      wv.getTTFB?.(onPerfEntry);
    });
  }
};

export default reportWebVitals;
