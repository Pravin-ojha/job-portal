import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';
import EditJobPage from './pages/EditJobPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SavedJobsPage from './pages/SavedJobsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import JobsPanel from './pages/JobsPanel';
import CompanyProfilePage from './pages/CompanyProfilePage';
import AdminDashboard from './pages/AdminDashboard';



function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <Router future={{ v7_startTransition: true }}>
        <div className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary/30">
          <Navbar />
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/companies/:id" element={<CompanyProfilePage />} />
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute>
                    <PostJobPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-job/:id"
                element={
                  <ProtectedRoute>
                    <EditJobPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved-jobs"
                element={
                  <ProtectedRoute>
                    <SavedJobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-jobs"
                element={
                  <ProtectedRoute>
                    <JobsPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <ApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </main>
        </div>
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
