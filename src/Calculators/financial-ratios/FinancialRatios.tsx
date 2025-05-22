import React, { useState, useCallback } from 'react';
// Define types for our styles
interface Styles {
  [key: string]: React.CSSProperties | ((size: number) => React.CSSProperties);
  container: React.CSSProperties;
  title: React.CSSProperties;
  sectionTitle: React.CSSProperties;
  card: React.CSSProperties;
  gridContainer: React.CSSProperties;
  gridItem: React.CSSProperties;
  divider: React.CSSProperties;
  gridRow: React.CSSProperties;
  gridCol: (size: number) => React.CSSProperties;
}

// Styled components using properly typed inline styles
const styles: Styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    color: '#666',
    margin: '16px 0',
    fontWeight: 500,
  },
  card: {
    background: '#fff',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '24px',
    marginBottom: '24px',
  },
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    margin: '0 -12px',
    width: 'calc(100% + 24px)',
  },
  gridItem: {
    padding: '0 12px',
    boxSizing: 'border-box' as const,
    width: '100%',
    marginBottom: '24px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '24px 0',
    border: 'none',
  },
  gridRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    margin: '0 -12px',
    width: '100%',
  },
  gridCol: (size: number) => ({
    padding: '0 12px',
    boxSizing: 'border-box' as const,
    width: `${(size / 12) * 100}%`,
    marginBottom: '16px',
  }),
};
import type { FinancialRatios } from './types';
import { FinancialMetrics, FinancialRatiosState } from './types';
import RatioCard from './components/RatioCard.tsx';
import RatioForm from './components/RatioForm.tsx';

const FinancialRatios: React.FC = () => {
  const [state, setState] = useState<FinancialRatiosState>({
    metrics: {
      // Liquidity
      currentAssets: 0,
      currentLiabilities: 0,
      inventory: 0,
      
      // Profitability
      netIncome: 0,
      revenue: 0,
      totalAssets: 0,
      shareholderEquity: 0,
      
      // Leverage
      totalDebt: 0,
      ebitda: 0,
      
      // Efficiency
      cogs: 0,
      averageInventory: 0,
      accountsReceivable: 0,
      accountsPayable: 0,
    },
    ratios: {
      // Liquidity
      currentRatio: 0,
      quickRatio: 0,
      
      // Profitability
      netProfitMargin: 0,
      returnOnAssets: 0,
      returnOnEquity: 0,
      
      // Leverage
      debtToEquity: 0,
      interestCoverage: 0,
      
      // Efficiency
      inventoryTurnover: 0,
      daysSalesOutstanding: 0,
      daysPayableOutstanding: 0,
    },
  });

  const calculateRatios = useCallback((metrics: FinancialMetrics): FinancialRatios => {
    // Liquidity Ratios
    const currentRatio = metrics.currentLiabilities !== 0 
      ? metrics.currentAssets / metrics.currentLiabilities 
      : 0;
      
    const quickRatio = metrics.currentLiabilities !== 0 
      ? (metrics.currentAssets - metrics.inventory) / metrics.currentLiabilities 
      : 0;

    // Profitability Ratios
    const netProfitMargin = metrics.revenue !== 0 
      ? (metrics.netIncome / metrics.revenue) * 100 
      : 0;
      
    const returnOnAssets = metrics.totalAssets !== 0 
      ? (metrics.netIncome / metrics.totalAssets) * 100 
      : 0;
      
    const returnOnEquity = metrics.shareholderEquity !== 0 
      ? (metrics.netIncome / metrics.shareholderEquity) * 100 
      : 0;

    // Leverage Ratios
    const debtToEquity = metrics.shareholderEquity !== 0 
      ? metrics.totalDebt / metrics.shareholderEquity 
      : 0;
      
    const interestCoverage = metrics.ebitda !== 0 
      ? metrics.ebitda / (metrics.totalDebt * 0.05) // Assuming 5% interest rate for simplicity
      : 0;

    // Efficiency Ratios
    const inventoryTurnover = metrics.averageInventory !== 0 
      ? metrics.cogs / metrics.averageInventory 
      : 0;
      
    const daysSalesOutstanding = metrics.revenue !== 0 
      ? (metrics.accountsReceivable / metrics.revenue) * 365 
      : 0;
      
    const daysPayableOutstanding = metrics.cogs !== 0 
      ? (metrics.accountsPayable / metrics.cogs) * 365 
      : 0;

    return {
      currentRatio,
      quickRatio,
      netProfitMargin,
      returnOnAssets,
      returnOnEquity,
      debtToEquity,
      interestCoverage,
      inventoryTurnover,
      daysSalesOutstanding,
      daysPayableOutstanding,
    };
  }, []);

  const handleMetricsChange = useCallback((newMetrics: Partial<FinancialMetrics>) => {
    setState(prevState => {
      const updatedMetrics = { ...prevState.metrics, ...newMetrics };
      const updatedRatios = calculateRatios(updatedMetrics);
      
      return {
        metrics: updatedMetrics,
        ratios: updatedRatios,
      };
    });
  }, [calculateRatios]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Financial Ratios Calculator</h1>
      
      <div style={styles.gridContainer}>
        <div style={{ ...styles.gridItem, flex: '0 0 33.333%', maxWidth: '33.333%' }}>
          <div style={styles.card}>
            <h2 style={{ ...styles.sectionTitle, marginTop: 0 }}>Input Metrics</h2>
            <RatioForm metrics={state.metrics} onChange={handleMetricsChange} />
          </div>
        </div>
        
        <div style={{ ...styles.gridItem, flex: '0 0 66.666%', maxWidth: '66.666%' }}>
          <h2 style={{ ...styles.title, fontSize: '1.5rem', marginBottom: '16px' }}>Financial Ratios</h2>
          
          <h3 style={styles.sectionTitle}>Liquidity Ratios</h3>
          <div style={styles.gridRow}>
            <div style={styles.gridCol(6)}>
              <RatioCard
                title="Current Ratio"
                value={state.ratios.currentRatio}
                description="Measures short-term liquidity (higher is better)"
                isGood={state.ratios.currentRatio >= 1.5}
                format="number"
              />
            </div>
            <div style={styles.gridCol(6)}>
              <RatioCard
                title="Quick Ratio"
                value={state.ratios.quickRatio}
                description="Measures immediate liquidity (higher is better)"
                isGood={state.ratios.quickRatio >= 1}
                format="number"
              />
            </div>
          </div>
          
          <hr style={styles.divider} />
          
          <h3 style={styles.sectionTitle}>Profitability Ratios</h3>
          <div style={styles.gridRow}>
            <div style={styles.gridCol(4)}>
              <RatioCard
                title="Net Profit Margin"
                value={state.ratios.netProfitMargin}
                description="Profit per dollar of revenue"
                isGood={state.ratios.netProfitMargin > 10}
                format="percent"
              />
            </div>
            <div style={styles.gridCol(4)}>
              <RatioCard
                title="ROA"
                value={state.ratios.returnOnAssets}
                description="Return on Assets"
                isGood={state.ratios.returnOnAssets > 5}
                format="percent"
              />
            </div>
            <div style={styles.gridCol(4)}>
              <RatioCard
                title="ROE"
                value={state.ratios.returnOnEquity}
                description="Return on Equity"
                isGood={state.ratios.returnOnEquity > 15}
                format="percent"
              />
            </div>
          </div>
          
          <hr style={styles.divider} />
          
          <h3 style={styles.sectionTitle}>Leverage Ratios</h3>
          <div style={styles.gridRow}>
            <div style={styles.gridCol(6)}>
              <RatioCard
                title="Debt to Equity"
                value={state.ratios.debtToEquity}
                description="Financial leverage ratio"
                isGood={state.ratios.debtToEquity < 2}
                format="number"
              />
            </div>
            <div style={styles.gridCol(6)}>
              <RatioCard
                title="Interest Coverage"
                value={state.ratios.interestCoverage}
                description="Ability to pay interest"
                isGood={state.ratios.interestCoverage > 3}
                format="number"
              />
            </div>
          </div>
          
          <hr style={styles.divider} />
          
          <h3 style={styles.sectionTitle}>Efficiency Ratios</h3>
          <div style={styles.gridRow}>
            <div style={styles.gridCol(4)}>
              <RatioCard
                title="Inventory Turnover"
                value={state.ratios.inventoryTurnover}
                description="How quickly inventory sells"
                isGood={state.ratios.inventoryTurnover > 5}
                format="number"
              />
            </div>
            <div style={styles.gridCol(4)}>
              <RatioCard
                title="Days Sales Outstanding"
                value={state.ratios.daysSalesOutstanding}
                description="Days to collect payment"
                isGood={state.ratios.daysSalesOutstanding < 45}
                format="days"
              />
            </div>
            <div style={styles.gridCol(4)}>
              <RatioCard
                title="Days Payable Outstanding"
                value={state.ratios.daysPayableOutstanding}
                description="Days to pay suppliers"
                isGood={state.ratios.daysPayableOutstanding > 30}
                format="days"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialRatios;
