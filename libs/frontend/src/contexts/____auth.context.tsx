'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContext {
  auth: boolean;
  setAuth: any;
}

export const AuthContext = createContext<AuthContext>({
  auth: false,
  setAuth: '',
});

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState(false);
  useEffect(() => {}, []);
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
