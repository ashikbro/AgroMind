import { useContext } from 'react';
import { AnalyticsContext } from './AnalyticsContext';

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsContextProvider');
  }
  return context;
};
