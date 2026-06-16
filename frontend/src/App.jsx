import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/layout/AppShell.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { Verify2FAPage } from './pages/Verify2FAPage.jsx';
import { Setup2FAPage } from './pages/Setup2FAPage.jsx';
import { CompanyWizardPage } from './pages/CompanyWizardPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { IdentityPage } from './pages/IdentityPage.jsx';
import { TreasuryPage } from './pages/TreasuryPage.jsx';
import { GovernancePage } from './pages/GovernancePage.jsx';
import { AgentManagementPage } from './pages/AgentManagementPage.jsx';
import { MarketplacePage } from './pages/MarketplacePage.jsx';
import { ServiceFeePage } from './pages/ServiceFeePage.jsx';
import { IntroductionPage } from './pages/IntroductionPage.jsx';
import { MembersPage } from './pages/MembersPage.jsx';
import InvitePage from './pages/InvitePage.jsx';
const SpatialWorkspacePage = lazy(() => import('./pages/SpatialWorkspacePage.jsx').then(m => ({ default: m.SpatialWorkspacePage })));
const VirtualOfficePage = lazy(() => import('./pages/VirtualOfficePage.jsx'));
import { DPEPipelinePage } from './pages/DPEPipelinePage.jsx';
import { ForensicAuditPage } from './pages/ForensicAuditPage.jsx';
import { AuditPage } from './pages/AuditPage.jsx';
import { CompanyManagementPage } from './pages/CompanyManagementPage.jsx';
import { ReportsPage } from './pages/ReportsPage.jsx';
import { useAuthStore } from './store/authStore.js';
import { authApi } from './services/authApi.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Private route wrapper — redirects to login if not authenticated.
 */
function PrivateRoute({ children, isInitializing }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const location = useLocation();
  
  if (isInitializing) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#000000',color:'#E4E2DD'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'16px'}}>
          <div style={{width:'32px',height:'32px',border:'3px solid #E4E2DD',borderTopColor:'#F13223',borderRadius:'50%',animation:'spin 1s linear infinite'}} />
          <div style={{fontWeight:'500'}}>Restoring session...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && !user.twoFactorEnabled && location.pathname !== '/setup-2fa') {
    return <Navigate to="/setup-2fa" replace />;
  }
  return children;
}

/**
 * Smart fallback — redirects based on auth state.
 */
function FallbackRedirect() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

/**
 * Sovereign Protocol — Root Application
 */
function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const restoreSession = useAuthStore(s => s.restoreSession);

  useEffect(() => {
    async function initSession() {
      try {
        const result = await authApi.refresh();
        if (result?.success && result?.data?.accessToken) {
          restoreSession(result.data.user, result.data.accessToken);
        }
      } catch (err) {
        // No valid session, user will just see the login page
      } finally {
        setIsInitializing(false);
      }
    }
    initSession();

    // Listen for unauthorized events triggered by API clients
    const handleUnauthorized = () => {
      useAuthStore.getState().logout();
    };
    window.addEventListener('sovereign_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('sovereign_unauthorized', handleUnauthorized);
  }, [restoreSession]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public: Introduction */}
          <Route path="/" element={<IntroductionPage />} />

          {/* Public: Auth flow */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-2fa" element={<Verify2FAPage />} />
          <Route path="/invite/:token" element={<InvitePage />} />
          <Route path="/create-workspace" element={<CompanyWizardPage />} />

          {/* Private Standalone Pages */}
          <Route path="/setup-2fa" element={<PrivateRoute isInitializing={isInitializing}><Setup2FAPage /></PrivateRoute>} />
          <Route path="/introduction" element={<PrivateRoute isInitializing={isInitializing}><IntroductionPage /></PrivateRoute>} />
          <Route path="/members" element={<PrivateRoute isInitializing={isInitializing}><MembersPage /></PrivateRoute>} />

          {/* Private: App Shell with nested routes */}
          <Route
            element={
              <PrivateRoute isInitializing={isInitializing}>
                <AppShell />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/identity" element={<IdentityPage />} />
            <Route path="/treasury" element={<TreasuryPage />} />
            <Route path="/governance" element={<GovernancePage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/company-management" element={<CompanyManagementPage />} />
            {/* Module 2: Command Center */}
            <Route path="/agents" element={<AgentManagementPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/service-fees" element={<ServiceFeePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            {/* Module 3: Spatial Workspace (lazy-loaded for performance) */}
            <Route path="/spatial" element={<Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'80vh',color:'#64748b'}}>Loading 3D workspace...</div>}><SpatialWorkspacePage /></Suspense>} />
            <Route path="/virtual-office" element={<Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'80vh',color:'#64748b'}}>Loading Virtual Office...</div>}><VirtualOfficePage /></Suspense>} />
            {/* Module 4: Operational Layer */}
            <Route path="/dpe-pipeline" element={<DPEPipelinePage />} />
            <Route path="/forensic-audit" element={<ForensicAuditPage />} />
          </Route>

          {/* Fallback — smart redirect based on auth state */}
          <Route path="*" element={<FallbackRedirect />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

