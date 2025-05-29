import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, PlusCircle, Info, MessageSquareText } from 'lucide-react';
import { 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Cell,
  Tooltip as RechartsTooltip, // Alias to avoid conflict with shadcn/ui Tooltip
} from 'recharts';

import { ImportExport } from '@/components/ui/UIComponents/ImportExport';
import { businessTypes, type BusinessType } from '@/data/businessTypes';
import { Progress } from '@/components/ui/progress';
import { allFeedbackRules, type FeedbackItem, type CalculatorType } from '../../../data/feedbackRules';
import { generateFeedback } from '../../../utils/feedbackUtils';
import { FeedbackDrawer } from '../../../components/feedback/FeedbackDrawer';

interface CostItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  isOneTime: boolean;
}

export default function StartupCostTab() {
  const [businessType, setBusinessType] = useState<string>('retail');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isFeedbackDrawerOpen, setIsFeedbackDrawerOpen] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [items, setItems] = useState<CostItem[]>([
    { id: 'startup1', name: 'Business Registration', amount: 0, category: 'Legal', isOneTime: true },
    { id: 'startup2', name: 'Equipment', amount: 0, category: 'Equipment', isOneTime: true },
    { id: 'startup3', name: 'Rent Deposit', amount: 0, category: 'Facilities', isOneTime: true },
    { id: 'startup4', name: 'Initial Inventory', amount: 0, category: 'Inventory', isOneTime: true },
    { id: 'startup5', name: 'Website', amount: 0, category: 'Marketing', isOneTime: true },
    { id: 'startup6', name: 'Rent', amount: 0, category: 'Facilities', isOneTime: false },
    { id: 'startup7', name: 'Utilities', amount: 0, category: 'Facilities', isOneTime: false },
    { id: 'startup8', name: 'Insurance', amount: 0, category: 'Insurance', isOneTime: false },
    { id: 'startup9', name: 'Marketing', amount: 0, category: 'Marketing', isOneTime: false },
    { id: 'startup10', name: 'Employee Salaries', amount: 0, category: 'Staffing', isOneTime: false },
  ]);

  const handleGetFeedback = () => {
    const selectedBizTypeData = businessTypes.find(bt => bt.value === businessType);
    
    const oneTime = items.filter(item => item.isOneTime).reduce((sum, item) => sum + item.amount, 0);
    const monthly = items.filter(item => !item.isOneTime).reduce((sum, item) => sum + item.amount, 0);
    const sixMonthOp = oneTime + (monthly * 6);

    const costsByCategory: Record<string, number> = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);

    const calculatorData: Record<string, any> = {
      totalOneTimeCosts: oneTime,
      totalMonthlyCosts: monthly,
      sixMonthOperating: sixMonthOp,
      totalStartupCosts: sixMonthOp, // Using sixMonthOp as the main "total startup cost"
      numberOfCostItems: items.length,
      costsByCategory: costsByCategory,
    };

    const filteredCalculatorData = Object.entries(calculatorData)
      .filter(([_, value]) => value !== undefined && !isNaN(Number(value)))
      .reduce((obj, [key, value]) => {
        obj[key] = Number(value);
        return obj;
      }, {} as Record<string, number | string>);

    const generatedItems = generateFeedback(
      filteredCalculatorData,
      selectedBizTypeData,
      'startupCosts' as CalculatorType,
      allFeedbackRules
    );
    setFeedbackItems(generatedItems);
    setIsFeedbackDrawerOpen(true);
  };

  const getSummaryCardClassName = (metricName: string, defaultClasses: string): string => {
    const relevantFeedback = feedbackItems.find(
      fb => fb.uiTarget?.scope === 'summaryMetric' && fb.uiTarget?.identifier === metricName
    );
    const severity = relevantFeedback?.severity;
    if (severity) {
      switch (severity) {
        case 'critical': return 'p-4 border-l-4 border-destructive bg-destructive bg-opacity-10';
        case 'warning': return 'p-4 border-l-4 border-yellow-400 bg-yellow-400 bg-opacity-10';
        case 'info': return 'p-4 border-l-4 border-blue-400 bg-blue-400 bg-opacity-10';
        case 'good': return 'p-4 border-l-4 border-green-400 bg-green-400 bg-opacity-10';
        default: return defaultClasses;
      }
    }
    return defaultClasses;
  };

  // Calculate completion percentage based on number of items with a non-zero amount
  useEffect(() => {
    if (items.length === 0) {
      setCompletionPercentage(0);
      return;
    }
    const filledItems = items.filter(item => item.amount > 0).length;
    const totalItems = items.length;
    const percentage = totalItems > 0 ? (filledItems / totalItems) * 100 : 0;
    setCompletionPercentage(Math.round(percentage));
  }, [items]);

  const handleItemChange = (id: string, field: keyof CostItem, value: any) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : item
      )
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: 'New Item',
        amount: 0,
        category: 'Other',
        isOneTime: true
      }
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items => items.filter(item => item.id !== id));
  };

  const applyTemplate = (type: string) => {
    let templateItems: CostItem[] = [];
    
    switch(type) {
      case 'retail':
        templateItems = [
          { id: 'retail1', name: 'Business Registration', amount: 500, category: 'Legal', isOneTime: true },
          { id: 'retail2', name: 'Store Equipment', amount: 15000, category: 'Equipment', isOneTime: true },
          { id: 'retail3', name: 'Rent Deposit', amount: 5000, category: 'Facilities', isOneTime: true },
          { id: 'retail4', name: 'Initial Inventory', amount: 25000, category: 'Inventory', isOneTime: true },
          { id: 'retail5', name: 'Store Fixtures', amount: 8000, category: 'Equipment', isOneTime: true },
          { id: 'retail6', name: 'Point of Sale System', amount: 3000, category: 'Equipment', isOneTime: true },
          { id: 'retail7', name: 'Signage', amount: 2500, category: 'Marketing', isOneTime: true },
          { id: 'retail8', name: 'Website', amount: 2000, category: 'Marketing', isOneTime: true },
          { id: 'retail9', name: 'Monthly Rent', amount: 2500, category: 'Facilities', isOneTime: false },
          { id: 'retail10', name: 'Utilities', amount: 500, category: 'Facilities', isOneTime: false },
          { id: 'retail11', name: 'Insurance', amount: 400, category: 'Insurance', isOneTime: false },
          { id: 'retail12', name: 'Marketing', amount: 1500, category: 'Marketing', isOneTime: false },
          { id: 'retail13', name: 'Employee Salaries', amount: 8000, category: 'Staffing', isOneTime: false },
        ];
        break;
      case 'service':
        templateItems = [
          { id: 'service1', name: 'Business Registration', amount: 500, category: 'Legal', isOneTime: true },
          { id: 'service2', name: 'Office Equipment', amount: 5000, category: 'Equipment', isOneTime: true },
          { id: 'service3', name: 'Security Deposit', amount: 2000, category: 'Facilities', isOneTime: true },
          { id: 'service4', name: 'Software & Licenses', amount: 3000, category: 'Equipment', isOneTime: true },
          { id: 'service5', name: 'Website', amount: 3000, category: 'Marketing', isOneTime: true },
          { id: 'service6', name: 'Professional Certifications', amount: 1500, category: 'Legal', isOneTime: true },
          { id: 'service7', name: 'Monthly Rent', amount: 1500, category: 'Facilities', isOneTime: false },
          { id: 'service8', name: 'Utilities', amount: 300, category: 'Facilities', isOneTime: false },
          { id: 'service9', name: 'Insurance', amount: 350, category: 'Insurance', isOneTime: false },
          { id: 'service10', name: 'Marketing', amount: 1000, category: 'Marketing', isOneTime: false },
          { id: 'service11', name: 'Employee Salaries', amount: 6000, category: 'Staffing', isOneTime: false },
        ];
        break;
      case 'online':
        templateItems = [
          { id: 'online1', name: 'Business Registration', amount: 500, category: 'Legal', isOneTime: true },
          { id: 'online2', name: 'Website Development', amount: 5000, category: 'Marketing', isOneTime: true },
          { id: 'online3', name: 'Logo & Branding', amount: 1500, category: 'Marketing', isOneTime: true },
          { id: 'online4', name: 'Computer Equipment', amount: 3000, category: 'Equipment', isOneTime: true },
          { id: 'online5', name: 'Initial Inventory', amount: 10000, category: 'Inventory', isOneTime: true },
          { id: 'online6', name: 'E-commerce Platform', amount: 2000, category: 'Equipment', isOneTime: true },
          { id: 'online7', name: 'Website Hosting', amount: 30, category: 'Equipment', isOneTime: false },
          { id: 'online8', name: 'Online Marketing', amount: 1500, category: 'Marketing', isOneTime: false },
          { id: 'online9', name: 'Software Subscriptions', amount: 200, category: 'Equipment', isOneTime: false },
          { id: 'online10', name: 'Shipping Supplies', amount: 300, category: 'Inventory', isOneTime: false },
          { id: 'online11', name: 'Insurance', amount: 200, category: 'Insurance', isOneTime: false },
        ];
        break;
      case 'restaurant':
        templateItems = [
          { id: 'restaurant1', name: 'Business Registration', amount: 1000, category: 'Legal', isOneTime: true },
          { id: 'restaurant2', name: 'Kitchen Equipment', amount: 50000, category: 'Equipment', isOneTime: true },
          { id: 'restaurant3', name: 'Furniture & Fixtures', amount: 30000, category: 'Equipment', isOneTime: true },
          { id: 'restaurant4', name: 'Rent Deposit', amount: 10000, category: 'Facilities', isOneTime: true },
          { id: 'restaurant5', name: 'Renovations', amount: 40000, category: 'Facilities', isOneTime: true },
          { id: 'restaurant6', name: 'Initial Inventory', amount: 15000, category: 'Inventory', isOneTime: true },
          { id: 'restaurant7', name: 'Liquor License', amount: 5000, category: 'Legal', isOneTime: true },
          { id: 'restaurant8', name: 'POS System', amount: 5000, category: 'Equipment', isOneTime: true },
          { id: 'restaurant9', name: 'Monthly Rent', amount: 5000, category: 'Facilities', isOneTime: false },
          { id: 'restaurant10', name: 'Utilities', amount: 1500, category: 'Facilities', isOneTime: false },
          { id: 'restaurant11', name: 'Insurance', amount: 1000, category: 'Insurance', isOneTime: false },
          { id: 'restaurant12', name: 'Marketing', amount: 3000, category: 'Marketing', isOneTime: false },
          { id: 'restaurant13', name: 'Staff Salaries', amount: 20000, category: 'Staffing', isOneTime: false },
          { id: 'restaurant14', name: 'Food & Beverage', amount: 10000, category: 'Inventory', isOneTime: false },
        ];
        break;
      case 'saas':
        templateItems = []; // Placeholder for SaaS template
        break;
      case 'manufacturing':
        templateItems = []; // Placeholder for Manufacturing template
        break;
      case 'ecommerce':
        templateItems = []; // Placeholder for E-commerce template
        break;
      case 'boutique':
        templateItems = []; // Placeholder for Boutique template
        break;
      case 'coworking':
        templateItems = []; // Placeholder for Co-working Space template
        break;
      case 'consulting':
        templateItems = []; // Placeholder for Consulting Agency template
        break;
      case 'creative':
        templateItems = []; // Placeholder for Creative Studio template
        break;
      case 'digitalMarketing':
        templateItems = []; // Placeholder for Digital Marketing Agency template
        break;
      case 'eventPlanning':
        templateItems = []; // Placeholder for Event Planning template
        break;
      case 'foodTruck':
        templateItems = []; // Placeholder for Food Truck template
        break;
      case 'health':
        templateItems = []; // Placeholder for Health & Wellness template
        break;
      default:
        templateItems = items;
    }
    
    setItems(templateItems);
    setBusinessType(type);
  };

  // Calculate totals
  const oneTimeCosts = items
    .filter(item => item.isOneTime)
    .reduce((total, item) => total + item.amount, 0);
    
  const monthlyCosts = items
    .filter(item => !item.isOneTime)
    .reduce((total, item) => total + item.amount, 0);
    
  const sixMonthOperating = monthlyCosts * 6;
  const totalStartupCosts = oneTimeCosts + sixMonthOperating;
  
  // Prepare data for chart
  const chartData = [
    { name: 'One-Time Costs', value: oneTimeCosts },
    { name: '6-Month Operating', value: sixMonthOperating },
  ];
  
  // Group by category for detailed chart
  const categories = [...new Set(items.map(item => item.category))];
  const categoryData = categories.map(category => {
    const categoryTotal = items
      .filter(item => item.category === category)
      .reduce((total, item) => item.isOneTime ? total + item.amount : total + (item.amount * 6), 0);
      
    return {
      name: category,
      value: categoryTotal
    };
  }).sort((a, b) => b.value - a.value);

  const handleImportData = (data: Record<string, unknown>, importedFeedbackItems?: FeedbackItem[]) => {
    if (data.items && Array.isArray(data.items)) {
      setItems(data.items as CostItem[]);
    }
    if (data.businessType && typeof data.businessType === 'string') {
      setBusinessType(data.businessType);
    }
    if (importedFeedbackItems) {
      setFeedbackItems(importedFeedbackItems);
      if (importedFeedbackItems.length > 0) {
        setIsFeedbackDrawerOpen(true);
      }
    }
  };



  return (
    <>
      <TooltipProvider>
      <div className="p-4 md:p-6 pb-16">
        <div className="flex justify-end">
          <ImportExport
            calculatorType="startupCosts"
            currentData={{ items, businessType }}
            currentFeedbackItems={feedbackItems}
            onImport={handleImportData}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Startup Cost Estimator</CardTitle>
          </CardHeader>

          {/* Progress Bar and Feedback Trigger Section */}
          <div className="my-4 px-6">
            <div className="flex items-center gap-2 mb-1">
              <Label htmlFor="completionProgress" className="text-sm font-medium">Estimate Progress</Label>
              {completionPercentage === 100 && (
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={handleGetFeedback}>
                  <MessageSquareText className="h-4 w-4 text-primary" />
                  <span className="sr-only">View Feedback</span>
                </Button>
              )}
            </div>
            <Progress id="completionProgress" value={completionPercentage} className="w-full" />
          </div>
          <CardContent className="space-y-4">
            <Select value={businessType} onValueChange={applyTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a business type template" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type: BusinessType) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          <div className="space-y-4">
            {/* ... */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Startup Costs</h3>
              <Button variant="outline" size="sm" onClick={addItem}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {items.map((item) => {
              const relevantFeedback = feedbackItems.find(
                fb => fb.uiTarget?.scope === 'costItem' && fb.uiTarget?.identifier === item.id
              );
              const severity = relevantFeedback?.severity;
              
              let classNames = "p-4 rounded-lg space-y-4";
              if (severity) {
                let borderColorClass = '';
                switch (severity) {
                  case 'critical': borderColorClass = 'border-destructive'; break;
                  case 'warning': borderColorClass = 'border-yellow-400'; break;
                  case 'info': borderColorClass = 'border-blue-400'; break;
                  case 'good': borderColorClass = 'border-green-400'; break;
                  default: borderColorClass = 'border-border'; // Fallback
                }
                classNames += ` border-2 ${borderColorClass}`;
              } else {
                classNames += ' border border-border'; // Default border
              }

              return (
                <div key={item.id} className={classNames}>

                <div className="flex justify-between items-center">
                  <div className="w-full">
                    <Label className="mb-2 block">Item Name</Label>
                    <Input
                      value={item.name}
                      className="w-full"
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2 mt-6" 
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-2 block">Category</Label>
                    <Select
                      value={item.category}
                      onValueChange={(value) => handleItemChange(item.id, 'category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Legal">Legal</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Facilities">Facilities</SelectItem>
                        <SelectItem value="Inventory">Inventory</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Staffing">Staffing</SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      <Label className="block">Type</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] p-4">
                          <p className="mb-2 font-semibold">Expense Type:</p>
                          <p className="mb-1"><span className="font-medium">One-Time:</span> Initial setup costs (e.g., equipment, licenses)</p>
                          <p><span className="font-medium">Monthly:</span> Recurring operational expenses</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select
                      value={item.isOneTime ? 'one-time' : 'monthly'}
                      onValueChange={(value) => handleItemChange(item.id, 'isOneTime', value === 'one-time')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-time">One-Time</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label>Amount ($)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground " />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the estimated amount for this expense</p>
                        </TooltipContent>
                      </Tooltip>

                    </div>
                    <Input
                      type="number"
                      className="w-full"
                      min="0"
                      value={item.amount || ''}
                      onChange={(e) => handleItemChange(item.id, 'amount', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              className="w-full"
              onClick={addItem}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Cost Item
            </Button>
          </div>

          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">One-Time Costs</p>
                  <p className="text-2xl font-bold">
                    ${oneTimeCosts.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <p className="text-sm text-muted-foreground">6-Month Operating</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px] p-4">
                        <p>Estimated operating expenses for the first 6 months.</p>
                        <p className="mt-1 text-sm text-muted-foreground">(Monthly recurring costs × 6 months)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-2xl font-bold">
                    ${sixMonthOperating.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Startup Costs</p>
                  <p className="text-2xl font-bold">
                    ${totalStartupCosts.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Cost Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className={getSummaryCardClassName('totalOneTimeCosts', 'p-4 border-l-4 border-primary')}>
                <div className="text-sm text-muted-foreground">One-Time Costs</div>
                <div className="text-2xl font-bold">${oneTimeCosts.toLocaleString()}</div>
              </Card>
              <Card className={getSummaryCardClassName('sixMonthOperating', 'p-4 border-l-4 border-secondary')}>
                <div className="flex items-center text-sm text-muted-foreground">
                  6-Month Operating
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1.5 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Estimated operating costs for the first 6 months. <br />This is a common period for initial cash flow planning.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-2xl font-bold">${sixMonthOperating.toLocaleString()}</div>
              </Card>
              <Card className={getSummaryCardClassName('totalStartupCosts', 'p-4 border-l-4 border-destructive')}>
                <div className="text-sm text-muted-foreground">Total Startup Costs</div>
                <div className="text-2xl font-bold">${totalStartupCosts.toLocaleString()}</div>
              </Card>
            </div>

            {/* Category Breakdown */}
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Costs by Category</CardTitle>
              <div className="space-y-4">
                {categoryData.map((item, index) => {
                  const percentage = totalStartupCosts > 0 ? (item.value / totalStartupCosts) * 100 : 0;
                  const relevantFeedback = feedbackItems.find(
                    fb => fb.uiTarget?.scope === 'category' && fb.uiTarget?.identifier === item.name
                  );
                  const severity = relevantFeedback?.severity;

                  let categoryClassNames = "space-y-2 p-2 rounded"; // Added padding and rounding
                  if (severity) {
                    let borderColorClass = '';
                    let bgColorClass = 'bg-opacity-10'; // Base for slight background tint
                    switch (severity) {
                      case 'critical': borderColorClass = 'border-l-4 border-destructive'; bgColorClass = 'bg-destructive ' + bgColorClass; break;
                      case 'warning': borderColorClass = 'border-l-4 border-yellow-400'; bgColorClass = 'bg-yellow-400 ' + bgColorClass; break;
                      case 'info': borderColorClass = 'border-l-4 border-blue-400'; bgColorClass = 'bg-blue-400 ' + bgColorClass; break;
                      case 'good': borderColorClass = 'border-l-4 border-green-400'; bgColorClass = 'bg-green-400 ' + bgColorClass; break;
                      default: borderColorClass = ''; bgColorClass = '';
                    }
                    categoryClassNames += ` ${borderColorClass} ${bgColorClass}`;
                  }

                  return (
                    <div key={item.name} className={categoryClassNames}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.name}</span>
                        <span>${item.value.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Cost Distribution */}
            <Card className="p-6">
              <CardTitle className="text-lg mb-6">Cost Distribution</CardTitle>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={categoryData}
                    margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name"
                      tick={{ fill: 'hsl(var(--foreground))' }}
                      axisLine={false}
                      tickLine={false}
                      width={100}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, null]}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[0, 4, 4, 0]}
                      name="Amount"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={`hsl(var(--chart-${(index % 5) + 1}))`} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
      </div>
      </TooltipProvider>

      <FeedbackDrawer
        isOpen={isFeedbackDrawerOpen}
        onClose={() => setIsFeedbackDrawerOpen(false)}
        feedbackItems={feedbackItems}
        calculatorName="Startup Cost Analysis"
      />
    </>
  );
};