import { type FeedbackCondition } from '@/data/feedbackRules';

export function evaluateCondition(
  condition: FeedbackCondition,
  metricValue: any,
  comparisonValue: any
): boolean {
  if (condition.operator === 'exists') {
    return metricValue !== undefined && metricValue !== null;
  }
  if (condition.operator === 'notExists') {
    return metricValue === undefined || metricValue === null;
  }

  const numMetricValue = Number(metricValue);
  const numComparisonValue = Number(comparisonValue);

  if (comparisonValue === undefined || isNaN(numMetricValue) || isNaN(numComparisonValue)) {
    if (condition.operator === '==') return String(metricValue) === String(comparisonValue);
    if (condition.operator === '!=') return String(metricValue) !== String(comparisonValue);
    return false;
  }

  switch (condition.operator) {
    case '>':
      return numMetricValue > numComparisonValue;
    case '<':
      return numMetricValue < numComparisonValue;
    case '>=':
      return numMetricValue >= numComparisonValue;
    case '<=':
      return numMetricValue <= numComparisonValue;
    case '==':
      return numMetricValue === numComparisonValue;
    case '!=':
      return numMetricValue !== numComparisonValue;
    default:
      return false;
  }
}
