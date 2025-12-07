'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AlertContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <AlertContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlertRefresh() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertRefresh must be used within AlertProvider');
  }
  return context;
}
