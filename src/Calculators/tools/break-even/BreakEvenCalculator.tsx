import React, { useState } from 'react';

interface BreakEvenData {
  fixedCosts: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
}

const BreakEvenCalculator: React.FC = () => {
  const [formData, setFormData] = useState<BreakEvenData>({
    fixedCosts: 0,
    variableCostPerUnit: 0,
    pricePerUnit: 0,
  });
  
  const [breakEvenPoint, setBreakEvenPoint] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const calculateBreakEven = () => {
    const { fixedCosts, variableCostPerUnit, pricePerUnit } = formData;
    if (pricePerUnit <= variableCostPerUnit) {
      alert('Price per unit must be greater than variable cost per unit');
      return;
    }
    const bep = fixedCosts / (pricePerUnit - variableCostPerUnit);
    setBreakEvenPoint(bep);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Break-Even Point Calculator</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="fixedCosts" className="block text-sm font-medium text-gray-700">
              Fixed Costs ($)
            </label>
            <input
              id="fixedCosts"
              name="fixedCosts"
              type="number"
              min="0"
              step="0.01"
              value={formData.fixedCosts || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="variableCostPerUnit" className="block text-sm font-medium text-gray-700">
              Variable Cost per Unit ($)
            </label>
            <input
              id="variableCostPerUnit"
              name="variableCostPerUnit"
              type="number"
              min="0"
              step="0.01"
              value={formData.variableCostPerUnit || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700">
              Price per Unit ($)
            </label>
            <input
              id="pricePerUnit"
              name="pricePerUnit"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.pricePerUnit || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={calculateBreakEven}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Calculate Break-Even Point
          </button>
        </div>

        {breakEvenPoint !== null && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Break-Even Point</h3>
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-800 mb-2">
                {breakEvenPoint.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} units
              </div>
              <p className="text-blue-700">
                You need to sell {breakEvenPoint.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} units to break even.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakEvenCalculator;
