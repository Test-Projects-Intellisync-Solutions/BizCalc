declare module '*.tsx' {
  const content: any;
  export default content;
}

declare module '@/features/cashflow/CashFlowTab' {
  import { FC } from 'react';
  const CashFlowTab: FC;
  export default CashFlowTab;
}
