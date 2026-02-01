interface UserProfile {
  name: string;
  password: string;
  age: string;
  weight: string;
  lifestyle: string;
  cycleLength: string;
  healthGoals: string[];
  createdAt: string;
}

const USERS_KEY = 'wellnessflow_users';
const CURRENT_USER_KEY = 'wellnessflow_current_user';

export const saveUser = (userData: Omit<UserProfile, 'createdAt'>): boolean => {
  try {
    const users = getUsers();
    
    // Check if user already exists
    if (users.find(u => u.name.toLowerCase() === userData.name.toLowerCase())) {
      return false;
    }

    const newUser: UserProfile = {
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

export const getUsers = (): UserProfile[] => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const validateUser = (name: string, password: string): UserProfile | null => {
  const users = getUsers();
  const user = users.find(
    u => u.name.toLowerCase().trim() === name.toLowerCase().trim() && 
         u.password === password
  );
  return user || null;
};

export const setCurrentUser = (user: UserProfile): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): UserProfile | null => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const hasUsers = (): boolean => {
  return getUsers().length > 0;
};
