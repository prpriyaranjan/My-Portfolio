import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Get users from localStorage
  const getUsers = useCallback(() => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (!Array.isArray(users)) {
        console.warn('Users is not an array, resetting');
        localStorage.setItem('users', '[]');
        return [];
      }
      return users;
    } catch (error) {
      console.error('Error parsing users:', error);
      localStorage.setItem('users', '[]');
      return [];
    }
  }, []);

  // Save users to localStorage
  const saveUsers = useCallback((users) => {
    try {
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Users saved:', users);
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }, []);

  // Register a new user
  const register = useCallback((username, password, email) => {
    console.log('Register attempt:', { username, email });
    if (!username?.trim() || !password?.trim() || !email?.trim()) {
      console.error('Registration failed: Missing fields');
      throw new Error('All fields are required');
    }
    const users = getUsers();
    if (users.some((user) => user.username === username.trim())) {
      console.error('Registration failed: Username exists');
      throw new Error('Username already exists');
    }
    if (users.some((user) => user.email === email.trim())) {
      console.error('Registration failed: Email exists');
      throw new Error('Email already exists');
    }
    const newUser = {
      username: username.trim(),
      password: password.trim(),
      email: email.trim(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    console.log('Registration successful:', newUser);
    return newUser;
  }, [getUsers, saveUsers]);

  // Login user
  const login = useCallback((username, password) => {
    console.log('Login attempt:', { username });
    if (!username?.trim() || !password?.trim()) {
      console.error('Login failed: Missing fields');
      throw new Error('Username and password are required');
    }
    const users = getUsers();
    const user = users.find((u) => u.username === username.trim() && u.password === password.trim());
    if (!user) {
      console.error('Login failed: Invalid credentials');
      throw new Error('Invalid username or password');
    }
    setIsAuthenticated(true);
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('Login successful:', user);
    return user;
  }, [getUsers]);

  // Reset credentials by email
  const resetCredentials = useCallback((email, newUsername, newPassword) => {
    console.log('Reset attempt:', { email });
    if (!email?.trim()) {
      console.error('Reset failed: Email required');
      throw new Error('Email is required');
    }
    if (!newUsername?.trim() && !newPassword?.trim()) {
      console.error('Reset failed: Provide new username or password');
      throw new Error('Provide at least a new username or password');
    }
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.email === email.trim());
    if (userIndex === -1) {
      console.error('Reset failed: Email not found');
      throw new Error('Email not found');
    }
    users[userIndex] = {
      ...users[userIndex],
      username: newUsername?.trim() || users[userIndex].username,
      password: newPassword?.trim() || users[userIndex].password,
      updatedAt: new Date().toISOString(),
    };
    saveUsers(users);
    console.log('Reset successful:', users[userIndex]);
    return users[userIndex];
  }, [getUsers, saveUsers]);

  // Logout user
  const logout = useCallback(() => {
    console.log('Logout:', currentUser?.username);
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  }, [currentUser]);

  // Initialize auth state
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user?.username && user?.email) {
          setIsAuthenticated(true);
          setCurrentUser(user);
          console.log('Initialized auth:', user);
        } else {
          console.warn('Invalid currentUser, clearing');
          localStorage.removeItem('currentUser');
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      localStorage.removeItem('currentUser');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, register, login, resetCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
};