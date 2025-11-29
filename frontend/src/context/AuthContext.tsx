import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the structure of the authenticated user, matching the backend response
// Note: We use '_id' for MongoDB ID and 'ADMIN'/'EMPLOYEE' for role.
interface User {
  _id: string; // MongoDB ID
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

// Define the shape of the context object
interface AuthContextType {
  user: User | null;
  token: string | null; // Added token state
  isAuthenticated: boolean;
  // Login and Signup are now asynchronous and return a promise
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
}

// Set up a default empty context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- CONFIGURATION ---
const API_BASE_URL = 'http://localhost:5000/api/users'; 
// ---------------------

// Utility to safely retrieve data from storage
const getToken = (): string | null => localStorage.getItem('token');
const getUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  try {
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    return null;
  }
};

// Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getUser());
  const [token, setToken] = useState<string | null>(getToken());
  const isAuthenticated = !!user;
  const [isLoading, setIsLoading] = useState(true); // State to handle initial token check

  // Logout function
  const logout = () => {
    // Clear state and storage
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  // Effect to validate token on app startup
  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      const fetchMe = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          if (response.ok) {
            const data: User = await response.json();
            setUser(data);
            setToken(storedToken);
            localStorage.setItem('user', JSON.stringify(data));
          } else {
            // Token invalid or expired, force logout
            logout();
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
        } finally {
          setIsLoading(false);
        }
      };
      fetchMe();
    } else {
      setIsLoading(false);
    }
  }, []);

  // --- API Handlers ---

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Use the toast logic in the calling component (Login.tsx) to show the error
        return false;
      }

      const data = await response.json();
      const { token, ...userData } = data;

      // Store state
      setToken(token);
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error('Network or unknown error during login:', error);
      return false;
    }
  };
  
  const signup = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      console.log('Signup response status:', response.body);
      if (!response.ok) {
        // Use the toast logic in the calling component (Signup.tsx) to show the error
        return false;
      }
      return true; // Signup successful
    } catch (error) {
      console.error('Network or unknown error during signup:', error);
      return false;
    }
  };

  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    signup,
    logout,
  };

  // Prevent UI rendering until we've checked for an existing token
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-primary font-medium">Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};