import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ui/UIComponents/theme-provider';
import Footer from '@/components/ui/UIComponents/Footer';
import { Calculator, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Navigation, MobileNavigation } from '@/components/ui/UIComponents/Navigation/Navigation';

interface AppLayoutProps {
  children?: React.ReactNode;
  activeTab: string;
  handleTabChange: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function AppLayout({ 
  children, 
  activeTab, 
  handleTabChange, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}: AppLayoutProps) {
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
          {children || <Outlet />}
          <Footer />
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
