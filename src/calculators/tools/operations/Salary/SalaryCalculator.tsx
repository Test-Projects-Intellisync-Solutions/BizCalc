import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

//
// Canadian Federal Tax Brackets (2023) for Salary Income
//  - 15% on the first $53,359
//  - 20.5% on the next $53,359 (from $53,359 to $106,717)
//  - 26% on the next $58,713 (from $106,717 to $165,430)
//  - 29% on the next $70,245 (from $165,430 to $235,675)
//  - 33% on any amount over $235,675
//
function calculateCanadianPersonalTax(salary: number): number {
  let tax = 0;
  let remaining = salary;

  const bracket1 = 53359;
  if (remaining <= bracket1) {
    return remaining * 0.15;
  }
  tax += bracket1 * 0.15;
  remaining -= bracket1;

  const bracket2 = 53359;
  if (remaining <= bracket2) {
    return tax + remaining * 0.205;
  }
  tax += bracket2 * 0.205;
  remaining -= bracket2;

  const bracket3 = 58713;
  if (remaining <= bracket3) {
    return tax + remaining * 0.26;
  }
  tax += bracket3 * 0.26;
  remaining -= bracket3;

  const bracket4 = 70245;
  if (remaining <= bracket4) {
    return tax + remaining * 0.29;
  }
  tax += bracket4 * 0.29;
  remaining -= bracket4;

  tax += remaining * 0.33;
  return tax;
}

/**
 * For incomes below $250,000, it's generally recommended to take 100% salary.
 * For incomes $250,000 and up, we try various splits (in increments of 5%) to find the best net income.
 */
function findOptimalSplit(
  targetIncome: number,
  corporateTaxRate: number,
  dividendTaxRate: number
) {
  // If below $250,000, return 100% salary split.
  if (targetIncome < 250000) {
    const personalTax = calculateCanadianPersonalTax(targetIncome);
    return {
      bestNet: targetIncome - personalTax,
      bestSalaryPortion: 1,
    };
  }

  let bestNet = 0;
  let bestSalaryPortion = 0;

  // Try splits in increments of 5%
  for (let i = 0; i <= 100; i += 5) {
    const salaryPortion = i / 100;
    const salary = targetIncome * salaryPortion;
    const dividend = targetIncome * (1 - salaryPortion);

    // Calculate tax on salary portion using brackets
    const personalTax = calculateCanadianPersonalTax(salary);
    const netSalary = salary - personalTax;

    // For dividends, first apply corporate tax then dividend tax
    const afterCorporate = dividend * (1 - corporateTaxRate / 100);
    const netDividend = afterCorporate * (1 - dividendTaxRate / 100);

    const totalNet = netSalary + netDividend;
    if (totalNet > bestNet) {
      bestNet = totalNet;
      bestSalaryPortion = salaryPortion;
    }
  }

  return {
    bestNet,
    bestSalaryPortion,
  };
}

export default function SalaryCalculator() {
  const [targetIncome, setTargetIncome] = useState<number>(0);
  const [corporateTaxRate, setCorporateTaxRate] = useState<number>(15);
  const [dividendTaxRate, setDividendTaxRate] = useState<number>(20);

  const { bestNet, bestSalaryPortion } = findOptimalSplit(
    targetIncome,
    corporateTaxRate,
    dividendTaxRate
  );

  const optimalSalary = targetIncome * bestSalaryPortion;
  const optimalDividend = targetIncome - optimalSalary;
  const totalTax = targetIncome - bestNet;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Salary vs. Dividend Calculator (Canada)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income">Target Annual Income</Label>
            <Input
              id="income"
              type="number"
              min="0"
              value={targetIncome || ''}
              onChange={(e) => setTargetIncome(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="corpTax">Corporate Tax Rate (%)</Label>
              <Input
                id="corpTax"
                type="number"
                min="0"
                max="100"
                value={corporateTaxRate || ''}
                onChange={(e) =>
                  setCorporateTaxRate(parseFloat(e.target.value) || 0)
                }
                placeholder="15.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dividendTax">Dividend Tax Rate (%)</Label>
              <Input
                id="dividendTax"
                type="number"
                min="0"
                max="100"
                value={dividendTaxRate || ''}
                onChange={(e) =>
                  setDividendTaxRate(parseFloat(e.target.value) || 0)
                }
                placeholder="20.00"
              />
            </div>
          </div>

          {targetIncome > 0 && (
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Recommended Salary
                    </p>
                    <p className="text-2xl font-bold">
                      ${optimalSalary.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                  {targetIncome >= 250000 && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Recommended Dividend
                      </p>
                      <p className="text-2xl font-bold">
                        ${optimalDividend.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Estimated Total Tax
                    </p>
                    <p className="text-2xl font-bold">
                      ${totalTax.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  {targetIncome < 250000 ? (
                    <p className="text-sm text-muted-foreground">
                      For incomes under $250,000, taking 100% salary is typically
                      recommended.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Optimal split: {(bestSalaryPortion * 100).toFixed(0)}% Salary /{' '}
                      {((1 - bestSalaryPortion) * 100).toFixed(0)}% Dividend. <br />
                      Net Income: ${bestNet.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            className="w-full"
            onClick={() => console.log('Save calculation')}
          >
            Save Calculation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}