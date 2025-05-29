import { FeedbackRule, CalculatorType } from '../feedbackRules';

export const genericFeedbackRules: FeedbackRule[] = [
  // ===== GENERIC RULES (apply to all calculators) =====
  {
    id: 'rule-generic-completion',
    calculatorType: ['cashflow', 'profitability', 'projections', 'ratios', 'startupcost', 'burnRate'],
    conditions: [
      {
        metric: 'completionPercentage',
        operator: '>=',
        value: 100,
      },
    ],
    feedbackTemplate: {
      title: 'Analysis Complete',
      message: 'Great job! You\'ve completed all the required fields for this calculator.',
      severity: 'good',
      implication: 'Your results are now based on complete information.',
      recommendation: 'Review the insights below and consider saving or exporting your results for future reference.',
    },
    priority: 5,
  }
];
