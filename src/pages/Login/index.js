import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { gsap } from 'gsap';
import { useAuth } from '../../contexts/AuthContext';

import {
  LoginPage,
  FormPanel,
  ImagePanel,
  LoginForm,
  Title,
  InputGroup,
  Label,
  Input,
  StyledLink,
  GradientButton,
  Footer,
  ButtonSpinner,
} from './styles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isRequestOptionsLoading, setIsRequestOptionsLoading] = useState(false);
  const [requestOptions, setRequestOptions] = useState({
    empresas: [],
    cargos: [],
    regionais: [],
  });
  const [requestData, setRequestData] = useState({
    nome: '',
    email: '',
    password: '',
    empresa_id: '',
    cargo_id: '',
    regional_id: '',
    observacao: '',
  });

  const { login } = useAuth();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const canvasRef = useRef();
  const panelRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const panel = panelRef.current;
    if (!canvas || !panel) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let width = 0;
    let height = 0;
    let mouse = { x: -9999, y: -9999 };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = panel.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedPoints();
    };

    let points = [];
    const seedPoints = () => {
      if (width <= 2 || height <= 2) return;
      points = Array.from({ length: 20 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 2 + Math.random() * 2.5,
      }));
    };

    const update = () => {
      if (width <= 2 || height <= 2) {
        animationId = requestAnimationFrame(update);
        return;
      }
      ctx.clearRect(0, 0, width, height);

      for (const p of points) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 90) {
          const force = (90 - dist) / 90;
          p.vx += (dx / (dist || 1)) * force * 0.6;
          p.vy += (dy / (dist || 1)) * force * 0.6;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
        p.vx *= 0.995;
        p.vy *= 0.995;
      }

      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const a = points[i];
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const alpha = 1 - dist / 110;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      const triDist = 130;
      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const a = points[i];
          const b = points[j];
          const ab = Math.hypot(a.x - b.x, a.y - b.y);
          if (ab > triDist) continue;
          for (let k = j + 1; k < points.length; k += 1) {
            const c = points[k];
            const ac = Math.hypot(a.x - c.x, a.y - c.y);
            const bc = Math.hypot(b.x - c.x, b.y - c.y);
            if (ac < triDist && bc < triDist) {
              const alpha = (1 - Math.max(ab, ac, bc) / triDist) * 0.18;
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.lineTo(c.x, c.y);
              ctx.closePath();
              ctx.fill();
            }
          }
        }
      }

      for (const p of points) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(update);
    };

    const onMouseMove = (e) => {
      const rect = panel.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouse = { x: -9999, y: -9999 };
    };

    resize();
    update();
    window.addEventListener('resize', resize);
    panel.addEventListener('mousemove', onMouseMove);
    panel.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      panel.removeEventListener('mousemove', onMouseMove);
      panel.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    if (!showRequestForm) return;
    if (
      requestOptions.empresas.length > 0 ||
      requestOptions.cargos.length > 0 ||
      requestOptions.regionais.length > 0
    ) {
      return;
    }

    let isMounted = true;
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';

    const loadRequestOptions = async () => {
      setIsRequestOptionsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/access-requests/options`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload?.message || 'Não foi possível carregar opções de cadastro.');
        }
        if (!isMounted) return;
        setRequestOptions({
          empresas: Array.isArray(payload?.empresas) ? payload.empresas : [],
          cargos: Array.isArray(payload?.cargos) ? payload.cargos : [],
          regionais: Array.isArray(payload?.regionais) ? payload.regionais : [],
        });
      } catch (error) {
        if (isMounted) {
          toast.error(error?.message || 'Erro ao carregar empresa, cargo e regional.');
        }
      } finally {
        if (isMounted) {
          setIsRequestOptionsLoading(false);
        }
      }
    };

    loadRequestOptions();
    return () => {
      isMounted = false;
    };
  }, [showRequestForm, requestOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) newErrors.email = true;
    if (!password.trim()) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Por favor, preencha todos os campos.');

      if (newErrors.email) {
        gsap.fromTo(emailInputRef.current, { x: 0 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power2.inOut' });
      }
      if (newErrors.password) {
        gsap.fromTo(passwordInputRef.current, { x: 0 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power2.inOut' });
      }
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      // handled in auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestInputChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccessRequestSubmit = async (e) => {
    e.preventDefault();

    if (
      !requestData.nome.trim() ||
      !requestData.email.trim() ||
      !requestData.password.trim() ||
      !requestData.empresa_id ||
      !requestData.cargo_id ||
      !requestData.regional_id
    ) {
      toast.error('Preencha nome, email, senha, empresa, cargo e regional.');
      return;
    }

    setIsRequestLoading(true);

    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';
      const response = await fetch(`${API_BASE_URL}/api/access-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const fieldLabels = {
          nome: 'Nome',
          email: 'E-mail',
          password: 'Senha',
          numero: 'Número',
          cpf: 'CPF',
          empresa_id: 'Empresa',
          cargo_id: 'Cargo',
          regional_id: 'Regional',
          observacao: 'Observação',
        };

        if (payload?.errors && typeof payload.errors === 'object') {
          const details = Object.entries(payload.errors)
            .flatMap(([field, messages]) => {
              const label = fieldLabels[field] || field;
              const list = Array.isArray(messages) ? messages : [String(messages)];
              return list.map((msg) => `${label}: ${msg}`);
            })
            .join(' | ');

          throw new Error(details || payload?.message || 'Dados inválidos na solicitação.');
        }

        throw new Error(payload?.message || 'Erro ao enviar solicitação.');
      }

      toast.success(payload?.message || 'Solicitação enviada com sucesso.');
      setShowRequestForm(false);
      setRequestData({
        nome: '',
        email: '',
        password: '',
        empresa_id: '',
        cargo_id: '',
        regional_id: '',
        observacao: '',
      });
    } catch (error) {
      toast.error(error?.message || 'Erro ao enviar solicitação.');
    } finally {
      setIsRequestLoading(false);
    }
  };

  return (
    <LoginPage>
      <ImagePanel ref={panelRef}>
        <canvas ref={canvasRef} className="welcome-canvas" aria-hidden="true" />
        <div className="welcome-panel">
          <div className="welcome-brand">IQT - Desktop</div>
          <h2>Bem-vindo de volta!</h2>
          <p>Para continuar conectado, faça login com suas credenciais.</p>
          <button type="button" className="welcome-ghost">SAIBA MAIS</button>
        </div>
      </ImagePanel>

      <FormPanel>
        <LoginForm onSubmit={handleSubmit} noValidate>
          <div className="login-brand">
            <Title>IQT - Desktop</Title>
            <span className="login-dot" />
          </div>
          <p className="login-subtitle">Acesso corporativo seguro</p>

          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              ref={emailInputRef} id="email" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              hasError={errors.email} disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Senha</Label>
            <Input
              ref={passwordInputRef} id="password" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              hasError={errors.password} disabled={isLoading}
            />
          </InputGroup>

          <StyledLink href="#">Esqueci minha senha</StyledLink>

          <GradientButton type="submit" disabled={isLoading}>
            {isLoading ? <ButtonSpinner /> : 'Entrar'}
          </GradientButton>

          <StyledLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowRequestForm(true);
            }}
          >
            Ainda nao tenho uma conta
          </StyledLink>
        </LoginForm>
        <Footer>2024 | IQT Solucoes</Footer>
      </FormPanel>

      {showRequestForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: 16,
          }}
        >
          <form
            onSubmit={handleAccessRequestSubmit}
            style={{
              width: '100%',
              maxWidth: 520,
              background: '#fff',
              borderRadius: 16,
              padding: 20,
              display: 'grid',
              gap: 12,
            }}
          >
            <h3 style={{ margin: 0, color: '#531110' }}>Solicitar acesso</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
              Seu cadastro sera analisado pelo administrador antes da liberacao do login.
            </p>
            <input
              name="nome"
              placeholder="Nome completo"
              value={requestData.nome}
              onChange={handleRequestInputChange}
              required
              style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd' }}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={requestData.email}
              onChange={handleRequestInputChange}
              required
              style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd' }}
            />
            <input
              name="password"
              type="password"
              placeholder="Senha desejada"
              value={requestData.password}
              onChange={handleRequestInputChange}
              required
              style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd' }}
            />
            <select
              name="empresa_id"
              value={requestData.empresa_id}
              onChange={handleRequestInputChange}
              required
              disabled={isRequestOptionsLoading}
              style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}
            >
              <option value="">{isRequestOptionsLoading ? 'Carregando empresas...' : 'Selecione a empresa'}</option>
              {requestOptions.empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nome}
                </option>
              ))}
            </select>
            <select
              name="cargo_id"
              value={requestData.cargo_id}
              onChange={handleRequestInputChange}
              required
              disabled={isRequestOptionsLoading}
              style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}
            >
              <option value="">{isRequestOptionsLoading ? 'Carregando cargos...' : 'Selecione o cargo'}</option>
              {requestOptions.cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.nome}
                </option>
              ))}
            </select>
            <select
              name="regional_id"
              value={requestData.regional_id}
              onChange={handleRequestInputChange}
              required
              disabled={isRequestOptionsLoading}
              style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}
            >
              <option value="">{isRequestOptionsLoading ? 'Carregando regionais...' : 'Selecione a regional'}</option>
              {requestOptions.regionais.map((regional) => (
                <option key={regional.id} value={regional.id}>
                  {regional.nome}
                </option>
              ))}
            </select>
            <textarea
              name="observacao"
              placeholder="Observacao (opcional)"
              value={requestData.observacao}
              onChange={handleRequestInputChange}
              style={{ padding: 12, borderRadius: 8, border: '1px solid #ddd', minHeight: 90 }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowRequestForm(false)}
                disabled={isRequestLoading}
                style={{
                  border: '1px solid #ddd',
                  background: '#fff',
                  borderRadius: 8,
                  padding: '10px 14px',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isRequestLoading}
                style={{
                  border: 'none',
                  background: '#a8372c',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {isRequestLoading ? 'Enviando...' : 'Enviar solicitação'}
              </button>
            </div>
          </form>
        </div>
      )}
    </LoginPage>
  );
};

export default Login;
