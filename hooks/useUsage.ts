
import { useState, useEffect, useCallback } from 'react';
import { FREE_TIER_LIMIT } from '../constants';
import type { UsageData } from '../types';

const USAGE_STORAGE_KEY = 'gemini-ai-agent-usage';
const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

const getDefaultUsage = (): UsageData => ({
  messageCount: 0,
  resetTimestamp: 0,
  isPremium: false,
});

export const useUsage = () => {
  const [usage, setUsage] = useState<UsageData>(getDefaultUsage);

  useEffect(() => {
    try {
      const storedUsage = localStorage.getItem(USAGE_STORAGE_KEY);
      if (storedUsage) {
        setUsage(JSON.parse(storedUsage));
      }
    } catch (error) {
      console.error("Failed to parse usage data from localStorage", error);
      localStorage.removeItem(USAGE_STORAGE_KEY);
    }
  }, []);

  const saveUsage = (newUsage: UsageData) => {
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(newUsage));
    setUsage(newUsage);
  };

  const checkAndResetUsage = useCallback(() => {
    const now = Date.now();
    if (usage.resetTimestamp > 0 && now - usage.resetTimestamp > TWENTY_FOUR_HOURS_IN_MS) {
      const freshUsage = { ...usage, messageCount: 0, resetTimestamp: 0 };
      saveUsage(freshUsage);
      return freshUsage;
    }
    return usage;
  }, [usage]);
  
  const incrementUsage = useCallback(() => {
    const currentUsage = checkAndResetUsage();
    
    const newCount = currentUsage.messageCount + 1;
    const newTimestamp = currentUsage.resetTimestamp === 0 ? Date.now() : currentUsage.resetTimestamp;

    saveUsage({ ...currentUsage, messageCount: newCount, resetTimestamp: newTimestamp });
  }, [checkAndResetUsage]);

  const subscribe = useCallback(() => {
    saveUsage({ ...usage, isPremium: true });
  }, [usage]);

  const isLimitReached = () => {
    const currentUsage = checkAndResetUsage();
    return !currentUsage.isPremium && currentUsage.messageCount >= FREE_TIER_LIMIT;
  };

  return { usage, incrementUsage, subscribe, isLimitReached, checkAndResetUsage };
};
