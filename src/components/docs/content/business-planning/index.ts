import { businessPlanOutline } from './business-plan-outline';
import { executiveSummaryTemplate } from './executive-summary';
import { marketAnalysisReport } from './market-analysis';
import { competitiveAnalysis } from './competitive-analysis';
import { financialProjections } from './financial-projections';
import { riskManagementPlan } from './risk-management';
import { swotAnalysis } from './swot-analysis';
import { strategicPlanning } from './strategic-planning';
import { marketingPlan } from './marketing-plan';
import { operationalPlan } from './operational-plan';
import { fundingStrategy } from './funding-strategy';

export const businessPlanningDocs = [
  executiveSummaryTemplate,   // Start with the high-level summary
  businessPlanOutline,         // Follow with the full plan structure
  strategicPlanning,           // Then strategic direction
  marketAnalysisReport,        // Market understanding
  competitiveAnalysis,         // Competitive landscape
  swotAnalysis,                // Strengths/weaknesses analysis
  marketingPlan,               // Marketing strategy
  operationalPlan,             // Operational details
  financialProjections,         // Financial planning
  fundingStrategy,             // Funding approach
  riskManagementPlan           // Risk assessment and mitigation
];