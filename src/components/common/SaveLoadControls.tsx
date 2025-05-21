import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Save, FolderOpen, FilePlus } from 'lucide-react';

interface SaveLoadControlsProps<T> {
  onNew: () => void;
  onSave: () => Promise<void>;
  onLoad: () => Promise<T | undefined>;
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
  fileName?: string | null;
  className?: string;
}

const SaveLoadControls = <T,>({
  onNew,
  onSave,
  onLoad,
  isSaving,
  isLoading,
  lastSaved,
  fileName = null,
  className = ''
}: SaveLoadControlsProps<T>) => {
  const formatFileStatus = () => {
    if (!fileName) return 'No file loaded';
    return `${fileName}`;
  };
  const formatLastSaved = (date: Date | null): string => {
    if (!date) return 'Not saved yet';
    return `Last saved: ${date.toLocaleString()}`;
  };

  return (
    <div className={`save-load-controls flex items-center gap-x-4 ${className}`}>
      <ButtonGroup variant="outline" size="sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onNew}
              disabled={isSaving || isLoading}
              size="sm"
              className="flex items-center gap-1"
              type="button"
            >
              <FilePlus className="h-4 w-4" />
              <span>New</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Start a new file</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onLoad}
              disabled={isSaving || isLoading}
              size="sm"
              className="flex items-center gap-1"
              type="button"
            >
              <FolderOpen className="h-4 w-4" />
              <span>Open</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open an existing file</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSave}
              disabled={isSaving || isLoading}
              size="sm"
              className="flex items-center gap-1"
              type="button"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save to file</p>
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
      <span className="text-xs text-muted-foreground">
        {formatFileStatus()} {fileName && <span className="mx-1">·</span>} {formatLastSaved(lastSaved)}
      </span>
    </div>
  );
};

export default SaveLoadControls;
