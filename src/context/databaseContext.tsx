"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

export interface DatabaseTable {
  table_name: string;
  columns: string[];
}

interface DatabaseContextProperties {
  tables: DatabaseTable[];
  updateTables: (newTables: DatabaseTable[]) => void;
  clearTables: () => void;
}

const DatabaseContext = createContext({} as DatabaseContextProperties);

export const useDatabaseContext = () => useContext(DatabaseContext);

export const DatabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tables, setTables] = useState<DatabaseTable[]>([]);

  useEffect(() => {
    const storedTables = localStorage.getItem("tables");
    if (storedTables) {
      setTables(JSON.parse(storedTables));
    }
  }, []);

  const updateTables = (newTables: DatabaseTable[]) => {
    setTables(newTables);
    localStorage.setItem("tables", JSON.stringify(newTables));
  };

  const clearTables = () => {
    setTables([]);
    localStorage.removeItem("tables");
  };

  return (
    <DatabaseContext.Provider value={{ tables, updateTables, clearTables }}>
      {children}
    </DatabaseContext.Provider>
  );
};
