import StartupCostEstimator from '@/components/tools/calculators/StartupCostEstimator';

interface CostCategory {
  name: string;
  amount: number;
}

export default function StartupCosts() {
  return <StartupCostEstimator />;
}