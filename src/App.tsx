'use client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './app/admin/page';
import UserPage from './app/user/page';
import RegisterPage from './app/register/page';
import { AppProvider } from './components/AppContext';
import { AuthProvider } from './context/AuthContext.tsx';
import { ProtectedRoute } from './components/ProtectedRoutes';
import LoginPage from './app/login/page.tsx';

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/user" replace />} />
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />


            {/* Admin only */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireRole="ADMIN">
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Any authenticated user */}
            <Route
              path="/user"
              element={
                  <UserPage />
              }
            />

            <Route path="*" element={<Navigate to="/user" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </AppProvider>
  );
}