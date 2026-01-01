import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { User, Habit } from '../types';
import { HabitCard } from './HabitCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userHabits, setUserHabits] = useState<Habit[]>([]);
  const [allHabits, setAllHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const loadedUsers = StorageService.getUsers();
    setUsers(loadedUsers);
    const loadedHabits = StorageService.getHabits();
    setAllHabits(loadedHabits);
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    const habits = StorageService.getUserHabits(user.id);
    setUserHabits(habits);
  };

  // Stats Logic
  const categoryData = allHabits.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: curr.category, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // User engagement data
  const engagementData = users.map(u => {
    const count = allHabits.filter(h => h.userId === u.id).length;
    return { name: u.name.split(' ')[0], habits: count };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Stats Section */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Habits by Category</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">User Engagement</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} />
                      <Bar dataKey="habits" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
          </div>

          {/* User Details Area */}
           {selectedUser ? (
            <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <img src={selectedUser.avatar} className="w-12 h-12 rounded-full shadow-sm" alt={selectedUser.name} />
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Viewing: {selectedUser.name}</h2>
                        <p className="text-sm text-slate-500">{selectedUser.email}</p>
                    </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Close View
                </button>
              </div>

              {userHabits.length === 0 ? (
                <p className="text-center text-slate-500 py-8">No habits found for this user.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userHabits.map(habit => (
                    <HabitCard 
                        key={habit.id} 
                        habit={habit} 
                        onToggle={() => {}} 
                        readonly={true}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                <i className="fa-solid fa-users-viewfinder text-4xl text-slate-300 mb-4"></i>
                <p className="text-slate-500">Select a user from the right sidebar to inspect their habit progress in detail.</p>
            </div>
          )}
        </div>

        {/* Sidebar List of Users */}
        <div className="w-full md:w-1/3">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
             <div className="p-4 border-b border-slate-100 bg-slate-50">
               <h3 className="font-bold text-slate-700">All Users ({users.length})</h3>
             </div>
             <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {users.map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left
                        ${selectedUser?.id === user.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}
                    `}
                  >
                    <img src={user.avatar} className="w-10 h-10 rounded-full" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                        {user.role}
                    </span>
                  </button>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
