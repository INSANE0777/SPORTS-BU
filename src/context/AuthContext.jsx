import { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../lib/appwrite';
import { ID } from 'appwrite';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [houseId, setHouseId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check for an existing session when the app loads
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const loggedInUser = await account.get();
      setUser(loggedInUser);
      
      // Extract houseId and role from user preferences
      const prefs = loggedInUser.prefs || {};
      
      if (prefs.role === 'admin') {
        setUserRole('admin');
        setHouseId(null);
      } else if (prefs.role === 'house' && prefs.houseId) {
        setHouseId(prefs.houseId);
        setUserRole('house');
      } else {
        setUserRole('viewer');
        setHouseId(null);
      }
    } catch (error) {
      setUser(null);
      setHouseId(null);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // First, try to delete any existing session
      await account.deleteSession('current');
    } catch (error) {
      // No active session to delete, that's fine
    }
    
    // Now create a new session
    await account.createEmailPasswordSession(email, password);
    
    // Get the user data and return it
    const loggedInUser = await account.get();
    setUser(loggedInUser);
    
    // Extract role and houseId from preferences
    const prefs = loggedInUser.prefs || {};
    let extractedHouseId = null;
    let extractedRole = null;
    
    if (prefs.role === 'admin') {
      setUserRole('admin');
      extractedRole = 'admin';
      setHouseId(null);
    } else if (prefs.role === 'house' && prefs.houseId) {
      extractedHouseId = prefs.houseId;
      setHouseId(extractedHouseId);
      setUserRole('house');
      extractedRole = 'house';
    } else {
      setUserRole('viewer');
      extractedRole = 'viewer';
      setHouseId(null);
    }
    
    setIsLoading(false);
    
    // Return user data for immediate use
    return {
      user: loggedInUser,
      houseId: extractedHouseId,
      role: extractedRole
    };
  };

  const signup = async (email, password, name) => {
    await account.create(ID.unique(), email, password, name);
    // After signup, log the user in automatically
    await login(email, password);
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
    setHouseId(null);
    setUserRole(null);
  };

  const value = {
    user,
    houseId,
    userRole,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily access the context
export const useAuth = () => {
  return useContext(AuthContext);
};