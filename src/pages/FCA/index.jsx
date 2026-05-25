import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FcaGlobal, AppBg, LoginWrap, LoginHero, LoginCard, LoginForm, LoginBtn,
  Field, Label, Input,
} from './theme';
import { fcaStorage, fcaFetch, getRedirectByRole } from './api';

const FcaLogin = () => {
  const [usuario, setUsuario]   = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

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
      toast.success(`Bem-vindo, ${data.name}!`);
      navigate(getRedirectByRole(data.role));
    } catch (err) {
      toast.error(err.message || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fca-root">
      <FcaGlobal />
      <AppBg>
        <LoginWrap>
          <LoginHero>
            <div className="hero-kicker">Gestão de Estrutura</div>
            <div className="hero-brand">GH · FCA</div>
            <div className="hero-title">Controle quem está abaixo de cada nível.</div>
            <div className="hero-desc">
              Gerencie a estrutura de equipes com janela mensal configurável,
              workflow de aprovação e hierarquia completa por perfil de acesso.
            </div>
            <div className="hero-chips">
              <span className="chip">Hierarquia</span>
              <span className="chip">Vínculos</span>
              <span className="chip">Janela Mensal</span>
              <span className="chip">Aprovações</span>
              <span className="chip">CSV Import</span>
            </div>
          </LoginHero>

          <LoginCard>
            <div className="card-brand">GH · FCA</div>
            <div className="card-kicker">Acesso corporativo seguro</div>

            <LoginForm onSubmit={handleSubmit} noValidate>
              <Field>
                <Label htmlFor="usuario">Usuário ou e-mail</Label>
                <Input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="seu.usuario"
                  disabled={loading}
                  autoComplete="username"
                />
              </Field>

              <Field>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                />
              </Field>

              <LoginBtn type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </LoginBtn>
            </LoginForm>
          </LoginCard>
        </LoginWrap>
      </AppBg>
    </div>
  );
};

export default FcaLogin;
