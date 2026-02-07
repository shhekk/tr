'use client';
import { createContext, useContext } from 'react';

export interface Vaiables {
  BACKEND_URL: string;
}

export const VariableContext = createContext<Vaiables>({
  BACKEND_URL: '',
});

export const VariableContextProvider = ({
  variables,
  children,
}: {
  variables: Vaiables;
  children: React.ReactNode;
}) => {
  return (
    <VariableContext.Provider value={{ ...variables }}>
      {children}
    </VariableContext.Provider>
  );
};

export const useVariables = () => {
  return useContext(VariableContext);
};
