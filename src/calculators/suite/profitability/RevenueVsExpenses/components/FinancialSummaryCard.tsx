import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { FinancialItem, FinancialSummary } from '../types';
import { formatCurrency, formatPercentage } from '../utils';

interface FinancialSummaryCardProps {
  type: 'revenue' | 'expense';
  summary: FinancialSummary;
  className?: string;
}

export function FinancialSummaryCard({ type, summary, className = '' }: FinancialSummaryCardProps) {
  const isRevenue = type === 'revenue';
  const Icon = isRevenue ? TrendingUp : TrendingDown;
  const title = isRevenue ? 'Total Revenue' : 'Total Expenses';
  
  // Calculate monthly total
  const monthlyTotal = summary.byCategory.reduce((sum, cat) => sum + cat.total, 0);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Icon className={`h-5 w-5 ${isRevenue ? 'text-green-500' : 'text-red-500'}`} />
            {title}
          </CardTitle>
          <div className="text-2xl font-bold">
            {formatCurrency(monthlyTotal)}
            <span className="text-sm font-normal text-muted-foreground ml-2">/month</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {summary.byCategory.length > 0 ? (
          <div className="space-y-3">
            {summary.byCategory.map((category) => (
              <div key={category.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center gap-2">
                    <span>{formatCurrency(category.total)}</span>
                    <span className="text-muted-foreground">
                      ({formatPercentage(category.percentage)})
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isRevenue ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, category.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No {type} data available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
