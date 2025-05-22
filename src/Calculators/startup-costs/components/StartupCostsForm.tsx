import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle } from 'lucide-react';
import { CostItem } from '@/Calculators/tools/startup-cost-estimator/types';

interface StartupCostsFormProps {
  businessType: string;
  items: CostItem[];
  onBusinessTypeChange: (type: string) => void;
  onItemChange: (id: string, field: string, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onTemplateApply: (type: string) => void;
}

export function StartupCostsForm({
  businessType,
  items,
  onBusinessTypeChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onTemplateApply,
}: StartupCostsFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Business Type</Label>
        <Select 
          value={businessType} 
          onValueChange={(value) => {
            onBusinessTypeChange(value);
            onTemplateApply(value);
          }}
        >
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
          <Button variant="outline" size="sm" onClick={onAddItem}>
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
                  onChange={(e) => onItemChange(item.id, 'name', e.target.value)}
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 mt-6" 
                onClick={() => onRemoveItem(item.id)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="mb-2 block">Category</Label>
                <Select
                  value={item.category}
                  onValueChange={(value) => onItemChange(item.id, 'category', value)}
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
                  onValueChange={(value) => onItemChange(item.id, 'isOneTime', value === 'one-time')}
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
                  onChange={(e) => onItemChange(item.id, 'amount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button
          variant="outline"
          className="w-full"
          onClick={onAddItem}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Cost Item
        </Button>
      </div>
    </div>
  );
}
