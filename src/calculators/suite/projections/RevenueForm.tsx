import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, MinusCircle } from 'lucide-react';

export interface RevenueStream {
  id: string;
  name: string;
  baseAmount: number;
  growthType: 'fixed' | 'percentage';
  growthRate: number;
}

interface RevenueFormProps {
  onUpdate: (streams: RevenueStream[]) => void;
}

export default function RevenueForm({ onUpdate }: RevenueFormProps) {
  const [streams, setStreams] = useState<RevenueStream[]>([
    {
      id: '1',
      name: 'Primary Revenue',
      baseAmount: 0,
      growthType: 'fixed',
      growthRate: 0,
    },
  ]);

  const handleStreamChange = (index: number, field: keyof RevenueStream, value: string | number) => {
    const newStreams = [...streams];
    newStreams[index] = {
      ...newStreams[index],
      [field]: value,
    };
    setStreams(newStreams);
    onUpdate(newStreams);
  };

  const addStream = () => {
    setStreams([
      ...streams,
      {
        id: Date.now().toString(),
        name: `Revenue Stream ${streams.length + 1}`,
        baseAmount: 0,
        growthType: 'fixed',
        growthRate: 0,
      },
    ]);
  };

  const removeStream = (index: number) => {
    const newStreams = streams.filter((_, i) => i !== index);
    setStreams(newStreams);
    onUpdate(newStreams);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Streams</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {streams.map((stream, index) => (
          <div key={stream.id} className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <Label>Revenue Stream Name</Label>
              {streams.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStream(index)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Input
              value={stream.name}
              onChange={(e) => handleStreamChange(index, 'name', e.target.value)}
              placeholder="e.g., Product Sales"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Monthly Base Amount</Label>
                <Input
                  type="number"
                  min="0"
                  value={stream.baseAmount}
                  onChange={(e) => handleStreamChange(index, 'baseAmount', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Growth Type</Label>
                <Select
                  value={stream.growthType}
                  onValueChange={(value) => handleStreamChange(index, 'growthType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="percentage">Percentage Growth</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {stream.growthType === 'percentage' && (
                <div className="space-y-2">
                  <Label>Monthly Growth Rate (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={stream.growthRate}
                    onChange={(e) => handleStreamChange(index, 'growthRate', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addStream}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Revenue Stream
        </Button>
      </CardContent>
    </Card>
  );
}