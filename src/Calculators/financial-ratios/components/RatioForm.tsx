import React from 'react';
import { TextField, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FinancialMetrics } from '../types';

interface RatioFormProps {
  metrics: FinancialMetrics;
  onChange: (updates: Partial<FinancialMetrics>) => void;
}

const RatioForm: React.FC<RatioFormProps> = ({ metrics, onChange }) => {
  const handleChange = (field: keyof FinancialMetrics) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    onChange({ [field]: value });
  };

  return (
    <Box>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Liquidity Metrics</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Current Assets"
            type="number"
            value={metrics.currentAssets || ''}
            onChange={handleChange('currentAssets')}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Current Liabilities"
            type="number"
            value={metrics.currentLiabilities || ''}
            onChange={handleChange('currentLiabilities')}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Inventory"
            type="number"
            value={metrics.inventory || ''}
            onChange={handleChange('inventory')}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Profitability Metrics</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Net Income"
            type="number"
            value={metrics.netIncome || ''}
            onChange={handleChange('netIncome')}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Revenue"
            type="number"
            value={metrics.revenue || ''}
            onChange={handleChange('revenue')}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Total Assets"
            type="number"
            value={metrics.totalAssets || ''}
            onChange={handleChange('totalAssets')}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Shareholder Equity"
            type="number"
            value={metrics.shareholderEquity || ''}
            onChange={handleChange('shareholderEquity')}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Leverage Metrics</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Total Debt"
            type="number"
            value={metrics.totalDebt || ''}
            onChange={handleChange('totalDebt')}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="EBITDA"
            type="number"
            value={metrics.ebitda || ''}
            onChange={handleChange('ebitda')}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Earnings Before Interest, Taxes, Depreciation, and Amortization"
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Efficiency Metrics</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Cost of Goods Sold (COGS)"
            type="number"
            value={metrics.cogs || ''}
            onChange={handleChange('cogs')}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Average Inventory"
            type="number"
            value={metrics.averageInventory || ''}
            onChange={handleChange('averageInventory')}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Accounts Receivable"
            type="number"
            value={metrics.accountsReceivable || ''}
            onChange={handleChange('accountsReceivable')}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Accounts Payable"
            type="number"
            value={metrics.accountsPayable || ''}
            onChange={handleChange('accountsPayable')}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default RatioForm;
