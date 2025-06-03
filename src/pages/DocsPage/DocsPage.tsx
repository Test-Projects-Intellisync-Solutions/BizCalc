import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Lightbulb, ChartBar, Wrench, Book, HelpCircle, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import { docSections } from '@/components/docs/content';
import { MarkdownViewer } from './MarkdownViewer';
import { cn } from '@/lib/utils'; // Import cn utility for conditional class names

const serviceCardGradients = [
  'var(--gradient-card-blue)',
  'var(--gradient-card-orange)',
  'var(--gradient-card-pink)',
  'var(--gradient-card-green)',
];

const sectionIcons = {
  "📘 Calculator Guides": BookOpen,
  "💡 Financial Concepts": Lightbulb,
  "📊 Industry Benchmarks": ChartBar,
  "🛠️ How-To Guides": Wrench,
  "📘 Glossary": Book,
  "❓ FAQs": HelpCircle,
  "🔍 Case Studies": FileText,
} as const;

const sectionDescriptions = {
  "📘 Calculator Guides": "Learn how to use our financial calculators effectively",
  "💡 Financial Concepts": "Understand key financial terms and principles",
  "📊 Industry Benchmarks": "Compare your business metrics with industry standards",
  "🛠️ How-To Guides": "Step-by-step instructions for common tasks",
  "📘 Glossary": "Definitions of financial and business terms",
  "❓ FAQs": "Answers to frequently asked questions",
  "🔍 Case Studies": "Real-world examples and success stories",
} as const;

export interface DocItem {
  id: string;
  label: string;
  content: string;
}

interface DocSection {
  label: string;
  icon: string;
  items: DocItem[];
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ content: string; title: string } | null>(null);
  const [sections, setSections] = useState<DocSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load documentation sections
  useEffect(() => {
    try {
      setIsLoading(true);
      // Use the imported docSections directly
      setSections(docSections);
      setError(null);
    } catch (err) {
      console.error('Failed to load documentation:', err);
      setError('Failed to load documentation. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (isLoading) return [];
    
    return sections
      .map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }))
      .filter(section => section.items.length > 0);
  }, [sections, searchQuery, isLoading]);

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    try {
      setIsLoading(true);
      setSections([...docSections]); // Force re-render with fresh data
      setError(null);
    } catch (err) {
      console.error('Failed to refresh documentation:', err);
      setError('Failed to refresh documentation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDocSelect = useCallback((content: string, title: string) => {
    setSelectedDoc({ content, title });
    setIsDialogOpen(true);
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--gradient-heading-start))] to-[hsl(var(--gradient-heading-end))] bg-clip-text text-transparent">Documentation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Find guides, references, and resources</p>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documentation..."
              className="pl-9 w-full bg-background/95 backdrop-blur border border-gray-200 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-background hover:border-[hsl(var(--service-title-blue))]/70 transition-colors"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-10 w-10 shrink-0 border border-[hsl(var(--service-title-blue))] text-[hsl(var(--service-title-blue))] hover:bg-[hsl(var(--service-title-blue))]/10 transition-colors"
            title="Refresh documentation"
          >
            <RefreshCw
              className={cn(
                'h-4 w-4',
                isLoading ? 'animate-spin' : ''
              )}
            />
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error loading documentation</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      {filteredSections.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSections.map((section, index) => {
            const Icon = sectionIcons[section.label as keyof typeof sectionIcons];
            return (
              <Card
                key={section.label}
                className="docs-gradient-card"
                style={{ '--gradient': serviceCardGradients[index % serviceCardGradients.length] } as React.CSSProperties}
              >
                <CardHeader className="docs-gradient-card-header">
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className="docs-gradient-card-icon-wrapper">
                        <Icon className="docs-gradient-card-icon" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="docs-gradient-card-title">
                        {section.label.replace(/[^\w\s]/gi, '')}
                      </CardTitle>
                      <CardDescription className="docs-gradient-card-description">
                        {sectionDescriptions[section.label as keyof typeof sectionDescriptions]}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="docs-gradient-card-content">
                  <div className="space-y-1.5">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleDocSelect(item.content, item.label)}
                        className="docs-gradient-card-item-button group"
                      >
                        <span className="docs-gradient-card-item-text">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No results found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedDoc && (
          <DialogContent className="max-w-4xl h-[85vh] sm:max-h-[90vh] flex flex-col">
            <DialogHeader className="border-b border-border/50 pb-4">
              <DialogTitle className="text-xl">{selectedDoc.title}</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto pr-4 -mr-4 py-4">
              <MarkdownViewer content={selectedDoc.content} />
            </div>
            <div className="pt-4 border-t border-border/50 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="px-6"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}