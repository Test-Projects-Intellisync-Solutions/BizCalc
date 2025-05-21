import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Define the data structure for the burn rate calculator
export interface BurnRateData {
  monthlyExpenses: number;
  cashOnHand: number;
}

export default function BurnRateCalculator() {
  const [data, setData] = useState<BurnRateData>({
    monthlyExpenses: 0,
    cashOnHand: 0
  });

  const { monthlyExpenses, cashOnHand } = data;
  const runway = monthlyExpenses === 0 ? Infinity : cashOnHand / monthlyExpenses;
  const isLowRunway = runway < 6;

  const handleChange = (field: keyof BurnRateData, value: number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format months
  const formatMonths = (months: number) => {
    if (months === Infinity) return '∞';
    return `${months.toFixed(1)} months`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Burn Rate Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="block">Monthly Expenses</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-muted-foreground">$</span>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    min="0"
                    value={monthlyExpenses || ''}
                    onChange={(e) => handleChange('monthlyExpenses', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="block">Cash on Hand</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-muted-foreground">$</span>
                  <Input
                    id="cashOnHand"
                    type="number"
                    min="0"
                    value={cashOnHand || ''}
                    onChange={(e) => handleChange('cashOnHand', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

        {/* Results panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Runway Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLowRunway && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Your runway is less than 6 months. Consider reducing expenses or securing additional funding.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Burn Rate</p>
                  <p className="text-2xl font-semibold">{formatCurrency(monthlyExpenses)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cash on Hand</p>
                  <p className="text-2xl font-semibold">{formatCurrency(cashOnHand)}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg md:col-span-2">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Runway</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatMonths(runway)}
                  </p>
                  <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
                    {runway === Infinity 
                      ? 'With no expenses, your cash will last indefinitely'
                      : `At this burn rate, your cash will last until ${new Date(Date.now() + runway * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {runway < 3 ? (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <span className="h-4 w-4 inline-block bg-red-500 rounded-full mr-2 align-middle"></span>
                    <AlertTitle>Critical Situation</AlertTitle>
                    <AlertDescription>
                      With less than 3 months of runway, immediate action is required. Consider significant cost reductions and emergency funding options.
                    </AlertDescription>
                  </Alert>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>Prioritize essential expenses only</li>
                    <li>Reach out to investors or lenders immediately</li>
                    <li>Consider downsizing or pivoting your business model</li>
                  </ul>
                </div>
              ) : runway < 6 ? (
                <div className="space-y-4">
                  <Alert>
                    <span className="h-4 w-4 inline-block bg-yellow-400 rounded-full mr-2 align-middle"></span>
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      Your runway is between 3-6 months. It's time to take action to extend your cash runway.
                    </AlertDescription>
                  </Alert>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>Review and reduce non-essential expenses</li>
                    <li>Explore additional funding options</li>
                    <li>Focus on revenue-generating activities</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <AlertTitle>Good Standing</AlertTitle>
                    <AlertDescription>
                      Your runway is healthy at {formatMonths(runway)}. Continue to monitor your burn rate and cash position.
                    </AlertDescription>
                  </Alert>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>Maintain regular financial reviews</li>
                    <li>Continue to optimize expenses</li>
                    <li>Consider setting aside a cash reserve</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
    </div>
  );
}