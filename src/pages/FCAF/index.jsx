import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FcaGlobal, LoginShell, LoginHero, LoginCard, LoginForm, LoginBtn, Fld, Lbl, Inp } from '../FCA/theme';
import { fcafStorage, fcafFetch, fcafRedirect } from './api';

const REMEMBER_USER_KEY = 'FCAF-remembered-user';

const FcafLogin = () => {
  const [usuario,  setUsuario]  = useState(() => localStorage.getItem(REMEMBER_USER_KEY) || '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem(REMEMBER_USER_KEY)));
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleRememberChange = (checked) => {
    setRemember(checked);
    if (!checked) localStorage.removeItem(REMEMBER_USER_KEY);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario.trim() || !password.trim()) { toast.error('Preencha todos os campos.'); return; }
    setLoading(true);
    try {
      const data = await fcafFetch('/loginfca', { method: 'POST', body: JSON.stringify({ usuario, password }) });
      if (!['admin', 'supervisao'].includes(data.role)) {
        toast.error('Acesso FCA disponível apenas para administradores e supervisores.');
        return;
      }
      fcafStorage.set('token', data.token);
      fcafStorage.set('name',  data.name);
      fcafStorage.set('role',  data.role);
      fcafStorage.set('id',    data.id);
      if (remember) {
        localStorage.setItem(REMEMBER_USER_KEY, usuario.trim());
      } else {
        localStorage.removeItem(REMEMBER_USER_KEY);
      }
      toast.success(`Bem-vindo, ${data.name}!`);
      navigate(fcafRedirect(data.role));
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
        <div className="kicker">Avaliação de Campo</div>
        <div className="brand">FCA</div>
        <div className="headline">Checklist de qualidade e observações em campo.</div>
        <div className="desc">
          Preencha formulários de avaliação dos seus técnicos, registre POs de observação
          e acompanhe o progresso do seu time no período vigente.
        </div>
        <div className="chips">
          <span className="chip">Checklist Completo</span>
          <span className="chip">PO de Campo</span>
          <span className="chip">Analítico</span>
          <span className="chip">Período Mensal</span>
        </div>
      </LoginHero>

      <LoginCard>
        <div className="logo">FCA</div>
        <div className="sub">Avaliação de campo — acesso restrito</div>
        <LoginForm onSubmit={handleSubmit} noValidate>
          <Fld>
            <Lbl htmlFor="usuario">Usuário</Lbl>
            <Inp id="usuario" type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)}
              placeholder="seu.usuario" disabled={loading} autoComplete="username" />
          </Fld>
          <Fld>
            <Lbl htmlFor="password">Senha</Lbl>
            <Inp id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" disabled={loading} autoComplete="current-password" />
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
          <LoginBtn type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</LoginBtn>
        </LoginForm>
      </LoginCard>
    </LoginShell>
  );
};

export default FcafLogin;
