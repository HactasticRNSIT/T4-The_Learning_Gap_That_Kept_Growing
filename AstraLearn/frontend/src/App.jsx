import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Intro from './pages/Intro';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Intro is the start point at '/' */}
      <Route path="/" element={<Intro />} />

      {/* Main App Routes wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        
        {/* FIXED: Changed element( to element={ */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 handler */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;