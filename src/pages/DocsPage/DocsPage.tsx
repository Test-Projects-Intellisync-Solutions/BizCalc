import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Lightbulb, ChartBar, Wrench, Book, HelpCircle, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import { docSections } from '@/components/docs/content';
import { MarkdownViewer } from './MarkdownViewer';

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
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Documentation</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-10 w-10" 
            title="Refresh documentation"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documentation..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading documentation</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSections.map((section) => {
          const Icon = sectionIcons[section.label as keyof typeof sectionIcons];
          return (
            <Card key={section.label} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-5 w-5 text-primary" />}
                  <CardTitle className="text-lg">{section.label}</CardTitle>
                </div>
                <CardDescription>
                  {sectionDescriptions[section.label as keyof typeof sectionDescriptions]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleDocSelect(item.content, item.label)}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedDoc && (
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>{selectedDoc.title}</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto pr-6">
              <MarkdownViewer content={selectedDoc.content} />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}