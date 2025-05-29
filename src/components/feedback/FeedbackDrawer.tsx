import React from 'react';
import { FeedbackItem } from '@/data/feedbackRules';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { XIcon, InfoIcon, CheckCircleIcon, AlertTriangleIcon, AlertOctagonIcon } from 'lucide-react';

interface FeedbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackItems: FeedbackItem[];
  calculatorName?: string; 
}

const severityIcons = {
  info: <InfoIcon className="h-5 w-5 text-blue-500" />,
  good: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
  warning: <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />,
  critical: <AlertOctagonIcon className="h-5 w-5 text-red-500" />,
};

const severityColors = {
  info: 'text-blue-700 bg-blue-50 border-blue-300',
  good: 'text-green-700 bg-green-50 border-green-300',
  warning: 'text-yellow-700 bg-yellow-50 border-yellow-300',
  critical: 'text-red-700 bg-red-50 border-red-300',
};

export const FeedbackDrawer: React.FC<FeedbackDrawerProps> = ({ isOpen, onClose, feedbackItems, calculatorName }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end" onClick={onClose}>
      <div 
        className="w-full max-w-md h-full bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside drawer
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{calculatorName ? `${calculatorName} Feedback` : 'Feedback Analysis'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {feedbackItems.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <InfoIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p>No specific feedback items to display at this time.</p>
              <p>Ensure all inputs are complete for a full analysis.</p>
            </div>
          ) : (
            feedbackItems.map((item) => (
              <Card key={item.id} className={`shadow-md border-l-4 ${severityColors[item.severity] || 'border-gray-300'}`}>
                <CardHeader className="pb-2 pt-3">
                  <div className="flex items-start">
                    <span className="mr-3 pt-1">{severityIcons[item.severity] || <InfoIcon className="h-5 w-5" />}</span>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-2 pl-11">
                  <p>{item.message}</p>
                  {item.implication && (
                    <div>
                      <h4 className="font-semibold">Implication:</h4>
                      <p>{item.implication}</p>
                    </div>
                  )}
                  {item.recommendation && (
                    <div>
                      <h4 className="font-semibold">Recommendation:</h4>
                      <p>{item.recommendation}</p>
                    </div>
                  )}
                  {item.link && (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Learn more
                    </a>
                  )}
                  {/* TODO: Display relevantMetrics in a structured way if needed */}
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <div className="p-4 border-t">
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </div>
  );
};
