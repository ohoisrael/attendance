
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUsers } from '@/data/mockData';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    const mockCredentials = [
      { username: 'admin', password: 'admin', userId: '1' },
      { username: 'hr', password: 'hr123', userId: '2' },
      { username: 'patricia.nurse', password: 'password', userId: '2' },
    ];

    const credential = mockCredentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (credential) {
      const foundUser = mockUsers.find(u => u.id === credential.userId);
      if (foundUser) {
        setUser(foundUser);
        return true;
      }
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
