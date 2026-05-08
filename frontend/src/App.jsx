import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import DashboardPage from './pages/DashboardPage'
import SkillGapPage from './pages/SkillGapPage'
import LearningPathPage from './pages/LearningPathPage'
import DemandForecastPage from './pages/DemandForecastPage'
import ResumeMatcherPage from './pages/ResumeMatcherPage'
import JobListingsPage from './pages/JobListingsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"              element={<Navigate to="/login" />} />
          <Route path="/login"         element={<LoginPage />} />
          <Route path="/register"      element={<RegisterPage />} />
          <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
          <Route path="/dashboard"     element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/skill-gap" element={<ProtectedRoute><SkillGapPage /></ProtectedRoute>} />
          <Route path="/learning-path" element={<ProtectedRoute><LearningPathPage /></ProtectedRoute>} />
          <Route path="/demand-forecast" element={<ProtectedRoute><DemandForecastPage /></ProtectedRoute>} />
          <Route path="/resume-matcher" element={<ProtectedRoute><ResumeMatcherPage /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><JobListingsPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
