import { useState, useEffect, Suspense, lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

// Lazy load calculator components
const StartupCostTab = lazy(() => import('@/calculators/suite/startupcost/StartupCostTab'));
const BurnRate = lazy(() => import('@/calculators/suite/startup/BurnRate/BurnRate'));
const ProjectionsTab = lazy(() => import('@/calculators/suite/projections/ProjectionsTab'));
const CashFlowTab = lazy(() => import('@/calculators/suite/cashflow/CashFlowTab'));
const ProfitabilityTab = lazy(() => import('@/calculators/suite/profitability/ProfitabilityTab'));
const RatiosTab = lazy(() => import('@/calculators/suite/ratios/RatiosTab'));

// Loading component for calculator tabs
const CalculatorLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

const CalculatorsPage = () => {
  // Default to 'startup' tab if no hash is present
  const [activeTab, setActiveTab] = useState(() => {
    // Check URL hash on initial load
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('calculators#')) {
      const tab = hash.split('#')[1];
      if (['startup', 'projections', 'cashflow', 'profitability', 'ratios'].includes(tab)) {
        return tab;
      }
    }
    return 'startup';
  });

  // Handle tab changes from URL or service cards
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without causing a page reload
    const newUrl = `${window.location.pathname}#${value}`;
    window.history.pushState({}, '', newUrl);
  };

  // Handle browser back/forward navigation and tab changes from Services
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== activeTab) {
        setActiveTab(hash);
      }
    };

    // Handle tab changes from Services component
    const handleTabChange = (e: CustomEvent) => {
      const tab = e.detail;
      if (tab && tab !== activeTab) {
        setActiveTab(tab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('tabChange', handleTabChange as EventListener);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('tabChange', handleTabChange as EventListener);
    };
  }, [activeTab]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[hsl(var(--gradient-heading-start))] to-[hsl(var(--gradient-heading-end))] bg-clip-text text-transparent">
          Business Calculators
        </h1>
        <p className="text-muted-foreground mt-2">Powerful tools to analyze and optimize your business finances</p>
      </div>
      <Tabs 
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6 gap-2 p-1 bg-muted/20 rounded-lg">
          <TabsTrigger 
            value="startup"
            className="font-semibold data-[state=active]:bg-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--gradient-heading-start))] data-[state=active]:to-[hsl(var(--gradient-heading-end))] data-[state=active]:bg-clip-text data-[state=active]:text-transparent data-[state=active]:shadow-sm transition-all hover:bg-muted/50"
          >
            Start-up & Costs
          </TabsTrigger>
          <TabsTrigger 
            value="projections"
            className="font-semibold data-[state=active]:bg-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--gradient-heading-start))] data-[state=active]:to-[hsl(var(--gradient-heading-end))] data-[state=active]:bg-clip-text data-[state=active]:text-transparent data-[state=active]:shadow-sm transition-all hover:bg-muted/50"
          >
            Revenue & Expenses
          </TabsTrigger>
          <TabsTrigger 
            value="cashflow"
            className="font-semibold data-[state=active]:bg-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--gradient-heading-start))] data-[state=active]:to-[hsl(var(--gradient-heading-end))] data-[state=active]:bg-clip-text data-[state=active]:text-transparent data-[state=active]:shadow-sm transition-all hover:bg-muted/50"
          >
            Cash Flow
          </TabsTrigger>
          <TabsTrigger 
            value="profitability"
            className="font-semibold data-[state=active]:bg-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--gradient-heading-start))] data-[state=active]:to-[hsl(var(--gradient-heading-end))] data-[state=active]:bg-clip-text data-[state=active]:text-transparent data-[state=active]:shadow-sm transition-all hover:bg-muted/50"
          >
            Profitability
          </TabsTrigger>
          <TabsTrigger 
            value="ratios"
            className="font-semibold data-[state=active]:bg-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(var(--gradient-heading-start))] data-[state=active]:to-[hsl(var(--gradient-heading-end))] data-[state=active]:bg-clip-text data-[state=active]:text-transparent data-[state=active]:shadow-sm transition-all hover:bg-muted/50"
          >
            Financial Ratios
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="startup" className="space-y-6">
          <Suspense fallback={<CalculatorLoading />}>
            <div className="grid gap-6">
              <StartupCostTab />
              <BurnRate />
            </div>
          </Suspense>
        </TabsContent>
        
        <TabsContent value="projections" className="space-y-6">
          <Suspense fallback={<CalculatorLoading />}>
            <ProjectionsTab />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="cashflow" className="space-y-6">
          <Suspense fallback={<CalculatorLoading />}>
            <CashFlowTab />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="profitability" className="space-y-6">
          <Suspense fallback={<CalculatorLoading />}>
            <ProfitabilityTab />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="ratios" className="space-y-6">
          <Suspense fallback={<CalculatorLoading />}>
            <RatiosTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalculatorsPage;
