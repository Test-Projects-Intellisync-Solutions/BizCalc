export interface CostItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  isOneTime: boolean;
}

export interface CostData {
  businessType: string;
  items: CostItem[];
}

export interface StartupCostEstimatorProps {
  initialData?: CostData;
  onDataChange?: (data: CostData) => void;
}
