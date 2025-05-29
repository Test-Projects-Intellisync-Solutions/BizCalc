import { FeedbackRule } from '../feedbackRules';
import { businessTypes } from '../businessTypes';

export const burnRateFeedbackRules: FeedbackRule[] = [
  {
    id: 'rule-burnrate-runway-short',
    calculatorType: 'burnRate',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'runwayMonths', operator: '>', value: 0 }, // Ensure there's a runway to evaluate
      { metric: 'runwayMonths', operator: '<', value: 3 }, // Example: runway less than 3 months
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Critically Short Runway',
      message: 'Your estimated runway is only {runwayMonths:number:1} months ({runwayInFutureDateFormatted}). This is critically short and requires immediate attention to extend your cash availability.',
      severity: 'critical',
      implication: 'High risk of running out of cash soon, potentially leading to inability to operate.',
      recommendation: 'Urgently explore options to reduce burn rate (cut costs, defer non-essential spending) and/or secure additional funding (investment, loans, revenue acceleration).',
      uiTarget: { scope: 'summaryMetric', identifier: 'runwayMonths' },
    },
    priority: 100,
  },
  {
    id: 'rule-burnrate-runway-warning',
    calculatorType: 'burnRate',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'runwayMonths', operator: '>=', value: 3 },
      { metric: 'runwayMonths', operator: '<', value: 6 }, // Example: runway between 3 and 6 months
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Short Runway Warning',
      message: 'Your estimated runway is {runwayMonths:number:1} months ({runwayInFutureDateFormatted}). While not immediately critical, this is a relatively short runway and warrants proactive planning.',
      severity: 'warning',
      implication: 'Limited time to achieve profitability or secure new funding before cash reserves are depleted.',
      recommendation: 'Review your financial projections. Focus on strategies to extend your runway, such as increasing revenue, managing expenses carefully, or starting fundraising efforts soon.',
      uiTarget: { scope: 'summaryMetric', identifier: 'runwayMonths' },
    },
    priority: 50,
  },
  {
    id: 'rule-burnrate-healthy-runway',
    calculatorType: 'burnRate',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'runwayMonths', operator: '>=', value: 12 }, // Example: runway 12 months or more
    ],
    feedbackTemplate: {
      title: 'Healthy Runway',
      message: 'Your estimated runway of {runwayMonths:number:1} months ({runwayInFutureDateFormatted}) is healthy. This provides a good buffer to execute your plans.',
      severity: 'good',
      implication: 'Sufficient time to achieve milestones, adapt to market changes, or secure further funding on favorable terms.',
      recommendation: 'Continue to manage your burn rate effectively and monitor your cash flow. Use this period of stability to focus on growth and achieving key business objectives.',
      uiTarget: { scope: 'summaryMetric', identifier: 'runwayMonths' },
    },
    priority: 10,
  },
  {
    id: 'rule-burnrate-negative-burn',
    calculatorType: 'burnRate',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'netBurnRateMonthly', operator: '<', value: 0 }, // Negative burn rate means profit
    ],
    feedbackTemplate: {
      title: 'Positive Cash Flow (Profit!)',
      message: 'Your net burn rate is {netBurnRateMonthly:currency}, which is negative! This indicates you are generating more cash than you are spending (i.e., you are profitable).',
      severity: 'good',
      implication: 'Excellent financial health. The business is self-sustaining and growing its cash reserves.',
      recommendation: 'Congratulations on achieving profitability! Continue to manage growth wisely. Consider how to best utilize the profits: reinvestment, building reserves, or distributions.',
      uiTarget: { scope: 'summaryMetric', identifier: 'netBurnRateMonthly' },
    },
    priority: 5, // Highest "good" priority
  },
];
