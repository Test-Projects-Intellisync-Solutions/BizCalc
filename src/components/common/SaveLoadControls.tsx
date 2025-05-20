import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Save, FolderOpen } from 'lucide-react';

interface SaveLoadControlsProps<T> {
  onSave: () => Promise<void>;
  onLoad: () => Promise<T | undefined>;
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
  className?: string;
}

const SaveLoadControls = <T,>({
  onSave,
  onLoad,
  isSaving,
  isLoading,
  lastSaved,
  className = ''
}: SaveLoadControlsProps<T>) => {
  const formatLastSaved = (date: Date | null): string => {
    if (!date) return 'Never saved';
    return `Last saved: ${date.toLocaleString()}`;
  };

  return (
    <div className={`save-load-controls ${className}`}>
      <ButtonGroup variant="outline" size="sm" className="mr-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSave}
              disabled={isSaving || isLoading}
              size="sm"
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save to file</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onLoad}
              disabled={isSaving || isLoading}
              size="sm"
              className="flex items-center gap-1"
            >
              <FolderOpen className="h-4 w-4" />
              <span>{isLoading ? 'Loading...' : 'Load'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Load from file</p>
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
      <span className="text-xs text-gray-500">
        {formatLastSaved(lastSaved)}
      </span>
    </div>
  );
};

export default SaveLoadControls;
