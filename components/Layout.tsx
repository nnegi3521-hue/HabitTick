import React from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storageService';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, title }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-check text-white text-sm"></i>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  HabitFlow
                </span>
              </div>
              {user && (
                <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                  <span className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    {title || 'Dashboard'}
                  </span>
                </div>
              )}
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                   {user.role === UserRole.ADMIN && (
                     <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase rounded-md">
                       Admin
                     </span>
                   )}
                   <span className="hidden md:block text-sm font-medium text-slate-700">{user.name}</span>
                   <img className="h-8 w-8 rounded-full border border-slate-200" src={user.avatar} alt="" />
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-500 hover:bg-slate-100 transition-colors"
                  title="Sign out"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
