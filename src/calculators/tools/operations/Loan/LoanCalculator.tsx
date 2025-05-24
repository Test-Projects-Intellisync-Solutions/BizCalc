import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Payment {
  number: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [term, setTerm] = useState<number>(0);
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');

  const calculatePayments = useMemo(() => {
    if (!loanAmount || !interestRate || !term) return [];

    const periodsPerYear = frequency === 'monthly' ? 12 : frequency === 'quarterly' ? 4 : 1;
    const totalPeriods = term * periodsPerYear;
    const periodicRate = (interestRate / 100) / periodsPerYear;
    
    const payment =
      (loanAmount * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) /
      (Math.pow(1 + periodicRate, totalPeriods) - 1);

    let balance = loanAmount;
    const schedule: Payment[] = [];

    for (let i = 1; i <= totalPeriods; i++) {
      const interest = balance * periodicRate;
      const principal = payment - interest;
      balance -= principal;

      schedule.push({
        number: i,
        payment,
        principal,
        interest,
        balance: Math.max(0, balance),
      });
    }

    return schedule;
  }, [loanAmount, interestRate, term, frequency]);

  const totalInterest = useMemo(() => {
    return calculatePayments.reduce((sum, payment) => sum + payment.interest, 0);
  }, [calculatePayments]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loan Repayment Planner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <TooltipWrapper content="The total amount of money you want to borrow">
                <Label htmlFor="loanAmount">Loan Amount</Label>
              </TooltipWrapper>
              <Input
                id="amount"
                type="number"
                min="0"
                value={loanAmount || ''}
                onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper content="The annual interest rate for the loan">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
              </TooltipWrapper>
              <Input
                id="rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={interestRate || ''}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper content="The length of time over which you'll repay the loan">
                <Label htmlFor="term">Loan Term (years)</Label>
              </TooltipWrapper>
              <Input
                id="term"
                type="number"
                min="1"
                value={term || ''}
                onChange={(e) => setTerm(parseFloat(e.target.value) || 0)}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper content="How often you'll make payments on the loan">
                <Label>Payment Frequency</Label>
              </TooltipWrapper>
              <Select value={frequency} onValueChange={(value) => setFrequency(value as 'monthly' | 'quarterly' | 'annually')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {calculatePayments.length > 0 && (
            <>
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Payment Amount</p>
                      <p className="text-2xl font-bold">
                        ${calculatePayments[0].payment.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Interest</p>
                      <p className="text-2xl font-bold">${totalInterest.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <TooltipWrapper content="Payment number in the schedule">
                          <span>Payment #</span>
                        </TooltipWrapper>
                      </TableHead>
                      <TableHead>
                        <TooltipWrapper content="Total payment amount (principal + interest)">
                          <span>Payment</span>
                        </TooltipWrapper>
                      </TableHead>
                      <TableHead>
                        <TooltipWrapper content="Portion of payment that reduces the loan balance">
                          <span>Principal</span>
                        </TooltipWrapper>
                      </TableHead>
                      <TableHead>
                        <TooltipWrapper content="Interest portion of the payment">
                          <span>Interest</span>
                        </TooltipWrapper>
                      </TableHead>
                      <TableHead>
                        <TooltipWrapper content="Remaining loan balance after the payment">
                          <span>Balance</span>
                        </TooltipWrapper>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calculatePayments.map((payment) => (
                      <TableRow key={payment.number}>
                        <TableCell>{payment.number}</TableCell>
                        <TableCell>${payment.payment.toFixed(2)}</TableCell>
                        <TableCell>${payment.principal.toFixed(2)}</TableCell>
                        <TableCell>${payment.interest.toFixed(2)}</TableCell>
                        <TableCell>${payment.balance.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button className="w-full">Export Amortization Schedule</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}