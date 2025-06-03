import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CircleHelp, Target } from 'lucide-react';

interface GuideStep {
  title: string;
  description: string;
}

interface GuideCardProps {
  title: string;
  steps: GuideStep[];
  interpretations: GuideStep[];
}

export default function GuideCard({ title, steps, interpretations }: GuideCardProps) {
  return (
    <Card className="mb-6 bg-blue-50/50 shadow-sm dark:bg-blue-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CircleHelp className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="how-to-use">
            <AccordionTrigger className="text-left">
              How to Use This Calculator
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="how-to-interpret">
            <AccordionTrigger className="text-left">
              How to Interpret Results
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {interpretations.map((interpretation, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{interpretation.title}</h4>
                      <p className="text-sm text-muted-foreground">{interpretation.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}