import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StartupCostEstimator from '@/calculators/suite/startup/StartupCostEstimator/StartupCostEstimator';
import BurnRate from '@/calculators/suite/startup/BurnRate/BurnRate';
import ProjectionsTab from '@/calculators/suite/projections/ProjectionsTab';
import CashFlowTab from '@/calculators/suite/cashflow/CashFlowTab';
import ProfitabilityTab from '@/calculators/suite/profitability/ProfitabilityTab';
import RatiosTab from '@/calculators/suite/ratios/RatiosTab';

const CalculatorsPage = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Business Calculators</h1>
      <Tabs defaultValue="startup" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="startup">Start-up & Costs</TabsTrigger>
          <TabsTrigger value="projections">Revenue & Expenses</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="startup" className="space-y-6">
          <div className="grid gap-6">
            <StartupCostEstimator />
            <BurnRate />
          </div>
        </TabsContent>
        
        <TabsContent value="projections" className="space-y-6">
          <ProjectionsTab />
        </TabsContent>
        
        <TabsContent value="cashflow" className="space-y-6">
          <CashFlowTab />
        </TabsContent>
        
        <TabsContent value="profitability" className="space-y-6">
          <ProfitabilityTab />
        </TabsContent>
        
        <TabsContent value="ratios" className="space-y-6">
          <RatiosTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalculatorsPage;
