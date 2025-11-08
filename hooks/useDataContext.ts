import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, Task, User, TimeLog, TaskStatus, InventoryItem, OrderItem, Invoice } from '../types';

// Legacy data context - all functionality moved to useSupabaseData
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
  addUser: (user: any) => Promise<void>;
  updateUser: (userId: number, data: any) => Promise<void>;
  addProject: (project: any) => Promise<void>;
  addTask: (task: any) => Promise<void>;
  updateTaskStatus: (taskId: number, status: TaskStatus) => Promise<void>;
  toggleClockInOut: (projectId?: number) => Promise<void>;
  switchJob: (newProjectId: number) => Promise<void>;
  addPunchListItem: (projectId: number, text: string) => Promise<void>;
  togglePunchListItem: (projectId: number, itemId: number) => Promise<void>;
  addPhoto: (projectId: number, imageDataUrls: string[], description: string) => Promise<void>;
  addPunchListPhoto: (projectId: number, punchListItemId: number, imageDataUrl: string) => Promise<void>;
  updatePunchListAnnotation: (projectId: number, punchListItemId: number, annotatedDataUrl: string) => void;
  deletePunchListPhoto: (projectId: number, punchListItemId: number) => Promise<void>;
  addManualTimeLog: (data: any) => Promise<void>;
  updateTimeLog: (logId: number, data: any) => Promise<void>;
  deleteTimeLog: (logId: number) => Promise<void>;
  addInvoice: (invoiceData: any) => Promise<Invoice>;
  updateInvoice: (invoiceId: number, data: any) => Promise<Invoice>;
  deleteInvoice: (invoiceId: number) => Promise<void>;
  addInventoryItem: (item: any) => Promise<void>;
  updateInventoryItem: (itemId: number, data: any) => Promise<void>;
  deleteInventoryItem: (itemId: number) => Promise<void>;
  addToOrderList: (item: InventoryItem) => void;
  addManualItemToOrderList: (name: string, cost?: number) => void;
  removeFromOrderList: (orderItem: OrderItem) => void;
  clearOrderList: () => void;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const users: User[] = [];
  const projects: Project[] = [];
  const tasks: Task[] = [];
  const timeLogs: TimeLog[] = [];
  const invoices: Invoice[] = [];
  const inventory: InventoryItem[] = [];
  const orderList: OrderItem[] = [];
  
  const isLoading = false;
  const error: string | null = null;

  const migrationError = () => {
    throw new Error('Please migrate to useSupabaseData hook');
  };

  const value = { 
    users, projects, tasks, timeLogs, invoices, inventory, orderList, currentUser,
    isLoading, error,
    setCurrentUser, 
    addUser: migrationError,
    updateUser: migrationError,
    addProject: migrationError,
    addTask: migrationError,
    updateTaskStatus: migrationError,
    toggleClockInOut: migrationError,
    switchJob: migrationError,
    addPunchListItem: migrationError,
    togglePunchListItem: migrationError,
    addPhoto: migrationError,
    addPunchListPhoto: migrationError,
    updatePunchListAnnotation: migrationError,
    deletePunchListPhoto: migrationError,
    addManualTimeLog: migrationError,
    updateTimeLog: migrationError,
    deleteTimeLog: migrationError,
    addInvoice: migrationError,
    updateInvoice: migrationError,
    deleteInvoice: migrationError,
    addInventoryItem: migrationError,
    updateInventoryItem: migrationError,
    deleteInventoryItem: migrationError,
    addToOrderList: migrationError,
    addManualItemToOrderList: migrationError,
    removeFromOrderList: migrationError,
    clearOrderList: migrationError,
    refreshData: async () => {}
  };

  return React.createElement(DataContext.Provider, { value }, children);
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) { 
    throw new Error('useData must be used within a DataProvider'); 
  }
  return context;
};