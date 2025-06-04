import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';
import { auth } from '../auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await auth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };

    initAuth();
  }, [setUser]);

  const login = async (email: string, password: string) => {
    const user = await auth.login({ email, password });
    navigate('/');
    return user;
  };

  const register = async (name: string, email: string, password: string, role: 'vibeCoder' | 'client') => {
    const user = await auth.register({ name, email, password, role });
    navigate('/');
    return user;
  };

  const logout = async () => {
    await auth.logout();
    navigate('/');
  };

  return {
    user,
    isAuthenticated: auth.isAuthenticated(),
    login,
    register,
    logout
  };
};

export const useRequireAuth = (redirectTo = '/login') => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  return isAuthenticated;
};