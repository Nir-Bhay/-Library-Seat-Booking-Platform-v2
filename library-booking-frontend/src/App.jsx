import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LibraryList from './pages/LibraryList';
import LibraryDetails from './pages/LibraryDetails';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingApprovals from './pages/admin/PendingApprovals';
import UserManagement from './pages/admin/UserManagement';
import LibraryManagement from './pages/admin/LibraryManagement';
import BookingManagement from './pages/admin/BookingManagement';
import CommissionReport from './pages/admin/CommissionReport';
import PlatformSettings from './pages/admin/PlatformSettings';

// Librarian Pages
import LibrarianDashboard from './pages/librarian/LibrarianDashboard';
import AddEditLibrary from './pages/librarian/AddEditLibrary';
import TimeSlots from './pages/librarian/TimeSlots';
import LibrarianBookings from './pages/librarian/LibrarianBookings';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Public routes */}
        <Route path="/libraries" element={<LibraryList />} />
        <Route path="/library/:id" element={<LibraryDetails />} />
        
        {/* Protected routes */}
        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pending-approvals"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PendingApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/libraries"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LibraryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <BookingManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/commission-report"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CommissionReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PlatformSettings />
            </ProtectedRoute>
          }
        />

        {/* Librarian routes */}
        <Route
          path="/librarian/dashboard"
          element={
            <ProtectedRoute allowedRoles={['librarian']}>
              <LibrarianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/librarian/add-library"
          element={
            <ProtectedRoute allowedRoles={['librarian']}>
              <AddEditLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/librarian/edit-library/:id"
          element={
            <ProtectedRoute allowedRoles={['librarian']}>
              <AddEditLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/librarian/time-slots/:libraryId"
          element={
            <ProtectedRoute allowedRoles={['librarian']}>
              <TimeSlots />
            </ProtectedRoute>
          }
        />
        <Route
          path="/librarian/bookings"
          element={
            <ProtectedRoute allowedRoles={['librarian']}>
              <LibrarianBookings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
