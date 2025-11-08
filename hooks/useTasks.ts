import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './useAuth';

export interface SupabaseTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export const useTasks = (projectId?: string) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<SupabaseTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks for a project or all projects
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    try {
      let query = supabase.from('tasks').select('*');

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error: err } = await query.order('created_at', { ascending: false });

      if (err) throw err;
      setTasks(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, isAuthenticated]);

  // Create a new task
  const createTask = useCallback(
    async (task: Omit<SupabaseTask, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error: err } = await supabase
          .from('tasks')
          .insert(task)
          .select()
          .single();

        if (err) throw err;
        setTasks(prev => [data, ...prev]);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create task';
        setError(message);
        throw err;
      }
    },
    []
  );

  // Update a task
  const updateTask = useCallback(
    async (id: string, updates: Partial<SupabaseTask>) => {
      try {
        const { data, error: err } = await supabase
          .from('tasks')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();

        if (err) throw err;
        setTasks(prev =>
          prev.map(t => (t.id === id ? data : t))
        );
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update task';
        setError(message);
        throw err;
      }
    },
    []
  );

  // Delete a task
  const deleteTask = useCallback(async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      throw err;
    }
  }, []);

  // Fetch tasks on mount and when projectId changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
