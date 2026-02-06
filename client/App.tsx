import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { isAuthenticatedAtom, userAtom } from './store';
import { useAuth } from './hooks/useAuth';
import { Login, Register } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Stores } from './pages/Stores';
import { Users } from './pages/Users';
import { Layout } from './components/UI';
import { Role } from './types';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = useAtomValue(isAuthenticatedAtom);
  if (!isAuth) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const RoleGuard: React.FC<{ children: React.ReactNode; roles: Role[] }> = ({ children, roles }) => {
  const user = useAtomValue(userAtom);
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const { loadUser } = useAuth();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />

        <Route path="/" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />

        <Route path="/stores" element={
          <RequireAuth>
            <Stores />
          </RequireAuth>
        } />

        <Route path="/users" element={
          <RequireAuth>
            <RoleGuard roles={[Role.ADMIN]}>
              <Users />
            </RoleGuard>
          </RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;