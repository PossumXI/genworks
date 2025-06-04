import { supabase } from './supabase';
import { useUserStore } from './store';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'vibeCoder' | 'client' | 'hubContributor';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: User['role'];
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (authError) throw new Error(authError.message);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw new Error(profileError.message);

    const user = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
    };

    useUserStore.getState().setUser(user);
    return user;
  }

  async register(data: RegisterData): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw new Error(authError.message);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user!.id,
        name: data.name,
        email: data.email,
        role: data.role,
      })
      .select()
      .single();

    if (profileError) throw new Error(profileError.message);

    const user = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
    };

    useUserStore.getState().setUser(user);
    return user;
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    useUserStore.getState().setUser(null);
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) return null;

    const currentUser = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
    };

    useUserStore.getState().setUser(currentUser);
    return currentUser;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', data.id!)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const updatedUser = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
    };

    useUserStore.getState().setUser(updatedUser);
    return updatedUser;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw new Error(error.message);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  }

  async resetPassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw new Error(error.message);
  }

  isAuthenticated(): boolean {
    return !!useUserStore.getState().user;
  }
}

export const auth = new AuthService();