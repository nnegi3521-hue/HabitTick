import React from 'react';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string, date: string) => void;
  onDelete?: (id: string) => void;
  readonly?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onDelete, readonly = false }) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);

  // Calculate Streak
  const getStreak = () => {
    let streak = 0;
    const dates = [...habit.completedDates].sort().reverse();
    const now = new Date();
    
    // Check from today or yesterday
    let checkDate = now;
    let dateStr = checkDate.toISOString().split('T')[0];
    
    if (dates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        dateStr = checkDate.toISOString().split('T')[0];
    } else {
        // If not completed today, check yesterday to continue streak
        checkDate.setDate(checkDate.getDate() - 1);
        dateStr = checkDate.toISOString().split('T')[0];
    }

    while (dates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        dateStr = checkDate.toISOString().split('T')[0];
    }
    return streak;
  };

  const streak = getStreak();
  
  // Last 7 days visualization
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'narrow' });
  };

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500',
    green: 'bg-green-50 text-green-700 border-green-200 ring-green-500',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200 ring-cyan-500',
  };

  const activeColor = colorClasses[habit.color || 'blue'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${activeColor.split(' ')[0]} ${activeColor.split(' ')[1]}`}>
               {habit.category}
             </span>
             <span className="text-xs text-slate-400">• {habit.frequency}</span>
           </div>
           <h3 className="text-lg font-bold text-slate-800">{habit.title}</h3>
           <p className="text-sm text-slate-500">{habit.description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-center">
            <span className="block text-xl font-bold text-slate-700">{streak}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Streak</span>
          </div>
          {onDelete && !readonly && (
            <button 
              onClick={() => onDelete(habit.id)}
              className="text-slate-300 hover:text-red-500 transition-colors p-1"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <div className="flex gap-2">
            {last7Days.map((date) => {
                const isDone = habit.completedDates.includes(date);
                const isToday = date === today;
                return (
                    <div key={date} className="flex flex-col items-center gap-1">
                        <div 
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] 
                            ${isDone ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-400'}
                            ${isToday && !isDone ? 'ring-2 ring-indigo-300 ring-offset-1' : ''}
                            `}
                        >
                            {isDone && <i className="fa-solid fa-check"></i>}
                        </div>
                        <span className="text-[9px] text-slate-400 uppercase">{getDayName(date)}</span>
                    </div>
                );
            })}
        </div>

        {!readonly && (
             <button
             onClick={() => onToggle(habit.id, today)}
             className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
               ${isCompletedToday 
                 ? 'bg-green-500 text-white shadow-lg shadow-green-200 transform scale-105' 
                 : 'bg-white border-2 border-slate-200 text-slate-300 hover:border-indigo-500 hover:text-indigo-500'}
             `}
           >
             <i className="fa-solid fa-check text-lg"></i>
           </button>
        )}
      </div>
    </div>
  );
};
