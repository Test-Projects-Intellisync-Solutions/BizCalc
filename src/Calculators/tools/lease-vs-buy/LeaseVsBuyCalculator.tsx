import React, { useState } from 'react';

interface LeaseVsBuyData {
  // Common
  purchasePrice: number;
  usefulLife: number; // years
  taxRate: number; // percentage
  discountRate: number; // percentage
  
  // Lease options
  leaseTerm: number; // years
  leasePayment: number; // monthly
  leasePaymentFrequency: 'monthly' | 'quarterly' | 'annually';
  leaseEscalation: number; // percentage
  
  // Buy options
  downPayment: number;
  loanTerm: number; // years
  interestRate: number; // percentage
  maintenanceCost: number; // annual
  insuranceCost: number; // annual
  residualValue: number;
}

interface CalculationResult {
  year: number;
  leaseCost: number;
  buyCost: number;
  cumulativeLease: number;
  cumulativeBuy: number;
  npvLease: number;
  npvBuy: number;
}

const LeaseVsBuyCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<LeaseVsBuyData>({
    purchasePrice: 50000,
    usefulLife: 5,
    taxRate: 30,
    discountRate: 5,
    leaseTerm: 5,
    leasePayment: 1000,
    leasePaymentFrequency: 'monthly',
    leaseEscalation: 3,
    downPayment: 10000,
    loanTerm: 5,
    interestRate: 6,
    maintenanceCost: 1000,
    insuranceCost: 800,
    residualValue: 10000,
  });
  
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [recommendation, setRecommendation] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const calculateLeaseVsBuy = () => {
    const {
      purchasePrice,
      usefulLife,
      taxRate,
      discountRate,
      leaseTerm,
      leasePayment,
      leasePaymentFrequency,
      leaseEscalation,
      downPayment,
      loanTerm,
      interestRate,
      maintenanceCost,
      insuranceCost,
      residualValue,
    } = formData;

    // Convert annual rates to decimal
    const taxRateDec = taxRate / 100;
    const discountRateDec = discountRate / 100;
    const leaseEscalationDec = leaseEscalation / 100;
    const monthlyInterestRate = (interestRate / 100) / 12;
    
    const calculationResults: CalculationResult[] = [];
    let cumulativeLease = 0;
    let cumulativeBuy = 0;
    let npvLease = 0;
    let npvBuy = 0;

    // Calculate monthly payments for loan
    const loanAmount = purchasePrice - downPayment;
    const numberOfPayments = loanTerm * 12;
    const monthlyLoanPayment = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    for (let year = 1; year <= Math.max(leaseTerm, usefulLife); year++) {
      // Calculate lease cost for the year
      let annualLeasePayment = 0;
      const paymentsPerYear = leasePaymentFrequency === 'monthly' ? 12 : 
                            leasePaymentFrequency === 'quarterly' ? 4 : 1;
      
      const escalatedPayment = leasePayment * Math.pow(1 + leaseEscalationDec, year - 1);
      annualLeasePayment = escalatedPayment * paymentsPerYear;
      
      // Tax benefit from lease payments (assume full deduction)
      const leaseTaxBenefit = annualLeasePayment * taxRateDec;
      const netLeaseCost = annualLeasePayment - leaseTaxBenefit;
      
      // Calculate buy cost for the year
      let loanPayment = 0;
      if (year <= loanTerm) {
        loanPayment = monthlyLoanPayment * 12;
      }
      
      // Interest portion of loan payment (simplified)
      const interestExpense = year <= loanTerm ? 
        (loanAmount - (year - 1) * (loanAmount / loanTerm)) * (interestRate / 100) : 0;
      
      // Depreciation (straight-line for simplicity)
      const annualDepreciation = purchasePrice / usefulLife;
      
      // Tax savings from interest and depreciation
      const buyTaxBenefit = (interestExpense + annualDepreciation) * taxRateDec;
      
      // Total buy cost
      let annualBuyCost = loanPayment + maintenanceCost + insuranceCost - buyTaxBenefit;
      
      // Add residual value in the last year
      if (year === usefulLife) {
        annualBuyCost -= residualValue;
      }
      
      // Update cumulative costs
      cumulativeLease += netLeaseCost;
      cumulativeBuy += annualBuyCost;
      
      // Calculate NPV
      const discountFactor = 1 / Math.pow(1 + discountRateDec, year);
      npvLease += netLeaseCost * discountFactor;
      npvBuy += annualBuyCost * discountFactor;
      
      calculationResults.push({
        year,
        leaseCost: parseFloat(netLeaseCost.toFixed(2)),
        buyCost: parseFloat(annualBuyCost.toFixed(2)),
        cumulativeLease: parseFloat(cumulativeLease.toFixed(2)),
        cumulativeBuy: parseFloat(cumulativeBuy.toFixed(2)),
        npvLease: parseFloat(npvLease.toFixed(2)),
        npvBuy: parseFloat(npvBuy.toFixed(2)),
      });
    }
    
    setResults(calculationResults);
    setRecommendation(
      npvLease < npvBuy 
        ? 'Leasing is more cost-effective based on the provided inputs.'
        : 'Buying is more cost-effective based on the provided inputs.'
    );
  };

  const renderInputTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Common Parameters</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">
              Purchase Price ($)
            </label>
            <input
              type="number"
              id="purchasePrice"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="usefulLife" className="block text-sm font-medium text-gray-700">
              Useful Life (years)
            </label>
            <input
              type="number"
              id="usefulLife"
              name="usefulLife"
              value={formData.usefulLife}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
              Tax Rate (%)
            </label>
            <input
              type="number"
              id="taxRate"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="discountRate" className="block text-sm font-medium text-gray-700">
              Discount Rate (%)
            </label>
            <input
              type="number"
              id="discountRate"
              name="discountRate"
              value={formData.discountRate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Lease vs Buy Options</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="leaseTerm" className="block text-sm font-medium text-gray-700">
              Lease Term (years)
            </label>
            <input
              type="number"
              id="leaseTerm"
              name="leaseTerm"
              value={formData.leaseTerm}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="leasePayment" className="block text-sm font-medium text-gray-700">
              Lease Payment ($)
            </label>
            <input
              type="number"
              id="leasePayment"
              name="leasePayment"
              value={formData.leasePayment}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700">
              Down Payment ($)
            </label>
            <input
              type="number"
              id="downPayment"
              name="downPayment"
              value={formData.downPayment}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
              Interest Rate (%)
            </label>
            <input
              type="number"
              id="interestRate"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultsTab = () => (
    <div>
      <div className="bg-blue-50 rounded-lg p-6 text-center mb-6">
        <h3 className="text-xl font-medium text-blue-800 mb-2">Recommendation</h3>
        <p className="text-lg font-medium text-blue-900 mb-4">{recommendation}</p>
        
        {results.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lease Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buy Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NPV Lease
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NPV Buy
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.year}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${result.leaseCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${result.buyCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${result.npvLease.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${result.npvBuy.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Lease vs Buy Calculator</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab(0)}
              className={`${
                activeTab === 0 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Inputs
            </button>
            <button
              onClick={() => results.length > 0 && setActiveTab(1)}
              className={`${
                activeTab === 1 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${
                results.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              disabled={results.length === 0}
            >
              Results
            </button>
          </nav>
        </div>
        
        {activeTab === 0 ? renderInputTab() : renderResultsTab()}
        
        <div className="mt-8">
          <button
            onClick={calculateLeaseVsBuy}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaseVsBuyCalculator;
