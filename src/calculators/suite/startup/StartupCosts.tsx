import StartupCostEstimator from '@/calculators/tools/operations/StartupCost/StartupCostEstimator';

interface CostCategory {
  name: string;
  amount: number;
}

export default function StartupCosts() {
  return <StartupCostEstimator />;
}