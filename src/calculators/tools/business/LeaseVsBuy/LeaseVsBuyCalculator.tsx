import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function LeaseVsBuyCalculator() {
  const [assetValue, setAssetValue] = useState<number>(0);
  const [assetLife, setAssetLife] = useState<number>(5);
  const [salvageValue, setSalvageValue] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [leasePayment, setLeasePayment] = useState<number>(0);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [maintenanceCost, setMaintenanceCost] = useState<number>(0);
  const [taxBracket, setTaxBracket] = useState<number>(25);

  const calculateNPV = (cashFlows: number[], rate: number): number => {
    return cashFlows.reduce((npv, cf, year) => {
      return npv + cf / Math.pow(1 + rate / 100, year);
    }, 0);
  };

  // Lease vs Buy Analysis
  const calculateAnalysis = () => {
    const years = assetLife;
    const annualLeaseCost = leasePayment * 12;
    const leaseTaxBenefit = annualLeaseCost * (taxBracket / 100);
    
    // Calculate loan payment
    const loanAmount = assetValue - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = assetLife * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    const annualLoanPayment = monthlyPayment * 12;
    
    // Calculate depreciation and tax benefits
    const depreciableAmount = assetValue - salvageValue;
    const annualDepreciation = depreciableAmount / years;
    const depreciationTaxBenefit = annualDepreciation * (taxBracket / 100);
    const interestTaxBenefit = (annualLoanPayment - (loanAmount / years)) * (taxBracket / 100); // Rough approximation
    
    interface YearData {
      year: string;
      leaseCash: number;
      buyCash: number;
      leaseCumulative: number;
      buyCumulative: number;
    }
    
    const data: YearData[] = [];
    
    for (let year = 0; year <= years; year++) {
      // Year 0 (initial)
      if (year === 0) {
        data.push({
          year: `Year ${year}`,
          leaseCash: 0,
          buyCash: -downPayment,
          leaseCumulative: 0,
          buyCumulative: -downPayment,
        });
        continue;
      }
      
      // Lease cash flow: Pay lease, get tax benefit
      const leaseYearCost = -(annualLeaseCost - leaseTaxBenefit);
      
      // Buy cash flow: Loan payment, maintenance, tax benefits from depreciation and interest
      const buyYearCost = -(annualLoanPayment + maintenanceCost - depreciationTaxBenefit - interestTaxBenefit);
      
      // Add salvage value in final year
      const finalYearAdjustment = year === years ? salvageValue : 0;
      
      const buyYearCostAdjusted = buyYearCost + finalYearAdjustment;
      
      // Cumulative calculations
      const prevData = data[year - 1];
      const leaseCumulative = prevData.leaseCumulative + leaseYearCost;
      const buyCumulative = prevData.buyCumulative + buyYearCostAdjusted;
      
      data.push({
        year: `Year ${year}`,
        leaseCash: leaseYearCost,
        buyCash: buyYearCostAdjusted,
        leaseCumulative,
        buyCumulative,
      });
    }
    
    // Calculate NPV
    const leaseCashFlows = data.map(d => data.indexOf(d) === 0 ? 0 : d.leaseCash);
    const buyCashFlows = data.map(d => data.indexOf(d) === 0 ? -downPayment : d.buyCash);
    
    const leaseNPV = calculateNPV(leaseCashFlows, interestRate);
    const buyNPV = calculateNPV(buyCashFlows, interestRate);
    
    return {
      data,
      leaseNPV,
      buyNPV,
      recommendation: leaseNPV > buyNPV ? 'Lease' : 'Buy'
    };
  };

  const analysis = assetValue > 0 && leasePayment > 0 ? calculateAnalysis() : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lease vs. Buy Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <TooltipWrapper content="The total purchase price of the asset you're considering">
                <Label htmlFor="assetValue">Asset Value</Label>
              </TooltipWrapper>
              <Input
                id="assetValue"
                type="number"
                min="0"
                value={assetValue || ''}
                onChange={(e) => setAssetValue(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper content="Expected useful life of the asset in years">
                <Label htmlFor="assetLife">Asset Life (years)</Label>
              </TooltipWrapper>
              <Input
                id="assetLife"
                type="number"
                min="1"
                value={assetLife || ''}
                onChange={(e) => setAssetLife(parseInt(e.target.value) || 5)}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper content="Estimated value of the asset at the end of its useful life">
                <Label htmlFor="salvageValue">Salvage Value</Label>
              </TooltipWrapper>
              <Input
                id="salvageValue"
                type="number"
                min="0"
                value={salvageValue || ''}
                onChange={(e) => setSalvageValue(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper content="Annual interest rate for financing the purchase">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
              </TooltipWrapper>
              <Input
                id="interestRate"
                type="number"
                min="0"
                step="0.1"
                value={interestRate || ''}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                placeholder="5.0"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper content="Monthly payment amount if leasing the asset">
                <Label htmlFor="leasePayment">Monthly Lease Payment</Label>
              </TooltipWrapper>
              <Input
                id="leasePayment"
                type="number"
                min="0"
                value={leasePayment || ''}
                onChange={(e) => setLeasePayment(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper content="Initial payment if purchasing the asset">
                <Label htmlFor="downPayment">Down Payment</Label>
              </TooltipWrapper>
              <Input
                id="downPayment"
                type="number"
                min="0"
                value={downPayment || ''}
                onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper content="Estimated annual maintenance cost if you own the asset">
                <Label htmlFor="maintenanceCost">Annual Maintenance Cost</Label>
              </TooltipWrapper>
              <Input
                id="maintenanceCost"
                type="number"
                min="0"
                value={maintenanceCost || ''}
                onChange={(e) => setMaintenanceCost(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper content="Your business tax bracket for calculating tax benefits">
                <Label htmlFor="taxBracket">Tax Bracket (%)</Label>
              </TooltipWrapper>
              <Input
                id="taxBracket"
                type="number"
                min="0"
                max="100"
                value={taxBracket || ''}
                onChange={(e) => setTaxBracket(parseFloat(e.target.value) || 0)}
                placeholder="25"
              />
            </div>
          </div>

          {analysis && (
            <>
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Lease NPV</p>
                      <p className="text-2xl font-bold">
                        ${analysis.leaseNPV.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Buy NPV</p>
                      <p className="text-2xl font-bold">
                        ${analysis.buyNPV.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Recommendation</p>
                      <p className="text-2xl font-bold">
                        {analysis.recommendation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysis.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number | string) => 
                        `$${typeof value === 'number' ? value.toFixed(2) : value}`
                      } 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="leaseCumulative" stroke="hsl(var(--chart-1))" name="Lease (Cumulative Cost)" />
                    <Line type="monotone" dataKey="buyCumulative" stroke="hsl(var(--chart-2))" name="Buy (Cumulative Cost)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          <Button className="w-full" onClick={() => console.log('Save analysis')}>
            Save Analysis
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}