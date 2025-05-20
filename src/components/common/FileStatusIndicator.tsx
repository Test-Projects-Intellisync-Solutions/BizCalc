import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, AlertCircle, Clock, Save } from 'lucide-react';

interface FileStatusIndicatorProps {
  fileName: string | null;
  lastSaved: Date | null;
  isSaving: boolean;
  error: Error | null;
  className?: string;
}

const FileStatusIndicator: React.FC<FileStatusIndicatorProps> = ({
  fileName,
  lastSaved,
  isSaving,
  error,
  className = ''
}) => {
  const formatLastSaved = (date: Date | null): string => {
    if (!date) return 'Not saved yet';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`inline-flex items-center gap-3 rounded-md bg-muted/40 px-3 py-1.5 text-sm ${className}`}>
      {isSaving ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
          <span>Saving...</span>
        </div>
      ) : error ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Error saving</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{error.message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : lastSaved ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Saved {formatLastSaved(lastSaved)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Last saved: {lastSaved.toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>No file loaded</span>
        </div>
      )}

      {fileName && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="text-muted-foreground/50">•</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex max-w-[200px] items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                  <Save className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
                  <span className="truncate">{fileName}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{fileName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default FileStatusIndicator;
