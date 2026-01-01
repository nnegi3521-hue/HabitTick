import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { NutritionData } from '../types';
import { Button } from './Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const NutritionTracker: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NutritionData | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const result = await GeminiService.analyzeNutrition(input);
    setData(result);
    setLoading(false);
  };

  const COLORS = ['#818cf8', '#34d399', '#f472b6']; // Protein (Indigo), Carbs (Emerald), Fat (Pink)

  const chartData = data ? [
    { name: 'Protein', value: data.protein },
    { name: 'Carbs', value: data.carbs },
    { name: 'Fat', value: data.fat },
  ] : [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
             <i className="fa-solid fa-apple-whole text-green-600"></i>
        </div>
        <h3 className="text-lg font-bold text-slate-800">AI Nutrition Tracker</h3>
      </div>
      
      <form onSubmit={handleAnalyze} className="mb-6">
        <div className="relative">
            <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What did you eat today? (e.g., 'Grilled chicken salad with avocado')"
            className="w-full rounded-xl border-slate-200 shadow-sm focus:border-green-500 focus:ring-green-500 border p-3 min-h-[80px] text-sm resize-none"
            />
            <div className="absolute bottom-2 right-2">
                <Button 
                    type="submit" 
                    disabled={loading || !input} 
                    variant="primary" 
                    className="!py-1 !px-3 !text-xs bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    isLoading={loading}
                >
                    {loading ? 'Analyzing...' : 'Analyze Food'}
                </Button>
            </div>
        </div>
      </form>

      {data && (
        <div className="animate-fade-in">
           <div className="flex flex-col md:flex-row gap-6 items-center">
             
             {/* Chart */}
             <div className="w-full md:w-1/3 h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                    <div className="text-center">
                        <span className="block text-xl font-bold text-slate-800">{data.calories}</span>
                        <span className="text-[10px] text-slate-400 uppercase">Kcal</span>
                    </div>
                </div>
             </div>

             {/* Details */}
             <div className="w-full md:w-2/3 space-y-4">
                <div>
                    <h4 className="font-bold text-slate-900 text-lg">{data.mealName}</h4>
                    <p className="text-sm text-slate-500">{data.summary}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-indigo-50 p-2 rounded-lg text-center">
                        <span className="block text-indigo-700 font-bold">{data.protein}g</span>
                        <span className="text-xs text-indigo-400 uppercase font-semibold">Protein</span>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-lg text-center">
                        <span className="block text-emerald-700 font-bold">{data.carbs}g</span>
                        <span className="text-xs text-emerald-400 uppercase font-semibold">Carbs</span>
                    </div>
                    <div className="bg-pink-50 p-2 rounded-lg text-center">
                        <span className="block text-pink-700 font-bold">{data.fat}g</span>
                        <span className="text-xs text-pink-400 uppercase font-semibold">Fat</span>
                    </div>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
