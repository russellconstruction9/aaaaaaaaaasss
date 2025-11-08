import { supabase } from './supabase';
import { Project, Task, User, TimeLog, TaskStatus, Location, PunchListItem, ProjectPhoto, ProjectType, Invoice, InvoiceStatus, InventoryItem, OrderItem, AuthUser, Business } from '../types';

// ============================================================================
// BUSINESS OPERATIONS
// ============================================================================

export const businessService = {
  async getByUserId(userId: string): Promise<Business | null> {
    const { data, error } = await supabase
      .from('users')
      .select('business_id')
      .eq('id', userId)
      .single();

    if (error || !data?.business_id) return null;
    
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', data.business_id)
      .single();

    if (businessError || !businessData) return null;

    return {
      id: parseInt(businessData.id),
      name: businessData.name,
      email: businessData.email,
      status: businessData.status,
      subscriptionPlan: businessData.subscription_plan,
      createdAt: new Date(businessData.created_at),
      updatedAt: new Date(businessData.updated_at),
    };
  }
};

// ============================================================================
// USER OPERATIONS
// ============================================================================

export const userService = {
  async getByBusinessId(businessId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch users: ${error.message}`);
    
    return (data || []).map(user => ({
      id: parseInt(user.id), // Convert UUID to number for compatibility
      businessId: parseInt(user.business_id),
      name: user.name,
      role: user.role,
      avatarUrl: user.avatar_url || '',
      isClockedIn: false, // Will be calculated from time_logs
      hourlyRate: parseFloat(user.hourly_rate || '0'),
      isActive: user.is_active,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    }));
  },

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        business_id: user.businessId,
        name: user.name,
        role: user.role,
        avatar_url: user.avatarUrl,
        hourly_rate: user.hourlyRate,
        is_active: user.isActive,
        email: `${user.name.toLowerCase().replace(/\s+/g, '.')}@${Date.now()}.local` // Temp email
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    
    return {
      id: parseInt(data.id),
      businessId: parseInt(data.business_id),
      name: data.name,
      role: data.role,
      avatarUrl: data.avatar_url || '',
      isClockedIn: false,
      hourlyRate: parseFloat(data.hourly_rate || '0'),
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async update(id: number, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        role: updates.role,
        avatar_url: updates.avatarUrl,
        hourly_rate: updates.hourlyRate,
        is_active: updates.isActive,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update user: ${error.message}`);
    
    return {
      id: parseInt(data.id),
      businessId: parseInt(data.business_id),
      name: data.name,
      role: data.role,
      avatarUrl: data.avatar_url || '',
      isClockedIn: false,
      hourlyRate: parseFloat(data.hourly_rate || '0'),
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
};

// ============================================================================
// PROJECT OPERATIONS
// ============================================================================

export const projectService = {
  async getByBusinessId(businessId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        punch_list_items(*),
        project_photos(*)
      `)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
    
    return (data || []).map(project => ({
      id: parseInt(project.id),
      businessId: parseInt(project.business_id),
      name: project.name,
      address: project.address || '',
      type: project.type as ProjectType,
      status: project.status,
      startDate: project.start_date ? new Date(project.start_date) : new Date(),
      endDate: project.end_date ? new Date(project.end_date) : new Date(),
      budget: parseFloat(project.budget || '0'),
      punchList: (project.punch_list_items || []).map((item: any) => ({
        id: parseInt(item.id),
        businessId: parseInt(item.business_id),
        text: item.text,
        isComplete: item.is_complete,
      })),
      photos: (project.project_photos || []).map((photo: any) => ({
        id: parseInt(photo.id),
        businessId: parseInt(photo.business_id),
        projectId: parseInt(photo.project_id),
        description: photo.description || '',
        dateAdded: new Date(photo.date_added),
      })),
      createdAt: new Date(project.created_at),
      updatedAt: new Date(project.updated_at),
    }));
  },

  async create(project: Omit<Project, 'id' | 'punchList' | 'photos' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        business_id: project.businessId,
        name: project.name,
        address: project.address,
        type: project.type,
        status: project.status,
        start_date: project.startDate.toISOString().split('T')[0],
        end_date: project.endDate.toISOString().split('T')[0],
        budget: project.budget,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create project: ${error.message}`);
    
    return {
      id: parseInt(data.id),
      businessId: parseInt(data.business_id),
      name: data.name,
      address: data.address || '',
      type: data.type as ProjectType,
      status: data.status,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      budget: parseFloat(data.budget || '0'),
      punchList: [],
      photos: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
};

// ============================================================================
// TASK OPERATIONS
// ============================================================================

export const taskService = {
  async getByBusinessId(businessId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch tasks: ${error.message}`);
    
    return (data || []).map(task => ({
      id: parseInt(task.id),
      businessId: parseInt(task.business_id),
      projectId: parseInt(task.project_id),
      assigneeId: task.assignee_id ? parseInt(task.assignee_id) : 0,
      title: task.title,
      description: task.description || '',
      status: task.status as TaskStatus,
      dueDate: task.due_date ? new Date(task.due_date) : new Date(),
      createdAt: new Date(task.created_at),
      updatedAt: new Date(task.updated_at),
    }));
  },

  async create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        business_id: task.businessId,
        project_id: task.projectId,
        assignee_id: task.assigneeId || null,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: 'Medium', // Default priority since it's required in DB
        due_date: task.dueDate.toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create task: ${error.message}`);
    
    return {
      id: parseInt(data.id),
      businessId: parseInt(data.business_id),
      projectId: parseInt(data.project_id),
      assigneeId: data.assignee_id ? parseInt(data.assignee_id) : 0,
      title: data.title,
      description: data.description || '',
      status: data.status as TaskStatus,
      dueDate: new Date(data.due_date),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async updateStatus(id: number, status: TaskStatus): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id);

    if (error) throw new Error(`Failed to update task status: ${error.message}`);
  }
};

// ============================================================================
// TIME LOG OPERATIONS
// ============================================================================

export const timeLogService = {
  async getByBusinessId(businessId: string): Promise<TimeLog[]> {
    const { data, error } = await supabase
      .from('time_logs')
      .select('*')
      .eq('business_id', businessId)
      .order('clock_in', { ascending: false });

    if (error) throw new Error(`Failed to fetch time logs: ${error.message}`);
    
    return (data || []).map(log => ({
      id: parseInt(log.id),
      businessId: parseInt(log.business_id),
      userId: parseInt(log.user_id),
      projectId: parseInt(log.project_id),
      clockIn: new Date(log.clock_in),
      clockOut: log.clock_out ? new Date(log.clock_out) : undefined,
      durationMs: log.duration_ms || undefined,
      cost: log.cost ? parseFloat(log.cost) : undefined,
      notes: log.notes || undefined,
      clockInLocation: log.clock_in_location_lat && log.clock_in_location_lng ? {
        lat: parseFloat(log.clock_in_location_lat),
        lng: parseFloat(log.clock_in_location_lng)
      } : undefined,
      clockOutLocation: log.clock_out_location_lat && log.clock_out_location_lng ? {
        lat: parseFloat(log.clock_out_location_lat),
        lng: parseFloat(log.clock_out_location_lng)
      } : undefined,
      createdAt: new Date(log.created_at),
      updatedAt: new Date(log.updated_at),
    }));
  },

  async create(timeLog: Omit<TimeLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<TimeLog> {
    const { data, error } = await supabase
      .from('time_logs')
      .insert({
        business_id: timeLog.businessId,
        user_id: timeLog.userId,
        project_id: timeLog.projectId,
        clock_in: timeLog.clockIn.toISOString(),
        clock_out: timeLog.clockOut?.toISOString(),
        duration_ms: timeLog.durationMs,
        cost: timeLog.cost,
        notes: timeLog.notes,
        clock_in_location_lat: timeLog.clockInLocation?.lat,
        clock_in_location_lng: timeLog.clockInLocation?.lng,
        clock_out_location_lat: timeLog.clockOutLocation?.lat,
        clock_out_location_lng: timeLog.clockOutLocation?.lng,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create time log: ${error.message}`);
    
    return {
      id: parseInt(data.id),
      businessId: parseInt(data.business_id),
      userId: parseInt(data.user_id),
      projectId: parseInt(data.project_id),
      clockIn: new Date(data.clock_in),
      clockOut: data.clock_out ? new Date(data.clock_out) : undefined,
      durationMs: data.duration_ms || undefined,
      cost: data.cost ? parseFloat(data.cost) : undefined,
      notes: data.notes || undefined,
      clockInLocation: data.clock_in_location_lat && data.clock_in_location_lng ? {
        lat: parseFloat(data.clock_in_location_lat),
        lng: parseFloat(data.clock_in_location_lng)
      } : undefined,
      clockOutLocation: data.clock_out_location_lat && data.clock_out_location_lng ? {
        lat: parseFloat(data.clock_out_location_lat),
        lng: parseFloat(data.clock_out_location_lng)
      } : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async update(id: number, updates: Partial<TimeLog>): Promise<TimeLog> {
    const { data, error } = await supabase
      .from('time_logs')
      .update({
        clock_out: updates.clockOut?.toISOString(),
        duration_ms: updates.durationMs,
        cost: updates.cost,
        notes: updates.notes,
        clock_out_location_lat: updates.clockOutLocation?.lat,
        clock_out_location_lng: updates.clockOutLocation?.lng,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update time log: ${error.message}`);
    
    return {
      id: parseInt(data.id),
      businessId: parseInt(data.business_id),
      userId: parseInt(data.user_id),
      projectId: parseInt(data.project_id),
      clockIn: new Date(data.clock_in),
      clockOut: data.clock_out ? new Date(data.clock_out) : undefined,
      durationMs: data.duration_ms || undefined,
      cost: data.cost ? parseFloat(data.cost) : undefined,
      notes: data.notes || undefined,
      clockInLocation: data.clock_in_location_lat && data.clock_in_location_lng ? {
        lat: parseFloat(data.clock_in_location_lat),
        lng: parseFloat(data.clock_in_location_lng)
      } : undefined,
      clockOutLocation: data.clock_out_location_lat && data.clock_out_location_lng ? {
        lat: parseFloat(data.clock_out_location_lat),
        lng: parseFloat(data.clock_out_location_lng)
      } : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('time_logs')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete time log: ${error.message}`);
  }
};

// ============================================================================
// INVENTORY OPERATIONS
// ============================================================================

export const inventoryService = {
  async getByBusinessId(businessId: string): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('business_id', businessId)
      .order('name');

    if (error) throw new Error(`Failed to fetch inventory: ${error.message}`);
    
    return (data || []).map(item => ({
      id: parseInt(item.id),
      businessId: parseInt(item.business_id),
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      cost: item.cost ? parseFloat(item.cost) : undefined,
      lowStockThreshold: item.low_stock_threshold || undefined,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
    }));
  },

  async create(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        business_id: item.businessId,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        cost: item.cost,
        low_stock_threshold: item.lowStockThreshold,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create inventory item: ${error.message}`);
    
    return {
      id: parseInt(data.id),
      businessId: parseInt(data.business_id),
      name: data.name,
      quantity: data.quantity,
      unit: data.unit,
      cost: data.cost ? parseFloat(data.cost) : undefined,
      lowStockThreshold: data.low_stock_threshold || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async update(id: number, updates: Partial<InventoryItem>): Promise<void> {
    const { error } = await supabase
      .from('inventory_items')
      .update({
        name: updates.name,
        quantity: updates.quantity,
        unit: updates.unit,
        cost: updates.cost,
        low_stock_threshold: updates.lowStockThreshold,
      })
      .eq('id', id);

    if (error) throw new Error(`Failed to update inventory item: ${error.message}`);
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete inventory item: ${error.message}`);
  }
};

// ============================================================================
// PUNCH LIST OPERATIONS
// ============================================================================

export const punchListService = {
  async addItem(projectId: number, businessId: number, text: string): Promise<PunchListItem> {
    const { data, error } = await supabase
      .from('punch_list_items')
      .insert({
        project_id: projectId,
        business_id: businessId,
        text,
        is_complete: false,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to add punch list item: ${error.message}`);
    
    return {
      id: parseInt(data.id),
      businessId: parseInt(data.business_id),
      text: data.text,
      isComplete: data.is_complete,
    };
  },

  async toggleComplete(itemId: number): Promise<void> {
    // First get current state
    const { data: currentItem, error: fetchError } = await supabase
      .from('punch_list_items')
      .select('is_complete')
      .eq('id', itemId)
      .single();

    if (fetchError) throw new Error(`Failed to fetch punch list item: ${fetchError.message}`);

    // Toggle the state
    const { error } = await supabase
      .from('punch_list_items')
      .update({ is_complete: !currentItem.is_complete })
      .eq('id', itemId);

    if (error) throw new Error(`Failed to toggle punch list item: ${error.message}`);
  }
};

// ============================================================================
// INVOICE OPERATIONS
// ============================================================================

export const invoiceService = {
  async getByBusinessId(businessId: string): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('business_id', businessId)
      .order('date_issued', { ascending: false });

    if (error) throw new Error(`Failed to fetch invoices: ${error.message}`);
    
    return (data || []).map(invoice => ({
      id: parseInt(invoice.id),
      businessId: parseInt(invoice.business_id),
      projectId: invoice.project_id ? parseInt(invoice.project_id) : 0,
      invoiceNumber: invoice.invoice_number,
      customerName: invoice.customer_name,
      customerEmail: invoice.customer_email || undefined,
      customerAddress: invoice.customer_address || '',
      dateIssued: new Date(invoice.date_issued),
      dueDate: new Date(invoice.due_date),
      status: invoice.status as InvoiceStatus,
      subtotal: parseFloat(invoice.subtotal || '0'),
      taxRate: parseFloat(invoice.tax_rate || '0'),
      taxAmount: parseFloat(invoice.tax_amount || '0'),
      total: parseFloat(invoice.total || '0'),
      notes: invoice.notes || undefined,
      lineItems: [], // Will need to fetch separately or join
      createdAt: new Date(invoice.created_at),
      updatedAt: new Date(invoice.updated_at),
    }));
  }
};