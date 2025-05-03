import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface FinancialData {
  currentAssets: number;
  inventory: number;
  cash: number;
  currentLiabilities: number;
  totalAssets: number;
  totalLiabilities: number;
  shareholderEquity: number;
  revenue: number;
  cogs: number;
  operatingIncome: number;
  netIncome: number;
  ebit: number;
  interestExpense: number;
  accountsReceivable: number;
  previousRevenue?: number;
  previousNetIncome?: number;
}

interface RatioFormProps {
  data: FinancialData;
  onUpdate: (data: FinancialData) => void;
}

export default function RatioForm({ data, onUpdate }: RatioFormProps) {
  const handleChange = (field: keyof FinancialData, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    onUpdate({ ...data, [field]: numValue });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Data Input</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Current Assets</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Assets expected to be converted to cash within one year. Found on the Balance Sheet under Current Assets, including cash, accounts receivable, inventory, and prepaid expenses.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              min="0"
              value={data.currentAssets || ''}
              onChange={(e) => handleChange('currentAssets', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Inventory</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Value of goods held for sale. Found on the Balance Sheet as a line item under Current Assets.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              min="0"
              value={data.inventory || ''}
              onChange={(e) => handleChange('inventory', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Cash</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Immediately available funds. Found on the Balance Sheet as "Cash and Cash Equivalents" under Current Assets.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              min="0"
              value={data.cash || ''}
              onChange={(e) => handleChange('cash', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Current Liabilities</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Obligations due within one year. Found on the Balance Sheet under Current Liabilities, including accounts payable, short-term debt, and accrued expenses.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              min="0"
              value={data.currentLiabilities || ''}
              onChange={(e) => handleChange('currentLiabilities', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Total Assets</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Sum of all company assets. Found as the total at the bottom of the Assets section on the Balance Sheet.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              min="0"
              value={data.totalAssets || ''}
              onChange={(e) => handleChange('totalAssets', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Total Liabilities</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Sum of all company debts and obligations. Found as the total at the bottom of the Liabilities section on the Balance Sheet.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              min="0"
              value={data.totalLiabilities || ''}
              onChange={(e) => handleChange('totalLiabilities', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Shareholder Equity</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Owners' stake in the company. Found on the Balance Sheet as the total Equity section, including paid-in capital, retained earnings, and other equity items.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              min="0"
              value={data.shareholderEquity || ''}
              onChange={(e) => handleChange('shareholderEquity', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Revenue</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Total income from sales before any deductions. Found at the top of the Income Statement as "Sales" or "Revenue".</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              min="0"
              value={data.revenue || ''}
              onChange={(e) => handleChange('revenue', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Cost of Goods Sold</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Direct costs attributable to the production of goods sold. Found on the Income Statement directly below Revenue.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              min="0"
              value={data.cogs || ''}
              onChange={(e) => handleChange('cogs', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Operating Income</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Profit from core business operations before interest and taxes. Found on the Income Statement as "Operating Income" or "Operating Profit".</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              value={data.operatingIncome || ''}
              onChange={(e) => handleChange('operatingIncome', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Net Income</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Total profit after all expenses, taxes, and interest. Found at the bottom of the Income Statement as "Net Income" or "Net Profit".</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              value={data.netIncome || ''}
              onChange={(e) => handleChange('netIncome', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>EBIT</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Earnings Before Interest and Taxes. Found on the Income Statement by taking Net Income and adding back interest and taxes, or as a separate line item.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              value={data.ebit || ''}
              onChange={(e) => handleChange('ebit', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Interest Expense</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Cost of borrowing money. Found on the Income Statement under "Non-Operating Expenses" or as a separate line item.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              min="0"
              value={data.interestExpense || ''}
              onChange={(e) => handleChange('interestExpense', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Previous Year Revenue</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Total income from sales in the prior year. Found on the previous year's Income Statement at the top line.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              min="0"
              value={data.previousRevenue || ''}
              onChange={(e) => handleChange('previousRevenue', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Previous Year Net Income</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Total profit after all expenses in the prior year. Found at the bottom of the previous year's Income Statement.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              min="0"
              value={data.previousNetIncome || ''}
              onChange={(e) => handleChange('previousNetIncome', e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}