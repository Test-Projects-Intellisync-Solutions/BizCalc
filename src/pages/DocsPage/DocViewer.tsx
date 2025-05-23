import { useEffect, useState } from 'react';
import MarkdownViewer from './MarkdownViewer';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface DocViewerProps {
  path: string;
}

export default function DocViewer({ path }: DocViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDoc() {
      try {
        // Remove leading slash if present
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        const response = await fetch(`/${cleanPath}`);
        if (!response.ok) throw new Error('Failed to load document');
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError('Failed to load document. Please try again later.');
        setContent(null);
      }
    }

    fetchDoc();
  }, [path]);

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-destructive">{error}</p>
      </Card>
    );
  }

  if (!content) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return <MarkdownViewer content={content} />;
}