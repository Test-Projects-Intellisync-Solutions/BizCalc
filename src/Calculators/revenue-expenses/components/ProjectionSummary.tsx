import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectionSummary as ProjectionSummaryType } from '../types';

interface ProjectionSummaryComponentProps {
  summary: ProjectionSummaryType;
  className?: string;
}

export function ProjectionSummary({ summary, className = '' }: ProjectionSummaryComponentProps) {
  const { totalRevenue, totalExpenses, netCashFlow } = summary;

  return (
    <div className={`grid gap-6 md:grid-cols-3 ${className}`}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">
            ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Net Cash Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <p 
            className={`text-2xl font-bold ${
              netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            ${netCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
