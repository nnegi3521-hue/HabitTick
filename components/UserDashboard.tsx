import React, { useState, useEffect } from 'react';
import { User, Habit } from '../types';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { HabitCard } from './HabitCard';
import { Button } from './Button';
import { WeeklyAnalysis } from './WeeklyAnalysis';
import { NutritionTracker } from './NutritionTracker';

interface UserDashboardProps {
  user: User;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [suggestionTopic, setSuggestionTopic] = useState('');
  
  // New Habit Form State
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Health');
  const [newHabitColor, setNewHabitColor] = useState('blue');
  const [newHabitFrequency, setNewHabitFrequency] = useState('Daily');
  const [newHabitReminder, setNewHabitReminder] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadHabits();
  }, [user.id]);

  const loadHabits = () => {
    setHabits(StorageService.getUserHabits(user.id));
  };

  const handleToggle = (id: string, date: string) => {
    StorageService.toggleHabitCompletion(id, date);
    loadHabits();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
        StorageService.deleteHabit(id);
        loadHabits();
    }
  };

  const handleGetInsight = async () => {
    setLoadingAI(true);
    const msg = await GeminiService.getPersonalizedInsight(habits);
    setAiMessage(msg);
    setLoadingAI(false);
  };

  const handleGetSuggestions = async () => {
    if (!suggestionTopic) return;
    setLoadingAI(true);
    const suggestions = await GeminiService.getHabitSuggestions(suggestionTopic);
    
    // Auto-add suggestions for demo fluidity
    suggestions.forEach(s => {
      const habit: Habit = {
        id: crypto.randomUUID(),
        userId: user.id,
        title: s.title,
        description: s.description || 'Suggested by AI',
        category: 'Growth',
        frequency: s.frequency || 'Daily',
        createdAt: new Date().toISOString(),
        completedDates: [],
        color: 'purple'
      };
      StorageService.addHabit(habit);
    });
    
    setSuggestionTopic('');
    setAiMessage(`Added ${suggestions.length} habits related to "${suggestionTopic}" to your dashboard!`);
    loadHabits();
    setLoadingAI(false);
  };

  const handleAddManualHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const habit: Habit = {
        id: crypto.randomUUID(),
        userId: user.id,
        title: newHabitTitle,
        description: 'Personal goal',
        category: newHabitCategory,
        frequency: newHabitFrequency,
        createdAt: new Date().toISOString(),
        completedDates: [],
        color: newHabitColor,
        reminderTime: newHabitReminder || undefined
    };
    StorageService.addHabit(habit);
    
    // Reset form
    setNewHabitTitle('');
    setNewHabitCategory('Health');
    setNewHabitColor('blue');
    setNewHabitFrequency('Daily');
    setNewHabitReminder('');
    setShowAdvanced(false);
    
    setShowAddModal(false);
    loadHabits();
  };

  const colors = ['blue', 'green', 'purple', 'rose', 'amber', 'cyan'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hello, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-slate-500">You have {habits.length} active habits.</p>
        </div>
        <div className="flex gap-3">
             <Button onClick={handleGetInsight} variant="secondary" disabled={loadingAI}>
               <i className="fa-solid fa-wand-magic-sparkles text-indigo-500 mr-2"></i>
               AI Coach
             </Button>
             <Button onClick={() => setShowAddModal(!showAddModal)}>
               <i className="fa-solid fa-plus mr-2"></i>
               New Habit
             </Button>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <WeeklyAnalysis habits={habits} />
         <NutritionTracker />
      </div>

      {/* AI Message Banner */}
      {aiMessage && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-1 shadow-lg animate-fade-in relative">
            <div className="bg-white rounded-lg p-4 flex items-start gap-4">
                <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                    <i className="fa-solid fa-robot text-indigo-600 text-xl"></i>
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-indigo-900 text-sm uppercase tracking-wide mb-1">AI Assistant</h4>
                    <p className="text-slate-700">{aiMessage}</p>
                </div>
                <button onClick={() => setAiMessage(null)} className="text-slate-400 hover:text-slate-600">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
      )}

      {/* Add Habit Area (Toggleable) */}
      {showAddModal && (
        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm animate-fade-in">
           <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-800">Add New Habit</h3>
               <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-red-500"><i className="fa-solid fa-xmark"></i></button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Manual Form */}
               <form onSubmit={handleAddManualHabit} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Habit Title</label>
                      <input 
                        type="text" 
                        required
                        value={newHabitTitle}
                        onChange={(e) => setNewHabitTitle(e.target.value)}
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        placeholder="e.g. Drink 2L Water"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <select 
                        value={newHabitCategory}
                        onChange={(e) => setNewHabitCategory(e.target.value)}
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                      >
                          <option>Health</option>
                          <option>Productivity</option>
                          <option>Mindfulness</option>
                          <option>Learning</option>
                          <option>Finance</option>
                      </select>
                  </div>

                  {/* Advanced Toggle */}
                  <div className="pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-sm text-indigo-600 font-medium flex items-center gap-2 hover:text-indigo-800 focus:outline-none"
                    >
                       {showAdvanced ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
                       {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                    </button>
                  </div>

                  {showAdvanced && (
                      <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-100 animate-fade-in">
                          {/* Frequency */}
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                              <select 
                                value={newHabitFrequency}
                                onChange={(e) => setNewHabitFrequency(e.target.value)}
                                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 text-sm"
                              >
                                  <option value="Daily">Daily</option>
                                  <option value="Weekly">Weekly</option>
                                  <option value="3 times a week">3 times a week</option>
                                  <option value="5 times a week">5 times a week</option>
                                  <option value="Weekends only">Weekends only</option>
                              </select>
                          </div>

                          {/* Color */}
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Color Theme</label>
                              <div className="flex flex-wrap gap-3">
                                  {colors.map(color => (
                                      <button
                                        key={color}
                                        type="button"
                                        onClick={() => setNewHabitColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center
                                            ${newHabitColor === color ? 'border-slate-600 scale-110' : 'border-transparent hover:scale-105'}`}
                                      >
                                         <div className={`w-full h-full rounded-full bg-${color}-500 opacity-90`}></div> 
                                      </button>
                                  ))}
                              </div>
                          </div>

                          {/* Reminder */}
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Reminder Time (Optional)</label>
                              <div className="relative">
                                <i className="fa-regular fa-clock absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                                <input 
                                    type="time" 
                                    value={newHabitReminder}
                                    onChange={(e) => setNewHabitReminder(e.target.value)}
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 pl-10 text-sm"
                                />
                              </div>
                          </div>
                      </div>
                  )}

                  <Button type="submit" className="w-full">Create Habit</Button>
               </form>

               {/* AI Suggestion Form */}
               <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8">
                  <div className="mb-2">
                       <span className="text-xs font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-2 py-1 rounded">AI Power</span>
                  </div>
                  <h4 className="font-medium text-slate-800 mb-2">Need Inspiration?</h4>
                  <p className="text-sm text-slate-500 mb-4">Tell the AI what you want to improve, and it will generate habits for you.</p>
                  <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={suggestionTopic}
                        onChange={(e) => setSuggestionTopic(e.target.value)}
                        placeholder="e.g. better sleep, marathon training"
                        className="flex-1 rounded-lg border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                      />
                      <Button onClick={handleGetSuggestions} disabled={!suggestionTopic || loadingAI} variant="secondary">
                          <i className="fa-solid fa-wand-magic-sparkles"></i>
                      </Button>
                  </div>
               </div>
           </div>
        </div>
      )}

      {/* Habit List */}
      <div className="grid grid-cols-1 gap-4">
        {habits.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-leaf text-2xl"></i>
                </div>
                <h3 className="text-lg font-medium text-slate-900">No habits tracked yet</h3>
                <p className="text-slate-500 mb-4">Create one manually or ask the AI for help!</p>
                <Button onClick={() => setShowAddModal(true)}>Get Started</Button>
            </div>
        ) : (
            habits.map(habit => (
                <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    onToggle={handleToggle} 
                    onDelete={handleDelete}
                />
            ))
        )}
      </div>
    </div>
  );
};