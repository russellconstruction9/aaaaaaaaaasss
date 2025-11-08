import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Project, Task, User, TimeLog, TaskStatus, Location, PunchListItem, ProjectPhoto, ProjectType, Invoice, InvoiceStatus, InventoryItem, OrderItem } from '../types';
import { useAuth } from './useAuth';
import { 
  businessService, 
  userService, 
  projectService, 
  taskService, 
  timeLogService, 
  inventoryService, 
  punchListService, 
  invoiceService 
} from '../utils/supabaseService';
import { setPhoto, setPunchListPhoto, deletePunchListPhoto as deleteDbPunchListPhoto } from '../utils/db';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

// Fetches the map image and converts it to a Data URL to embed it directly.
// This is more reliable for PDF generation as it avoids cross-origin issues.
const getMapImageDataUrl = async (location: Location): Promise<string | undefined> => {
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=200x150&markers=color:red%7C${location.lat},${location.lng}&key=${GOOGLE_MAPS_API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch map image: ${response.statusText}`);
            return undefined;
        }
        const blob = await response.blob();
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error fetching or converting map image:", error);
        return undefined;
    }
};

interface DataContextType {
  users: User[];
  projects: Project[];
  tasks: Task[];
  timeLogs: TimeLog[];
  invoices: Invoice[];
  inventory: InventoryItem[];
  orderList: OrderItem[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  setCurrentUser: (user: User | null) => void;
  addUser: (user: { name: string; role: string; hourlyRate: number; }) => Promise<void>;
  updateUser: (userId: number, data: Partial<Omit<User, 'id' | 'isClockedIn' | 'clockInTime' | 'currentProjectId'>>) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'punchList' | 'photos'>) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'status'>) => Promise<void>;
  updateTaskStatus: (taskId: number, status: TaskStatus) => Promise<void>;
  toggleClockInOut: (projectId?: number) => Promise<void>;
  switchJob: (newProjectId: number) => Promise<void>;
  addPunchListItem: (projectId: number, text: string) => Promise<void>;
  togglePunchListItem: (projectId: number, itemId: number) => Promise<void>;
  addPhoto: (projectId: number, imageDataUrls: string[], description: string) => Promise<void>;
  addPunchListPhoto: (projectId: number, punchListItemId: number, imageDataUrl: string) => Promise<void>;
  updatePunchListAnnotation: (projectId: number, punchListItemId: number, annotatedDataUrl: string) => void;
  deletePunchListPhoto: (projectId: number, punchListItemId: number) => Promise<void>;
  addManualTimeLog: (data: { userId: number, projectId: number, clockIn: Date, clockOut: Date, notes?: string }) => Promise<void>;
  updateTimeLog: (logId: number, data: { projectId: number, clockIn: Date, clockOut: Date, notes?: string }) => Promise<void>;
  deleteTimeLog: (logId: number) => Promise<void>;
  addInvoice: (invoiceData: Omit<Invoice, 'id'>) => Promise<Invoice>;
  updateInvoice: (invoiceId: number, data: Omit<Invoice, 'id'>) => Promise<Invoice>;
  deleteInvoice: (invoiceId: number) => Promise<void>;
  addInventoryItem: (item: { name: string; quantity: number; unit: string; cost?: number; lowStockThreshold?: number }) => Promise<void>;
  updateInventoryItem: (itemId: number, data: Partial<Omit<InventoryItem, 'id'>>) => Promise<void>;
  deleteInventoryItem: (itemId: number) => Promise<void>;
  addToOrderList: (item: InventoryItem) => void;
  addManualItemToOrderList: (name: string, cost?: number) => void;
  removeFromOrderList: (orderItem: OrderItem) => void;
  clearOrderList: () => void;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuth();
  const businessId = authUser?.businessId?.toString() || '';
  
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orderList, setOrderList] = useState<OrderItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Supabase
  const loadData = useCallback(async () => {
    if (!businessId || !authUser) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Load all data in parallel
      const [
        usersData,
        projectsData, 
        tasksData,
        timeLogsData,
        invoicesData,
        inventoryData
      ] = await Promise.all([
        userService.getByBusinessId(businessId),
        projectService.getByBusinessId(businessId),
        taskService.getByBusinessId(businessId),
        timeLogService.getByBusinessId(businessId),
        invoiceService.getByBusinessId(businessId),
        inventoryService.getByBusinessId(businessId)
      ]);

      setUsers(usersData);
      setProjects(projectsData);
      setTasks(tasksData);
      setTimeLogs(timeLogsData);
      setInvoices(invoicesData);
      setInventory(inventoryData);

      // Set current user from auth user data
      const currentUserData = usersData.find(u => u.id === authUser.id);
      if (currentUserData) {
        setCurrentUser(currentUserData);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [businessId, authUser]);

  // Load data when auth user changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const addUser = useCallback(async ({ name, role, hourlyRate }: { name: string; role: string; hourlyRate: number; }) => {
    if (!businessId) throw new Error('No business context');

    const newUser = await userService.create({
      businessId: parseInt(businessId),
      name,
      role: role as any,
      hourlyRate,
      avatarUrl: '',
      isClockedIn: false,
      isActive: true,
    });

    setUsers(prev => [...prev, newUser]);
  }, [businessId]);

  const updateUser = useCallback(async (userId: number, data: Partial<Omit<User, 'id' | 'isClockedIn' | 'clockInTime' | 'currentProjectId'>>) => {
    const updatedUser = await userService.update(userId, data);
    
    setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
    
    if (currentUser?.id === userId) {
      setCurrentUser(updatedUser);
    }
  }, [currentUser]);

  const addProject = useCallback(async (projectData: Omit<Project, 'id' | 'punchList' | 'photos'>) => {
    if (!businessId) throw new Error('No business context');

    const newProject = await projectService.create({
      ...projectData,
      businessId: parseInt(businessId),
    });

    setProjects(prev => [...prev, newProject]);
  }, [businessId]);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'status'>) => {
    if (!businessId) throw new Error('No business context');

    const newTask = await taskService.create({
      ...taskData,
      businessId: parseInt(businessId),
      status: TaskStatus.ToDo,
    });

    setTasks(prev => [...prev, newTask]);
  }, [businessId]);

  const updateTaskStatus = useCallback(async (taskId: number, status: TaskStatus) => {
    await taskService.updateStatus(taskId, status);
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, status } : task));
  }, []);

  const getCurrentLocation = useCallback((): Promise<Location | undefined> => {
      return new Promise((resolve) => {
          if (!navigator.geolocation) { 
            console.warn("Geolocation is not supported by this browser.");
            resolve(undefined);
            return;
           }
          navigator.geolocation.getCurrentPosition(
              (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
              (error) => {
                console.error("Error getting location:", error);
                alert(`Could not get location: ${error.message}`);
                resolve(undefined);
              }
          );
      });
  }, []);

  const toggleClockInOut = useCallback(async (projectId?: number) => {
    if (!currentUser || !businessId) return;
    
    try {
        if (currentUser.isClockedIn) {
          // Clock out - find active time log and update it
          const activeLog = timeLogs.find(log => log.userId === currentUser.id && !log.clockOut);
          if (activeLog) {
            const location = await getCurrentLocation();
            const now = new Date();
            const durationMs = now.getTime() - activeLog.clockIn.getTime();
            const hoursWorked = durationMs / (1000 * 60 * 60);
            const cost = hoursWorked * currentUser.hourlyRate;
            const mapImageUrl = location ? await getMapImageDataUrl(location) : undefined;
            
            const updatedLog = await timeLogService.update(activeLog.id, {
              clockOut: now,
              durationMs,
              cost,
              clockOutLocation: location,
              clockOutMapImage: mapImageUrl
            });

            setTimeLogs(prev => prev.map(log => log.id === activeLog.id ? updatedLog : log));
          }
          
          const updatedUser = { ...currentUser, isClockedIn: false };
          setCurrentUser(updatedUser);
          setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
        } else {
          // Clock in
          if (!projectId) return;
          
          const location = await getCurrentLocation();
          const mapImageUrl = location ? await getMapImageDataUrl(location) : undefined;
          const clockInTime = new Date();
          
          const newLog = await timeLogService.create({
            businessId: parseInt(businessId),
            userId: currentUser.id,
            projectId: projectId,
            clockIn: clockInTime,
            clockInLocation: location,
            clockInMapImage: mapImageUrl,
          });

          setTimeLogs(prev => [newLog, ...prev]);
          
          const updatedUser = { ...currentUser, isClockedIn: true };
          setCurrentUser(updatedUser);
          setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
        }
    } catch (error) {
        console.error("Error during clock in/out:", error);
        alert("An unexpected error occurred while clocking in/out. Please try again.");
    }
  }, [currentUser, timeLogs, getCurrentLocation, businessId]);

  const switchJob = useCallback(async (newProjectId: number) => {
    if (!currentUser || !currentUser.isClockedIn || !businessId) return;
    
    try {
        // Clock out from current job
        await toggleClockInOut();
        
        // Small delay to ensure clock out completes
        setTimeout(async () => {
          // Clock in to new job
          await toggleClockInOut(newProjectId);
        }, 100);
    } catch (error) {
        console.error("Error switching job:", error);
        alert("An unexpected error occurred while switching jobs. Please try again.");
    }
  }, [currentUser, toggleClockInOut, businessId]);

  const addPunchListItem = useCallback(async (projectId: number, text: string) => {
    if (!businessId) throw new Error('No business context');

    const newItem = await punchListService.addItem(projectId, parseInt(businessId), text);
    
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, punchList: [...p.punchList, newItem] }
        : p
    ));
  }, [businessId]);

  const togglePunchListItem = useCallback(async (projectId: number, itemId: number) => {
    await punchListService.toggleComplete(itemId);
    
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { 
            ...p, 
            punchList: p.punchList.map(item => 
              item.id === itemId 
                ? { ...item, isComplete: !item.isComplete }
                : item
            )
          }
        : p
    ));
  }, []);

  // Photo and other methods remain the same for now (using IndexedDB)
  const addPhoto = useCallback(async (projectId: number, imageDataUrls: string[], description: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error(`Project with ID ${projectId} not found.`);

    let newPhotosMeta: Omit<ProjectPhoto, 'imageDataUrl'>[] = [];
    const dateAdded = new Date();
    const maxId = project.photos.length > 0 ? Math.max(...project.photos.map(p => p.id)) : 0;
    let nextId = maxId + 1;

    const photoSavePromises = imageDataUrls.map((url) => {
        const photoId = nextId++;
        const newPhotoMeta: Omit<ProjectPhoto, 'imageDataUrl'> = { 
          id: photoId, 
          businessId: parseInt(businessId), 
          projectId, 
          description, 
          dateAdded 
        };
        newPhotosMeta.push(newPhotoMeta);
        return setPhoto(projectId, photoId, url);
    });

    await Promise.all(photoSavePromises);

    setProjects(prev => {
        return prev.map(p => {
            if (p.id === projectId) {
                return { ...p, photos: [...newPhotosMeta, ...p.photos] };
            }
            return p;
        });
    });
  }, [projects, businessId]);

  // Stub implementations for remaining methods (implement as needed)
  const addPunchListPhoto = useCallback(async (projectId: number, punchListItemId: number, imageDataUrl: string) => {
    // Implementation using IndexedDB as before
  }, []);

  const updatePunchListAnnotation = useCallback((projectId: number, punchListItemId: number, annotatedDataUrl: string) => {
    // Implementation as before
  }, []);

  const deletePunchListPhoto = useCallback(async (projectId: number, punchListItemId: number) => {
    // Implementation as before
  }, []);

  const addManualTimeLog = useCallback(async (data: { userId: number, projectId: number, clockIn: Date, clockOut: Date, notes?: string }) => {
    if (!businessId) throw new Error('No business context');

    const user = users.find(u => u.id === data.userId);
    if (!user) return;

    const durationMs = data.clockOut.getTime() - data.clockIn.getTime();
    const cost = (durationMs / 3600000) * user.hourlyRate;

    const newLog = await timeLogService.create({
      businessId: parseInt(businessId),
      userId: data.userId,
      projectId: data.projectId,
      clockIn: data.clockIn,
      clockOut: data.clockOut,
      durationMs,
      cost,
      notes: data.notes,
    });

    setTimeLogs(prev => [newLog, ...prev]);
  }, [businessId, users]);

  const updateTimeLog = useCallback(async (logId: number, data: { projectId: number, clockIn: Date, clockOut: Date, notes?: string }) => {
    const log = timeLogs.find(l => l.id === logId);
    const user = users.find(u => u.id === log?.userId);
    if (!user || !log) return;

    const durationMs = data.clockOut.getTime() - data.clockIn.getTime();
    const cost = (durationMs / 3600000) * user.hourlyRate;

    const updatedLog = await timeLogService.update(logId, {
      ...data,
      durationMs,
      cost,
    });

    setTimeLogs(prev => prev.map(log => log.id === logId ? updatedLog : log));
  }, [users, timeLogs]);

  const deleteTimeLog = useCallback(async (logId: number) => {
    await timeLogService.delete(logId);
    setTimeLogs(prev => prev.filter(log => log.id !== logId));
  }, []);

  // Invoice, inventory, and order list methods - implement as needed
  const addInvoice = useCallback(async (invoiceData: Omit<Invoice, 'id'>): Promise<Invoice> => {
    // TODO: Implement with invoiceService
    throw new Error('Not implemented yet');
  }, []);

  const updateInvoice = useCallback(async (invoiceId: number, data: Omit<Invoice, 'id'>): Promise<Invoice> => {
    // TODO: Implement with invoiceService  
    throw new Error('Not implemented yet');
  }, []);

  const deleteInvoice = useCallback(async (invoiceId: number): Promise<void> => {
    // TODO: Implement with invoiceService
    throw new Error('Not implemented yet');
  }, []);

  const addInventoryItem = useCallback(async ({ name, quantity, unit, cost, lowStockThreshold }: { name: string; quantity: number; unit: string; cost?: number; lowStockThreshold?: number }) => {
    if (!businessId) throw new Error('No business context');

    const newItem = await inventoryService.create({
      businessId: parseInt(businessId),
      name,
      quantity,
      unit,
      cost,
      lowStockThreshold,
    });

    setInventory(prev => [...prev, newItem]);
  }, [businessId]);

  const updateInventoryItem = useCallback(async (itemId: number, data: Partial<Omit<InventoryItem, 'id'>>) => {
    await inventoryService.update(itemId, data);
    setInventory(prev => prev.map(item => item.id === itemId ? { ...item, ...data } : item));
  }, []);

  const deleteInventoryItem = useCallback(async (itemId: number) => {
    await inventoryService.delete(itemId);
    setInventory(prev => prev.filter(item => item.id !== itemId));
    setOrderList(prev => prev.filter(orderItem => !(orderItem.type === 'inventory' && orderItem.itemId === itemId)));
  }, []);

  // Order list methods - implement proper database storage when needed
  const addToOrderList = useCallback((item: InventoryItem) => {
    // TODO: Implement proper database storage for order lists
    // For now, this is a temporary in-memory solution
    const orderItem: OrderItem = {
      id: `inv-${item.id}-${Date.now()}`,
      businessId: parseInt(businessId),
      type: 'inventory',
      itemId: item.id,
      createdAt: new Date(),
    };
    setOrderList(prev => [...prev, orderItem]);
  }, [businessId]);

  const addManualItemToOrderList = useCallback((name: string, cost?: number) => {
    // TODO: Implement proper database storage for order lists
    const orderItem: OrderItem = {
      id: `manual-${Date.now()}`,
      businessId: parseInt(businessId),
      type: 'manual',
      name,
      cost,
      createdAt: new Date(),
    };
    setOrderList(prev => [...prev, orderItem]);
  }, [businessId]);

  const removeFromOrderList = useCallback((orderItem: OrderItem) => {
    // TODO: Implement proper database storage for order lists
    setOrderList(prev => prev.filter(item => item.id !== orderItem.id));
  }, []);

  const clearOrderList = useCallback(() => {
    // TODO: Implement proper database storage for order lists
    setOrderList([]);
  }, []);

  const value = useMemo(() => ({ 
      users, projects, tasks, timeLogs, invoices, inventory, orderList, currentUser,
      isLoading, error,
      setCurrentUser, addUser, updateUser, addProject, addTask, updateTaskStatus, 
      toggleClockInOut, switchJob, addPunchListItem, togglePunchListItem, addPhoto, 
      addPunchListPhoto, updatePunchListAnnotation, deletePunchListPhoto,
      addManualTimeLog, updateTimeLog, deleteTimeLog,
      addInvoice, updateInvoice, deleteInvoice,
      addInventoryItem, updateInventoryItem, deleteInventoryItem,
      addToOrderList, addManualItemToOrderList, removeFromOrderList, clearOrderList,
      refreshData
  }), [
      users, projects, tasks, timeLogs, invoices, inventory, orderList, currentUser,
      isLoading, error,
      addUser, updateUser, addProject, addTask, updateTaskStatus, toggleClockInOut,
      switchJob, addPunchListItem, togglePunchListItem, addPhoto,
      addPunchListPhoto, updatePunchListAnnotation, deletePunchListPhoto,
      addManualTimeLog, updateTimeLog, deleteTimeLog,
      addInvoice, updateInvoice, deleteInvoice,
      addInventoryItem, updateInventoryItem, deleteInventoryItem,
      addToOrderList, addManualItemToOrderList, removeFromOrderList, clearOrderList,
      refreshData
  ]);

  return React.createElement(DataContext.Provider, { value }, children);
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) { throw new Error('useData must be used within a DataProvider'); }
  return context;
};