import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './useAuth';

export interface SupabaseProject {
  id: string;
  business_id: string;
  name: string;
  address: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const { business, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    if (!business?.id || !isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (err) throw err;
      setProjects(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(message);
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, [business?.id, isAuthenticated]);

  // Create a new project
  const createProject = useCallback(
    async (project: Omit<SupabaseProject, 'id' | 'created_at' | 'updated_at'>) => {
      if (!business?.id) throw new Error('No business selected');

      try {
        const { data, error: err } = await supabase
          .from('projects')
          .insert({
            ...project,
            business_id: business.id,
          })
          .select()
          .single();

        if (err) throw err;
        setProjects(prev => [data, ...prev]);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create project';
        setError(message);
        throw err;
      }
    },
    [business?.id]
  );

  // Update a project
  const updateProject = useCallback(
    async (id: string, updates: Partial<SupabaseProject>) => {
      try {
        const { data, error: err } = await supabase
          .from('projects')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();

        if (err) throw err;
        setProjects(prev =>
          prev.map(p => (p.id === id ? data : p))
        );
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update project';
        setError(message);
        throw err;
      }
    },
    []
  );

  // Delete a project
  const deleteProject = useCallback(async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      setError(message);
      throw err;
    }
  }, []);

  // Fetch projects on mount and when business changes
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};
