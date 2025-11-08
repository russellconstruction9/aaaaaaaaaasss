import { supabase } from './supabase';
import { Project } from '../types';

// Fetch all projects for a business
export const fetchProjects = async (businessId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Create a new project
export const createProject = async (project: {
  business_id: string;
  name: string;
  address: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
}) => {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update a project
export const updateProject = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('projects')
    .update({
      name: updates.name,
      address: updates.address,
      status: updates.status,
      start_date: updates.startDate,
      end_date: updates.endDate,
      budget: updates.budget,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a project
export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
