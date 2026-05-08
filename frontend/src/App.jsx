import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRedirect from './components/RoleRedirect'
import MainLayout from './layouts/MainLayout'
import PortalLayout from './layouts/PortalLayout'
import AddStudent from './pages/AddStudent'
import AIInsights from './pages/AIInsights'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Intro from './pages/Intro'
import IntelligenceSuite from './pages/IntelligenceSuite'
import LearningGaps from './pages/LearningGaps'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import PortalFeatureLab from './pages/PortalFeatureLab'
import PortalWorkspace from './pages/PortalWorkspace'
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
            <RoleRedirect />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <PortalLayout role="teacher" />
          </ProtectedRoute>
        }
      >
        <Route index element={<IntelligenceSuite mode="teacher" />} />
        <Route path="students" element={<Students />} />
        <Route path="add-student" element={<AddStudent />} />
        <Route path="ai-insights" element={<AIInsights />} />
        <Route path="learning-gaps" element={<LearningGaps />} />
        <Route path="risk-alerts" element={<RiskAlerts />} />
        <Route path="prediction-engine" element={<IntelligenceSuite mode="prediction" />} />
        <Route path="academic-copilot" element={<IntelligenceSuite mode="copilot" />} />
        <Route path="features" element={<PortalFeatureLab role="teacher" />} />
      </Route>

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <PortalLayout role="student" />
          </ProtectedRoute>
        }
      >
        <Route index element={<IntelligenceSuite mode="student" />} />
        <Route path="study-coach" element={<PortalWorkspace type="studyCoach" />} />
        <Route path="timetable" element={<PortalWorkspace type="timetable" />} />
        <Route path="mastery-map" element={<PortalWorkspace type="masteryMap" />} />
        <Route path="motivation" element={<PortalWorkspace type="motivation" />} />
        <Route path="projects" element={<PortalWorkspace type="projects" />} />
        <Route path="contributions" element={<PortalWorkspace type="contributions" />} />
        <Route path="world-comparison" element={<PortalWorkspace type="worldComparison" />} />
        <Route path="career-guide" element={<PortalWorkspace type="careerGuide" />} />
        <Route path="opportunities" element={<PortalWorkspace type="opportunities" />} />
        <Route path="features" element={<PortalFeatureLab role="student" />} />
      </Route>

      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <PortalLayout role="parent" />
          </ProtectedRoute>
        }
      >
        <Route index element={<IntelligenceSuite mode="parent" />} />
        <Route path="risk-guidance" element={<PortalWorkspace type="parentRisk" />} />
        <Route path="attendance" element={<PortalWorkspace type="parentAttendance" />} />
        <Route path="contributions" element={<PortalWorkspace type="parentContributions" />} />
        <Route path="reports" element={<PortalWorkspace type="parentReports" />} />
        <Route path="features" element={<PortalFeatureLab role="parent" />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PortalLayout role="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<IntelligenceSuite mode="admin" />} />
        <Route path="departments" element={<PortalWorkspace type="departments" />} />
        <Route path="interventions" element={<PortalWorkspace type="interventions" />} />
        <Route path="document-ai" element={<PortalWorkspace type="documentAi" />} />
        <Route path="national-scale" element={<PortalWorkspace type="nationalScale" />} />
        <Route path="features" element={<PortalFeatureLab role="admin" />} />
      </Route>

      <Route path="/dashboard/overview" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
