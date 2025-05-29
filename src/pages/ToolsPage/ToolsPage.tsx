import { useState, lazy, Suspense } from 'react';
import { Calculator, DollarSign, TrendingDown, LineChart, PiggyBank, BarChart, ArrowDownUp, Scale, Building, PercentCircle, FileText, ClipboardList, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GuideCard from '@/components/ui/guide-card';
import { businessPlanningDocs } from '@/components/docs/content/business-planning';
import { MarkdownViewer } from '../DocsPage/MarkdownViewer';

// Lazy load tool components
const BurnRateCalculator = lazy(() => import('@/calculators/tools/financial/BurnRate/BurnRateCalculator'));
const LoanCalculator = lazy(() => import('@/calculators/tools/operations/Loan/LoanCalculator'));
const ValuationCalculator = lazy(() => import('@/calculators/tools/business/Valuation/ValuationCalculator'));
const RoiCalculator = lazy(() => import('@/calculators/tools/business/Roi/RoiCalculator'));
const SalaryCalculator = lazy(() => import('@/calculators/tools/operations/Salary/SalaryCalculator'));
const BreakEvenCalculator = lazy(() => import('@/calculators/tools/financial/BreakEven/BreakEvenCalculator'));
const CashFlowForecast = lazy(() => import('@/calculators/tools/operations/CashFlowForecast/CashFlowForecast'));
const LeaseVsBuyCalculator = lazy(() => import('@/calculators/tools/business/LeaseVsBuy/LeaseVsBuyCalculator'));
const ProfitMarginCalculator = lazy(() => import('@/calculators/tools/financial/ProfitMargin/ProfitMarginCalculator'));
const StartupCostTab = lazy(() => import('@/calculators/suite/startupcost/StartupCostTab'));

// Loading component for tools
const ToolLoading = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

const calculators = [
  // Financial Health
  {
    id: 'cash-flow',
    name: 'Cash Flow Forecast',
    description: 'Project your future cash position to identify potential shortfalls and ensure healthy liquidity.',
    icon: ArrowDownUp,
    component: CashFlowForecast,
  },
  {
    id: 'break-even',
    name: 'Break-Even Calculator',
    description: 'Determine how many units you need to sell to cover your costs and start making a profit.',
    icon: BarChart,
    component: BreakEvenCalculator,
  },
  {
    id: 'profit-margin',
    name: 'Profit Margin Calculator',
    description: 'Calculate gross, operating, and net profit margins to evaluate your business performance.',
    icon: PercentCircle,
    component: ProfitMarginCalculator,
  },
  {
    id: 'burn-rate',
    name: 'Burn Rate Calculator',
    description: 'Calculate how long your cash runway will last based on current expenses.',
    icon: TrendingDown,
    component: BurnRateCalculator,
  },
  
  // Business Planning
  {
    id: 'startup-costs',
    name: 'Startup Cost Estimator',
    description: 'Estimate initial business expenses and plan your funding needs.',
    icon: Building,
    component: StartupCostTab,
  },
  {
    id: 'valuation',
    name: 'Business Valuation',
    description: 'Get a quick estimate of your business value using industry multiples.',
    icon: LineChart,
    component: ValuationCalculator,
  },
  {
    id: 'roi',
    name: 'ROI Calculator',
    description: 'Calculate return on investment for business decisions.',
    icon: PiggyBank,
    component: RoiCalculator,
  },
  
  // Operations
  {
    id: 'salary',
    name: 'Salary vs. Dividend Planner',
    description: 'Optimize your income split between salary and dividends.',
    icon: Calculator,
    component: SalaryCalculator,
  },
  {
    id: 'lease-vs-buy',
    name: 'Lease vs. Buy Calculator',
    description: 'Compare the financial impact of leasing equipment versus purchasing it outright.',
    icon: Scale,
    component: LeaseVsBuyCalculator,
  },
  {
    id: 'loan',
    name: 'Loan Repayment Planner',
    description: 'Plan loan payments and view complete amortization schedules.',
    icon: DollarSign,
    component: LoanCalculator,
  },
];

const documents = businessPlanningDocs.map(doc => ({
  id: doc.id,
  name: doc.label,
  description: doc.content.split('\n')[0].replace('# ', ''),
  icon: ClipboardList,
  content: doc.content
}));

type Tool = typeof calculators[number];
type Document = typeof documents[number];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState('calculators');
  const [selectedItem, setSelectedItem] = useState<Tool | Document | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      <GuideCard
        title="Financial Tools Guide"
        steps={[
          {
            title: "Choose a Tool",
            description: "Select from our collection of specialized financial calculators and planning documents"
          },
          {
            title: "Enter Your Data",
            description: "Provide the required information for your calculation or review planning templates"
          },
          {
            title: "Get Results",
            description: "View instant results with clear explanations and insights"
          },
          {
            title: "Save or Export",
            description: "Save your calculations or export detailed reports"
          }
        ]}
        interpretations={[
          {
            title: "Real-Time Updates",
            description: "All calculations update instantly as you adjust inputs"
          },
          {
            title: "Context-Aware",
            description: "Results include industry benchmarks and recommendations"
          },
          {
            title: "Data Privacy",
            description: "All calculations are performed locally in your browser"
          }
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calculators">Calculators</TabsTrigger>
          <TabsTrigger value="documents">Planning Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="calculators">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {calculators.map((tool) => (
              <Card key={tool.id} className="relative group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{tool.name}</CardTitle>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      setSelectedItem(tool);
                      setIsSheetOpen(true);
                    }}
                  >
                    Launch Calculator
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="relative group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{doc.name}</CardTitle>
                  </div>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      setSelectedItem(doc);
                      setIsSheetOpen(true);
                    }}
                  >
                    View Document
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Single Sheet for all tools and documents */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl flex flex-col h-full">
          {selectedItem && (
            <>
              <SheetHeader className="flex-shrink-0">
                <SheetTitle>{selectedItem.name}</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto mt-6 pr-6">
                {'component' in selectedItem ? (
                  <Suspense fallback={<ToolLoading />}>
                    <selectedItem.component />
                  </Suspense>
                ) : 'content' in selectedItem ? (
                  <MarkdownViewer content={selectedItem.content} />
                ) : null}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}