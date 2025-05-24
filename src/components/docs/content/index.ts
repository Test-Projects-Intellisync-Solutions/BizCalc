import { calculatorGuides } from './calculator-guides';
import { financialConcepts } from './financial-concepts';
import { industryBenchmarks } from './industry-benchmarks';
import { howToGuides } from './how-to-guides';
import { glossaryTerms } from './glossary';
import { faqs } from './faqs';
import { caseStudies } from './case-studies';
import { businessPlanningDocs } from './business-planning';

// Create a function to ensure we always get fresh content

const getDocSections = () => [
  {
    label: "📘 Calculator Guides",
    icon: "BookOpen",
    items: [...calculatorGuides]
  },
  {
    label: "💡 Financial Concepts",
    icon: "Lightbulb",
    items: [...financialConcepts]
  },
  {
    label: "📊 Industry Benchmarks",
    icon: "ChartBar",
    items: [...industryBenchmarks]
  },
  {
    label: "🛠️ How-To Guides",
    icon: "Wrench",
    items: [...howToGuides]
  },
  {
    label: "📘 Glossary",
    icon: "Book",
    items: [...glossaryTerms]
  },
  {
    label: "❓ FAQs",
    icon: "HelpCircle", 
    items: [...faqs]
  },
  {
    label: "🔍 Case Studies",
    icon: "FileText",
    items: [...caseStudies]
  },
  {
    label: "📋 Business Planning",
    icon: "ClipboardList",
    items: [...businessPlanningDocs]
  }
];

export const docSections = getDocSections();

// Allow for refreshing the content
export const refreshDocSections = () => getDocSections();