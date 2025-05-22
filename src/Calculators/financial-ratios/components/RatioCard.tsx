import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip } from '@mui/material';
import { RatioCardProps } from '../types';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const RatioCard: React.FC<RatioCardProps> = ({
  title,
  value,
  description,
  isGood = true,
  format = 'number',
}) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percent':
        return `${val.toFixed(2)}%`;
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(val);
      case 'days':
        return `${Math.round(val)} days`;
      case 'number':
      default:
        return val.toFixed(2);
    }
  };

  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%',
        borderLeft: 4,
        borderColor: isGood ? 'success.main' : 'warning.main',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="div" gutterBottom>
            {title}
          </Typography>
          <Tooltip title={description} arrow>
            <HelpOutlineIcon color="action" fontSize="small" sx={{ mt: 0.5 }} />
          </Tooltip>
        </Box>
        
        <Typography 
          variant="h4" 
          component="div" 
          color={isGood ? 'success.dark' : 'warning.dark'}
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          {formatValue(value)}
        </Typography>
        
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{
            display: 'block',
            fontStyle: 'italic',
            mt: 1,
          }}
        >
          {isGood ? 'Good' : 'Needs attention'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RatioCard;
