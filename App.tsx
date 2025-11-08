import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { DataProvider } from './hooks/useSupabaseData';
import { NotificationProvider } from './hooks/useNotification';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationContainer from './components/NotificationContainer';
import Layout from './components/Layout';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import ProjectDetails from './components/ProjectDetails';
import Tasks from './components/Tasks';
import Team from './components/Team';
import TimeTracking from './components/TimeTracking';
import PunchLists from './components/PunchLists';
import PunchListDetails from './components/PunchListDetails';
import ProjectPhotos from './components/ProjectPhotos';
import Profile from './components/Profile';
import Schedule from './components/Schedule';
import MapView from './components/MapView';
import Invoices from './components/Invoices';
import InvoiceDetails from './components/InvoiceDetails';
import InvoiceEditor from './components/InvoiceEditor';
import AuthCallback from './components/AuthCallback';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <DataProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <Layout>
                  <Projects />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/projects/:projectId" element={
              <ProtectedRoute>
                <Layout>
                  <ProjectDetails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/projects/:projectId/photos" element={
              <ProtectedRoute>
                <Layout>
                  <ProjectPhotos />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/projects/:projectId/tasks" element={
              <ProtectedRoute>
                <Layout>
                  <Tasks />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <Layout>
                  <Tasks />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute>
                <Layout>
                  <Schedule />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <Layout>
                  <MapView />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/team" element={
              <ProtectedRoute>
                <Layout>
                  <Team />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/time-tracking" element={
              <ProtectedRoute>
                <Layout>
                  <TimeTracking />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/punch-lists" element={
              <ProtectedRoute>
                <Layout>
                  <PunchLists />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/punch-lists/:projectId" element={
              <ProtectedRoute>
                <Layout>
                  <PunchListDetails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/invoicing" element={
              <ProtectedRoute>
                <Layout>
                  <Invoices />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/invoices/new" element={
              <ProtectedRoute>
                <Layout>
                  <InvoiceEditor />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/invoices/:invoiceId" element={
              <ProtectedRoute>
                <Layout>
                  <InvoiceDetails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/invoices/:invoiceId/edit" element={
              <ProtectedRoute>
                <Layout>
                  <InvoiceEditor />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <NotificationContainer />
        </DataProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;