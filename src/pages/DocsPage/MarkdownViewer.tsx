import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

// Define custom components with proper TypeScript types
const components: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground pt-4 border-t border-border/50" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-medium mt-5 mb-2 text-foreground/90" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="my-4 text-foreground/90 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  a: ({ children, ...props }) => (
    <a 
      className="text-primary hover:underline underline-offset-4" 
      target="_blank" 
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-6 my-4 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-6 my-4 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="my-1.5" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote 
      className="border-l-4 border-primary/20 pl-4 py-1 my-4 text-foreground/80 italic" 
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ node, className, children, ...props }) => {
    // Check if it's an inline code block
    const isInline = !className?.includes('language-');
    
    if (isInline) {
      return (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }
    
    // For code blocks with language specification
    return (
      <div className="my-4 overflow-hidden rounded-md">
        <div className="bg-muted p-4 overflow-x-auto text-sm">
          <code className={`font-mono ${className || ''}`} {...props}>
            {children}
          </code>
        </div>
      </div>
    );
  },
  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted/50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-border p-3 text-left font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-border p-3" {...props}>
      {children}
    </td>
  ),
  hr: (props) => (
    <hr className="my-8 border-border/50" {...props} />
  ),
};

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-6">
        <div className="markdown-content">
          <div className={cn(
            'prose dark:prose-invert max-w-none',
            'prose-headings:font-medium',
            'prose-p:my-4 prose-p:leading-relaxed',
            'prose-ul:my-4 prose-ol:my-4',
            'prose-li:my-1',
            'prose-blockquote:not-italic',
            'prose-pre:bg-muted prose-pre:p-0',
            'prose-code:before:content-none prose-code:after:content-none',
            'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
            'prose-a:text-primary hover:prose-a:underline',
            'prose-table:w-full prose-th:p-3 prose-td:p-3',
            'prose-th:border prose-th:border-border',
            'prose-td:border prose-td:border-border',
            'dark:prose-invert',
          )}
          >
            <ReactMarkdown
              components={components}
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MarkdownViewer;