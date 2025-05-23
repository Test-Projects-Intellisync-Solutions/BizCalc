import { Pencil, Trash2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FinancialItem, frequencyLabels } from '../types';
import { formatCurrency } from '../utils';

interface FinancialItemListProps {
  items: FinancialItem[];
  onEdit: (item: FinancialItem) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export function FinancialItemList({ 
  items, 
  onEdit, 
  onDelete,
  emptyMessage = 'No items found'
}: FinancialItemListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <DollarSign className="h-10 w-10 mx-auto mb-2 opacity-30" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Monthly</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  {item.notes && (
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {item.notes}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>{item.category || 'Uncategorized'}</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col">
                  <span>{formatCurrency(item.amount)}</span>
                  <span className="text-xs text-muted-foreground">
                    {frequencyLabels[item.frequency]}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(
                  item.amount * 
                  (item.frequency === 'monthly' ? 1 : 
                   item.frequency === 'quarterly' ? 1/3 : 1/12)
                )}
              </TableCell>
              <TableCell>
                <div className="flex justify-end space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
