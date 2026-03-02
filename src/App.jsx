// src/App.jsx - Main routing for Takwine

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Challenges from './pages/Challenges';
import Events from './pages/Events';
import Clubs from './pages/Clubs';
import Subjects from './pages/Subjects';
import NotFound from './pages/NotFound';

// Layout
import Layout from './components/layout/Layout';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Chargement de Takwine...</p>
        </div>
      </div>
    );
  }
  return currentUser ? children : <Navigate to="/login" replace />;
}

// Public route (redirect to feed if already logged in)
function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  return currentUser ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* Protected routes (wrapped in Layout) */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Feed />} />
        <Route path="profile/:id" element={<Profile />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="events" element={<Events />} />
        <Route path="clubs" element={<Clubs />} />
        <Route path="subjects" element={<Subjects />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
