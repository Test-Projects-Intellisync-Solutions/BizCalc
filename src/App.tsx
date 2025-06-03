import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Layout
import AppLayout from './AppLayout'; 

// UI Components
import { Tabs, TabsContent } from '@/components/ui/tabs';

// Page Components (Main App)
const DocsPage = lazy(() => import('@/pages/DocsPage/DocsPage'));
const CalculatorsPage = lazy(() => import('@/pages/CalculatorsPage/CalculatorsPage'));
const ToolsPage = lazy(() => import('@/pages/ToolsPage/ToolsPage'));
import Hero from '@/components/ui/UIComponents/Hero';
import Services from '@/components/ui/UIComponents/Services';
import ScrollToTop from '@/components/ui/UIComponents/ScrollToTop';

// Policy Pages (Lazy Loaded)
const PrivacyPolicy = lazy(() => import('@/pages/policies/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/policies/TermsOfService'));
const CookiesPolicy = lazy(() => import('@/pages/policies/CookiesPolicy'));

// Loading component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"> 
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

interface MainAppProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

// MainApp component to encapsulate tab-based navigation content
function MainApp({ currentTab, onTabChange }: MainAppProps) {
  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8">
      <ScrollToTop />
      <Tabs
        value={currentTab} 
        onValueChange={onTabChange} 
        className="space-y-8"
      >
        {/* Home Tab */}
        <TabsContent value="home" className="space-y-12">
          <Hero />
          <Services />
        </TabsContent>

        {/* Calculators Tab */}
        <TabsContent value="calculators">
          <Suspense fallback={<PageLoading />}>
            <CalculatorsPage />
          </Suspense>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools">
          <Suspense fallback={<PageLoading />}>
            <ToolsPage />
          </Suspense>
        </TabsContent>

        {/* Docs Tab */}
        <TabsContent value="docs">
          <Suspense fallback={<PageLoading />}>
            <DocsPage />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'home';
    const validTabs = ['home', 'calculators', 'tools', 'docs'];
    if (validTabs.includes(path)) {
      setActiveTab(path);
    } else {
      if (!['privacy-policy', 'terms', 'cookies'].includes(path)) {
      }
    }
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    navigate(`/${tab}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <AppLayout
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route index element={<Navigate to="/home" replace />} /> 
          <Route path="/home" element={<MainApp currentTab="home" onTabChange={handleTabChange} />} />
          <Route path="/calculators/*" element={<MainApp currentTab="calculators" onTabChange={handleTabChange} />} />
          <Route path="/tools/*" element={<MainApp currentTab="tools" onTabChange={handleTabChange} />} />
          <Route path="/docs/*" element={<MainApp currentTab="docs" onTabChange={handleTabChange} />} />
          
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiesPolicy />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}

export default App;