
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import ImportEmployees from './pages/ImportEmployees';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [loginError, setLoginError] = React.useState('');
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleLogin = async (username: string, password: string) => {
    setIsLoggingIn(true);
    setLoginError('');
    
    const success = await login(username, password);
    
    if (!success) {
      setLoginError('Invalid username or password');
    }
    
    setIsLoggingIn(false);
  };

  if (!isAuthenticated) {
    return (
      <LoginForm 
        onLogin={handleLogin}
        isLoading={isLoggingIn}
        error={loginError}
      />
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/dashboard" />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/add" element={<AddEmployee />} />
        <Route path="employees/import" element={<ImportEmployees />} />
        <Route path="departments" element={<div>Departments - Coming Soon</div>} />
        <Route path="units" element={<div>Units - Coming Soon</div>} />
        <Route path="attendance" element={<div>Attendance - Coming Soon</div>} />
        <Route path="reports" element={<div>Reports - Coming Soon</div>} />
        <Route path="settings" element={<div>Settings - Coming Soon</div>} />
        <Route path="my-attendance" element={<div>My Attendance - Coming Soon</div>} />
        <Route path="schedule" element={<div>Schedule - Coming Soon</div>} />
        <Route path="profile" element={<div>Profile - Coming Soon</div>} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AuthenticatedApp />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
