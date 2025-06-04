import { type BusinessType } from '@/data/businessTypes';

export function getFlattenedBenchmarks(businessTypeData?: BusinessType): Record<string, any> {
  if (!businessTypeData?.benchmarks) return {};
  const flattened: Record<string, any> = {};
  Object.entries(businessTypeData.benchmarks).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        flattened[`${key}.${subKey}`] = subValue;
      });
    } else {
      flattened[key] = value;
    }
  });
  return flattened;
}
