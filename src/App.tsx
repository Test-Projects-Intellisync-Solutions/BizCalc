import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Toaster } from '@/components/ui/sonner';
import { Calculator, Menu, Home, Wrench, Book, LogIn } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { Routes, Route } from 'react-router-dom';

// Lazy-loaded components
const DocsPage = lazy(() => import('@/components/docs/DocsPage'));
const ToolsPage = lazy(() => import('@/components/tools/ToolsPage'));
const StartupCosts = lazy(() => import('@/components/startupCostsTab/StartupCosts'));
const BurnRate = lazy(() => import('@/components/startupCostsTab/BurnRate'));
const CashFlowTab = lazy(() => import('@/components/cashflowTab/CashFlowTab'));
const ProjectionsTab = lazy(() => import('@/components/revenueExpensesTab/ProjectionsTab'));
const ProfitabilityTab = lazy(() => import('@/components/profitabilityTab/ProfitabilityTab'));
const RatiosTab = lazy(() => import('@/components/ratiosTab/RatiosTab'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiesPolicy = lazy(() => import('./pages/CookiesPolicy'));
// const PricingPage = lazy(() => import('@/components/pricing/PricingPage')); // For Future Use
import { motion } from 'framer-motion';
// import CTA from '@/components/CTA'; // For Future Use
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import ScrollToTop from '@/components/ScrollToTop';
import { Skeleton } from '@/components/ui/skeleton';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Listen to URL hash changes to update the active tab
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) setActiveTab(hash);
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash) setActiveTab(newHash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Routes>
            <Route path="privacy" element={<><Suspense fallback={<div className="p-8"><Skeleton className="h-[600px] w-full rounded-lg" /></div>}><PrivacyPolicy /></Suspense><Footer /></>} />
            <Route path="terms" element={<><Suspense fallback={<div className="p-8"><Skeleton className="h-[600px] w-full rounded-lg" /></div>}><TermsOfService /></Suspense><Footer /></>} />
            <Route path="cookies" element={<><Suspense fallback={<div className="p-8"><Skeleton className="h-[600px] w-full rounded-lg" /></div>}><CookiesPolicy /></Suspense><Footer /></>} />
            <Route
              path="*"
              element={
                <>
                  <div className="min-h-screen bg-background">
                    <div className="flex flex-col min-h-screen">
                    {/* Header */}
                    <header className="sticky top-0 z-50 bg-background/95 border-b backdrop-blur-lg px-4 py-3 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Calculator className="h-8 w-8 text-primary" />
                          <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">BusinessOne</h1>
                        </div>
                        {/* Desktop Navigation */}
                        <nav className="hidden md:block">
                          <NavigationMenu>
                            <NavigationMenuList>
                              {/* Animated Desktop Navigation Links */}
                              <NavigationMenuItem asChild>
                                <motion.button
                                  className="px-4 py-2 flex items-center gap-2 group hover:text-primary"
                                  onClick={() => {
                                    window.location.hash = 'home';
                                    setActiveTab('home');
                                  }}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.05, type: 'spring', stiffness: 260, damping: 20 }}
                                  whileHover={{ scale: 1.07 }}
                                >
                                  <motion.span whileHover={{ color: '#6366f1', scale: 1.2 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <Home className="h-5 w-5 transition-colors" />
                                  </motion.span>
                                  <NavigationMenuLink className="transition-colors group-hover:underline"></NavigationMenuLink>
                                </motion.button>
                              </NavigationMenuItem>
                              <NavigationMenuItem asChild>
                                <motion.button
                                  className="px-4 py-2 flex items-center gap-2 group hover:text-primary"
                                  onClick={() => {
                                    window.location.hash = 'calculators';
                                    setActiveTab('calculators');
                                  }}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.10, type: 'spring', stiffness: 260, damping: 20 }}
                                  whileHover={{ scale: 1.07 }}
                                >
                                  <motion.span whileHover={{ color: '#6366f1', scale: 1.2 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <Calculator className="h-5 w-5 transition-colors" />
                                  </motion.span>
                                  <NavigationMenuLink className="transition-colors group-hover:underline"></NavigationMenuLink>
                                </motion.button>
                              </NavigationMenuItem>
                              <NavigationMenuItem asChild>
                                <motion.button
                                  className="px-4 py-2 flex items-center gap-2 group hover:text-primary"
                                  onClick={() => {
                                    window.location.hash = 'tools';
                                    setActiveTab('tools');
                                  }}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
                                  whileHover={{ scale: 1.07 }}
                                >
                                  <motion.span whileHover={{ color: '#6366f1', scale: 1.2 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <Wrench className="h-5 w-5 transition-colors" />
                                  </motion.span>
                                  <NavigationMenuLink className="transition-colors group-hover:underline"></NavigationMenuLink>
                                </motion.button>
                              </NavigationMenuItem>
                              <NavigationMenuItem asChild>
                                <motion.button
                                  className="px-4 py-2 flex items-center gap-2 group hover:text-primary"
                                  onClick={() => {
                                    window.location.hash = 'docs';
                                    setActiveTab('docs');
                                  }}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.20, type: 'spring', stiffness: 260, damping: 20 }}
                                  whileHover={{ scale: 1.07 }}
                                >
                                  <motion.span whileHover={{ color: '#6366f1', scale: 1.2 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <Book className="h-5 w-5 transition-colors" />
                                  </motion.span>
                                  <NavigationMenuLink className="transition-colors group-hover:underline"></NavigationMenuLink>
                                </motion.button>
                              </NavigationMenuItem>

                    
                    {/*--- Pricing and Sign-In Buttons are commented out for future use ---*/}
                    {/*
                    <NavigationMenuItem asChild>
                      <button
                        className="px-4 py-2 hover:text-primary"
                        onClick={() => {
                          window.location.hash = 'pricing';
                          setActiveTab('pricing');
                        }}
                      >
                        <NavigationMenuLink>Pricing</NavigationMenuLink>
                      </button>
                    </NavigationMenuItem>
                    // Pricing link commented out for testing
                    */}

                    
                    {/* Sign In Button - For Future Use
                    <NavigationMenuItem>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 20 }}
                        whileHover={{ scale: 1.07 }}
                      >
                        <Button variant="outline" className="flex items-center gap-2 group">
                          <motion.span whileHover={{ color: '#6366f1', scale: 1.2 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <LogIn className="h-5 w-5 transition-colors" />
                          </motion.span>
                          <span className="transition-colors group-hover:underline">Sign In</span>
                        </Button>
                      </motion.div>
                    </NavigationMenuItem>
                    */}


                  </NavigationMenuList>
                </NavigationMenu>
              </nav>
              {/* Mobile Navigation */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <nav className="flex flex-col space-y-4">
                      <motion.button
                        onClick={() => {
                          window.location.hash = 'home';
                          setActiveTab('home');
                        }}
                        className="text-lg hover:text-primary text-left flex items-center gap-2 group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05, type: 'spring', stiffness: 260, damping: 20 }}
                        whileHover={{ scale: 1.07 }}
                      >
                        <motion.span whileHover={{ color: '#6366f1', scale: 1.2 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Home className="h-5 w-5 transition-colors" />
                        </motion.span>
                        Home
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          window.location.hash = 'calculators';
                          setActiveTab('calculators');
                        }}
                        className="text-lg hover:text-primary text-left flex items-center gap-2 group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.10, type: 'spring', stiffness: 260, damping: 20 }}
                        whileHover={{ scale: 1.07 }}
                      >
                        <motion.span whileHover={{ color: '#6366f1', scale: 1.2 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Calculator className="h-5 w-5 transition-colors" />
                        </motion.span>
                        Calculators
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          window.location.hash = 'tools';
                          setActiveTab('tools');
                        }}
                        className="text-lg hover:text-primary text-left flex items-center gap-2 group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
                        whileHover={{ scale: 1.07 }}
                      >
                        <motion.span whileHover={{ color: '#6366f1', scale: 1.2 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Wrench className="h-5 w-5 transition-colors" />
                        </motion.span>
                        Tools
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          window.location.hash = 'docs';
                          setActiveTab('docs');
                        }}
                        className="text-lg hover:text-primary text-left flex items-center gap-2 group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.20, type: 'spring', stiffness: 260, damping: 20 }}
                        whileHover={{ scale: 1.07 }}
                      >
                        <motion.span whileHover={{ color: '#6366f1', scale: 1.2 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Book className="h-5 w-5 transition-colors" />
                        </motion.span>
                        Docs
                      </motion.button>

                      
                      // --- Pricing and Sign-In Buttons are commented out for future use ---
                      {/*
                      <button
                        onClick={() => {
                          window.location.hash = 'pricing';
                          setActiveTab('pricing');
                        }}
                        className="text-lg hover:text-primary text-left"
                      >
                        Pricing
                      </button>
                      // Pricing link commented out for testing
                      */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 20 }}
                        whileHover={{ scale: 1.07 }}
                      >
                        <Button className="flex items-center gap-2 group">
                          <motion.span whileHover={{ color: '#6366f1', scale: 1.2 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <LogIn className="h-5 w-5 transition-colors" />
                          </motion.span>
                          <span className="transition-colors group-hover:underline group-hover:decoration-wavy">Sign In</span>
                        </Button>
                      </motion.div>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </header>


          <main className="flex-1 p-4 sm:p-6 md:p-8">
            <ScrollToTop />
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                window.location.hash = value;
                setActiveTab(value);
              }}
              className="space-y-8"
            >
              {/* Home Tab */}
              <TabsContent value="home" className="space-y-12">
                {/* Hero Section */}
                <Hero />
                {/* Animated Services Section */}
                <Services />
                {/* Magical CTA - for future use*/}
                {/* <CTA /> */} 

              </TabsContent>

              {/* Calculators Tab */}
              <TabsContent value="calculators" className="mt-6">
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
                      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
                        <StartupCosts />
                      </Suspense>
                      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
                        <BurnRate />
                      </Suspense>
                    </div>
                  </TabsContent>
                  <TabsContent value="projections" className="space-y-6">
                    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-lg" />}>
                      <ProjectionsTab />
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="cashflow" className="space-y-6">
                    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-lg" />}>
                      <CashFlowTab />
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="profitability" className="space-y-6">
                    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-lg" />}>
                      <ProfitabilityTab />
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="ratios" className="space-y-6">
                    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-lg" />}>
                      <RatiosTab />
                    </Suspense>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* Tools Tab */}
              <TabsContent value="tools" className="mt-6">
                <Suspense fallback={<div className="p-8"><Skeleton className="h-[600px] w-full rounded-lg" /></div>}>
                  <ToolsPage />
                </Suspense>
              </TabsContent>

              {/* Docs Tab */}
              <TabsContent value="docs" className="mt-6">
                <Suspense fallback={<div className="p-8"><Skeleton className="h-[600px] w-full rounded-lg" /></div>}>
                  <DocsPage />
                </Suspense>
              </TabsContent>
              
              {/*
              // Pricing Tab (commented out for testing)
              <TabsContent value="pricing" className="mt-6">
                <PricingPage />
              </TabsContent>
              */}
            </Tabs>
          </main>

          {/* Footer */}
          <Footer />
                    </div>
                  </div>
                  <Toaster />
                </>
              }
            />
          </Routes>
        </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;