import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Menu, Home, Wrench, Book } from 'lucide-react';

// UI Components
import { ThemeProvider } from '@/components/ui/UIComponents/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';

// Pages
import DocsPage from '@/pages/DocsPage/DocsPage';
import CalculatorsPage from '@/pages/CalculatorsPage/CalculatorsPage';
import ToolsPage from '@/pages/ToolsPage/ToolsPage';

// Utils
import { cn } from '@/lib/utils';

// Components
import Footer from '@/components/ui/UIComponents/Footer';
import Hero from '@/components/ui/UIComponents/Hero';
import Services from '@/components/ui/UIComponents/Services';
import ScrollToTop from '@/components/ui/UIComponents/ScrollToTop';
// import CTA from '@/components/ui/UIComponents/CTA'; For Future Use
// import PricingPage from '@/components/pricing/PricingPage'; For Future Use

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
      <div className="min-h-screen bg-background">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-background/95 border-b backdrop-blur-lg px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Calculator className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">BusinessOne</h1>
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
                        <NavigationMenuLink className="transition-colors group-hover:underline">Home</NavigationMenuLink>
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
                        <NavigationMenuLink className="transition-colors group-hover:underline">Calculators</NavigationMenuLink>
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
                        <NavigationMenuLink className="transition-colors group-hover:underline">Tools</NavigationMenuLink>
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
                        <NavigationMenuLink className="transition-colors group-hover:underline">Docs</NavigationMenuLink>
                      </motion.button>
                    </NavigationMenuItem>
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
                    {/* Sign In Button - Temporarily disabled for future authentication implementation
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
                          <span className="transition-colors group-hover:underline group-hover:decoration-wavy">Sign In</span>
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
                      // Pricing link commented out for futre use.
                      */}
                      {/* CTA Button - Temporarily disabled for future implementation
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
                          <span className="transition-colors group-hover:underline">Sign In</span>
                        </Button>
                      </motion.div>
                      */}
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
                {/* God Tier Hero Section */}
                <Hero />
                {/* Animated Services Section */}
                <Services />
                {/* CTA - Commented out for future use. */}
                {/* <CTA /> */}
              </TabsContent>

              {/* Calculators Tab */}
              <TabsContent value="calculators" className="mt-6">
                <CalculatorsPage />
              </TabsContent>

              {/* Tools Tab */}
              <TabsContent value="tools" className="mt-6">
                <ToolsPage />
              </TabsContent>

              {/* Docs Tab */}
              <TabsContent value="docs" className="mt-6">
                <DocsPage />
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
    </ThemeProvider>
  );
}

export default App;