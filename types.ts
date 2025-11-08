import { GoogleGenAI, GenerateContentResponse, Chat as GeminiChat, FunctionDeclaration, Type } from '@google/genai';

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export enum ProjectType {
  NewConstruction = "New Construction",
  Renovation = "Renovation",
  Demolition = "Demolition",
  InteriorFitOut = "Interior Fit-Out",
}

export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  Worker = 'Worker',
  Viewer = 'Viewer',
}

export enum BusinessStatus {
  Active = 'Active',
  Suspended = 'Suspended',
  Trial = 'Trial',
}

export interface Location {
  lat: number;
  lng: number;
}

// SaaS Business/Organization Model
export interface Business {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email: string;
  website?: string;
  status: BusinessStatus;
  subscriptionPlan: string;
  subscriptionExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced User model for SaaS
export interface User {
  id: number;
  businessId: number;
  email?: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  isClockedIn: boolean;
  hourlyRate: number;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Legacy fields for backward compatibility
  clockInTime?: Date;
  currentProjectId?: number;
}

export interface PunchListItem {
  id: number;
  businessId: number;
  text: string;
  isComplete: boolean;
  photo?: {
    baseImageId: string; // Unique ID for the original image in IndexedDB
    annotatedImageUrl: string; // Data URL for the marked-up image to display
  };
}

export interface ProjectPhoto {
  id: number;
  businessId: number;
  projectId: number;
  imageDataUrl?: string; // Stored in IndexedDB, not with project object
  description: string;
  dateAdded: Date;
}

export interface Project {
  id: number;
  businessId: number;
  name: string;
  address: string;
  type: ProjectType;
  status: 'In Progress' | 'Completed' | 'On Hold';
  startDate: Date;
  endDate: Date;
  budget: number;
  punchList: PunchListItem[];
  photos: ProjectPhoto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: number;
  businessId: number;
  title: string;
  description: string;
  projectId: number;
  assigneeId: number;
  dueDate: Date;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeLog {
  id: number;
  businessId: number;
  userId: number;
  projectId: number;
  clockIn: Date;
  clockOut?: Date;
  durationMs?: number;
  cost?: number;
  clockInLocation?: Location;
  clockOutLocation?: Location;
  clockInMapImage?: string;
  clockOutMapImage?: string;
  notes?: string;
  invoiceId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  sender: 'user' | 'model';
  message: string;
  image?: string; // base64 encoded image
  toolResponse?: any;
}

// FIX: Added InventoryItem interface to resolve type errors in inventory components.
export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  cost?: number;
  lowStockThreshold?: number;
}

// Order list item for inventory management
export interface OrderItem {
  id: string;
  type: 'inventory' | 'manual';
  itemId?: number; // For inventory items
  name?: string; // For manual items
  cost?: number; // For manual items
}

// FIX: Added InventoryItem interface to resolve type errors in inventory components.
export interface InventoryItem {
  id: number;
  businessId: number;
  name: string;
  quantity: number;
  unit: string;
  cost?: number;
  lowStockThreshold?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order list item for inventory management
export interface OrderItem {
  id: string;
  businessId: number;
  type: 'inventory' | 'manual';
  itemId?: number; // For inventory items
  name?: string; // For manual items
  cost?: number; // For manual items
  createdAt: Date;
}

// FIX: Added Invoice-related types to resolve type errors in invoicing components.
export enum InvoiceStatus {
  Draft = 'Draft',
  Sent = 'Sent',
  Paid = 'Paid',
  Overdue = 'Overdue',
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  timeLogIds?: number[];
}

export interface Invoice {
  id: number;
  businessId: number;
  invoiceNumber: string;
  projectId: number;
  dateIssued: Date;
  dueDate: Date;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  notes?: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication Types
export interface AuthUser {
  id: number;
  email: string;
  name: string;
  businessId: number;
  role: UserRole;
  avatarUrl: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  businessName: string;
  businessEmail: string;
  userName: string;
  userEmail: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  business: Business | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}