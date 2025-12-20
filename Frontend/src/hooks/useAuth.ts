import AuthContext from '@/context/AuthContextType';
import { useContext } from 'react';

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
