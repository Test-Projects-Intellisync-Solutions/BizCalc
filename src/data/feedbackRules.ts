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
  value?: number | string; // Value to compare against (literal). Becomes optional if comparisonMetric or valuePath is used.
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

export const allFeedbackRules: FeedbackRule[] = [
  // ===== RATIOS CALCULATOR RULES =====
  {
    id: 'rule-cr-low-retail',
    calculatorType: 'ratios',
    businessType: ['retail'],
    conditions: [
      {
        metric: 'currentRatio',
        operator: '<',
        valuePath: 'currentRatio.warning',
        value: 1.5, // Fallback value if path not found
      },
    ],
    feedbackTemplate: {
      title: 'Low Current Ratio (Retail)',
      message: 'Your Current Ratio of {currentRatio} is below the typical warning threshold of {currentRatio.warning} for retail businesses. This may indicate potential short-term liquidity challenges.',
      severity: 'warning',
      implication: 'Difficulty meeting short-term obligations.',
      recommendation: 'Consider strategies to improve working capital, such as accelerating receivables, managing payables effectively, or securing short-term financing.',
    },
    priority: 10,
  },
  {
    id: 'rule-cr-very-low-generic',
    calculatorType: 'ratios',
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
      message: 'Your Current Ratio of {currentRatio} is critically low (below {currentRatio.critical}), indicating potential issues with meeting short-term financial obligations.',
      severity: 'critical',
      implication: 'High risk of insolvency if immediate action is not taken.',
      recommendation: 'Urgently review your cash flow, reduce non-essential spending, and explore options for immediate capital infusion or debt restructuring.',
    },
    priority: 100,
  },
  {
    id: 'rule-qr-critical',
    calculatorType: 'ratios',
    conditions: [
      {
        metric: 'quickRatio',
        operator: '<',
        valuePath: 'quickRatio.critical', // e.g., benchmarks.quickRatio.low or a specific critical threshold
        value: 0.5, // Fallback: Generally, below 0.5 is critical for many
      },
    ],
    feedbackTemplate: {
      title: 'Critically Low Quick Ratio',
      message: 'Your Quick Ratio of {quickRatio:number:2} is critically low (benchmark: >{quickRatio.critical}). This indicates a severe potential inability to meet short-term obligations without selling inventory.',
      severity: 'critical',
      implication: 'Very high risk of liquidity crisis; difficulty paying immediate debts.',
      recommendation: 'Urgent action: Secure immediate financing, accelerate receivables collection, negotiate extended payment terms with suppliers, and critically review all non-essential cash outflows.',
    },
    priority: 95, // High priority, just below current ratio critical
  },
  {
    id: 'rule-qr-low',
    calculatorType: 'ratios',
    conditions: [
      {
        metric: 'quickRatio',
        operator: '<',
        valuePath: 'quickRatio.warning', // e.g., benchmarks.quickRatio.low or a general warning threshold
        value: 0.8, // Fallback: Generally, below 0.8-1.0 might be a warning
      },
      {
        metric: 'quickRatio',
        operator: '>=',
        valuePath: 'quickRatio.critical',
        value: 0.5, // Ensure it's not already critical
      },
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Low Quick Ratio',
      message: 'Your Quick Ratio of {quickRatio:number:2} is low (benchmark: >{quickRatio.warning}). This suggests potential difficulty in meeting short-term liabilities with your most liquid assets.',
      severity: 'warning',
      implication: 'May need to rely on selling inventory to cover short-term debts, which is not always feasible quickly.',
      recommendation: 'Improve cash management, review inventory levels to ensure they are not excessive, and monitor accounts receivable closely. Consider if credit terms offered to customers are too long.',
    },
    priority: 45, // Mid-range priority
  },
  {
    id: 'rule-qr-good',
    calculatorType: 'ratios',
    conditions: [
      {
        metric: 'quickRatio',
        operator: '>=',
        valuePath: 'quickRatio.good', // e.g., benchmarks.quickRatio.high or a general good threshold
        value: 1.0, // Fallback: Generally, 1.0 or above is considered healthy
      },
    ],
    feedbackTemplate: {
      title: 'Healthy Quick Ratio',
      message: 'Your Quick Ratio of {quickRatio:number:2} is healthy (benchmark: >{quickRatio.good}). This indicates a good ability to meet short-term obligations with liquid assets.',
      severity: 'good',
      implication: 'Strong short-term financial health and liquidity.',
      recommendation: 'Maintain effective cash and receivables management. Continue monitoring to ensure this healthy position is sustained.',
    },
    priority: 5,
  },
  {
    id: 'rule-de-high-generic',
    calculatorType: 'ratios',
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
      message: 'Your Debt-to-Equity ratio of {debtToEquityRatio} is higher than the recommended threshold of {debtToEquityRatio.warning}, suggesting a heavy reliance on debt financing.',
      severity: 'warning',
      implication: 'Increased financial risk, potentially higher interest expenses, and less flexibility in borrowing further.',
      recommendation: 'Evaluate your capital structure. Consider strategies to reduce debt, such as retaining earnings, or explore equity financing options.',
    },
    priority: 50,
  },
  {
    id: 'rule-nm-critical-ratios',
    calculatorType: 'ratios',
    conditions: [
      {
        metric: 'netMargin',
        operator: '<=',
        valuePath: 'netMargin.critical', // e.g., benchmarks.netMargin.critical (could be 0 or slightly above for some industries)
        value: 0, // Fallback: Net margin at or below 0% is generally critical
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
    conditions: [
      {
        metric: 'netMargin',
        operator: '<',
        valuePath: 'netMargin.warning', // e.g., benchmarks.netMargin.low
        value: 5, // Fallback: e.g., below 5% might be a warning for some general businesses
      },
      {
        metric: 'netMargin',
        operator: '>',
        valuePath: 'netMargin.critical',
        value: 0, // Ensure it's not already critical
      },
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Low Net Margin',
      message: 'Your Net Margin of {netMargin:percent:1} is low (benchmark: >{netMargin.warning:percent:1}). This suggests profitability is slim after all expenses are accounted for.',
      severity: 'warning',
      implication: 'Limited funds for reinvestment, debt repayment, or distribution to owners. Vulnerable to cost increases or revenue dips.',
      recommendation: 'Analyze gross margin and operating expenses. Explore ways to increase prices, reduce COGS, or control overheads. Compare with industry benchmarks to identify specific areas of underperformance.',
    },
    priority: 40,
  },
  {
    id: 'rule-nm-good-ratios',
    calculatorType: 'ratios',
    conditions: [
      {
        metric: 'netMargin',
        operator: '>=',
        valuePath: 'netMargin.good', // e.g., benchmarks.netMargin.high
        value: 10, // Fallback: e.g., 10% or above might be considered good for many
      },
    ],
    feedbackTemplate: {
      title: 'Healthy Net Margin',
      message: 'Your Net Margin of {netMargin:percent:1} is healthy (benchmark: >{netMargin.good:percent:1}). This indicates good overall profitability from operations.',
      severity: 'good',
      implication: 'The business is efficiently converting revenue into actual profit. Strong capacity for growth, investment, and financial stability.',
      recommendation: 'Continue effective cost management and strategic pricing. Monitor market conditions and competitive pressures to maintain this strong performance. Consider reinvesting profits for further growth.',
    },
    priority: 10,
  },
  
  // ===== CASH FLOW CALCULATOR RULES =====
  {
    id: 'rule-cf-negative-cash-flow',
    calculatorType: 'cashflow',
    conditions: [
      {
        metric: 'netCashFlow',
        operator: '<',
        value: 0,
      },
    ],
    feedbackTemplate: {
      uiTarget: { scope: 'summaryMetric', identifier: 'netCashFlow' },
      title: 'Negative Cash Flow',
      message: 'Your business is experiencing negative cash flow of {netCashFlow} per period. This means you\'re spending more than you\'re earning.',
      severity: 'warning',
      implication: 'Sustained negative cash flow can deplete your reserves and threaten business viability.',
      recommendation: 'Review expenses, accelerate receivables, or explore financing options to bridge the gap.',
    },
    priority: 50,
  },
  {
    id: 'rule-cf-low-runway',
    calculatorType: 'cashflow',
    conditions: [
      {
        metric: 'runwayMonths',
        operator: '<',
        value: 3,
      },
    ],
    feedbackTemplate: {
      uiTarget: { scope: 'summaryMetric', identifier: 'netCashFlow' },
      title: 'Low Cash Runway',
      message: 'Your cash runway is only {runwayMonths} months. This is below the recommended minimum of 3 months.',
      severity: 'critical',
      implication: 'You may run out of cash soon if revenue doesn\'t increase or expenses aren\'t reduced.',
      recommendation: 'Immediately reduce expenses, secure additional funding, or accelerate revenue generation.',
    },
    priority: 90,
  },

  // ===== PROFITABILITY CALCULATOR RULES =====
  {
    id: 'rule-profit-low-margin',
    calculatorType: 'profitability',
    conditions: [
      {
        metric: 'netProfitMargin',
        operator: '<',
        valuePath: 'netMargin.low',
        value: 5, // 5% as fallback
      },
    ],
    feedbackTemplate: {
      title: 'Low Net Profit Margin',
      message: 'Your net profit margin of {netProfitMargin}% is below the typical range of {netMargin.low}% to {netMargin.high}% for your industry.',
      severity: 'warning',
      implication: 'Lower margins mean less money is available for growth, savings, or unexpected expenses.',
      recommendation: 'Review pricing strategy, reduce COGS, or find operational efficiencies to improve margins.',
    },
    priority: 30,
  },

  // ===== PROJECTIONS CALCULATOR RULES =====
  {
    id: 'rule-proj-growth-high',
    calculatorType: 'projections',
    conditions: [
      {
        metric: 'projectedGrowthRate',
        operator: '>',
        value: 50, // 50% growth
      },
    ],
    feedbackTemplate: {
      title: 'Aggressive Growth Projection',
      message: 'Your projected growth rate of {projectedGrowthRate}% is quite aggressive. Ensure your team and resources can support this pace.',
      severity: 'info',
      implication: 'Rapid growth can strain resources and cash flow if not managed carefully.',
      recommendation: 'Create a detailed growth plan with contingency measures and ensure adequate financing is in place.',
    },
    priority: 20,
  },
  {
    id: 'rule-proj-rev-stagnant',
    calculatorType: 'projections',
    conditions: [
      {
        metric: 'projectedRevenue', // Assumes calculatorData.projectedRevenue exists
        operator: '<=',
        comparisonMetric: 'currentRevenue', // Assumes calculatorData.currentRevenue exists
      },
    ],
    feedbackTemplate: {
      title: 'Stagnant or Declining Revenue Projection',
      message: 'Your projected revenue of {projectedRevenue:currency:USD:0} is not greater than your current revenue of {currentRevenue:currency:USD:0}. If growth is expected, please review your assumptions and projections.',
      severity: 'warning',
      implication: 'Projections indicate no growth or a decline in revenue, which may not align with business goals or investor expectations.',
      recommendation: 'Re-evaluate your market analysis, sales strategies, and operational capacity. Adjust projections to reflect realistic growth targets or identify reasons for stagnation.',
    },
    priority: 25, // Slightly higher than generic growth projection info
  },
  {
    id: 'rule-proj-negative-net-cashflow',
    calculatorType: 'projections',
    conditions: [
      {
        metric: 'netCashFlow',
        operator: '<',
        value: 0,
      },
    ],
    feedbackTemplate: {
      title: 'Negative Projected Net Cash Flow',
      message: 'Your projections show a negative net cash flow of {netCashFlow:currency:USD:0} over {projectionMonths} months. This indicates that projected expenses exceed projected revenues.',
      severity: 'warning',
      implication: 'If these projections hold, your business will be spending more than it earns, potentially leading to a need for additional funding or a depletion of cash reserves.',
      recommendation: 'Review your revenue assumptions and expense forecasts. Identify areas to increase projected revenue or reduce projected costs to achieve a positive cash flow.',
    },
    priority: 70,
  },
  {
    id: 'rule-proj-high-expense-ratio',
    calculatorType: 'projections',
    conditions: [
      {
        metric: 'expenseToRevenueRatio', // This is a percentage
        operator: '>',
        value: 75, // Example: if expenses are more than 75% of revenue
      },
      {
        metric: 'totalRevenue', // Ensure there's revenue to make the ratio meaningful
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
  },

  // ===== PROFITABILITY CALCULATOR RULES =====
  {
    id: 'rule-profit-low-net-margin',
    calculatorType: 'profitability',
    conditions: [
      {
        metric: 'netMargin',
        operator: '<',
        valuePath: 'netMargin.warning', // e.g., benchmarks.netMargin.warning (standard, like 5-10%)
        value: 5, // Fallback if no benchmark
      },
      {
        metric: 'netMargin',
        operator: '>=',
        valuePath: 'netMargin.critical', // e.g., benchmarks.netMargin.critical (like 0-2%)
        value: 0, // Fallback (don't trigger if already critical)
      },
      {
        metric: 'revenue', // Only if there's revenue to calculate margin from
        operator: '>',
        value: 0,
      }
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Low Net Profit Margin',
      message: 'Your Net Profit Margin of {netMargin:percent:1} is on the lower side (benchmark: >{netMargin.warning}%). This indicates limited profitability after all expenses.',
      severity: 'warning',
      implication: 'Reduced ability to absorb unexpected costs, reinvest in growth, or generate substantial returns.',
      recommendation: 'Analyze your cost structure (COGS and operating expenses) for potential savings, or explore strategies to increase prices or sales volume.',
    },
    priority: 60,
  },
  {
    id: 'rule-profit-critical-net-margin',
    calculatorType: 'profitability',
    conditions: [
      {
        metric: 'netMargin',
        operator: '<',
        valuePath: 'netMargin.critical', // e.g., benchmarks.netMargin.critical (like 0-2%)
        value: 0, // Fallback (less than 0% is definitely critical)
      },
      {
        metric: 'revenue', // Only if there's revenue
        operator: '>',
        value: 0,
      }
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Critically Low/Negative Net Profit Margin',
      message: 'Your Net Profit Margin is {netMargin:percent:1} (benchmark: >{netMargin.critical}%). This is a critical situation as your business may be losing money overall.',
      severity: 'critical',
      implication: 'The business is not sustainable in its current state and is eroding capital.',
      recommendation: 'Urgent action required. Conduct a thorough review of pricing, COGS, and all operating expenses. Consider drastic cost-cutting or business model adjustments.',
    },
    priority: 120,
  },
  {
    id: 'rule-profit-good-net-margin',
    calculatorType: 'profitability',
    conditions: [
      {
        metric: 'netMargin',
        operator: '>=',
        valuePath: 'netMargin.good', // e.g., benchmarks.netMargin.good (standard, like 10-15% or higher)
        value: 10, // Fallback
      },
    ],
    feedbackTemplate: {
      title: 'Healthy Net Profit Margin',
      message: 'Congratulations! Your Net Profit Margin of {netMargin:percent:1} is healthy (benchmark: >{netMargin.good}%).',
      severity: 'good',
      implication: 'Strong profitability, indicating efficient operations and good pricing power.',
      recommendation: 'Maintain your current strategies and continue to monitor for any changes in costs or market conditions. Consider reinvesting profits for growth.',
    },
    priority: 10,
  },
  {
    id: 'rule-profit-breakeven-exceeds-revenue',
    calculatorType: 'profitability',
    conditions: [
      {
        metric: 'breakEvenRevenue',
        operator: '>',
        comparisonMetric: 'revenue',
      },
      {
        metric: 'revenue',
        operator: '>',
        value: 0, // Ensure there is some revenue to compare against
      },
      {
        metric: 'fixedCosts', // Ensure breakeven is meaningful
        operator: '>',
        value: 0,
      }
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Break-Even Point Not Reached',
      message: 'Your break-even revenue of {breakEvenRevenue:currency:USD:0} exceeds your current period revenue of {revenue:currency:USD:0}. This means you are not yet covering all your fixed and variable costs.',
      severity: 'warning',
      implication: 'The business is currently operating at a loss for this period.',
      recommendation: 'Focus on strategies to increase sales volume, improve pricing, or reduce variable/fixed costs to reach profitability.',
    },
    priority: 50,
  },
  {
    id: 'rule-profit-low-contrib-margin',
    calculatorType: 'profitability',
    conditions: [
      {
        metric: 'contributionMarginRatio',
        operator: '<',
        value: 20, // Example: less than 20%
      },
      {
        metric: 'pricePerUnit', // Ensure ratio is meaningful
        operator: '>',
        value: 0,
      }
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Low Contribution Margin Ratio',
      message: 'Your Contribution Margin Ratio of {contributionMarginRatio:percent:1} is relatively low. This means each unit sold contributes a small amount towards covering fixed costs.',
      severity: 'warning',
      implication: 'Requires selling a higher volume of units to reach break-even and achieve profitability. More sensitive to changes in variable costs or price.',
      recommendation: 'Review your variable costs per unit for potential reductions. Evaluate if your pricing strategy adequately covers costs and contributes to profit.',
    },
    priority: 45,
  },

  // ===== CASH FLOW CALCULATOR RULES =====
  {
    id: 'rule-cf-negative-net',
    calculatorType: 'cashflow',
    conditions: [
      {
        metric: 'monthlyNetCashFlow',
        operator: '<',
        value: 0,
      },
    ],
    feedbackTemplate: {
      title: 'Negative Monthly Cash Flow',
      message: 'Your projected monthly cash flow is negative (${monthlyNetCashFlow:currency:USD:0}). This means your business is spending more than it earns each month.',
      severity: 'warning',
      implication: 'Sustained negative cash flow will deplete your cash reserves and can lead to insolvency if not addressed.',
      recommendation: 'Review your expenses for potential reductions, explore ways to increase inflows, or secure additional funding to cover the shortfall.',
    },
    priority: 70,
  },
  {
    id: 'rule-cf-low-runway',
    calculatorType: 'cashflow',
    conditions: [
      {
        metric: 'cashRunwayMonths',
        operator: '<',
        value: 3, // Less than 3 months runway
      },
      {
        metric: 'cashRunwayMonths',
        operator: '!=',
        value: 999, // Not infinity (which is represented as 999)
      },
      {
        metric: 'monthlyNetCashFlow', // Only trigger if actually burning cash
        operator: '<',
        value: 0,
      }
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Critically Low Cash Runway',
      message: 'Your cash runway is critically low at {cashRunwayMonths:number:0} months. You are at high risk of running out of funds.',
      severity: 'critical',
      implication: 'Immediate risk of not being able to meet financial obligations.',
      recommendation: 'Urgently implement cost-cutting measures, seek immediate funding, or take drastic steps to increase revenue. Prioritize survival.',
    },
    priority: 110, // Higher than just negative cash flow
  },
  {
    id: 'rule-cf-warning-low-runway',
    calculatorType: 'cashflow',
    conditions: [
      {
        metric: 'cashRunwayMonths',
        operator: '<',
        value: 6, // Less than 6 months runway
      },
      {
        metric: 'cashRunwayMonths',
        operator: '>=',
        value: 3, // But not critically low (covered by other rule)
      },
      {
        metric: 'cashRunwayMonths',
        operator: '!=',
        value: 999, // Not infinity
      },
      {
        metric: 'monthlyNetCashFlow', // Only trigger if actually burning cash
        operator: '<',
        value: 0,
      }
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Low Cash Runway Warning',
      message: 'Your cash runway is {cashRunwayMonths:number:0} months. While not immediately critical, you should take action to improve this.',
      severity: 'warning',
      implication: 'Limited buffer to handle unexpected expenses or slower-than-expected revenue growth.',
      recommendation: 'Proactively look for ways to extend your runway by managing expenses, boosting sales, or securing financing before the situation becomes critical.',
    },
    priority: 75,
  },
  {
    id: 'rule-cf-positive-net',
    calculatorType: 'cashflow',
    conditions: [
      {
        metric: 'monthlyNetCashFlow',
        operator: '>',
        value: 0,
      },
    ],
    feedbackTemplate: {
      title: 'Positive Monthly Cash Flow',
      message: 'Excellent! Your projected monthly cash flow is positive (${monthlyNetCashFlow:currency:USD:0}). Your business is generating more cash than it spends.',
      severity: 'good',
      implication: 'This strengthens your financial position, allows for reinvestment, and builds a buffer for future uncertainties.',
      recommendation: 'Continue monitoring your cash flow. Consider allocating surplus cash towards growth initiatives, debt reduction, or building a larger emergency fund.',
    },
    priority: 10,
  },

  // ===== STARTUP COST CALCULATOR RULES =====
  {
    id: 'rule-startup-high-cost',
    calculatorType: 'startupcost',
    conditions: [
      {
        metric: 'totalStartupCosts',
        operator: '>',
        valuePath: 'startupCosts.high', // e.g., businessType.benchmarks.startupCosts.high
        value: 75000, // Fallback if valuePath is not found or for generic cases
      },
    ],
    feedbackTemplate: {
      title: 'High Startup Costs',
      message: 'Your total startup costs of ${totalStartupCosts:currency} are substantial, potentially exceeding the typical high benchmark of ${startupCosts.high:currency} for your business type. This will require significant upfront investment.',
      severity: 'warning',
      implication: 'Higher startup costs mean you\'ll need more capital to launch and may take longer to become profitable.',
      recommendation: 'Consider ways to reduce initial costs, explore financing options, or validate your business model with a smaller investment first.',
    },
    priority: 40,
  },
  {
    id: 'rule-startup-contingency-missing',
    calculatorType: 'startupcost',
    conditions: [
      {
        metric: 'contingencyAmount', // Assumes this key might be absent or null/undefined in calculatorData
        operator: 'notExists',
      },
    ],
    feedbackTemplate: {
      title: 'Consider Contingency Fund',
      message: "We noticed you haven't specified a contingency amount. It's generally a good practice to include a contingency fund (e.g., 10-20% of total estimated costs) to cover unexpected expenses during your startup phase.",
      severity: 'info',
      implication: 'Without a contingency fund, unexpected costs could strain your startup budget more significantly.',
      recommendation: "Consider adding a 'Contingency Fund' to your startup costs. This can provide a financial buffer for unforeseen challenges.",
    },
    priority: 15,
  },
  {
    id: 'rule-startup-low-item-count',
    calculatorType: 'startupcost',
    conditions: [
      {
        metric: 'numberOfCostItems',
        operator: '<',
        value: 5, // If less than 5 items are entered
      },
    ],
    feedbackTemplate: {
      title: 'Review Startup Cost Items',
      message: 'You currently have only {numberOfCostItems} cost items listed. While every startup is different, many businesses have more individual startup expenses. Consider if you have overlooked any common costs.',
      severity: 'info',
      implication: 'Missing potential cost items could lead to underestimating your total startup capital needs.',
      recommendation: 'Review common startup cost categories like legal fees, equipment, initial inventory, marketing launch expenses, rent deposits, and professional services. Ensure your list is comprehensive for your specific business.',
    },
    priority: 5, // Low priority, informational
  },
  {
    id: 'rule-startup-category-dominance',
    calculatorType: 'startupcost',
    conditions: [
      // This rule needs a custom evaluation function in generateFeedback
      // as it iterates over costsByCategory and compares with totalStartupCosts.
      // For now, we'll represent the intent with a placeholder condition.
      // The actual logic will be in generateFeedback.
      {
        metric: 'costsByCategory.someCategory.percentageOfTotal', // Placeholder metric
        operator: '>',
        value: 50, // Example: if any category is > 50% of total
      },
    ],
    feedbackTemplate: {
      title: 'Dominant Cost Category: {dominantCategoryName}',
      message: 'The "{dominantCategoryName}" category accounts for {dominantCategoryPercentage}% of your total startup costs. This concentration might be appropriate, but it\'s worth reviewing if this allocation is optimal and if other areas are underfunded.',
      severity: 'warning',
      implication: 'Over-concentration in one cost category can increase risk or indicate under-investment in other critical startup areas.',
      recommendation: 'Review the cost breakdown. Ensure that this dominant category is justified and that other essential areas (e.g., marketing, legal, contingency) are adequately funded. Consider if costs can be optimized within the dominant category or reallocated.',
    },
    // uiTarget will be set dynamically in generateFeedback
    priority: 20,
  },

  // ===== BURN RATE CALCULATOR RULES =====
  {
    id: 'rule-burn-rate-high',
    calculatorType: 'burnRate',
    conditions: [
      {
        metric: 'monthsOfRunway',
        operator: '<',
        value: 6,
      },
    ],
    feedbackTemplate: {
      title: 'Low Runway',
      message: 'With only {monthsOfRunway} months of runway, your business is at risk of running out of cash quickly.',
      severity: 'critical',
      implication: 'Limited runway increases financial risk and reduces your ability to weather unexpected challenges.',
      recommendation: 'Immediately reduce expenses, secure additional funding, or accelerate revenue generation to extend your runway.',
    },
    priority: 80,
  },

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
