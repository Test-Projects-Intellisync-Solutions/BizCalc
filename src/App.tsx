import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Menu } from 'lucide-react';

// UI Components
import { ThemeProvider } from '@/components/ui/UIComponents/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Navigation, MobileNavigation } from '@/components/ui/UIComponents/Navigation/Navigation';

// Pages
import DocsPage from '@/pages/DocsPage/DocsPage';
import CalculatorsPage from '@/pages/CalculatorsPage/CalculatorsPage';
import ToolsPage from '@/pages/ToolsPage/ToolsPage';

// Utils
// import { cn } from '@/lib/utils'; For Future Use

// Components
import Footer from '@/components/ui/UIComponents/Footer';
import Hero from '@/components/ui/UIComponents/Hero';
import Services from '@/components/ui/UIComponents/Services';
import ScrollToTop from '@/components/ui/UIComponents/ScrollToTop';
import { NavigationMenu } from '@radix-ui/react-navigation-menu';
// import CTA from '@/components/ui/UIComponents/CTA'; For Future Use
// import PricingPage from '@/components/pricing/PricingPage'; For Future Use

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  // Listen to URL hash changes
  useEffect(() => {
    const processHash = () => {
      const fullHash = window.location.hash.replace('#', '');
      // Define valid main tabs based on your TabsContent values.
      // 'pricing' is commented out in TabsContent, so exclude it unless active.
      const validMainTabs = ['home', 'calculators', 'tools', 'docs']; 
      
      if (fullHash) {
        const mainTab = fullHash.split(/[#?]/)[0]; // Extracts 'calculators' from 'calculators#startup' or 'docs' from 'docs?section=planning'
        if (validMainTabs.includes(mainTab)) {
          setActiveTab(mainTab);
        } else {
          // If the base part of the hash isn't a recognized main tab (e.g., 'unknown#details'),
          // or if the hash is like '#subtabonly' which doesn't match a main tab after splitting,
          // fall back to 'home'.
          setActiveTab('home');
        }
      } else { // No hash, or hash is just '#'
        setActiveTab('home');
      }
    };

    processHash(); // Process initial hash on component mount
    
    window.addEventListener('hashchange', processHash); // Process subsequent hash changes
    return () => window.removeEventListener('hashchange', processHash);
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
                <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
              </nav>
              {/* Mobile Navigation */}
              <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <MobileNavigation activeTab={activeTab} onTabChange={handleTabChange} />
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

              {/* Resources Tab */}
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