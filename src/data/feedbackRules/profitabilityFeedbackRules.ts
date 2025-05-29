import { FeedbackRule } from '../feedbackRules';
import { businessTypes } from '../businessTypes';

export const profitabilityFeedbackRules: FeedbackRule[] = [
  {
    id: 'rule-profitability-negative-profit-critical',
    calculatorType: 'profitability',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'netProfit', operator: '<', value: 0 },
    ],
    feedbackTemplate: {
      title: 'Net Loss Reported',
      message: 'Your business is reporting a net loss of {netProfit:currency:USD:2}. This is a critical issue requiring immediate attention.',
      severity: 'critical',
      implication: 'The business is not generating enough revenue to cover its costs, leading to financial instability.',
      recommendation: 'Conduct a thorough review of revenues and all cost categories. Identify opportunities to increase sales, raise prices, or reduce expenses significantly. Consider developing a turnaround plan.',
      uiTarget: {
        scope: 'summaryMetric',
        identifier: 'netProfit'
      }
    },
    priority: 100,
  },
  {
    id: 'rule-profitability-low-profit-margin-warning',
    calculatorType: 'profitability',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'netProfitMargin', operator: '<', valuePath: 'profitability.netProfitMargin.warning', value: 5 },
      { metric: 'netProfit', operator: '>', value: 0 }
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Low Net Profit Margin',
      message: 'Your net profit margin of {netProfitMargin:percent:1} is quite low for your business type. While profitable, there\'s limited room for error or reinvestment.',
      severity: 'warning',
      implication: 'Vulnerability to cost increases or sales dips. Limited funds for growth, debt repayment, or owner distributions.',
      recommendation: 'Explore strategies to improve profitability, such as optimizing pricing, controlling operating expenses, or improving sales volume efficiently.',
      uiTarget: {
        scope: 'summaryMetric',
        identifier: 'netProfitMargin'
      }
    },
    priority: 40,
  },
  {
    id: 'rule-profitability-healthy-profit-margin-good',
    calculatorType: 'profitability',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'netProfitMargin', operator: '>=', valuePath: 'profitability.netProfitMargin.good', value: 20 },
    ],
    feedbackTemplate: {
      title: 'Healthy Net Profit Margin',
      message: 'Congratulations! Your net profit margin of {netProfitMargin:percent:1} is healthy, indicating strong profitability.',
      severity: 'good',
      implication: 'Good financial health and capacity for reinvestment, growth, or distributions.',
      recommendation: 'Continue effective cost management and revenue strategies. Monitor market conditions to maintain this strong performance.',
      uiTarget: {
        scope: 'summaryMetric',
        identifier: 'netProfitMargin'
      }
    },
    priority: 10,
  },
  {
    id: 'rule-profitability-be-units-high',
    calculatorType: 'profitability',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'breakEvenUnits',
        operator: '>',
        value: 1000,
      },
    ],
    feedbackTemplate: {
      title: 'High Break-Even Point (Units)',
      message: 'Your break-even point of {breakEvenUnits:number:0} units seems high. Reaching this volume might be challenging.',
      severity: 'warning',
      implication: 'A high break-even point means you need to sell a large volume to start making a profit, increasing risk.',
      recommendation: 'Review your fixed costs to see if they can be reduced, or explore ways to increase your contribution margin per unit (e.g., by increasing price or reducing variable costs).',
      uiTarget: {
        scope: 'chart',
        identifier: 'breakEvenPointLine',
      }
    },
    priority: 50,
  },
  {
    id: 'rule-profitability-cmr-critical',
    calculatorType: 'profitability',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'contributionMarginRatio',
        operator: '<',
        value: 15,
      },
    ],
    feedbackTemplate: {
      title: 'Critically Low Contribution Margin',
      message: 'Your contribution margin ratio of {contributionMarginRatio:percent:1} is critically low. This severely impacts your ability to cover fixed costs and achieve profit.',
      severity: 'critical',
      implication: 'High risk of losses even with moderate sales volume. Profitability is very challenging.',
      recommendation: 'Urgently review pricing strategy and variable costs per unit. Explore all avenues to increase price or decrease variable costs significantly.',
      uiTarget: {
        scope: 'chart',
        identifier: 'profitLine',
      }
    },
    priority: 60,
  },
  {
    id: 'rule-profitability-cmr-warning',
    calculatorType: 'profitability',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'contributionMarginRatio',
        operator: '>=',
        value: 15,
      },
      {
        metric: 'contributionMarginRatio',
        operator: '<',
        value: 30,
      },
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Low Contribution Margin',
      message: 'Your contribution margin ratio of {contributionMarginRatio:percent:1} is low. This may make it difficult to cover fixed costs and generate substantial profit.',
      severity: 'warning',
      implication: 'Profitability may be challenging without high sales volume.',
      recommendation: 'Consider strategies to improve your contribution margin, such as moderately increasing prices or finding ways to reduce variable costs per unit.',
      uiTarget: {
        scope: 'chart',
        identifier: 'profitLine',
      }
    },
    priority: 55,
  },
  {
    id: 'rule-profitability-cmr-good',
    calculatorType: 'profitability',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        metric: 'contributionMarginRatio',
        operator: '>=',
        value: 50,
      },
    ],
    feedbackTemplate: {
      title: 'Healthy Contribution Margin',
      message: 'Your contribution margin ratio of {contributionMarginRatio:percent:1} is healthy! This provides a good foundation for covering fixed costs and generating profit.',
      severity: 'good',
      implication: 'Strong potential for profitability as sales volume increases.',
      recommendation: 'Maintain efficient variable cost management and monitor market conditions to sustain this strong margin.',
      uiTarget: {
        scope: 'chart',
        identifier: 'profitLine',
      }
    },
    priority: 50,
  }
];
