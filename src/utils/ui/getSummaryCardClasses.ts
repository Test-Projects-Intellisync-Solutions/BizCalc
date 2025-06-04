import { type FeedbackItem } from '@/data/feedbackRules';

export type SeverityClassMap = Partial<Record<FeedbackItem['severity'], string>>;

const defaultClassMap: Record<FeedbackItem['severity'], string> = {
  critical: 'border-l-4 border-red-500',
  warning: 'border-l-4 border-yellow-500',
  good: 'border-l-4 border-green-500',
  info: 'border-l-4 border-blue-500',
};

export function getSummaryCardClasses(
  metricName: string,
  feedbackItems: FeedbackItem[],
  baseClasses = '',
  classMap: SeverityClassMap = {}
): string {
  const relevant = feedbackItems.filter(
    (item) =>
      item.uiTarget?.scope === 'summaryMetric' &&
      item.uiTarget?.identifier === metricName
  );

  if (relevant.length === 0) return baseClasses;

  let severity: FeedbackItem['severity'] = 'info';
  if (relevant.some((item) => item.severity === 'critical')) severity = 'critical';
  else if (relevant.some((item) => item.severity === 'warning')) severity = 'warning';
  else if (relevant.some((item) => item.severity === 'good')) severity = 'good';

  const map = { ...defaultClassMap, ...classMap };
  return map[severity] ?? baseClasses;
}
