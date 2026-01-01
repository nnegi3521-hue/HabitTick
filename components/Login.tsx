import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { User } from '../types';
import { Button } from './Button';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLogin = (email: string) => {
    setIsAnimating(true);
    // Simulate network delay for realism
    setTimeout(() => {
      const user = StorageService.login(email);
      if (user) {
        onLogin(user);
      }
      setIsAnimating(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <i className="fa-solid fa-chart-line text-white text-3xl"></i>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to HabitFlow
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Track your habits, get AI insights, and achieve your goals.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Sign in with</span>
            </div>
          </div>

          <Button 
            variant="google" 
            className="w-full justify-center gap-3 py-3"
            onClick={() => handleLogin('alex@gmail.com')}
            isLoading={isAnimating}
          >
             <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google logo" />
             Continue with Google (User Demo)
          </Button>

          <Button 
            variant="secondary" 
            className="w-full justify-center gap-3 py-3"
            onClick={() => handleLogin('admin@habitflow.com')}
            disabled={isAnimating}
          >
             <i className="fa-solid fa-shield-halved text-purple-600"></i>
             Sign in as Admin
          </Button>

          <p className="text-xs text-center text-slate-400 mt-4">
            Note: This is a frontend-only demo. Authentication is simulated locally.
          </p>
        </div>
      </div>
    </div>
  );
};
