import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

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
} from '../Login/styles';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';

const getRedirectPath = (cargo = '') => {
  const cargoLower = cargo.toLowerCase();
  if (cargoLower.includes('adm') || cargoLower.includes('administrador')) {
    return '/dashboard/adm';
  }
  if (cargoLower.includes('supervisor')) {
    return '/dashboard/supervisor';
  }
  if (cargoLower.includes('coordenador')) {
    return '/dashboard/coordenador';
  }
  return '/dashboard';
};

const FcaLogin = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const usuarioInputRef = useRef();
  const passwordInputRef = useRef();
  const canvasRef = useRef();
  const panelRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const panel = panelRef.current;
    if (!canvas || !panel) return undefined;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!usuario.trim()) newErrors.usuario = true;
    if (!password.trim()) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Por favor, preencha todos os campos.');

      if (newErrors.usuario && usuarioInputRef.current) {
        gsap.fromTo(usuarioInputRef.current, { x: 0 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power2.inOut' });
      }
      if (newErrors.password && passwordInputRef.current) {
        gsap.fromTo(passwordInputRef.current, { x: 0 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power2.inOut' });
      }
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/loginfca`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Usuário ou senha inválidos.');
      }

      const prefix = 'FCA';
      localStorage.setItem(`${prefix}-token`, data.token);
      localStorage.setItem(`${prefix}-nome`, data.nome);
      localStorage.setItem(`${prefix}-cargo`, data.cargo);
      localStorage.setItem(`${prefix}-usuario`, usuario);

      toast.success(`Bem-vindo, ${data.nome}!`);
      navigate(getRedirectPath(data.cargo));
    } catch (error) {
      toast.error(error.message || 'Erro ao realizar login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginPage>
      <ImagePanel ref={panelRef}>
        <canvas ref={canvasRef} className="welcome-canvas" aria-hidden="true" />
        <div className="welcome-panel">
          <div className="welcome-brand">FCA - Desktop</div>
          <h2>Bem-vindo ao FCA!</h2>
          <p>Para continuar conectado, faça login com suas credenciais FCA.</p>
          <button type="button" className="welcome-ghost">SAIBA MAIS</button>
        </div>
      </ImagePanel>

      <FormPanel>
        <LoginForm onSubmit={handleSubmit} noValidate>
          <div className="login-brand">
            <Title>FCA - Desktop</Title>
            <span className="login-dot" />
          </div>
          <p className="login-subtitle">Acesso FCA corporativo seguro</p>

          <InputGroup>
            <Label htmlFor="usuario">Usuário</Label>
            <Input
              ref={usuarioInputRef}
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              hasError={errors.usuario}
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Senha</Label>
            <Input
              ref={passwordInputRef}
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hasError={errors.password}
              disabled={isLoading}
            />
          </InputGroup>

          <StyledLink href="#">Esqueci minha senha</StyledLink>

          <GradientButton type="submit" disabled={isLoading}>
            {isLoading ? <ButtonSpinner /> : 'Entrar'}
          </GradientButton>

          <StyledLink href="#">Ainda não tenho uma conta</StyledLink>
        </LoginForm>
        <Footer>2024 | FCA Solu??es</Footer>
      </FormPanel>
    </LoginPage>
  );
};

export default FcaLogin;
