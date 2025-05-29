import { FeedbackRule } from '../feedbackRules';
import { businessTypes } from '../businessTypes';

export const cashflowFeedbackRules: FeedbackRule[] = [
  // ===== CASHFLOW CALCULATOR RULES (Specific) =====
  {
    id: 'rule-cashflow-negative-starting-critical',
    calculatorType: 'cashflow',
    businessType: Object.values(businessTypes).map(bt => bt.value), 
    conditions: [
      { metric: 'startingBalance', operator: '<', value: 0 },
    ],
    feedbackTemplate: {
      title: 'Negative Starting Cash Balance',
      message: 'Your starting cash balance of {startingBalance, currency} is negative. This is a critical issue that needs immediate attention.',
      severity: 'critical',
      implication: 'Indicates existing financial distress or errors in data entry. Operations may be unsustainable without immediate intervention.',
      recommendation: 'Verify your input data. If correct, urgently seek funding, reduce initial outflows, or delay start until a positive balance can be achieved.',
      uiTarget: {
        scope: 'summaryMetric',
        identifier: 'startingBalance'
      }
    },
    priority: 200
  },
  {
    id: 'rule-cashflow-negative-ending-critical',
    calculatorType: 'cashflow',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'endingBalance', operator: '<', value: 0 },
    ],
    feedbackTemplate: {
      title: 'Projected Negative Ending Cash Balance',
      message: 'Your projected ending cash balance after {projectionMonths} months is {endingBalance, currency}. This indicates a potential cash shortfall.',
      severity: 'critical',
      implication: 'Inability to cover expenses and obligations by the end of the projection period.',
      recommendation: 'Review your cash inflows and outflows. Identify areas to increase revenue, reduce costs, or secure additional financing before this point.',
      uiTarget: {
        scope: 'summaryMetric',
        identifier: 'endingBalance'
      }
    },
    priority: 150
  },
  {
    id: 'rule-cashflow-negative-net-critical',
    calculatorType: 'cashflow',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'netCashFlow', operator: '<', value: 0 },
      { metric: 'endingBalance', operator: '>', value: 0 } // Only show if not already critically low ending
    ],
    feedbackTemplate: {
      title: 'Negative Net Cash Flow',
      message: 'Your total net cash flow over {projectionMonths} months is {netCashFlow, currency}, meaning outflows are exceeding inflows. While your ending balance is currently positive, this trend is unsustainable.',
      severity: 'critical',
      implication: 'Erosion of cash reserves over time, leading to future shortfalls if not addressed.',
      recommendation: 'Analyze monthly cash flow details to pinpoint periods of high deficit. Implement strategies to boost inflows or cut outflows to achieve positive net cash flow.',
      uiTarget: {
        scope: 'summaryMetric',
        identifier: 'netCashFlow'
      }
    },
    priority: 120
  },
  {
    id: 'rule-cashflow-low-coverage-warning',
    calculatorType: 'cashflow',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'cashCoverageRatio', operator: '<', value: 1 }, // Example: less than 1 month of expenses covered by cash
      { metric: 'cashCoverageRatio', operator: '>', value: 0 },
      { metric: 'endingBalance', operator: '>', value: 0 }
    ],
    feedbackTemplate: {
      title: 'Low Cash Coverage Ratio',
      message: 'Your cash coverage ratio of {cashCoverageRatio, number:1} indicates you have less than 1 month of operating expenses covered by your current cash. This is a warning sign.',
      severity: 'warning',
      implication: 'Limited buffer to handle unexpected expenses or revenue dips.',
      recommendation: 'Aim to increase your cash reserves to cover at least 3-6 months of operating expenses. Review spending and revenue generation strategies.',
    },
    priority: 80
  },
  {
    id: 'rule-cashflow-positive-outlook-good',
    calculatorType: 'cashflow',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'endingBalance', operator: '>', value: 0 },
      { metric: 'netCashFlow', operator: '>', value: 0 },
      { metric: 'startingBalance', operator: '>=', value: 0 },
      { metric: 'cashCoverageRatio', operator: '>=', value: 3 } // Example: At least 3 months coverage
    ],
    feedbackTemplate: {
      title: 'Positive Cash Flow Outlook',
      message: 'Your cash flow projection looks healthy! You have a positive starting balance ({startingBalance, currency}), positive net cash flow ({netCashFlow, currency}), and a projected ending balance of {endingBalance, currency}. Your cash coverage ratio is {cashCoverageRatio, number:1} months.',
      severity: 'good',
      implication: 'Strong financial stability and capacity to manage operations and growth.',
      recommendation: 'Maintain prudent cash management. Consider opportunities for investment or strategic initiatives.',
    },
    priority: 10
  },
  {
    id: 'rule-cashflow-overall-endingBalance-critical',
    calculatorType: 'cashflow',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'endingBalance', operator: '<=', value: 0 }
    ],
    feedbackTemplate: {
      title: 'Critical Projected Ending Balance',
      message: 'Your projected ending cash balance after {projectionMonths} months is {endingBalance, currency}. This is a critical situation requiring immediate action.',
      severity: 'critical',
      implication: 'High risk of insolvency and inability to meet financial obligations.',
      recommendation: 'Urgently review all financial plans. Drastic cost-cutting, revenue acceleration, or immediate funding is necessary.'
    },
    priority: 190 // Higher than the other ending balance critical for more specific message
  },
  {
    id: 'rule-cashflow-overall-endingBalance-warning',
    calculatorType: 'cashflow',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'endingBalance', operator: '>', value: 0 },
      { metric: 'endingBalance', operator: '<', comparisonMetric: 'averageMonthlyOverallExpenses' } // averageMonthlyOverallExpenses needs to be in calculatorData
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Low Projected Ending Balance',
      message: 'Your projected ending cash balance after {projectionMonths} months is {endingBalance, currency}. This is positive, but less than one average month of your expenses ({averageMonthlyOverallExpenses, currency}).',
      severity: 'warning',
      implication: 'Limited buffer for future uncertainties or growth opportunities.',
      recommendation: 'Aim to build a larger cash reserve, ideally covering 3-6 months of operating expenses. Explore ways to improve overall net cash flow.'
    },
    priority: 75
  },
  {
    id: 'rule-cashflow-overall-avgNetCashFlow-warning',
    calculatorType: 'cashflow',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'averageNetCashFlow', operator: '<', value: 0 } // averageNetCashFlow needs to be in calculatorData
    ],
    feedbackTemplate: {
      title: 'Negative Average Net Cash Flow',
      message: 'Your average monthly net cash flow over {projectionMonths} months is {averageNetCashFlow, currency}. This indicates that, on average, your expenses are exceeding your income.',
      severity: 'warning',
      implication: 'Sustained negative average net cash flow will continually deplete your cash reserves.',
      recommendation: 'Focus on strategies to achieve a positive average net cash flow. This may involve increasing prices, boosting sales volume, or reducing recurring expenses.'
    },
    priority: 60
  }
];
