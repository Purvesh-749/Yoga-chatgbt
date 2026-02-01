import { getCurrentUser } from "./userStorage";

// Generic function to save user-specific data
export const saveUserData = <T>(key: string, data: T): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  
  const storageKey = `wellnessflow_${currentUser.name}_${key}`;
  localStorage.setItem(storageKey, JSON.stringify(data));
};

// Generic function to get user-specific data
export const getUserData = <T>(key: string, defaultValue: T): T => {
  const currentUser = getCurrentUser();
  if (!currentUser) return defaultValue;
  
  const storageKey = `wellnessflow_${currentUser.name}_${key}`;
  const stored = localStorage.getItem(storageKey);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error(`Error parsing user data for ${key}:`, error);
      return defaultValue;
    }
  }
  
  return defaultValue;
};

// Clear all data for current user
export const clearUserData = (): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  
  const prefix = `wellnessflow_${currentUser.name}_`;
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
};
