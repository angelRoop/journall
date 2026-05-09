import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const LOCAL_USER = {
  id: 'local-user',
  name: 'TradeJournal User',
  email: 'local@tradejournal.com',
};

export const AuthProvider = ({ children }) => {
  const [currentUser] = useState(LOCAL_USER);
  const [initialLoading] = useState(false);

  return (
    <AuthContext.Provider value={{ currentUser, initialLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};