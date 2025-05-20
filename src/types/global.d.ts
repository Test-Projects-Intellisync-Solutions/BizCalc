// File System Access API types
interface FileSystemCreateWritableOptions {
  keepExistingData?: boolean;
}

interface FileSystemWritableFileStream extends WritableStream<Uint8Array> {
  write(chunk: FileSystemWriteChunkType): Promise<void>;
  seek(position: number): Promise<void>;
  truncate(size: number): Promise<void>;
  close(): Promise<void>;
}

type FileSystemWriteChunkType = BufferSource | Blob | string | WriteParams;

interface WriteParams {
  type: 'write' | 'seek' | 'truncate';
  size?: number | null;
  position?: number | null;
  data?: BufferSource | Blob | string | null;
}

interface FileSystemHandle {
  readonly kind: 'file' | 'directory';
  readonly name: string;
  isSameEntry(other: FileSystemHandle): Promise<boolean>;
  queryPermission?(options?: { mode?: 'read' | 'readwrite' }): Promise<PermissionState>;
  requestPermission?(options?: { mode?: 'read' | 'readwrite' }): Promise<PermissionState>;
}

interface FileSystemFileHandle extends FileSystemHandle {
  readonly kind: 'file';
  getFile(): Promise<File>;
  createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
}

type PermissionState = 'granted' | 'denied' | 'prompt';

declare global {
  interface Window {
    showSaveFilePicker?: (options?: {
      suggestedName?: string;
      excludeAcceptAllOption?: boolean;
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<FileSystemFileHandle>;

    showOpenFilePicker?: (options?: {
      multiple?: boolean;
      excludeAcceptAllOption?: boolean;
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<FileSystemFileHandle[]>;
  }
}
