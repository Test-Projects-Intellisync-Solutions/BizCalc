import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Lightbulb, ChartBar, Wrench, Book, HelpCircle, FileText } from 'lucide-react';
import { docSections } from './content';
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

export interface DocItem {
  id: string;
  label: string;
  content: string;
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ content: string; title: string } | null>(null);
  // Add a forceUpdate state to trigger re-renders when content changes
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force refresh of content on mount and periodically
  useEffect(() => {
    // Force an initial update
    setForceUpdate(prev => prev + 1);
    
    // Set up a periodic refresh
    const interval = setInterval(() => {
      setForceUpdate(prev => prev + 1);
    }, 5000); // Check for updates every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const filteredSections = useMemo(() => docSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0), [searchQuery, forceUpdate]);

  const handleDocSelect = useCallback((content: string, title: string) => {
    setSelectedDoc({ content, title });
    setIsDialogOpen(true);
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

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