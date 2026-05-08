import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import MainLayout from './layouts/MainLayout'
import AddStudent from './pages/AddStudent'
import AIInsights from './pages/AIInsights'
import DashboardOverview from './pages/DashboardOverview'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Intro from './pages/Intro'
import LearningGaps from './pages/LearningGaps'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import RiskAlerts from './pages/RiskAlerts'
import Students from './pages/Students'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="students" element={<Students />} />
        <Route path="add-student" element={<AddStudent />} />
        <Route path="ai-insights" element={<AIInsights />} />
        <Route path="learning-gaps" element={<LearningGaps />} />
        <Route path="risk-alerts" element={<RiskAlerts />} />
      </Route>

      <Route path="/dashboard/overview" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
