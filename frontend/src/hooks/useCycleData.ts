import { useState, useEffect, useCallback } from 'react';
import { CycleEntry, CycleLogInput, CyclePrediction } from '../types';

const API_URL = process.env.REACT_APP_API_ENDPOINT || '';

// Demo mode flag - set to true when API is unavailable
const USE_DEMO_MODE = false;

// Calculate predictions based on logged cycles
const calculatePredictions = (cycles: CycleEntry[]): CyclePrediction | null => {
  if (cycles.length === 0) return null;
  
  // Sort cycles by start date (most recent first)
  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  
  // Calculate average cycle length (need at least 2 cycles)
  let avgCycleLength = 28; // Default
  if (sortedCycles.length >= 2) {
    const cycleLengths: number[] = [];
    for (let i = 0; i < sortedCycles.length - 1; i++) {
      const current = new Date(sortedCycles[i].startDate);
      const previous = new Date(sortedCycles[i + 1].startDate);
      const length = Math.round((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
      if (length > 0 && length < 60) cycleLengths.push(length);
    }
    if (cycleLengths.length > 0) {
      avgCycleLength = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
    }
  }
  
  // Calculate average period length
  let avgPeriodLength = 5; // Default
  const periodLengths = sortedCycles
    .filter(c => c.endDate)
    .map(c => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate!);
      return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    })
    .filter(l => l > 0 && l < 15);
  
  if (periodLengths.length > 0) {
    avgPeriodLength = Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length);
  }
  
  // Calculate next period start based on last cycle
  const lastCycleStart = new Date(sortedCycles[0].startDate);
  const nextPeriodStart = new Date(lastCycleStart.getTime() + avgCycleLength * 24 * 60 * 60 * 1000);
  
  // Calculate confidence based on data consistency
  let confidence: 'low' | 'medium' | 'high' = 'low';
  if (cycles.length >= 3) confidence = 'medium';
  if (cycles.length >= 6) confidence = 'high';
  
  return {
    nextPeriodStart,
    nextPeriodEnd: new Date(nextPeriodStart.getTime() + avgPeriodLength * 24 * 60 * 60 * 1000),
    fertileWindowStart: new Date(nextPeriodStart.getTime() - 19 * 24 * 60 * 60 * 1000), // ~Day 10 of cycle
    fertileWindowEnd: new Date(nextPeriodStart.getTime() - 12 * 24 * 60 * 60 * 1000),   // ~Day 17 of cycle
    ovulationDate: new Date(nextPeriodStart.getTime() - 14 * 24 * 60 * 60 * 1000),      // ~Day 14 of cycle
    pmsStart: new Date(nextPeriodStart.getTime() - 7 * 24 * 60 * 60 * 1000),            // 7 days before period
    pmsEnd: new Date(nextPeriodStart.getTime() - 1 * 24 * 60 * 60 * 1000),              // 1 day before period
    averageCycleLength: avgCycleLength,
    averagePeriodLength: avgPeriodLength,
    confidence,
  };
};

// Local storage key removed — all data stored in DynamoDB via API

interface UseCycleDataReturn {
  cycles: CycleEntry[];
  predictions: CyclePrediction | null;
  loading: boolean;
  error: string | null;
  logCycle: (entry: CycleLogInput) => Promise<void>;
  updateCycle: (startDate: string, entry: CycleLogInput) => Promise<void>;
  deleteCycle: (startDate: string) => Promise<void>;
  refetch: () => Promise<void>;
}

// Default user ID for demo purposes - in production, this would come from auth context
const DEFAULT_USER_ID = 'demo-user';

export function useCycleData(userId: string = DEFAULT_USER_ID): UseCycleDataReturn {
  const [cycles, setCycles] = useState<CycleEntry[]>([]);
  const [predictions, setPredictions] = useState<CyclePrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCycles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/cycles?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cycles');
      }
      
      const data = await response.json();
      setCycles(data.items || []);
    } catch (err) {
      console.warn('API unavailable:', err);
      setCycles([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchPredictions = useCallback(async () => {
    // Skip if using demo mode - predictions are already set in fetchCycles
    if (USE_DEMO_MODE) return;
    
    try {
      const response = await fetch(`${API_URL}/cycles/predictions?userId=${userId}`);
      
      if (!response.ok) {
        // Predictions may not be available if not enough cycle data
        if (response.status === 404) {
          setPredictions(null);
          return;
        }
        throw new Error('Failed to fetch predictions');
      }
      
      const data = await response.json();
      // Convert date strings to Date objects
      setPredictions({
        ...data,
        nextPeriodStart: new Date(data.nextPeriodStart),
        nextPeriodEnd: new Date(data.nextPeriodEnd),
        fertileWindowStart: new Date(data.fertileWindowStart),
        fertileWindowEnd: new Date(data.fertileWindowEnd),
        ovulationDate: new Date(data.ovulationDate),
        pmsStart: new Date(data.pmsStart),
        pmsEnd: new Date(data.pmsEnd),
      });
    } catch (err) {
      // Don't set error for predictions - they're optional
      console.warn('Could not fetch predictions:', err);
      setPredictions(null);
    }
  }, [userId]);

  const refetch = useCallback(async () => {
    await Promise.all([fetchCycles(), fetchPredictions()]);
  }, [fetchCycles, fetchPredictions]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const logCycle = async (entry: CycleLogInput): Promise<void> => {
    try {
      setError(null);
      
      // Demo mode - add to local state and persist
      if (USE_DEMO_MODE) {
        const newCycle: CycleEntry = {
          PK: `USER#${userId}`,
          SK: `CYCLE#${entry.startDate}`,
          userId,
          startDate: entry.startDate,
          endDate: entry.endDate,
          flowIntensity: entry.flowIntensity,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const updatedCycles = [newCycle, ...cycles];
        setCycles(updatedCycles);
        setPredictions(calculatePredictions(updatedCycles));
        return;
      }
      
      const response = await fetch(`${API_URL}/cycles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...entry,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to log cycle');
      }
      
      // Refetch data after successful log
      await refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to log cycle';
      setError(message);
      throw err;
    }
  };

  const updateCycle = async (startDate: string, entry: CycleLogInput): Promise<void> => {
    try {
      setError(null);
      
      // Demo mode - update local state and persist
      if (USE_DEMO_MODE) {
        const updatedCycles = cycles.map(c => 
          c.startDate === startDate ? { 
            ...c, 
            startDate: entry.startDate,
            endDate: entry.endDate,
            flowIntensity: entry.flowIntensity,
            updatedAt: new Date().toISOString(),
          } : c
        );
        setCycles(updatedCycles);
        setPredictions(calculatePredictions(updatedCycles));
        return;
      }
      
      const response = await fetch(`${API_URL}/cycles/${encodeURIComponent(startDate)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...entry,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cycle');
      }
      
      // Refetch data after successful update
      await refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update cycle';
      setError(message);
      throw err;
    }
  };

  // Delete a cycle entry
  const deleteCycle = async (startDate: string): Promise<void> => {
    try {
      setError(null);
      
      if (USE_DEMO_MODE) {
        const updatedCycles = cycles.filter(c => c.startDate !== startDate);
        setCycles(updatedCycles);
        setPredictions(calculatePredictions(updatedCycles));
        return;
      }
      
      // API delete would go here
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete cycle';
      setError(message);
      throw err;
    }
  };

  return {
    cycles,
    predictions,
    loading,
    error,
    logCycle,
    updateCycle,
    deleteCycle,
    refetch,
  };
}

export default useCycleData;
