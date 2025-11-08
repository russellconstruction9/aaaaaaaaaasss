import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, AuthState, LoginCredentials, SignupData, Business } from '../types';
import { supabase } from '../utils/supabase';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    business: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user and business data from database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*, businesses(*)')
            .eq('email', session.user.email)
            .single();

          if (userData && !userError) {
            const user: AuthUser = {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              businessId: userData.business_id,
              role: userData.role,
              avatarUrl: userData.avatar_url,
            };

            const business: Business = {
              id: userData.businesses.id,
              name: userData.businesses.name,
              email: userData.businesses.email,
              status: userData.businesses.status,
              subscriptionPlan: userData.businesses.subscription_plan,
              createdAt: new Date(userData.businesses.created_at),
              updatedAt: new Date(userData.businesses.updated_at),
            };

            setAuthState({
              user,
              business,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            setAuthState(prev => ({ ...prev, isLoading: false }));
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAuthState({
          user: null,
          business: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned');

      // Fetch user and business data from database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, businesses(*)')
        .eq('email', authData.user.email)
        .single();

      if (userError || !userData) throw new Error('User not found in database');

      const user: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        businessId: userData.business_id,
        role: userData.role,
        avatarUrl: userData.avatar_url,
      };

      const business: Business = {
        id: userData.businesses.id,
        name: userData.businesses.name,
        email: userData.businesses.email,
        status: userData.businesses.status,
        subscriptionPlan: userData.businesses.subscription_plan,
        createdAt: new Date(userData.businesses.created_at),
        updatedAt: new Date(userData.businesses.updated_at),
      };

      setAuthState({
        user,
        business,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.userEmail,
        password: data.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned');

      // Create business record
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .insert({
          name: data.businessName,
          email: data.businessEmail,
          status: 'Trial',
          subscription_plan: 'Trial',
        })
        .select()
        .single();

      if (businessError || !businessData) throw new Error('Failed to create business');

      // Create user record
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          email: data.userEmail,
          name: data.userName,
          business_id: businessData.id,
          role: 'Admin',
        })
        .select()
        .single();

      if (userError || !userData) throw new Error('Failed to create user');

      const user: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        businessId: userData.business_id,
        role: userData.role,
        avatarUrl: userData.avatar_url,
      };

      const business: Business = {
        id: businessData.id,
        name: businessData.name,
        email: businessData.email,
        status: businessData.status,
        subscriptionPlan: businessData.subscription_plan,
        createdAt: new Date(businessData.created_at),
        updatedAt: new Date(businessData.updated_at),
      };

      setAuthState({
        user,
        business,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      business: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!authState.user) return;

    try {
      // Update user in database
      const { error } = await supabase
        .from('users')
        .update({
          name: data.name,
          avatar_url: data.avatarUrl,
        })
        .eq('id', authState.user.id);

      if (error) throw error;

      const updatedUser = { ...authState.user, ...data };
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    updateProfile,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};