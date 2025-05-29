// src/data/businessTypes.ts

export interface BenchmarkRange {
  low: number;
  high: number;
}

export interface Benchmarks {
  currentRatio?: BenchmarkRange;
  quickRatio?: BenchmarkRange;
  netMargin?: BenchmarkRange;
  debtToEquity?: BenchmarkRange;
  roe?: BenchmarkRange;
  // Add other ratio benchmarks as needed
}

export interface BusinessType {
  value: string;
  label: string;
  benchmarks?: Benchmarks; // Make benchmarks optional
}

export const businessTypes: BusinessType[] = [
  { 
    value: 'retail', 
    label: 'Retail Business', 
    benchmarks: { 
      currentRatio: { low: 1.0, high: 2.0 },
      quickRatio: { low: 0.5, high: 1.0 },
      netMargin: { low: 2, high: 5 }, // Example: 2% to 5%
      debtToEquity: { low: 0.4, high: 0.6 },
      roe: { low: 10, high: 15 } // Example: 10% to 15%
    }
  },
  { value: 'service', label: 'Service-Based Business', benchmarks: {} },
  { value: 'saas', label: 'SaaS (Software as a Service)', benchmarks: {} },
  { value: 'manufacturing', label: 'Manufacturing Business', benchmarks: {} },
  { value: 'ecommerce', label: 'E-commerce Business', benchmarks: {} },
  { value: 'boutique', label: 'Boutique', benchmarks: {} },
  { value: 'coworking', label: 'Co-working Space', benchmarks: {} },
  { value: 'consulting', label: 'Consulting Agency', benchmarks: {} },
  { value: 'creative', label: 'Creative Studio', benchmarks: {} },
  { value: 'digitalMarketing', label: 'Digital Marketing Agency', benchmarks: {} },
  { value: 'eventPlanning', label: 'Event Planning', benchmarks: {} },
  { value: 'foodTruck', label: 'Food Truck', benchmarks: {} },
  { value: 'health', label: 'Health & Wellness', benchmarks: {} },
  // Add more types here as needed
];

// Optional: Export a union type for stricter type checking if desired elsewhere
export type BusinessTypeValue = typeof businessTypes[number]['value'];
