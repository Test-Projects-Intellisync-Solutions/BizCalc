import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BarChart2, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

import { FinancialItem } from './types';
import { calculateSummary, formatCurrency, getInitialCategories } from './utils';
import { FinancialItemForm } from './components/FinancialItemForm';
import { FinancialSummaryCard } from './components/FinancialSummaryCard';
import { FinancialItemList } from './components/FinancialItemList';

const STORAGE_KEY = 'financialItems';

export default function RevenueVsExpenses() {
  // State for financial items
  const [revenues, setRevenues] = useState<FinancialItem[]>([]);
  const [expenses, setExpenses] = useState<FinancialItem[]>([]);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FinancialItem | null>(null);
  const [activeTab, setActiveTab] = useState<'revenue' | 'expense'>('revenue');
  
  // Categories
  const [revenueCategories, setRevenueCategories] = useState<string[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);

  // Calculate summaries
  const revenueSummary = calculateSummary(revenues);
  const expenseSummary = calculateSummary(expenses);
  const netIncome = revenueSummary.total - expenseSummary.total;
  const profitMargin = revenueSummary.total > 0 ? (netIncome / revenueSummary.total) * 100 : 0;

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const { revenues: savedRevenues, expenses: savedExpenses } = JSON.parse(savedData);
        setRevenues(savedRevenues || []);
        setExpenses(savedExpenses || []);
      }
    } catch (error) {
      console.error('Failed to load saved data', error);
    }
    
    // Initialize categories
    setRevenueCategories(getInitialCategories('revenue'));
    setExpenseCategories(getInitialCategories('expense'));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    const dataToSave = {
      revenues,
      expenses,
      lastUpdated: new Date().toISOString(),
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save data', error);
    }
  }, [revenues, expenses]);

  // Handle adding/updating an item
  const handleSubmitItem = useCallback((item: Omit<FinancialItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    if (editingItem) {
      // Update existing item
      const updateItems = (items: FinancialItem[]) => 
        items.map(i => 
          i.id === editingItem.id 
            ? { ...item, id: i.id, createdAt: i.createdAt, updatedAt: now }
            : i
        );
      
      if (editingItem.type === 'revenue') {
        setRevenues(updateItems(revenues));
      } else {
        setExpenses(updateItems(expenses));
      }
    } else {
      // Add new item
      const newItem: FinancialItem = {
        ...item,
        id: uuidv4(),
        type: activeTab,
        createdAt: now,
        updatedAt: now,
      };
      
      if (activeTab === 'revenue') {
        setRevenues([newItem, ...revenues]);
      } else {
        setExpenses([newItem, ...expenses]);
      }
      
      // Add new category if it doesn't exist
      if (item.category) {
        const categories = activeTab === 'revenue' ? revenueCategories : expenseCategories;
        const setCategories = activeTab === 'revenue' ? setRevenueCategories : setExpenseCategories;
        
        if (!categories.includes(item.category)) {
          setCategories([...categories, item.category]);
        }
      }
    }
    
    // Reset form
    setShowForm(false);
    setEditingItem(null);
  }, [activeTab, editingItem, revenues, expenses, revenueCategories, expenseCategories]);

  // Handle deleting an item
  const handleDeleteItem = useCallback((id: string, type: 'revenue' | 'expense') => {
    if (type === 'revenue') {
      setRevenues(revenues.filter(item => item.id !== id));
    } else {
      setExpenses(expenses.filter(item => item.id !== id));
    }
  }, [revenues, expenses]);

  // Handle editing an item
  const handleEditItem = useCallback((item: FinancialItem) => {
    setEditingItem(item);
    setActiveTab(item.type);
    setShowForm(true);
  }, []);

  // Handle canceling the form
  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingItem(null);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-primary" />
            Revenue vs Expenses
          </h1>
          <p className="text-muted-foreground">
            Track and analyze your business finances
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add {activeTab === 'revenue' ? 'Revenue' : 'Expense'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FinancialSummaryCard 
          type="revenue" 
          summary={revenueSummary} 
        />
        <FinancialSummaryCard 
          type="expense" 
          summary={expenseSummary} 
        />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              Net Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {formatCurrency(netIncome)}
                <span className="text-sm font-normal text-muted-foreground ml-2">/month</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  netIncome >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className={`text-sm ${
                  netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {netIncome >= 0 ? 'Profitable' : 'Loss'}
                </span>
                <span className="text-sm text-muted-foreground">
                  • {formatCurrency(Math.abs(netIncome))} {netIncome >= 0 ? 'profit' : 'loss'} per month
                </span>
              </div>
              <div className="pt-2">
                <div className="text-sm text-muted-foreground">Profit Margin</div>
                <div className={`text-lg font-medium ${
                  profitMargin >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {profitMargin.toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingItem ? 'Edit' : 'Add New'} {activeTab === 'revenue' ? 'Revenue' : 'Expense'}
            </CardTitle>
            {!editingItem && (
              <CardDescription>
                Add a new {activeTab === 'revenue' ? 'revenue stream' : 'expense'} to track
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <FinancialItemForm
              type={activeTab}
              categories={activeTab === 'revenue' ? revenueCategories : expenseCategories}
              onSubmit={handleSubmitItem}
              initialData={editingItem || undefined}
              onCancel={handleCancelForm}
            />
          </CardContent>
        </Card>
      )}

      {/* Tabs for Revenues and Expenses */}
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'revenue' | 'expense')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Revenues ({revenues.length})
          </TabsTrigger>
          <TabsTrigger value="expense" className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Expenses ({expenses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <FinancialItemList
            items={revenues}
            onEdit={handleEditItem}
            onDelete={(id) => handleDeleteItem(id, 'revenue')}
            emptyMessage="No revenue streams added yet. Click 'Add Revenue' to get started."
          />
        </TabsContent>

        <TabsContent value="expense" className="space-y-4">
          <FinancialItemList
            items={expenses}
            onEdit={handleEditItem}
            onDelete={(id) => handleDeleteItem(id, 'expense')}
            emptyMessage="No expenses added yet. Click 'Add Expense' to get started."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
