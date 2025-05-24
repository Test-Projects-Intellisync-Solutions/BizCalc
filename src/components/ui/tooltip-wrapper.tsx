import { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface TooltipWrapperProps {
  children: ReactNode;
  content: string;
  className?: string;
}

export function TooltipWrapper({ children, content, className = '' }: TooltipWrapperProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {children}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="w-[200px]">{content}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
