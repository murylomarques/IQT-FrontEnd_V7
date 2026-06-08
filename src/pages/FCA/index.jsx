import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FcaGlobal, LoginShell, LoginHero, LoginCard, LoginForm, LoginBtn,
  Fld, Lbl, Inp,
} from './theme';
import { fcaStorage, fcaFetch, getRedirectByRole } from './api';

const REMEMBER_USER_KEY = 'GH-remembered-user';

const FcaLogin = () => {
  const [usuario, setUsuario]   = useState(() => localStorage.getItem(REMEMBER_USER_KEY) || '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem(REMEMBER_USER_KEY)));
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleRememberChange = (checked) => {
    setRemember(checked);
    if (!checked) localStorage.removeItem(REMEMBER_USER_KEY);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario.trim() || !password.trim()) {
      toast.error('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const data = await fcaFetch('/loginfca', {
        method: 'POST',
        body: JSON.stringify({ usuario, password }),
      });
      fcaStorage.set('token',      data.token);
      fcaStorage.set('name',       data.name);
      fcaStorage.set('role',       data.role);
      fcaStorage.set('id',         data.id);
      fcaStorage.set('territory',  data.territory ?? '');
      fcaStorage.set('regional',   data.regional ?? '');
      fcaStorage.set('manager_id', data.manager_id ?? '');
      if (remember) {
        localStorage.setItem(REMEMBER_USER_KEY, usuario.trim());
      } else {
        localStorage.removeItem(REMEMBER_USER_KEY);
      }
      toast.success(`Bem-vindo, ${data.name}!`);
      navigate(getRedirectByRole(data.role));
    } catch (err) {
      toast.error(err.message || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginShell>
      <FcaGlobal />

      <LoginHero>
        <div className="kicker">Gestão de Estrutura</div>
        <div className="brand">GH · FCA</div>
        <div className="headline">Controle quem está abaixo de cada nível.</div>
        <div className="desc">
          Gerencie a estrutura de equipes com janela mensal configurável,
          workflow de aprovação e hierarquia completa por perfil de acesso.
        </div>
        <div className="chips">
          <span className="chip">Hierarquia</span>
          <span className="chip">Vínculos</span>
          <span className="chip">Janela Mensal</span>
          <span className="chip">Aprovações</span>
          <span className="chip">CSV Import</span>
        </div>
      </LoginHero>

      <LoginCard>
        <div className="logo">GH · FCA</div>
        <div className="sub">Acesso corporativo seguro</div>

        <LoginForm onSubmit={handleSubmit} noValidate>
          <Fld>
            <Lbl htmlFor="usuario">Usuário ou e-mail</Lbl>
            <Inp
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="seu.usuario"
              disabled={loading}
              autoComplete="username"
            />
          </Fld>

          <Fld>
            <Lbl htmlFor="password">Senha</Lbl>
            <Inp
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="current-password"
            />
          </Fld>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#5a5551', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => handleRememberChange(e.target.checked)}
              disabled={loading}
            />
            Lembrar usuário
          </label>

          <LoginBtn type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </LoginBtn>
        </LoginForm>
      </LoginCard>
    </LoginShell>
  );
};

export default FcaLogin;
