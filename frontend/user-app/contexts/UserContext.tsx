'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/lib/models/User';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => void;
  refreshTrigger: number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshUser = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, refreshTrigger }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function useUserRefresh() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserRefresh must be used within a UserProvider');
  }
  return { triggerRefresh: context.refreshUser, refreshTrigger: context.refreshTrigger };
}
