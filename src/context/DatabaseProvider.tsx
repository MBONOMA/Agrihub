import React, { createContext, useContext, ReactNode } from 'react';
import { database } from '../database';

type DatabaseType = typeof database;

interface DatabaseContextType {
  database: DatabaseType;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  return (
    <DatabaseContext.Provider value={{ database }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase(): DatabaseType {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context.database;
}
