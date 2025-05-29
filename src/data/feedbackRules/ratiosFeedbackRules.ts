import { FeedbackRule } from '../feedbackRules';
import { businessTypes } from '../businessTypes';

export const ratiosFeedbackRules: FeedbackRule[] = [
  {
    id: 'rule-cr-low-retail',
    calculatorType: 'ratios',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'currentRatio',
        operator: '<',
        valuePath: 'currentRatio.warning',
        value: 1.5,
      },
    ],
    feedbackTemplate: {
      title: 'Low Current Ratio (Retail)',
      message: 'Your Current Ratio of {currentRatio:number:2} is below the typical warning threshold of {currentRatio.warning:number:2} for retail businesses. This may indicate potential short-term liquidity challenges.',
      severity: 'warning',
      implication: 'Difficulty meeting short-term obligations.',
      recommendation: 'Consider strategies to improve working capital, such as accelerating receivables, managing payables effectively, or securing short-term financing.',
    },
    priority: 10,
  },
  {
    id: 'rule-cr-very-low-generic',
    calculatorType: 'ratios',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'currentRatio',
        operator: '<',
        valuePath: 'currentRatio.critical',
        value: 1.0,
      },
    ],
    feedbackTemplate: {
      title: 'Critically Low Current Ratio',
      message: 'Your Current Ratio of {currentRatio:number:2} is critically low (below {currentRatio.critical:number:2}), indicating potential issues with meeting short-term financial obligations.',
      severity: 'critical',
      implication: 'High risk of insolvency if immediate action is not taken.',
      recommendation: 'Urgently review your cash flow, reduce non-essential spending, and explore options for immediate capital infusion or debt restructuring.',
    },
    priority: 100,
  },
  {
    id: 'rule-qr-critical',
    calculatorType: 'ratios',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'quickRatio',
        operator: '<',
        valuePath: 'quickRatio.critical',
        value: 0.5,
      },
    ],
    feedbackTemplate: {
      title: 'Critically Low Quick Ratio',
      message: 'Your Quick Ratio of {quickRatio:number:2} is critically low (benchmark: >{quickRatio.critical:number:2}). This indicates a severe potential inability to meet short-term obligations without selling inventory.',
      severity: 'critical',
      implication: 'Very high risk of liquidity crisis; difficulty paying immediate debts.',
      recommendation: 'Urgent action: Secure immediate financing, accelerate receivables collection, negotiate extended payment terms with suppliers, and critically review all non-essential cash outflows.',
    },
    priority: 95,
  },
  {
    id: 'rule-qr-low',
    calculatorType: 'ratios',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'quickRatio',
        operator: '<',
        valuePath: 'quickRatio.warning',
        value: 0.8,
      },
      {
        metric: 'quickRatio',
        operator: '>=',
        valuePath: 'quickRatio.critical',
        value: 0.5,
      },
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Low Quick Ratio',
      message: 'Your Quick Ratio of {quickRatio:number:2} is low (benchmark: >{quickRatio.warning:number:2}). This suggests potential difficulty in meeting short-term liabilities with your most liquid assets.',
      severity: 'warning',
      implication: 'May need to rely on selling inventory to cover short-term debts, which is not always feasible quickly.',
      recommendation: 'Improve cash management, review inventory levels to ensure they are not excessive, and monitor accounts receivable closely. Consider if credit terms offered to customers are too long.',
    },
    priority: 45,
  },
  {
    id: 'rule-qr-good',
    calculatorType: 'ratios',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'quickRatio',
        operator: '>=',
        valuePath: 'quickRatio.good',
        value: 1.0,
      },
    ],
    feedbackTemplate: {
      title: 'Healthy Quick Ratio',
      message: 'Your Quick Ratio of {quickRatio:number:2} is healthy (benchmark: >{quickRatio.good:number:2}). This indicates a good ability to meet short-term obligations with liquid assets.',
      severity: 'good',
      implication: 'Strong short-term financial health and liquidity.',
      recommendation: 'Maintain effective cash and receivables management. Continue monitoring to ensure this healthy position is sustained.',
    },
    priority: 5,
  },
  {
    id: 'rule-de-high-generic',
    calculatorType: 'ratios',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'debtToEquityRatio',
        operator: '>',
        valuePath: 'debtToEquityRatio.warning',
        value: 2.0,
      },
    ],
    feedbackTemplate: {
      title: 'High Debt-to-Equity Ratio',
      message: 'Your Debt-to-Equity ratio of {debtToEquityRatio:number:2} is higher than the recommended threshold of {debtToEquityRatio.warning:number:2}, suggesting a heavy reliance on debt financing.',
      severity: 'warning',
      implication: 'Increased financial risk, potentially higher interest expenses, and less flexibility in borrowing further.',
      recommendation: 'Evaluate your capital structure. Consider strategies to reduce debt, such as retaining earnings, or explore equity financing options.',
    },
    priority: 50,
  },
  {
    id: 'rule-nm-critical-ratios',
    calculatorType: 'ratios',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'netMargin',
        operator: '<=',
        valuePath: 'netMargin.critical',
        value: 0,
      },
    ],
    feedbackTemplate: {
      title: 'Critically Low/Negative Net Margin',
      message: 'Your Net Margin of {netMargin:percent:1} is critically low or negative (benchmark: >{netMargin.critical:percent:1}). This indicates the business is unprofitable after all expenses.',
      severity: 'critical',
      implication: 'The business is losing money on its core operations. Sustainability is at severe risk.',
      recommendation: 'Urgently review pricing strategies, cost of goods sold, and all operating expenses. Identify areas for significant cost reduction or revenue enhancement. A business model review may be necessary.',
    },
    priority: 90,
  },
  {
    id: 'rule-nm-low-ratios',
    calculatorType: 'ratios',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'netMargin',
        operator: '<',
        valuePath: 'netMargin.warning',
        value: 5,
      },
      {
        metric: 'netMargin',
        operator: '>', // Ensure it's not already critical
        valuePath: 'netMargin.critical',
        value: 0,
      },
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Low Net Margin',
      message: 'Your Net Margin of {netMargin:percent:1} is low (benchmark: >{netMargin.warning:percent:1}). While profitable, this indicates limited efficiency in converting revenue into actual profit.',
      severity: 'warning',
      implication: 'Vulnerability to cost increases or price pressures. Limited funds for reinvestment or dividends.',
      recommendation: 'Analyze gross margin and operating expenses. Explore ways to increase prices, reduce COGS, or control overheads. Compare with industry benchmarks to identify specific areas of underperformance.',
    },
    priority: 40,
  },
  {
    id: 'rule-nm-good-ratios',
    calculatorType: 'ratios',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'netMargin',
        operator: '>=',
        valuePath: 'netMargin.good',
        value: 10,
      },
    ],
    feedbackTemplate: {
      title: 'Healthy Net Margin',
      message: 'Your Net Margin of {netMargin:percent:1} is healthy (benchmark: >{netMargin.good:percent:1}). This indicates strong profitability and operational efficiency.',
      severity: 'good',
      implication: 'Good financial health, ability to absorb some shocks, and capacity for reinvestment or shareholder returns.',
      recommendation: 'Continue effective cost management and value-driven pricing. Monitor market trends to maintain this strong performance.',
    },
    priority: 10,
  }
];
