import { FeedbackRule } from '../feedbackRules';
import { businessTypes } from '../businessTypes';

export const projectionsFeedbackRules: FeedbackRule[] = [
  {
    id: 'rule-proj-negative-net-cashflow',
    calculatorType: 'projections',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'netCashFlow',
        operator: '<',
        value: 0,
      },
    ],
    feedbackTemplate: {
      title: 'Negative Projected Net Cash Flow',
      message: 'Your projections show a negative net cash flow of {netCashFlow:currency:USD:2} over {projectionMonths:number:0} months. This indicates that projected expenses exceed projected revenues.',
      severity: 'warning',
      implication: 'If these projections hold, your business will be spending more than it earns, potentially leading to a need for additional funding or a depletion of cash reserves.',
      recommendation: 'Review your revenue assumptions and expense forecasts. Identify areas to increase projected revenue or reduce projected costs to achieve a positive cash flow.',
    },
    priority: 70,
  },
  {
    id: 'rule-proj-high-expense-ratio',
    calculatorType: 'projections',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'expenseToRevenueRatio',
        operator: '>',
        value: 75,
      },
      {
        metric: 'totalRevenue',
        operator: '>',
        value: 0,
      }
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'High Projected Expense-to-Revenue Ratio',
      message: 'Your projected expense-to-revenue ratio is {expenseToRevenueRatio:percent:1}. This suggests that a large portion of your projected revenue is consumed by expenses.',
      severity: 'warning',
      implication: 'High expense ratios can limit profitability and cash flow, making the business more vulnerable to revenue fluctuations or unexpected cost increases.',
      recommendation: 'Analyze your projected expenses for potential cost-saving opportunities. Ensure your revenue projections are realistic and that your pricing strategy adequately covers all costs while allowing for profit.',
    },
    priority: 60,
  }
];
