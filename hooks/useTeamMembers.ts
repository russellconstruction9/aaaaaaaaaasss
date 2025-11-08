import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './useAuth';

export interface SupabaseTeamMember {
  id: string;
  business_id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  hourly_rate?: number;
  created_at: string;
}

export const useTeamMembers = () => {
  const { business, isAuthenticated } = useAuth();
  const [teamMembers, setTeamMembers] = useState<SupabaseTeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all team members for a business
  const fetchTeamMembers = useCallback(async () => {
    if (!business?.id || !isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('team_members')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (err) throw err;
      setTeamMembers(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch team members';
      setError(message);
      console.error('Error fetching team members:', err);
    } finally {
      setIsLoading(false);
    }
  }, [business?.id, isAuthenticated]);

  // Create a new team member
  const createTeamMember = useCallback(
    async (member: Omit<SupabaseTeamMember, 'id' | 'created_at'>) => {
      if (!business?.id) throw new Error('No business selected');

      try {
        const { data, error: err } = await supabase
          .from('team_members')
          .insert({
            ...member,
            business_id: business.id,
          })
          .select()
          .single();

        if (err) throw err;
        setTeamMembers(prev => [data, ...prev]);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create team member';
        setError(message);
        throw err;
      }
    },
    [business?.id]
  );

  // Update a team member
  const updateTeamMember = useCallback(
    async (id: string, updates: Partial<SupabaseTeamMember>) => {
      try {
        const { data, error: err } = await supabase
          .from('team_members')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (err) throw err;
        setTeamMembers(prev =>
          prev.map(m => (m.id === id ? data : m))
        );
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update team member';
        setError(message);
        throw err;
      }
    },
    []
  );

  // Delete a team member
  const deleteTeamMember = useCallback(async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setTeamMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete team member';
      setError(message);
      throw err;
    }
  }, []);

  // Fetch team members on mount and when business changes
  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  return {
    teamMembers,
    isLoading,
    error,
    fetchTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
  };
};
