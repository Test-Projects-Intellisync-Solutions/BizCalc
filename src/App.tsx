import { useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Toaster } from '@/components/ui/sonner';
import { Calculator, Menu, Home, Wrench, Book } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import ScrollToTop from '@/components/ScrollToTop';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Layout Components
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Services from '@/components/Services';

// Lazy-loaded pages
const DocsPage = lazy(() => import('@/components/docs/DocsPage'));
const ToolsPage = lazy(() => import('@/components/QuickCalculators/calculators/ToolsPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiesPolicy = lazy(() => import('./pages/CookiesPolicy'));

// Lazy-loaded calculator components
const StartupCosts = lazy(() => import('@/components/startupCostsTab/SimpleStartupCosts'));
const BurnRate = lazy(() => import('@/components/startupCostsTab/BurnRate'));
const CashFlowTab = lazy(() => import('@/Calculators/cashflow'));
const ProjectionsTab = lazy(() => import('@/Calculators/revenue-expenses/RevenueExpenses'));
const ProfitabilityTab = lazy(() => import('@/Calculators/profitability'));
const RatiosTab = lazy(() => import('@/components/ratiosTab/RatiosTab'));

// Navigation Menu Component
const NavigationMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calculators', label: 'Calculators', icon: Calculator },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'docs', label: 'Docs', icon: Book },
  ];

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-4">
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => handleNavigation(item.id === 'home' ? '' : item.id)}
            className={`px-4 py-2 flex items-center gap-2 group ${location.pathname === `/${item.id}` || (location.pathname === '/' && item.id === 'home') ? 'text-primary' : ''}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.07 }}
          >
            <motion.span 
              whileHover={{ color: '#6366f1', scale: 1.2 }} 
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <item.icon className="h-5 w-5 transition-colors" />
            </motion.span>
            <span className="transition-colors group-hover:underline">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item.id === 'home' ? '' : item.id)}
                  className={`text-lg flex items-center gap-3 p-2 rounded-lg ${location.pathname === `/${item.id}` || (location.pathname === '/' && item.id === 'home') ? 'bg-accent' : 'hover:bg-accent/50'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

const LoadingFallback = () => (
  <div className="p-4 space-y-4">
    <Skeleton className="h-12 w-1/2 mx-auto" />
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-5/6" />
      <Skeleton className="h-10 w-4/5" />
      <Skeleton className="h-10 w-5/6" />
      <Skeleton className="h-10 w-4/5" />
    </div>
  </div>
);

// Main Layout Component
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 border-b backdrop-blur-lg px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calculator className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                BusinessOne
              </h1>
            </div>
            <NavigationMenu />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <ScrollToTop />
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

// Home Page Component
const HomePage = () => (
  <div className="space-y-12">
    <Hero />
    <Services />
  </div>
);

// Calculators Page Component
const CalculatorsPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Tabs defaultValue="startup" className="space-y-4">
        <TabsList className="flex overflow-x-auto hide-scrollbar p-1 gap-2">
          <TabsTrigger value="startup">Start-Up &amp; Costs</TabsTrigger>
          <TabsTrigger value="projections">Revenue &amp; Expenses</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="startup" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Suspense fallback={<LoadingFallback />}>
              <StartupCosts />
            </Suspense>
            <Suspense fallback={<LoadingFallback />}>
              <BurnRate />
            </Suspense>
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
    </Suspense>
  );
};

// Main App Component
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster position="top-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <MainLayout>
              <Suspense fallback={<LoadingFallback />}>
                <HomePage />
              </Suspense>
            </MainLayout>
          } />
          
          <Route path="/calculators" element={
            <MainLayout>
              <Suspense fallback={<LoadingFallback />}>
                <CalculatorsPage />
              </Suspense>
            </MainLayout>
          } />
          
          <Route path="/tools" element={
            <MainLayout>
              <Suspense fallback={<LoadingFallback />}>
                <ToolsPage />
              </Suspense>
            </MainLayout>
          } />
          
          <Route path="/docs" element={
            <MainLayout>
              <Suspense fallback={<LoadingFallback />}>
                <DocsPage />
              </Suspense>
            </MainLayout>
          } />
          
          {/* Legal Pages */}
          <Route path="/privacy" element={
            <MainLayout>
              <Suspense fallback={<LoadingFallback />}>
                <PrivacyPolicy />
              </Suspense>
            </MainLayout>
          } />
          
          <Route path="/terms" element={
            <MainLayout>
              <Suspense fallback={<LoadingFallback />}>
                <TermsOfService />
              </Suspense>
            </MainLayout>
          } />
          
          <Route path="/cookies" element={
            <MainLayout>
              <Suspense fallback={<LoadingFallback />}>
                <CookiesPolicy />
              </Suspense>
            </MainLayout>
          } />
          
          {/* 404 - Not Found */}
          <Route path="*" element={
            <MainLayout>
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl text-muted-foreground mb-6">Page not found</p>
                <Button onClick={() => window.location.href = '/'}>
                  Go back home
                </Button>
              </div>
            </MainLayout>
          } />
        </Routes>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;