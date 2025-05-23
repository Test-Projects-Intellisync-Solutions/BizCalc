import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface CostItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  isOneTime: boolean;
}

export default function StartupCostEstimator() {
  const [businessType, setBusinessType] = useState<string>('retail');
  const [items, setItems] = useState<CostItem[]>([
    { id: '1', name: 'Business Registration', amount: 500, category: 'Legal', isOneTime: true },
    { id: '2', name: 'Equipment', amount: 5000, category: 'Equipment', isOneTime: true },
    { id: '3', name: 'Rent Deposit', amount: 3000, category: 'Facilities', isOneTime: true },
    { id: '4', name: 'Initial Inventory', amount: 10000, category: 'Inventory', isOneTime: true },
    { id: '5', name: 'Website', amount: 2000, category: 'Marketing', isOneTime: true },
    { id: '6', name: 'Rent', amount: 1500, category: 'Facilities', isOneTime: false },
    { id: '7', name: 'Utilities', amount: 500, category: 'Facilities', isOneTime: false },
    { id: '8', name: 'Insurance', amount: 300, category: 'Insurance', isOneTime: false },
    { id: '9', name: 'Marketing', amount: 1000, category: 'Marketing', isOneTime: false },
    { id: '10', name: 'Employee Salaries', amount: 5000, category: 'Staffing', isOneTime: false },
  ]);

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
          { id: '1', name: 'Business Registration', amount: 500, category: 'Legal', isOneTime: true },
          { id: '2', name: 'Store Equipment', amount: 15000, category: 'Equipment', isOneTime: true },
          { id: '3', name: 'Rent Deposit', amount: 5000, category: 'Facilities', isOneTime: true },
          { id: '4', name: 'Initial Inventory', amount: 25000, category: 'Inventory', isOneTime: true },
          { id: '5', name: 'Store Fixtures', amount: 8000, category: 'Equipment', isOneTime: true },
          { id: '6', name: 'Point of Sale System', amount: 3000, category: 'Equipment', isOneTime: true },
          { id: '7', name: 'Signage', amount: 2500, category: 'Marketing', isOneTime: true },
          { id: '8', name: 'Website', amount: 2000, category: 'Marketing', isOneTime: true },
          { id: '9', name: 'Monthly Rent', amount: 2500, category: 'Facilities', isOneTime: false },
          { id: '10', name: 'Utilities', amount: 500, category: 'Facilities', isOneTime: false },
          { id: '11', name: 'Insurance', amount: 400, category: 'Insurance', isOneTime: false },
          { id: '12', name: 'Marketing', amount: 1500, category: 'Marketing', isOneTime: false },
          { id: '13', name: 'Employee Salaries', amount: 8000, category: 'Staffing', isOneTime: false },
        ];
        break;
      case 'service':
        templateItems = [
          { id: '1', name: 'Business Registration', amount: 500, category: 'Legal', isOneTime: true },
          { id: '2', name: 'Office Equipment', amount: 5000, category: 'Equipment', isOneTime: true },
          { id: '3', name: 'Security Deposit', amount: 2000, category: 'Facilities', isOneTime: true },
          { id: '4', name: 'Software & Licenses', amount: 3000, category: 'Equipment', isOneTime: true },
          { id: '5', name: 'Website', amount: 3000, category: 'Marketing', isOneTime: true },
          { id: '6', name: 'Professional Certifications', amount: 1500, category: 'Legal', isOneTime: true },
          { id: '7', name: 'Monthly Rent', amount: 1500, category: 'Facilities', isOneTime: false },
          { id: '8', name: 'Utilities', amount: 300, category: 'Facilities', isOneTime: false },
          { id: '9', name: 'Insurance', amount: 350, category: 'Insurance', isOneTime: false },
          { id: '10', name: 'Marketing', amount: 1000, category: 'Marketing', isOneTime: false },
          { id: '11', name: 'Employee Salaries', amount: 6000, category: 'Staffing', isOneTime: false },
        ];
        break;
      case 'online':
        templateItems = [
          { id: '1', name: 'Business Registration', amount: 500, category: 'Legal', isOneTime: true },
          { id: '2', name: 'Website Development', amount: 5000, category: 'Marketing', isOneTime: true },
          { id: '3', name: 'Logo & Branding', amount: 1500, category: 'Marketing', isOneTime: true },
          { id: '4', name: 'Computer Equipment', amount: 3000, category: 'Equipment', isOneTime: true },
          { id: '5', name: 'Initial Inventory', amount: 10000, category: 'Inventory', isOneTime: true },
          { id: '6', name: 'E-commerce Platform', amount: 2000, category: 'Equipment', isOneTime: true },
          { id: '7', name: 'Website Hosting', amount: 30, category: 'Equipment', isOneTime: false },
          { id: '8', name: 'Online Marketing', amount: 1500, category: 'Marketing', isOneTime: false },
          { id: '9', name: 'Software Subscriptions', amount: 200, category: 'Equipment', isOneTime: false },
          { id: '10', name: 'Shipping Supplies', amount: 300, category: 'Inventory', isOneTime: false },
          { id: '11', name: 'Insurance', amount: 200, category: 'Insurance', isOneTime: false },
        ];
        break;
      case 'restaurant':
        templateItems = [
          { id: '1', name: 'Business Registration', amount: 1000, category: 'Legal', isOneTime: true },
          { id: '2', name: 'Kitchen Equipment', amount: 50000, category: 'Equipment', isOneTime: true },
          { id: '3', name: 'Furniture & Fixtures', amount: 30000, category: 'Equipment', isOneTime: true },
          { id: '4', name: 'Rent Deposit', amount: 10000, category: 'Facilities', isOneTime: true },
          { id: '5', name: 'Renovations', amount: 40000, category: 'Facilities', isOneTime: true },
          { id: '6', name: 'Initial Inventory', amount: 15000, category: 'Inventory', isOneTime: true },
          { id: '7', name: 'Liquor License', amount: 5000, category: 'Legal', isOneTime: true },
          { id: '8', name: 'POS System', amount: 5000, category: 'Equipment', isOneTime: true },
          { id: '9', name: 'Monthly Rent', amount: 5000, category: 'Facilities', isOneTime: false },
          { id: '10', name: 'Utilities', amount: 1500, category: 'Facilities', isOneTime: false },
          { id: '11', name: 'Insurance', amount: 1000, category: 'Insurance', isOneTime: false },
          { id: '12', name: 'Marketing', amount: 3000, category: 'Marketing', isOneTime: false },
          { id: '13', name: 'Staff Salaries', amount: 20000, category: 'Staffing', isOneTime: false },
          { id: '14', name: 'Food & Beverage', amount: 10000, category: 'Inventory', isOneTime: false },
        ];
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Startup Cost Estimator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Business Type</Label>
            <Select value={businessType} onValueChange={applyTemplate}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
                <SelectContent>
    <SelectItem value="boutique">Boutique</SelectItem>
    <SelectItem value="coworking">Co-working Space</SelectItem>
    <SelectItem value="consulting">Consulting Agency</SelectItem>
    <SelectItem value="creative">Creative Studio</SelectItem>
    <SelectItem value="digitalMarketing">Digital Marketing Agency</SelectItem>
    <SelectItem value="ecommerce">E-commerce Store</SelectItem>
    <SelectItem value="eventPlanning">Event Planning</SelectItem>
    <SelectItem value="foodTruck">Food Truck</SelectItem>
    <SelectItem value="health">Health &amp; Wellness</SelectItem>
    <SelectItem value="homeBased">Home-based Business</SelectItem>
    <SelectItem value="manufacturing">Manufacturing &amp; Production</SelectItem>
    <SelectItem value="mobileApp">Mobile App Development</SelectItem>
    <SelectItem value="online">Online Business</SelectItem>
    <SelectItem value="realEstate">Real Estate Agency</SelectItem>
    <SelectItem value="restaurant">Restaurant</SelectItem>
    <SelectItem value="retail">Retail Store</SelectItem>
    <SelectItem value="service">Service Business</SelectItem>
    <SelectItem value="socialEnterprise">Social Enterprise</SelectItem>
    <SelectItem value="subscription">Subscription Box Service</SelectItem>
    <SelectItem value="tech">Tech Startup</SelectItem>
  </SelectContent>
              
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Startup Costs</h3>
              <Button variant="outline" size="sm" onClick={addItem}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {items.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-4">
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
                    <Label className="mb-2 block">Type</Label>
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
                    <Label className="mb-2 block">Amount ($)</Label>
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
                  <p className="text-sm text-muted-foreground">6-Month Operating</p>
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

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-4">
              <CardTitle className="text-lg mb-4">Cost Breakdown</CardTitle>
              <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="value" name="Cost" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <CardTitle className="text-lg mb-4">Costs by Category</CardTitle>
              <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="value" name="Cost by Category" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Button className="w-full" onClick={() => console.log('Save estimate')}>
            Save Estimate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}