// Public API for the Financial Ratios feature
import FinancialRatios from './FinancialRatios';
import type { 
  FinancialMetrics, 
  FinancialRatios as FinancialRatiosType,
  FinancialRatiosState,
  RatioCardProps 
} from './types';

export default FinancialRatios;

export type { 
  FinancialMetrics, 
  FinancialRatiosType, 
  FinancialRatiosState,
  RatioCardProps 
};

// Re-export components
export * from './components/index';
