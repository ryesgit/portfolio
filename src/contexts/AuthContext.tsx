import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  // Add auth context types as needed
}

const AuthContext = createContext<AuthContextType>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};