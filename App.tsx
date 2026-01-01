import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import { User, UserRole } from './types';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        StorageService.init(); // Initialize mock DB
        const storedUser = StorageService.getCurrentUser();
        if (storedUser) {
          setCurrentUser(storedUser);
        }
      } catch (error) {
        console.error("Failed to initialize app:", error);
        // Fallback or recovery could happen here, 
        // for now just ensure we don't stick on loading
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={currentUser} 
      onLogout={handleLogout}
      title={currentUser.role === UserRole.ADMIN ? 'Admin Dashboard' : 'My Habits'}
    >
      {currentUser.role === UserRole.ADMIN ? (
        <AdminDashboard />
      ) : (
        <UserDashboard user={currentUser} />
      )}
    </Layout>
  );
};

export default App;