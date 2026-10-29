import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export type AnalyticsData = Record<string, unknown> | null;

export interface AnalyticsContextType {
  analyticsData: AnalyticsData;
  setAnalyticsData: Dispatch<SetStateAction<AnalyticsData>>;
}

export const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);
