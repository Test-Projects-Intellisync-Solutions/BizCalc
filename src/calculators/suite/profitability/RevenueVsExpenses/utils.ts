import { FinancialItem, FinancialSummary, frequencyMultipliers } from './types'; // Removed unused CategorySummary

export const calculateItemMonthlyAmount = (item: FinancialItem): number => {
  return (item.amount || 0) * frequencyMultipliers[item.frequency];
};

export const calculateSummary = (items: FinancialItem[]): FinancialSummary => {
  const categoryTotals = items.reduce<Record<string, number>>((acc, item) => {
    const category = item.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + calculateItemMonthlyAmount(item);
    return acc;
  }, {});

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  const byCategory = Object.entries(categoryTotals)
    .map(([name, total]) => ({
      name,
      total,
      percentage: total > 0 ? (total / total) * 100 : 0,
      count: items.filter(item => (item.category || 'Uncategorized') === name).length,
    }))
    .sort((a, b) => b.total - a.total);

  return {
    total,
    byCategory,
    items: [...items].sort((a, b) => 
      (b.updatedAt || '').localeCompare(a.updatedAt || '')
    ),
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export const getInitialCategories = (type: 'revenue' | 'expense'): string[] => {
  if (type === 'revenue') {
    return [
      'Product Sales',
      'Service Revenue',
      'Subscription Income',
      'Advertising',
      'Other Income',
    ];
  } else {
    return [
      'Salaries & Wages',
      'Rent & Utilities',
      'Marketing',
      'Supplies',
      'Insurance',
      'Software',
      'Other Expenses',
    ];
  }
};
