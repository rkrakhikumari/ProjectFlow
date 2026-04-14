import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { useAuthStore } from './store/authStore'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ProfilePage from './pages/ProfilePage'

const theme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    background: { default: '#f8fafc', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 2px 8px rgba(37,99,235,0.3)' },
        },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
    MuiPaper:  { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiAppBar: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiChip:   { styleOverrides: { root: { fontWeight: 600 } } },
  },
})

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return <LoadingSpinner />
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return <LoadingSpinner />
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

function AppInitializer({ children }: { children: React.ReactNode }) {
  const { initAuth } = useAuth()
  useEffect(() => { initAuth() }, [initAuth])
  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppInitializer>
          <Routes>
            <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/dashboard"   element={<PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>} />
            <Route path="/projects/:id" element={<PrivateRoute><Layout><ProjectDetailPage /></Layout></PrivateRoute>} />
            <Route path="/profile"     element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />
            <Route path="/"  element={<Navigate to="/dashboard" replace />} />
            <Route path="*"  element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppInitializer>
      </BrowserRouter>
    </ThemeProvider>
  )
}