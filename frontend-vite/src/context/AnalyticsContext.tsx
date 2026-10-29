import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { AnalyticsContext } from './analyticsContext';
import type { AnalyticsData } from './analyticsContext';

const AnalyticsContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(null);
  // ...advanced analytics context logic here
  return (
    <AnalyticsContext.Provider value={{ analyticsData, setAnalyticsData }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsContextProvider;
