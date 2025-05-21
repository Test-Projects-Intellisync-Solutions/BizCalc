import { Card, CardContent } from '@/components/ui/card';

interface StartupCostsSummaryProps {
  oneTimeCosts: number;
  sixMonthOperating: number;
  totalStartupCosts: number;
}

export function StartupCostsSummary({ 
  oneTimeCosts, 
  sixMonthOperating, 
  totalStartupCosts 
}: StartupCostsSummaryProps) {
  return (
    <Card className="bg-muted">
      <CardContent className="pt-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">One-Time Costs</p>
            <p className="text-2xl font-bold">
              ${oneTimeCosts.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">6-Month Operating</p>
            <p className="text-2xl font-bold">
              ${sixMonthOperating.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Startup Costs</p>
            <p className="text-2xl font-bold">
              ${totalStartupCosts.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
