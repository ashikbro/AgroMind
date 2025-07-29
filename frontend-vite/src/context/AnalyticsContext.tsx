import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

type AnalyticsData = Record<string, unknown> | null;
interface AnalyticsContextType {
  analyticsData: AnalyticsData;
  setAnalyticsData: React.Dispatch<React.SetStateAction<AnalyticsData>>;
}

export const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

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
