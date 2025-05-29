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
export function interpolateString(template: string, data: Record<string, string | number | undefined>): string {
  if (template === undefined || template === null) return '';
  let result = template;
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      // Ensure value is a string or number before replacing. Handle undefined gracefully.
      const replacement = (value !== undefined && value !== null) ? String(value) : '';
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), replacement);
    }
  }
  return result;
}

export function getNestedValue(obj: any, path: string, defaultValue?: any): any {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === null || typeof current !== 'object' || !(key in current)) {
      return defaultValue;
    }
    current = current[key];
  }
  return current;
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

export function generateFeedback(
  calculatorData: Record<string, number | string>,
  businessTypeData: BusinessType | undefined,
  calculatorType: CalculatorType,
  allRules: FeedbackRule[]
): FeedbackItem[] {
  const matchedRulesData: MatchedRuleData[] = [];

  for (const rule of allRules) {
    // 1. Check if rule applies to this calculatorType
    const ruleAppliesToCalcType =
      Array.isArray(rule.calculatorType) ? 
      rule.calculatorType.includes(calculatorType) : 
      rule.calculatorType === calculatorType;
    if (!ruleAppliesToCalcType) {
      continue;
    }

    // 2. Check if rule applies to this businessType (if specified)
    if (rule.businessType && rule.businessType.length > 0) {
      if (!businessTypeData || !rule.businessType.includes(businessTypeData.value)) {
        continue; // Skip if rule requires a specific business type and it doesn't match or no business type is selected
      }
    } else {
      // This is a generic rule (no specific businessType defined in the rule).
      // It can apply even if businessTypeData is undefined.
      // However, if businessTypeData is undefined, conditions using valuePath will likely not be met.
    }

    const ruleConditionLogic = rule.conditionLogic || 'AND';
    let allConditionsMetForAND = true;
    let anyConditionMetForOR = false;

    // 3. Evaluate conditions
    for (const condition of rule.conditions) {
      const metricValue = calculatorData[condition.metric];
      let comparisonValue = condition.value;

      // If valuePath is provided, try to get the benchmark value
      // This requires businessTypeData and its benchmarks to be present.
      if (condition.valuePath) {
        if (businessTypeData && businessTypeData.benchmarks) {
        const benchmarkVal = getNestedValue(businessTypeData.benchmarks, condition.valuePath);
        if (benchmarkVal !== undefined) {
          comparisonValue = benchmarkVal;
        } else {
          // console.warn(`Benchmark path ${condition.valuePath} not found for ${businessTypeData.label}`);
          if (ruleConditionLogic === 'AND') {
            allConditionsMetForAND = false;
            break;
          }
          continue; // Skip for OR
        }
      } else {
          // valuePath is present, but no businessTypeData or no benchmarks. Condition cannot use benchmark.
          // This condition cannot be met if it relies on a benchmark that isn't there.
          if (ruleConditionLogic === 'AND') {
            allConditionsMetForAND = false;
            break;
          }
          continue; // Skip for OR
        }
      }
      
      if (metricValue === undefined) {
        if (ruleConditionLogic === 'AND') {
          allConditionsMetForAND = false;
          break;
        }
        continue; // For 'OR', this condition doesn't contribute if metric is missing
      }

      let currentConditionResult = false;
      const numMetricValue = Number(metricValue);
      const numComparisonValue = Number(comparisonValue);

      switch (condition.operator) {
        case '>':  currentConditionResult = numMetricValue > numComparisonValue; break;
        case '<':  currentConditionResult = numMetricValue < numComparisonValue; break;
        case '>=': currentConditionResult = numMetricValue >= numComparisonValue; break;
        case '<=': currentConditionResult = numMetricValue <= numComparisonValue; break;
        case '==': currentConditionResult = numMetricValue === numComparisonValue; break;
        case '!=': currentConditionResult = numMetricValue !== numComparisonValue; break;
        default:   currentConditionResult = false;
      }

      if (ruleConditionLogic === 'AND') {
        if (!currentConditionResult) {
          allConditionsMetForAND = false;
          break; // Exit condition loop for this rule
        }
      } else { // OR logic
        if (currentConditionResult) {
          anyConditionMetForOR = true;
          break; // Exit condition loop for this rule, OR condition met
        }
      }
    }

    const finalConditionsMet = (ruleConditionLogic === 'AND') ? allConditionsMetForAND : anyConditionMetForOR;

    if (finalConditionsMet) {
      // 4. Prepare data for placeholder interpolation and relevantMetrics
      const interpolationData: Record<string, string | number | undefined> = {};
      const preciseRelevantMetrics: Record<string, string | number> = {};

      // Populate interpolationData and preciseRelevantMetrics based on the conditions that led to the match
      // This part needs careful implementation: we need to know which condition(s) made the rule pass,
      // especially for OR logic. For now, let's assume the *last evaluated* condition that was true for OR,
      // or all conditions for AND. This is a simplification and might need refinement.
      // For a simple start, let's try to use the first condition's details if the rule matches.
      // A more robust solution would track the specific condition(s) that caused the match.

      if (rule.conditions.length > 0) {
        const firstCondition = rule.conditions[0]; // Simplification for now
        const metricName = firstCondition.metric;
        const metricVal = calculatorData[metricName];
        let compVal = firstCondition.value;
        if (firstCondition.valuePath && businessTypeData && businessTypeData.benchmarks) {
          const benchmarkVal = getNestedValue(businessTypeData.benchmarks, firstCondition.valuePath);
          if (benchmarkVal !== undefined) compVal = benchmarkVal;
        }

        interpolationData['metricName'] = metricName;
        interpolationData['metricValue'] = metricVal;
        interpolationData['comparisonValue'] = compVal;
        if (firstCondition.valuePath) {
            interpolationData['benchmarkPath'] = firstCondition.valuePath;
        }

        if (metricVal !== undefined) preciseRelevantMetrics[metricName] = metricVal;
        preciseRelevantMetrics[`comparison_${metricName}`] = compVal; // Example naming for comparison value
      }

      matchedRulesData.push({
        rule,
        interpolationData,
        preciseRelevantMetrics,
        businessTypeValue: businessTypeData?.value || 'generic',
      });
    }
  }

  // Sort matched rules by priority (descending)
  matchedRulesData.sort((a, b) => (b.rule.priority || 0) - (a.rule.priority || 0));

  // Map sorted rules to FeedbackItem array
  const applicableFeedback: FeedbackItem[] = matchedRulesData.map(data => ({
    id: `${calculatorType}-${data.rule.id}-${data.businessTypeValue}`,
    title: interpolateString(data.rule.feedbackTemplate.title, data.interpolationData),
    message: interpolateString(data.rule.feedbackTemplate.message, data.interpolationData),
    severity: data.rule.feedbackTemplate.severity,
    implication: data.rule.feedbackTemplate.implication ? interpolateString(data.rule.feedbackTemplate.implication, data.interpolationData) : undefined,
    recommendation: data.rule.feedbackTemplate.recommendation ? interpolateString(data.rule.feedbackTemplate.recommendation, data.interpolationData) : undefined,
    relevantMetrics: data.preciseRelevantMetrics,
    link: data.rule.feedbackTemplate.link,
  }));

  return applicableFeedback;
}

// Example of how it might be used (will require actual rules and data):
/*
import { businessTypes } from '../data/businessTypes';
import { exampleFeedbackRules } from '../data/feedbackRules';

const sampleCalcData = { currentRatio: 0.8, quickRatio: 0.5 };
const selectedBizType = businessTypes.find(bt => bt.value === 'retail');
const calcType: CalculatorType = 'ratios';

if (selectedBizType) {
  const feedback = generateFeedback(sampleCalcData, selectedBizType, calcType, exampleFeedbackRules);
  console.log(feedback);
}
*/
