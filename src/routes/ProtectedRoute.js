import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Agora a prop se chamará 'allowedRoles' (plural) para ficar mais claro
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  // 1. A primeira verificação continua a mesma: O usuário está logado?
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 2. A NOVA LÓGICA:
  // Se a rota exige permissões (se allowedRoles foi fornecido)...
  // ...verifique se a permissão do usuário (user.role) está INCLUÍDA na lista de permissões permitidas.
  // Se NÃO estiver incluída, redirecione.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  // 3. Se o usuário estiver logado e tiver a permissão necessária (ou se a rota não exigir permissão),
  // o acesso é permitido.
  return children;
};

export default ProtectedRoute;