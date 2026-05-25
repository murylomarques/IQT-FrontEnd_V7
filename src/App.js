import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

import VistoriaDetalhe from './pages/VistoriaDetalhe';
// Importação das páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Fiscal from './pages/Fiscal'; 
import Admin from './pages/Admin';
import Agendamentos from './pages/Agendamentos';
import Analiticos from './pages/Analiticos';
import Backlog from './pages/Backlog';
import AgendamentoDetalhe from './pages/AgendamentoDetalhe';
import Cadastros from './pages/Cadastros';
import ResolverQualidade from './pages/ResolverQualidade';
import Agenda from './pages/Agenda';
import VistoriaSeguranca from './pages/VistoriaSeguranca';
// GH — Gestão de Hierarquia
import GhLogin from './pages/FCA';
import DashboardAdm from './pages/DashboardAdm';
import DashboardSupervisor from './pages/DashboardSupervisor';
import DashboardCoordenador from './pages/DashboardCoordenador';
import InserirFca from './pages/InserirFca';

// FCA — Avaliação de Campo
import FcafLogin from './pages/FCAF';
import DashboardFcaAdmin from './pages/DashboardFcaAdmin';
import DashboardFcaSupervisor from './pages/DashboardFcaSupervisor';
import Mensagens from './pages/Mensagens';
import GlobalNotifier from './components/GlobalNotifier';

const NotFound = () => {
  const { user } = useAuth();
  return <Navigate to={user ? '/dashboard' : '/login'} />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AuthProvider>
          <GlobalNotifier />
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* --- ROTAS PÚBLICAS PARA TODOS OS USUÁRIOS LOGADOS --- */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/resolver-qualidade/:id" element={<ProtectedRoute><ResolverQualidade /></ProtectedRoute>} />

            {/* 'terceirizado' só pode ver Dashboard e Backlog, então Backlog é a única outra rota */}
            <Route
              path="/backlog"
              element={
                <ProtectedRoute allowedRoles={['admin', 'fiscal', 'terceirizado']}>
                  <Backlog />
                </ProtectedRoute>
              }
            />

            {/* --- ROTAS RESTRITAS PARA FISCAL E ADMIN --- */}
            <Route
              path="/agendamentos"
              element={
                <ProtectedRoute allowedRoles={['admin', 'fiscal']}>
                  <Agendamentos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analiticos"
              element={
                <ProtectedRoute allowedRoles={['admin', 'fiscal']}>
                  <Analiticos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agendamento/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'fiscal']}>
                  <AgendamentoDetalhe />
                </ProtectedRoute>
              }
            />
             <Route
              path="/fiscal"
              element={
                <ProtectedRoute allowedRoles={['admin', 'fiscal']}> {/* Permite admin e fiscal */}
                  <Fiscal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cadastros"
              element={
                <ProtectedRoute allowedRoles={['admin', 'fiscal']}>
                  <Cadastros />
                </ProtectedRoute>
              }
            />
            <Route
                path="/vistoria-seguranca"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'fiscal']}>
                    <VistoriaSeguranca />
                  </ProtectedRoute>
                }
              />



            <Route
              path="/vistoria/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'fiscal']}>
                  <VistoriaDetalhe />
                </ProtectedRoute>
              }
            />

            <Route
              path="/agenda"
              element={
                <ProtectedRoute allowedRoles={['admin', 'fiscal']}>
                  <Agenda />
                </ProtectedRoute>
              }
            />

            {/* --- ROTA EXCLUSIVA PARA ADMIN --- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mensagens"
              element={
                <ProtectedRoute allowedRoles={['admin', 'fiscal', 'terceirizado']}>
                  <Mensagens />
                </ProtectedRoute>
              }
            />



            {/* ── GH — Gestão de Hierarquia ── */}
            <Route path="/login/GH"                element={<GhLogin />} />
            <Route path="/dashboard/gh-adm"        element={<DashboardAdm />} />
            <Route path="/dashboard/gh-supervisor"  element={<DashboardSupervisor />} />
            <Route path="/dashboard/gh-coordenador" element={<DashboardCoordenador />} />
            <Route path="/dashboard/gh-viewer"      element={<InserirFca />} />

            {/* ── FCA — Avaliação de Campo ── */}
            <Route path="/login/FCA"                element={<FcafLogin />} />
            <Route path="/dashboard/fca-admin"      element={<DashboardFcaAdmin />} />
            <Route path="/dashboard/fca-supervisor"  element={<DashboardFcaSupervisor />} />




            {/* Rota padrão: logado vai para dashboard, deslogado vai para login */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="dark"
      />
    </ThemeProvider>
  );
}

export default App;
