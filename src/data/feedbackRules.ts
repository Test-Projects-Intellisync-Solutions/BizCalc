export interface FeedbackItem {
  id: string; // Unique ID for the feedback message
  title: string;
  message: string;
  severity: 'good' | 'warning' | 'critical' | 'info'; // To guide visual cues
  implication?: string; // What this means for the business
  recommendation?: string; // Actionable advice
  relevantMetrics?: Record<string, string | number>; // e.g., { "Current Ratio": 1.2, "Benchmark": ">2.0" }
  link?: string; // Optional link for more info
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
  operator: '>' | '<' | '>=' | '<=' | '==' | '!='; // Comparison operator
  value: number | string; // Value to compare against
  // Optional: to compare against a benchmark from businessTypes.ts
  valuePath?: string; // e.g., "liquidity.currentRatio.target" to look up in businessType.benchmarks
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

export const allFeedbackRules: FeedbackRule[] = [
  {
    id: 'rule-cr-low-retail',
    calculatorType: 'ratios',
    businessType: ['retail'], // Specific to retail
    conditions: [
      {
        metric: 'currentRatio', // Metric key from RatiosTab's calculated data
        operator: '<',
        // Assumes businessType.benchmarks.currentRatio.warning exists and is a number
        valuePath: 'currentRatio.warning',
        value: 0, // Placeholder, valuePath takes precedence
      },
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Low Current Ratio (Retail)',
      message: 'Your Current Ratio is below the typical warning threshold for retail businesses. This may indicate potential short-term liquidity challenges.',
      severity: 'warning',
      implication: 'Difficulty meeting short-term obligations.',
      recommendation: 'Consider strategies to improve working capital, such as accelerating receivables, managing payables effectively, or securing short-term financing.',
    },
    priority: 10,
  },
  {
    id: 'rule-cr-very-low-generic',
    calculatorType: 'ratios',
    // No businessType specified, so applies to all
    conditions: [
      {
        metric: 'currentRatio',
        operator: '<',
        // Assumes businessType.benchmarks.currentRatio.critical exists and is a number
        valuePath: 'currentRatio.critical',
        value: 0, // Placeholder, valuePath takes precedence
      },
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Critically Low Current Ratio',
      message: 'Your Current Ratio is very low, indicating potential critical issues with meeting short-term financial obligations.',
      severity: 'critical',
      implication: 'High risk of insolvency if immediate action is not taken.',
      recommendation: 'Urgently review your cash flow, reduce non-essential spending, and explore options for immediate capital infusion or debt restructuring.',
    },
    priority: 100, // Higher priority
  },
  {
    id: 'rule-de-high-generic',
    calculatorType: 'ratios',
    // No businessType specified, so applies to all
    conditions: [
      {
        metric: 'debtToEquityRatio',
        operator: '>',
        // Assumes businessType.benchmarks.debtToEquityRatio.warning exists (upper bound for warning)
        valuePath: 'debtToEquityRatio.warning',
        value: 0, // Placeholder, valuePath takes precedence
      },
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'High Debt-to-Equity Ratio',
      message: 'Your Debt-to-Equity ratio is higher than generally recommended, suggesting a significant reliance on debt financing.',
      severity: 'warning',
      implication: 'Increased financial risk, potentially higher interest expenses, and less flexibility in borrowing further.',
      recommendation: 'Evaluate your capital structure. Consider strategies to reduce debt, such as retaining earnings, or explore equity financing options.',
    },
    priority: 10,
  },
];

// Example Usage (Illustrative - to be populated later)
/*
export const exampleFeedbackRules: FeedbackRule[] = [
  {
    id: 'rule-cr-low-retail',
    calculatorType: 'ratios',
    businessType: ['retail'],
    conditions: [
      {
        metric: 'currentRatio',
        operator: '<',
        valuePath: 'liquidity.currentRatio.warning', // Assumes benchmarks.liquidity.currentRatio.warning exists
      },
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Low Current Ratio for Retail',
      message: 'Your Current Ratio is below the typical warning threshold for retail businesses. This may indicate potential short-term liquidity challenges.',
      severity: 'warning',
      implication: 'Difficulty meeting short-term obligations.',
      recommendation: 'Consider strategies to improve working capital, such as accelerating receivables or managing payables effectively.',
    },
    priority: 1,
  },
];
*/
