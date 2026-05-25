import { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutos de inatividade
const SESSION_WARNING_TIME = 15 * 1000; // 15 segundos antes do logout
const ACTIVITY_THROTTLE = 5 * 1000; // evita atualizar a cada evento

const AuthContext = createContext();

// Configuração global do axios
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL;

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
  const warningShownRef = useRef(false);
  const authToken = user?.token;

  const logout = useCallback(() => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    warningShownRef.current = false;

    localStorage.removeItem('desktopUser');
    delete axios.defaults.headers.common.Authorization;
    setUser(null);
    const hasFcaToken = !!localStorage.getItem('FCA-token');
    if (hasFcaToken && window.location.pathname.startsWith('/dashboard')) {
      navigate('/login/FCA');
    } else {
      navigate('/login');
    }
    toast.info('Sua sessão expirou.');
  }, [navigate]);

  const initSessionTimers = useCallback((expirationTime) => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);

    const remainingTime = expirationTime - Date.now();
    const warningTimeout = remainingTime - SESSION_WARNING_TIME;

    if (remainingTime > 0) {
        logoutTimer.current = setTimeout(logout, remainingTime);
    }

    if (warningTimeout > 0 && !warningShownRef.current) {
      warningTimer.current = setTimeout(() => {
        toast.warn('Sua sessão está prestes a expirar!', { autoClose: 15000, closeOnClick: false });
        warningShownRef.current = true;
      }, warningTimeout);
    }
  }, [logout]);

  const touchSession = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const now = Date.now();
      if (prev.__lastTouch && now - prev.__lastTouch < ACTIVITY_THROTTLE) {
        return prev;
      }

      const expirationTime = now + SESSION_DURATION;
      warningShownRef.current = false;
      const updated = { ...prev, expirationTime, __lastTouch: now };
      localStorage.setItem('desktopUser', JSON.stringify(updated));
      initSessionTimers(expirationTime);
      return updated;
    });
  }, [initSessionTimers]);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('desktopUser'));
      if (storedUser && Date.now() < storedUser.expirationTime) {
        setUser(storedUser);
        if (storedUser.token) {
          axios.defaults.headers.common.Authorization = `Bearer ${storedUser.token}`;
        }
        initSessionTimers(storedUser.expirationTime);
      } else if (storedUser) {
        localStorage.removeItem('desktopUser');
      }
    } catch (error) {
        localStorage.removeItem('desktopUser');
        toast.error('Sua sessão anterior estava corrompida. Faça login novamente.');
    } finally {
        setLoading(false);
    }
  }, [initSessionTimers]);

  useEffect(() => {
    if (!user) return undefined;

    const handleActivity = () => {
      touchSession();
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
    };
  }, [user, touchSession]);

  // ==========================================================
  // ==================== INÍCIO DA CORREÇÃO ==================
  // ==========================================================
  const login = async (email, password) => {
    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/api/login', { email, password });

      const expirationTime = Date.now() + SESSION_DURATION;
      const apiUser = response.data.user;

      const userRole = ROLE_MAP[apiUser.cargo_id];
      if (!userRole) {
        toast.error('Perfil de acesso não reconhecido. Contate o administrador.');
        throw new Error(`cargo_id não mapeado: ${apiUser.cargo_id}`);
      }

      const userData = {
        ...apiUser,
        role: userRole,
        token: response.data.access_token,
        expirationTime
      };

      localStorage.setItem('desktopUser', JSON.stringify(userData));
      setUser(userData);
      if (userData.token) {
        axios.defaults.headers.common.Authorization = `Bearer ${userData.token}`;
      }

      initSessionTimers(expirationTime);

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

  const apiFetch = useCallback(async (url, options = {}) => {
    try {
      const {
        method = 'GET',
        headers = {},
        params,
        data,
        body,
        responseType
      } = options;

      const hasAuthHeader =
        !!headers.Authorization ||
        !!headers.authorization;

      const finalHeaders = {
        ...headers,
        ...(authToken && !hasAuthHeader ? { Authorization: `Bearer ${authToken}` } : {}),
      };

      const finalData = data !== undefined ? data : body;

      const response = await axios({
        url,
        method,
        headers: finalHeaders,
        params,
        data: finalData,
        responseType,
      });
      return response.data;
    }
    catch (error) {
      // Adicionar tratamento para erro 401 (Não Autorizado) se necessário
      if (error.response && error.response.status === 401) {
        logout(); // Desloga o usuário se o token for inválido
      }
      throw error;
    }
  }, [authToken, logout]);

  return (
    <AuthContext.Provider value={{ user, token: user?.token, loading, login, logout, apiFetch }}>
      {/* Esta condição agora só afeta o carregamento inicial da aplicação */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
