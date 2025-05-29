import { FeedbackItem, FeedbackRule, FeedbackCondition, CalculatorType } from '../data/feedbackRules';
import { BusinessType, Benchmarks } from '../data/businessTypes';

/**
 * Safely retrieves a nested value from an object using a dot-separated path.
 * @param obj The object to traverse.
 * @param path The dot-separated path to the desired value (e.g., 'property.nestedProperty.value').
 * @param defaultValue The value to return if the path is not found or any part of it is undefined.
 * @returns The value at the specified path or the defaultValue.
 */
/**
 * Interpolates a string with values from a data object.
 * Placeholders in the template should be in the format {key}.
 * @param template The string template with placeholders.
 * @param data An object where keys match placeholders and values are the replacements.
 * @returns The interpolated string.
 */
function applyFormat(value: any, formatter?: string, ...args: string[]): string {
  if (value === undefined || value === null) return '';

  // For 'exists' and 'notExists', the raw value is more relevant than its numeric conversion
  if (formatter === 'exists') return (value !== undefined && value !== null) ? 'Exists' : 'Not Found';
  if (formatter === 'notExists') return (value === undefined || value === null) ? 'Not Found' : 'Exists';

  const numValue = Number(value);

  switch (formatter) {
    case 'currency':
      const currencyCode = args[0] || 'USD';
      const currencyDigits = args[1] !== undefined ? parseInt(args[1], 10) : 2;
      if (isNaN(numValue)) return String(value); // Fallback for non-numeric
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: currencyCode, 
        minimumFractionDigits: currencyDigits, 
        maximumFractionDigits: currencyDigits 
      }).format(numValue);
    case 'percent':
      const percentDigits = args[0] !== undefined ? parseInt(args[0], 10) : 1;
      if (isNaN(numValue)) return String(value); // Fallback for non-numeric
      // Assuming the value is already a percentage, e.g., 15.5 for 15.5%
      return `${numValue.toFixed(percentDigits)}%`;
    case 'number':
      const numberDigits = args[0] !== undefined ? parseInt(args[0], 10) : 2;
      if (isNaN(numValue)) return String(value); // Fallback for non-numeric
      return numValue.toFixed(numberDigits);
    default:
      return String(value);
  }
}

export function interpolateString(template: string, data: Record<string, any>): string {
  if (template === undefined || template === null) return '';
  if (typeof template !== 'string') {
    return String(template);
  }

  // Regex to find placeholders like {path}, {path:formatter}, or {path:formatter:arg1:arg2}
  return template.replace(/\{([^}]+)\}/g, (match, placeholderContent) => {
    const parts = placeholderContent.trim().split(':');
    const path = parts[0];
    const formatter = parts[1];
    const formatArgs = parts.slice(2);

    // Check if a pre-formatted version exists (e.g., amountFormatted from generateFeedback)
    // If no explicit formatter is given in the template, prefer the pre-formatted version.
    if (!formatter && data.hasOwnProperty(`${path}Formatted`)) {
      const preFormattedValue = data[`${path}Formatted`];
      return (preFormattedValue !== undefined && preFormattedValue !== null) ? String(preFormattedValue) : match;
    }

    const value = getNestedValue(data, path);

    if (value === undefined || value === null) {
      // If value not found, and a pre-formatted version was not used, return the original placeholder.
      // This helps identify missing data or typos in paths.
      return match; 
    }

    return applyFormat(value, formatter, ...formatArgs);
  });
}

export function getNestedValue(obj: any, path: string, defaultValue: any = undefined): any {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Improved path splitting to handle array indexing like 'array[0].property'
  const pathParts = path.replace(/\[(\w+)\]/g, '.$1') // Convert array[index] to array.index
                        .replace(/^\./, '') // Remove leading dot if any
                        .split('.');

  let current = obj;
  for (const part of pathParts) {
    if (current === null || typeof current !== 'object' || !(part in current)) {
      return defaultValue;
    }
    current = current[part];
  }
  return current === undefined ? defaultValue : current;
}

/**
 * Generates contextual feedback items based on calculator data, business type, and predefined rules.
 * 
 * @param calculatorData An object containing the current metrics from the calculator (e.g., { currentRatio: 1.5, netProfit: 5000 }).
 * @param businessTypeData The full BusinessType object for the selected business type, including benchmarks.
 * @param calculatorType The type of the current calculator.
 * @param allRules An array of all feedback rules to evaluate.
 * @returns An array of FeedbackItem objects that apply to the current context.
 */
interface MatchedRuleData {
  rule: FeedbackRule;
  interpolationData: Record<string, string | number | undefined>;
  preciseRelevantMetrics: Record<string, string | number>;
  businessTypeValue: string; 
}

/**
 * Helper to get all benchmark values for interpolation, flattening nested structures.
 */
function getFlattenedBenchmarks(businessTypeData?: BusinessType): Record<string, any> {
  if (!businessTypeData?.benchmarks) return {};
  const flattened: Record<string, any> = {};
  Object.entries(businessTypeData.benchmarks).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        flattened[`${key}.${subKey}`] = subValue;
      });
    } else {
      flattened[key] = value;
    }
  });
  return flattened;
}

/**
 * Evaluates a single feedback condition.
 */
function evaluateCondition(
  condition: FeedbackCondition,
  metricValue: any,
  comparisonValue: any
): boolean {
  // Handle 'exists' and 'notExists' first as they don't need comparisonValue or numeric conversion
  if (condition.operator === 'exists') {
    return metricValue !== undefined && metricValue !== null;
  }
  if (condition.operator === 'notExists') {
    return metricValue === undefined || metricValue === null;
  }

  const numMetricValue = Number(metricValue);
  const numComparisonValue = Number(comparisonValue);

  // For other operators, if either value is not a number (and it's not an existence check),
  // or if comparisonValue is undefined (which can happen if a comparisonMetric path is bad),
  // then the condition typically can't be meaningfully evaluated for numeric comparisons.
  if (comparisonValue === undefined || isNaN(numMetricValue) || isNaN(numComparisonValue)) {
    // Allow string comparison for '==' and '!=' as a fallback if values are not numbers
    if (condition.operator === '==') return String(metricValue) === String(comparisonValue);
    if (condition.operator === '!=') return String(metricValue) !== String(comparisonValue);
    // For other operators (>, <, >=, <=), non-numeric or missing comparisonValue means condition fails
    return false; 
  }

  switch (condition.operator) {
    case '>':  return numMetricValue > numComparisonValue;
    case '<':  return numMetricValue < numComparisonValue;
    case '>=': return numMetricValue >= numComparisonValue;
    case '<=': return numMetricValue <= numComparisonValue;
    case '==': return numMetricValue === numComparisonValue; // Numeric comparison
    case '!=': return numMetricValue !== numComparisonValue; // Numeric comparison
    default:   return false;
  }
}

export function generateFeedback(
  calculatorData: Record<string, any>, // Allow any data type for flexibility
  businessTypeData: BusinessType | undefined,
  calculatorType: CalculatorType,
  allRules: FeedbackRule[]
): FeedbackItem[] {
  const matchedFeedbackItems: FeedbackItem[] = [];
  const flattenedBenchmarks = getFlattenedBenchmarks(businessTypeData);

  // Base context for interpolation, including all calculator data and flattened benchmarks
  const baseInterpolationContext: Record<string, any> = {
    ...calculatorData,
    ...flattenedBenchmarks,
    businessTypeName: businessTypeData?.label || 'your business type',
    businessTypeValue: businessTypeData?.value || 'generic',
  };

  // Pre-format common numeric values for easier use in templates
  Object.entries(calculatorData).forEach(([key, value]) => {
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('cost') || key.toLowerCase().includes('revenue') || key.toLowerCase().includes('profit') || key.toLowerCase().includes('expense') || key.toLowerCase().includes('amount')) {
        baseInterpolationContext[`${key}Formatted`] = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
      }
      if (key.toLowerCase().includes('margin') || key.toLowerCase().includes('rate') || key.toLowerCase().includes('ratio') || key.toLowerCase().includes('percentage')) {
        baseInterpolationContext[`${key}Formatted`] = `${value.toFixed(1)}%`;
      }
    }
  });

  for (const rule of allRules) {
    const ruleAppliesToCalcType =
      Array.isArray(rule.calculatorType) ? 
      rule.calculatorType.includes(calculatorType) : 
      rule.calculatorType === calculatorType;

    if (!ruleAppliesToCalcType) continue;

    if (rule.businessType && rule.businessType.length > 0) {
      if (!businessTypeData || !rule.businessType.includes(businessTypeData.value)) {
        continue;
      }
    }

    // Special handling for startup cost calculator rules
    if (calculatorType === 'startupcost') {
      const totalStartupCosts = getNestedValue(calculatorData, 'totalStartupCosts') as number || 0;
      const costsByCategory = getNestedValue(calculatorData, 'costsByCategory') as Record<string, number> || {};
      const contingencyAmount = getNestedValue(calculatorData, 'contingencyAmount') as number || 0;

      // Handle category dominance rule
      if (rule.id === 'rule-startup-category-dominance' && rule.conditions.length > 0) {
        const thresholdPercentage = rule.conditions[0].value as number; // Assuming the first condition holds the threshold

        if (costsByCategory && totalStartupCosts > 0) {
          for (const categoryName in costsByCategory) {
            const categoryCost = costsByCategory[categoryName];
            const categoryPercentage = (categoryCost / totalStartupCosts) * 100;

            if (categoryPercentage > thresholdPercentage) {
              const dominantCategoryInterpolationData = {
                ...baseInterpolationContext,
                dominantCategoryName: categoryName,
                dominantCategoryPercentage: applyFormat(categoryPercentage, 'number', '1'),
                categoryCost: applyFormat(categoryCost, 'currency'),
                totalStartupCosts: applyFormat(totalStartupCosts, 'currency'),
              };

              const dominantCategoryRelevantMetrics = {
                [categoryName]: applyFormat(categoryCost, 'currency'),
                [`${categoryName}_percentage`]: applyFormat(categoryPercentage, 'percent', '1'),
                totalStartupCosts: applyFormat(totalStartupCosts, 'currency'),
                threshold: `${thresholdPercentage}%`
              };

              const feedbackItem: FeedbackItem = {
                id: `${rule.id}-${categoryName}-${Date.now()}`,
                title: interpolateString(rule.feedbackTemplate.title, dominantCategoryInterpolationData),
                message: interpolateString(rule.feedbackTemplate.message, dominantCategoryInterpolationData),
                severity: rule.feedbackTemplate.severity,
                implication: rule.feedbackTemplate.implication ? interpolateString(rule.feedbackTemplate.implication, dominantCategoryInterpolationData) : undefined,
                recommendation: rule.feedbackTemplate.recommendation ? interpolateString(rule.feedbackTemplate.recommendation, dominantCategoryInterpolationData) : undefined,
                relevantMetrics: dominantCategoryRelevantMetrics,
                link: rule.feedbackTemplate.link ? interpolateString(rule.feedbackTemplate.link, dominantCategoryInterpolationData) : undefined,
                uiTarget: {
                  scope: 'category',
                  identifier: categoryName,
                },
              };
              matchedFeedbackItems.push(feedbackItem);
            }
          }
        }
        continue; // Skip standard condition processing for this rule
      }

      // Handle contingency fund rule
      if (rule.id === 'rule-startup-has-contingency' && totalStartupCosts > 0) {
        const contingencyPercentage = (contingencyAmount / totalStartupCosts) * 100;
        const minRecommendedContingency = totalStartupCosts * 0.1; // 10% of total costs
        const maxRecommendedContingency = totalStartupCosts * 0.2; // 20% of total costs
        
        // Only show positive feedback if contingency is at least 10%
        if (contingencyAmount >= minRecommendedContingency) {
          const contingencyInterpolationData = {
            ...baseInterpolationContext,
            contingencyAmount,
            contingencyPercentage: applyFormat(contingencyPercentage, 'number', '1'),
            totalStartupCosts: applyFormat(totalStartupCosts, 'currency'),
            minRecommendedContingency: applyFormat(minRecommendedContingency, 'currency'),
            maxRecommendedContingency: applyFormat(maxRecommendedContingency, 'currency'),
          };

          const feedbackItem: FeedbackItem = {
            id: `${rule.id}-${Date.now()}`,
            title: interpolateString(rule.feedbackTemplate.title, contingencyInterpolationData),
            message: interpolateString(rule.feedbackTemplate.message, contingencyInterpolationData),
            severity: rule.feedbackTemplate.severity,
            implication: rule.feedbackTemplate.implication ? interpolateString(rule.feedbackTemplate.implication, contingencyInterpolationData) : undefined,
            recommendation: rule.feedbackTemplate.recommendation ? interpolateString(rule.feedbackTemplate.recommendation, contingencyInterpolationData) : undefined,
            relevantMetrics: {
              'Contingency Fund': applyFormat(contingencyAmount, 'currency'),
              'Contingency %': applyFormat(contingencyPercentage, 'percent', '1'),
              'Total Startup Costs': applyFormat(totalStartupCosts, 'currency'),
              'Recommended Range': `${applyFormat(minRecommendedContingency, 'currency')} - ${applyFormat(maxRecommendedContingency, 'currency')}`
            },
            uiTarget: {
              scope: 'summaryMetric',
              identifier: 'contingencyFund',
            },
          };
          matchedFeedbackItems.push(feedbackItem);
        }
        continue; // Skip standard condition processing for this rule
      }
    }

    const ruleConditionLogic = rule.conditionLogic || 'AND';
    const conditionResults: boolean[] = [];
    const ruleSpecificInterpolationData: Record<string, any> = {};
    const ruleRelevantMetrics: Record<string, string | number> = {};

    for (const condition of rule.conditions) {
      const metricValue = getNestedValue(calculatorData, condition.metric);
      let comparisonValue: any;
      let comparisonSource = "literal"; // To track where the comparison value came from for interpolation keys

      if (condition.comparisonMetric) {
        comparisonValue = getNestedValue(calculatorData, condition.comparisonMetric);
        comparisonSource = condition.comparisonMetric; // Use the metric name as source
      } else if (condition.valuePath) {
        const benchmarkVal = getNestedValue(flattenedBenchmarks, condition.valuePath);
        if (benchmarkVal !== undefined) {
          comparisonValue = benchmarkVal;
          comparisonSource = condition.valuePath; // Use the path as source identifier
        } else if (condition.value !== undefined) { // Fallback to literal if valuePath is specified but not found
            comparisonValue = condition.value;
        }
      } else if (condition.value !== undefined) {
        comparisonValue = condition.value;
      }
      
      // Store actual values used in condition for interpolation and relevantMetrics
      ruleSpecificInterpolationData[condition.metric] = metricValue;
      // Make the comparison value available using a dynamic key based on its source
      if (comparisonSource === "literal") {
        ruleSpecificInterpolationData[`${condition.metric}_comparisonValue`] = comparisonValue;
      } else {
        // For benchmarks or other metrics, use a more descriptive key if possible, or a generic one
        // e.g., if comparisonMetric is 'previousRevenue', key becomes 'previousRevenue_value'
        // if valuePath is 'some.benchmark.path', key becomes 'some.benchmark.path_value'
        // This helps avoid clashes and provides clarity in templates.
        const comparisonKey = comparisonSource.replace(/\./g, '_'); // Sanitize path for key
        ruleSpecificInterpolationData[comparisonKey] = comparisonValue; 
      }

      if (metricValue !== undefined) ruleRelevantMetrics[condition.metric] = metricValue;
      if (comparisonValue !== undefined) {
        // Add to relevantMetrics, trying to use a meaningful key
        const relevantComparisonKey = condition.comparisonMetric || condition.valuePath || `comparison_${condition.metric}`;
        ruleRelevantMetrics[relevantComparisonKey] = comparisonValue;
      }

      if (metricValue === undefined || comparisonValue === undefined) { // Condition cannot be evaluated if either value is missing
        conditionResults.push(false);
        continue;
      }
      conditionResults.push(evaluateCondition(condition, metricValue, comparisonValue));
    }

    const conditionsMet = ruleConditionLogic === 'AND' 
      ? conditionResults.every(Boolean) 
      : conditionResults.some(Boolean);

    if (conditionsMet && conditionResults.length > 0) { // Ensure at least one condition was evaluated
      const finalInterpolationContext = {
        ...baseInterpolationContext,
        ...ruleSpecificInterpolationData,
      };

      const feedbackItem: FeedbackItem = {
        id: `${rule.id}-${calculatorType}-${businessTypeData?.value || 'generic'}-${Date.now()}`,
        title: interpolateString(rule.feedbackTemplate.title, finalInterpolationContext),
        message: interpolateString(rule.feedbackTemplate.message, finalInterpolationContext),
        severity: rule.feedbackTemplate.severity,
        implication: rule.feedbackTemplate.implication ? interpolateString(rule.feedbackTemplate.implication, finalInterpolationContext) : undefined,
        recommendation: rule.feedbackTemplate.recommendation ? interpolateString(rule.feedbackTemplate.recommendation, finalInterpolationContext) : undefined,
        relevantMetrics: ruleRelevantMetrics,
        link: rule.feedbackTemplate.link ? interpolateString(rule.feedbackTemplate.link, finalInterpolationContext) : undefined,
      };
      matchedFeedbackItems.push(feedbackItem);
    }
  }

  matchedFeedbackItems.sort((a, b) => {
    const priorityA = allRules.find(r => r.id === a.id.split('-')[0])?.priority || 0;
    const priorityB = allRules.find(r => r.id === b.id.split('-')[0])?.priority || 0;
    return priorityB - priorityA;
  });

  return matchedFeedbackItems;
}

// Example of how it might be used (will require actual rules and data):
/*
import { businessTypes } from '../data/businessTypes';
import { allFeedbackRules } from '../data/feedbackRules';

const sampleCalcData = { currentRatio: 0.8, quickRatio: 0.5 };
const selectedBizType = businessTypes.find(bt => bt.value === 'retail');
const calcType: CalculatorType = 'ratios';

if (selectedBizType) {
  const feedback = generateFeedback(sampleCalcData, selectedBizType, calcType, allFeedbackRules);
  console.log(feedback);
}
*/
