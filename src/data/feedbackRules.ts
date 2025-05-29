export interface FeedbackItem {
  id: string; // Unique ID for the feedback message
  title: string;
  message: string;
  severity: 'good' | 'warning' | 'critical' | 'info'; // To guide visual cues
  implication?: string; // What this means for the business
  recommendation?: string; // Actionable advice
  relevantMetrics?: Record<string, string | number>; // e.g., { "Current Ratio": 1.2, "Benchmark": ">2.0" }
  link?: string; // Optional link for more info
  uiTarget?: {
    scope: 'costItem' | 'category' | 'summaryMetric' | 'chart'; // Defines the UI area to target
    identifier: string; // ID of the cost item, name of the category/metric, or chart ID/name
    details?: Record<string, any>; // Additional details, e.g., for chart highlighting { dataKey: 'revenue' }
  };
}

export type CalculatorType = 
  | 'burnRate'
  | 'cashflow' 
  | 'profitability' 
  | 'projections' 
  | 'ratios'
  | 'startupcost';

export interface FeedbackCondition {
  metric: string; // Key of the metric to check (e.g., "currentRatio", "netProfitMargin")
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'exists' | 'notExists'; // Comparison operator
  value?: number | string | boolean; // Value to compare against (literal). Becomes optional if comparisonMetric or valuePath is used.
  valuePath?: string; // Optional: Path to a benchmark in businessType.benchmarks (e.g., "liquidity.currentRatio.target")
  comparisonMetric?: string; // Optional: Path to another metric in calculatorData to compare against (e.g., "previousRevenue")
}

export interface FeedbackRule {
  id: string; // Unique ID for the rule
  calculatorType: CalculatorType | CalculatorType[]; // Which calculator(s) this rule applies to
  businessType?: string[]; // Optional: specific business types (by value) this rule applies to. If undefined, applies to all.
  conditions: FeedbackCondition[]; // Conditions to evaluate.
  conditionLogic?: 'AND' | 'OR'; // How multiple conditions are combined (default 'AND').
  feedbackTemplate: Omit<FeedbackItem, 'id' | 'relevantMetrics'>; // Template for the FeedbackItem.
  priority?: number; // For resolving conflicts if multiple rules match. Higher is more important.
}

import { cashflowFeedbackRules } from './feedbackRules/cashflowFeedbackRules';
import { genericFeedbackRules } from './feedbackRules/genericFeedbackRules';
import { profitabilityFeedbackRules } from './feedbackRules/profitabilityFeedbackRules';
import { ratiosFeedbackRules } from './feedbackRules/ratiosFeedbackRules';
import { projectionsFeedbackRules } from './feedbackRules/projectionsFeedbackRules';
import { startupCostFeedbackRules } from './feedbackRules/startupCostFeedbackRules';
import { burnRateFeedbackRules } from './feedbackRules/burnRateFeedbackRules';

export const allFeedbackRules: FeedbackRule[] = [
  ...cashflowFeedbackRules,
  ...genericFeedbackRules,
  ...profitabilityFeedbackRules,
  ...ratiosFeedbackRules,
  ...projectionsFeedbackRules,
  ...startupCostFeedbackRules,
  ...burnRateFeedbackRules,

];