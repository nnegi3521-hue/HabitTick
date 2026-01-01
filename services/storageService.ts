import { User, Habit, UserRole } from '../types';

const USERS_KEY = 'habitflow_users';
const HABITS_KEY = 'habitflow_habits';
const CURRENT_USER_KEY = 'habitflow_current_user';

// Helper for safe JSON parsing
const safeParse = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error parsing ${key} from localStorage, resetting to fallback.`, error);
    localStorage.removeItem(key);
    return fallback;
  }
};

// Mock Data Initialization
const initMockData = () => {
  try {
    const existingUsers = localStorage.getItem(USERS_KEY);
    if (!existingUsers) {
      const mockUsers: User[] = [
        {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@habitflow.com',
          avatar: 'https://picsum.photos/100/100?random=1',
          role: UserRole.ADMIN,
          joinedAt: new Date().toISOString(),
        },
        {
          id: 'user-1',
          name: 'Alex Johnson',
          email: 'alex@gmail.com',
          avatar: 'https://picsum.photos/100/100?random=2',
          role: UserRole.USER,
          joinedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        },
        {
          id: 'user-2',
          name: 'Sarah Smith',
          email: 'sarah@gmail.com',
          avatar: 'https://picsum.photos/100/100?random=3',
          role: UserRole.USER,
          joinedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        }
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));

      // START FRESH: No dummy habits for users.
      const mockHabits: Habit[] = []; 
      localStorage.setItem(HABITS_KEY, JSON.stringify(mockHabits));
    } else {
        // Ensure habits key exists even if users exist (migration safety)
        if (!localStorage.getItem(HABITS_KEY)) {
             localStorage.setItem(HABITS_KEY, JSON.stringify([]));
        }
    }
  } catch (e) {
    console.error("Storage initialization failed", e);
  }
};

export const StorageService = {
  init: initMockData,

  getUsers: (): User[] => {
    return safeParse<User[]>(USERS_KEY, []);
  },

  getCurrentUser: (): User | null => {
    return safeParse<User | null>(CURRENT_USER_KEY, null);
  },

  login: (email: string): User | null => {
    try {
      const users = StorageService.getUsers();
      const user = users.find(u => u.email === email);
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
      }
    } catch (e) {
      console.error("Login failed", e);
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getHabits: (): Habit[] => {
    return safeParse<Habit[]>(HABITS_KEY, []);
  },

  getUserHabits: (userId: string): Habit[] => {
    const all = StorageService.getHabits();
    return all.filter(h => h.userId === userId);
  },

  addHabit: (habit: Habit) => {
    const all = StorageService.getHabits();
    all.push(habit);
    localStorage.setItem(HABITS_KEY, JSON.stringify(all));
  },

  toggleHabitCompletion: (habitId: string, date: string) => {
    const all = StorageService.getHabits();
    const index = all.findIndex(h => h.id === habitId);
    if (index !== -1) {
      const habit = all[index];
      if (habit.completedDates.includes(date)) {
        habit.completedDates = habit.completedDates.filter(d => d !== date);
      } else {
        habit.completedDates.push(date);
      }
      all[index] = habit;
      localStorage.setItem(HABITS_KEY, JSON.stringify(all));
    }
  },

  deleteHabit: (habitId: string) => {
    let all = StorageService.getHabits();
    all = all.filter(h => h.id !== habitId);
    localStorage.setItem(HABITS_KEY, JSON.stringify(all));
  }
};