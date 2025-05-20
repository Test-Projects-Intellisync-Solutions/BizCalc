// File System Access API Type Declarations

export interface FileSystemHandle {
  readonly kind: 'file' | 'directory';
  readonly name: string;
  isSameEntry(other: FileSystemHandle): boolean;
}

export interface FileSystemFileHandle extends FileSystemHandle {
  readonly kind: 'file';
  getFile(): Promise<File>;
  createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
}

export interface FileSystemCreateWritableOptions {
  keepExistingData?: boolean;
}

export interface FileSystemWritableFileStream extends WritableStream {
  write(data: string | BufferSource | Blob | { type: 'write' | 'seek' | 'truncate', position?: number, data?: string | BufferSource | Blob }): Promise<void>;
  close(): Promise<void>;
}

declare global {
  interface Window {
    showSaveFilePicker?(options?: {
      suggestedName?: string;
      types?: Array<{
        description?: string;
        accept: Record<string, string[]>;
      }>;
    }): Promise<FileSystemFileHandle>;

    showOpenFilePicker?(options?: {
      multiple?: boolean;
      excludeAcceptAllOption?: boolean;
      types?: Array<{
        description?: string;
        accept: Record<string, string[]>;
      }>;
    }): Promise<FileSystemFileHandle[]>;
  }
}
