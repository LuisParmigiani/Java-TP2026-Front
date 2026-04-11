import React from 'react';
import { AuthContext, type AuthContextType } from '../contexts/authContext';

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
