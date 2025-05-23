import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FinancialItem, FrequencyType } from '../types';
import { formatCurrency } from '../utils';

interface FinancialItemFormProps {
  type: 'revenue' | 'expense';
  categories: string[];
  onSubmit: (item: Omit<FinancialItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<FinancialItem>;
  onCancel?: () => void;
}

export function FinancialItemForm({
  type,
  categories,
  onSubmit,
  initialData,
  onCancel,
}: FinancialItemFormProps) {
  const [formData, setFormData] = useState<Omit<FinancialItem, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    amount: 0,
    category: categories[0] || '',
    frequency: 'monthly',
    notes: '',
    ...initialData,
  });
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const category = showCustomCategory && customCategory ? customCategory : formData.category;
    
    onSubmit({
      ...formData,
      category,
    });
    
    // Reset form
    setFormData({
      name: '',
      amount: 0,
      category: categories[0] || '',
      frequency: 'monthly',
      notes: '',
    });
    setCustomCategory('');
    setShowCustomCategory(false);
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomCategory(true);
      setFormData(prev => ({
        ...prev,
        category: '',
      }));
    } else {
      setShowCustomCategory(false);
      setFormData(prev => ({
        ...prev,
        category: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={`${type === 'revenue' ? 'Revenue' : 'Expense'} name`}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              className="pl-8"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={showCustomCategory ? 'custom' : formData.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
              <SelectItem value="custom">+ Add new category</SelectItem>
            </SelectContent>
          </Select>
          {showCustomCategory && (
            <Input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter new category name"
              className="mt-2"
            />
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Frequency</Label>
          <Select
            value={formData.frequency}
            onValueChange={(value: FrequencyType) =>
              setFormData({ ...formData, frequency: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any additional notes"
            rows={2}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="gap-2">
          <Plus className="h-4 w-4" />
          {initialData ? 'Update' : 'Add'} {type}
        </Button>
      </div>
    </form>
  );
}
