import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import Signup from './pages/Authentication/Signup';
import Login from './pages/Authentication/Login';
import GlobalLayout from './Layout/GlobalLayout';
import Dashboard from './pages/User/Dasboard';
import SubscriptionsPage from './pages/User/Subscriptions';
import AnalyticsPage from './pages/User/Analytics';
import ChatsPage from './pages/User/Chats';
import CalendarPage from './pages/User/Calendar';
import PaymentsPage from './pages/User/Payments';
import NotificationsPage from './pages/User/Notifications';
import ProfilePage from './pages/User/Profile';
import SettingsPage from './pages/User/Settings';
import ProtectedRoute from './utils/ProtectedRoute';
import PurpleParticleWave from './components/Home/PurpleParticleWave';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen w-full overflow-hidden bg-[#05010d] text-foreground">
        <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_18%_18%,rgba(153,92,255,0.22),transparent_28%),radial-gradient(circle_at_86%_10%,rgba(199,144,255,0.18),transparent_26%),linear-gradient(180deg,#120429_0%,#090112_48%,#04010a_100%)]" />
        <div className="fixed inset-0 z-0 opacity-90">
          <PurpleParticleWave />
        </div>
        <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_bottom,rgba(132,65,255,0.16),transparent_32%)]" />

        <div className="relative z-10 min-h-screen w-full">
          <Router>
            <Routes>
              {/* Public Routes - No Layout */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes with Global Layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <GlobalLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/subscriptions" element={<SubscriptionsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/chats" element={<ChatsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
