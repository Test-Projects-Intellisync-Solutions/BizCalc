import React, { useState } from 'react';

interface BurnRateData {
  startingBalance: number;
  endingBalance: number;
  timePeriod: number; // in months
}

const BurnRateCalculator: React.FC = () => {
  const [formData, setFormData] = useState<BurnRateData>({
    startingBalance: 0,
    endingBalance: 0,
    timePeriod: 1,
  });
  
  const [burnRate, setBurnRate] = useState<number | null>(null);
  const [runway, setRunway] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const calculateBurnRate = () => {
    const { startingBalance, endingBalance, timePeriod } = formData;
    const totalBurn = startingBalance - endingBalance;
    const monthlyBurn = totalBurn / timePeriod;
    
    setBurnRate(monthlyBurn);
    setRunway(endingBalance / monthlyBurn);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Burn Rate Calculator</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="startingBalance" className="block text-sm font-medium text-gray-700">
              Starting Balance ($)
            </label>
            <input
              id="startingBalance"
              name="startingBalance"
              type="number"
              min="0"
              step="0.01"
              value={formData.startingBalance || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="endingBalance" className="block text-sm font-medium text-gray-700">
              Ending Balance ($)
            </label>
            <input
              id="endingBalance"
              name="endingBalance"
              type="number"
              min="0"
              step="0.01"
              value={formData.endingBalance || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700">
              Time Period (months)
            </label>
            <input
              id="timePeriod"
              name="timePeriod"
              type="number"
              min="1"
              step="1"
              value={formData.timePeriod || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={calculateBurnRate}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Calculate Burn Rate
          </button>
        </div>

        {(burnRate !== null && runway !== null) && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Burn Rate Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h4 className="text-lg font-medium text-blue-800 mb-2">Monthly Burn Rate</h4>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ${Math.abs(burnRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-blue-700">
                  {burnRate >= 0 ? 'You are burning' : 'You are adding'} ${Math.abs(burnRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per month
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <h4 className="text-lg font-medium text-green-800 mb-2">Runway</h4>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {runway.toFixed(1)} months
                </div>
                <p className="text-green-700">
                  At current burn rate, your funds will last until {new Date(Date.now() + (runway * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BurnRateCalculator;
