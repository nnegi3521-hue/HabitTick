import React from 'react';
import { Habit } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface WeeklyAnalysisProps {
  habits: Habit[];
}

export const WeeklyAnalysis: React.FC<WeeklyAnalysisProps> = ({ habits }) => {
  // Generate last 7 days
  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Count completions for this day
    const completedCount = habits.filter(h => h.completedDates.includes(dateStr)).length;
    
    return {
        date: dateStr,
        day: dayName,
        completed: completedCount
    };
  });

  const totalCompletions = data.reduce((acc, curr) => acc + curr.completed, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
       <div className="flex justify-between items-end mb-6">
         <div>
            <h3 className="text-lg font-bold text-slate-800">Weekly Progress</h3>
            <p className="text-sm text-slate-400">Day-wise habit consistency</p>
         </div>
         <div className="text-right">
             <span className="block text-2xl font-bold text-indigo-600">{totalCompletions}</span>
             <span className="text-xs text-slate-400 uppercase font-semibold">Total Wins</span>
         </div>
       </div>

       <div className="h-48 w-full">
         <ResponsiveContainer width="100%" height="100%">
           <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
             <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                dy={10}
             />
             <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                allowDecimals={false}
             />
             <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
             />
             <Bar 
                dataKey="completed" 
                fill="#6366f1" 
                radius={[4, 4, 4, 4]} 
                barSize={20}
                animationDuration={1000}
             />
           </BarChart>
         </ResponsiveContainer>
       </div>
    </div>
  );
};
