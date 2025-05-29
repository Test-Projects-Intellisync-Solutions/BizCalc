import { FeedbackRule } from '../feedbackRules';
import { businessTypes } from '../businessTypes';

export const startupCostFeedbackRules: FeedbackRule[] = [
  {
    id: 'rule-startup-category-dominance',
    calculatorType: 'startupcost',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      {
        // This condition's 'value' is used by custom logic in generateFeedback as the threshold percentage.
        // The metric and operator here are placeholders for the type system but not used by the custom evaluation logic.
        metric: 'categoryDominanceThreshold', 
        operator: '>', 
        value: 50, // Example: if a category is > 50% of total costs
      },
    ],
    feedbackTemplate: {
      title: 'Dominant Cost Category',
      message: 'The category "{dominantCategoryName}" makes up {dominantCategoryPercentage}% ({categoryCost}) of your total estimated startup costs of {totalStartupCosts}. This concentration might pose a risk if this category faces unexpected price increases or issues.',
      severity: 'warning',
      implication: 'High concentration in one cost category can increase risk. Over-reliance on a single area.',
      recommendation: 'Review the "{dominantCategoryName}" category closely. Explore alternatives, negotiate prices, or see if costs can be diversified. Ensure your contingency plan adequately covers potential overruns in this dominant category.',

    },
    priority: 20,
  },
  {
    id: 'rule-startup-contingency-missing',
    calculatorType: 'startupcost',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'contingencyPercentage', operator: '==', value: 0 },
    ],
    feedbackTemplate: {
      title: 'Contingency Fund Missing',
      message: 'You have not allocated a contingency fund. Startup costs often exceed estimates, and a contingency helps cover unexpected expenses.',
      severity: 'critical',
      implication: 'High risk of project failure or significant financial stress if unforeseen costs arise.',
      recommendation: 'It is highly recommended to add a contingency fund, typically 10-20% of your total estimated startup costs. This provides a buffer for unexpected expenses.',
      uiTarget: { scope: 'summaryMetric', identifier: 'contingencyAmount' },
    },
    priority: 100,
  },
  {
    id: 'rule-startup-contingency-low',
    calculatorType: 'startupcost',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'contingencyPercentage', operator: '>', value: 0 },
      { metric: 'contingencyPercentage', operator: '<', value: 10 }, // Example: less than 10% is low
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Low Contingency Fund',
      message: 'Your contingency fund is {contingencyPercentage}%, which is {contingencyAmountFormatted}. While some contingency is allocated, this may be insufficient for typical unforeseen startup expenses.',
      severity: 'warning',
      implication: 'May not be enough to cover unexpected costs, potentially leading to financial strain.',
      recommendation: 'Consider increasing your contingency fund to at least 10-20% of total estimated costs to provide a more robust financial cushion.',
      uiTarget: { scope: 'summaryMetric', identifier: 'contingencyAmount' },
    },
    priority: 50,
  },
  {
    id: 'rule-startup-contingency-adequate',
    calculatorType: 'startupcost',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'contingencyPercentage', operator: '>=', value: 10 }, // Example: 10% or more is adequate
    ],
    feedbackTemplate: {
      title: 'Adequate Contingency Fund',
      message: 'Your contingency fund is {contingencyPercentage}% ({contingencyAmountFormatted}). This is a good practice and provides a buffer for unexpected costs.',
      severity: 'good',
      implication: 'Better prepared for unforeseen expenses and financial surprises during startup.',
      recommendation: 'Maintain this level of contingency. Regularly review your cost estimates to ensure your contingency remains adequate as your plans evolve.',
      uiTarget: { scope: 'summaryMetric', identifier: 'contingencyAmount' },
    },
    priority: 10,
  },
  {
    id: 'rule-startup-missing-key-category',
    calculatorType: 'startupcost',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'isCategoryMissing', operator: '==', value: true },
    ],
    feedbackTemplate: {
      title: 'Possible Missing Key Cost Categories',
      message: 'Your startup cost plan might be missing key categories like "{suggestedCategory}". These are common in startups and should be evaluated.',
      severity: 'warning',
      implication: 'Missing cost categories can lead to underestimated startup requirements.',
      recommendation: 'Review typical startup cost categories and ensure you’ve covered marketing, legal, tech setup, and others. Add them if relevant.',
    },
    priority: 70,
  },
  {
    id: 'rule-startup-unusual-category-expense',
    calculatorType: 'startupcost',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'isCategoryUnusuallyHigh', operator: '==', value: true },
    ],
    feedbackTemplate: {
      title: 'Unusually High Expense in {categoryName}',
      message: 'The cost for "{categoryName}" is significantly higher than industry norms. This could be due to overestimation or inflated vendor quotes.',
      severity: 'info',
      implication: 'Budget misalignment may reduce funds available for other critical needs.',
      recommendation: 'Double-check the cost estimate for "{categoryName}". Get multiple quotes or peer benchmarks.',
    },
    priority: 60,
  },
  {
    id: 'rule-startup-marketing-without-sales',
    calculatorType: 'startupcost',
    businessType: Object.values(businessTypes).map(bt => bt.value),
    conditions: [
      { metric: 'hasMarketingSpend', operator: '==', value: true },
      { metric: 'hasSalesCategory', operator: '==', value: false },
    ],
    conditionLogic: 'AND',
    feedbackTemplate: {
      title: 'Marketing Spend with No Sales Infrastructure',
      message: 'You’ve budgeted for marketing but have no sales system setup. This may limit your ability to convert leads.',
      severity: 'warning',
      implication: 'You might generate traffic but not revenue if sales infrastructure is missing.',
      recommendation: 'Consider allocating budget to a CRM system, sales staff, or training.',
    },
    priority: 40,
  },
  {
    id: 'rule-startup-costs-balanced',
    calculatorType: 'startupcost',
    businessType: Object.values(businessTypes).map(bt => bt.value),
      conditions: [
      { metric: 'costSpreadEvenness', operator: '>=', value: 0.75 },
    ],
    feedbackTemplate: {
      title: 'Balanced Startup Cost Distribution',
      message: 'Your cost distribution appears well-balanced across categories. This shows thoughtful planning.',
      severity: 'good',
      implication: 'Diversified cost planning reduces risk and improves execution flexibility.',
      recommendation: 'Keep this balance in mind as you finalize your financial plan. Great job!',
    },
    priority: 5,
  },
];
