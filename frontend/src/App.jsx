import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content container">
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<Landing />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/notes/:id" element={<NoteDetail />} />
              </Route>

              {/* Catch all redirecting to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
