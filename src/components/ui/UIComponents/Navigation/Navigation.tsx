// src/components/Navigation/Navigation.tsx
import { Home, Calculator, Wrench, Book } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { id: 'calculators', label: 'Calculators', icon: <Calculator className="h-5 w-5" /> },
  { id: 'tools', label: 'Tools', icon: <Wrench className="h-5 w-5" /> },
  { id: 'docs', label: 'Resources', icon: <Book className="h-5 w-5" /> },
];

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item, index) => (
          <NavigationMenuItem key={item.id}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.05 * (index + 1), 
                type: 'spring', 
                stiffness: 260, 
                damping: 20 
              }}
              whileHover={{ scale: 1.07 }}
            >
              <NavigationMenuLink
                asChild
                active={activeTab === item.id}
                className={navigationMenuTriggerStyle()}
              >
                <Button
                  variant="ghost"
                  className="gap-2 group"
                  onClick={() => onTabChange(item.id)}
                >
                  <motion.span 
                    whileHover={{ color: '#6366f1', scale: 1.2 }} 
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {item.icon}
                  </motion.span>
                  {item.label}
                </Button>
              </NavigationMenuLink>
            </motion.div>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// Mobile Navigation Component
export function MobileNavigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="grid gap-2 w-full">
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`w-full text-left p-3 rounded-md flex items-center gap-2 ${
            activeTab === item.id ? 'bg-accent' : 'hover:bg-accent/50'
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {item.icon}
          {item.label}
        </motion.button>
      ))}
    </div>
  );
}