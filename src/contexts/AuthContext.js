import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutos
const SESSION_WARNING_TIME = 15 * 1000; // 15 segundos antes do logout

const AuthContext = createContext();

// Configuração global do axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://iqt.desktop.com.br/api';

// Mapa para traduzir o ID do cargo para um nome de role
const ROLE_MAP = {
  1: 'admin',
  2: 'terceirizado',
  3: 'fiscal',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Este loading é apenas para o carregamento inicial da app
  const navigate = useNavigate();

  const logoutTimer = useRef();
  const warningTimer = useRef();

  const logout = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);

    localStorage.removeItem('desktopUser');
    setUser(null);
    navigate('/login');
    toast.info('Sua sessão expirou.');
  };

  const initSessionTimers = (userData) => {
    const remainingTime = userData.expirationTime - Date.now();
    const warningTimeout = remainingTime - SESSION_WARNING_TIME;

    if (remainingTime > 0) {
        logoutTimer.current = setTimeout(logout, remainingTime);
    }

    if (warningTimeout > 0) {
      warningTimer.current = setTimeout(() => {
        toast.warn('Sua sessão está prestes a expirar!', { autoClose: 15000, closeOnClick: false });
      }, warningTimeout);
    }
  };

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('desktopUser'));
      if (storedUser && Date.now() < storedUser.expirationTime) {
        setUser(storedUser);
        initSessionTimers(storedUser);
      } else if (storedUser) {
        localStorage.removeItem('desktopUser');
      }
    } catch (error) {
        console.error("Falha ao processar dados do usuário:", error);
        localStorage.removeItem('desktopUser');
    } finally {
        setLoading(false);
    }
  }, []);

  // ==========================================================
  // ==================== INÍCIO DA CORREÇÃO ==================
  // ==========================================================
  const login = async (email, password) => {
    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/api/login', { email, password });

      const expirationTime = Date.now() + SESSION_DURATION;
      const apiUser = response.data.user;

      const userRole = ROLE_MAP[apiUser.cargo_id] || 'unknown';

      const userData = {
        ...apiUser,
        role: userRole,
        token: response.data.access_token,
        expirationTime
      };

      localStorage.setItem('desktopUser', JSON.stringify(userData));
      setUser(userData);

      initSessionTimers(userData);

      // ==========================================================
      // ==================== INÍCIO DA ALTERAÇÃO ===================
      // ==========================================================

      // Redireciona o usuário com base no seu cargo
      if (userRole === 'fiscal') {
        navigate('/fiscal'); // Rota para a nova tela do fiscal
      } else {
        navigate('/dashboard'); // Rota padrão para os outros usuários
      }

      // ==========================================================
      // ===================== FIM DA ALTERAÇÃO =====================
      // ==========================================================

      return userData;
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erro ao tentar fazer login.');
      }
      throw error;
    }
  };
  // ==========================================================
  // ===================== FIM DA CORREÇÃO ====================
  // ==========================================================

  const apiFetch = async (url, options = {}) => {
    try {
      const response = await axios({
        url,
        ...options,
        headers: {
          ...options.headers,
          Authorization: user ? `Bearer ${user.token}` : undefined,
        },
      });
      return response.data;
    } catch (error) {
      // Adicionar tratamento para erro 401 (Não Autorizado) se necessário
      if (error.response && error.response.status === 401) {
        logout(); // Desloga o usuário se o token for inválido
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, apiFetch }}>
      {/* Esta condição agora só afeta o carregamento inicial da aplicação */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);