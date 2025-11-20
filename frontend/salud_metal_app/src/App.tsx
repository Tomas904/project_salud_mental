// React import removed because the project uses the automatic JSX runtime
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import ProtectedRoute from './routes/ProtectedRoute'
import Dashboard from './features/dashboard/Dashboard'
import Emotions from './features/emotions/Emotions'
import Journal from './features/journal/Journal'
import Graph from './features/graph/Graph'
import Challenges from './features/challenges/Challenges'
import Tips from './features/tips/Tips'
import Exercises from './features/exercises/Exercises'
import Profile from './features/profile/Profile'
// Vistas eliminadas: Medallas, Notificaciones, Estadísticas, Buscar

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/emotions" element={<ProtectedRoute><Emotions /></ProtectedRoute>} />
  <Route path="/graph" element={<ProtectedRoute><Graph /></ProtectedRoute>} />
      <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
      <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
      <Route path="/tips" element={<ProtectedRoute><Tips /></ProtectedRoute>} />
      <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  { /* Rutas eliminadas: /medals, /notifications, /stats/*, /search */ }

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
