import { GoogleGenAI, Type } from "@google/genai";
import { Habit, NutritionData } from '../types';

// NOTE: In a production environment, never expose keys on the client.
// This is for demonstration using the provided environment variable.
const createAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const GeminiService = {
  getHabitSuggestions: async (userInterest: string): Promise<any[]> => {
    try {
      const ai = createAI();
      const model = 'gemini-3-flash-preview';
      
      const prompt = `Suggest 3 specific, actionable habits for someone interested in: "${userInterest}".
      For each habit, provide a title, a short description, and a recommended frequency (daily or weekly).`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                frequency: { type: Type.STRING }
              }
            }
          }
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      return [];
    }
  },

  getPersonalizedInsight: async (habits: Habit[]): Promise<string> => {
    try {
      const ai = createAI();
      const model = 'gemini-3-flash-preview';

      // Prepare data summary for AI
      const summary = habits.map(h => ({
        title: h.title,
        completions: h.completedDates.length,
        frequency: h.frequency
      }));

      const prompt = `Here is the user's habit tracking data: ${JSON.stringify(summary)}. 
      Analyze their performance briefly. Provide one sentence of analysis and one sentence of high-energy motivation. 
      Keep it under 50 words total. Address the user directly.`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      return response.text || "Keep pushing forward! Consistency is key.";
    } catch (error) {
      console.error("AI Insight Error:", error);
      return "Great job tracking your habits! Keep it up.";
    }
  },

  analyzeNutrition: async (foodInput: string): Promise<NutritionData | null> => {
    try {
      const ai = createAI();
      const model = 'gemini-3-flash-preview';

      const prompt = `Analyze the nutritional content of the following meal description: "${foodInput}". 
      Estimate the calories, protein, carbs, and fat. Provide a short health summary (1 sentence). 
      Also provide a short name for the meal.`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    calories: { type: Type.NUMBER },
                    protein: { type: Type.NUMBER, description: "in grams" },
                    carbs: { type: Type.NUMBER, description: "in grams" },
                    fat: { type: Type.NUMBER, description: "in grams" },
                    summary: { type: Type.STRING },
                    mealName: { type: Type.STRING }
                },
                required: ["calories", "protein", "carbs", "fat", "summary", "mealName"]
            }
        }
      });

      if (response.text) {
          return JSON.parse(response.text) as NutritionData;
      }
      return null;
    } catch (error) {
      console.error("Nutrition Analysis Error:", error);
      return null;
    }
  }
};