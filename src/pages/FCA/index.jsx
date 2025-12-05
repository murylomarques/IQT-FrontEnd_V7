import { useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';

import {
  LoginPage, FormPanel, ImagePanel, LoginForm, Title, Subtitle,
  InputGroup, Label, Input, FormActions, AuthLink,
  GradientButton, Footer, ButtonSpinner, AltActions
} from './styles';

// Função auxiliar para redirecionamento
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

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formPanelRef = useRef(null);
  const formRef = useRef(null);

  // Animação de entrada do painel
  useGSAP(() => {
    gsap.from(formPanelRef.current, {
      x: -200, opacity: 0, duration: 1.2, ease: 'power3.out'
    });
    gsap.from(formRef.current.children, {
      opacity: 0, y: 20, stagger: 0.1, duration: 0.5, delay: 0.5
    });
  }, { scope: formPanelRef });

  // Função para animação de erro
  const triggerErrorAnimation = useCallback((ref) => {
    gsap.fromTo(ref.current,
      { x: 0 },
      { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power2.inOut' }
    );
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!usuario.trim()) newErrors.usuario = true;
    if (!password.trim()) newErrors.password = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Por favor, preencha todos os campos.');
      // A animação agora será acionada pelo useEffect abaixo
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://iqt.desktop.com.br/api/api/loginfca`, {
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
      triggerErrorAnimation(formRef); // Animação de tremor no formulário inteiro
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginPage>
      <FormPanel ref={formPanelRef}>
        <LoginForm ref={formRef} onSubmit={handleSubmit} noValidate>
          <header>
            <Title>FCA<span>.</span></Title>
            <Subtitle>Bem-vindo de volta! Faça login para continuar.</Subtitle>
          </header>

          <InputGroup>
            <Input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              hasError={errors.usuario}
              disabled={isLoading}
              required
            />
            <Label htmlFor="usuario">Usuário</Label>
          </InputGroup>

          <InputGroup>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hasError={errors.password}
              disabled={isLoading}
              required
            />
            <Label htmlFor="password">Senha</Label>
          </InputGroup>

          <FormActions>
            <AuthLink href="#">Esqueci minha senha</AuthLink>
            <GradientButton type="submit" disabled={isLoading}>
              {isLoading ? <ButtonSpinner /> : 'Entrar'}
            </GradientButton>
          </FormActions>
          
          <AltActions>
            Não tem uma conta? <AuthLink href="#">Crie agora</AuthLink>
          </AltActions>

        </LoginForm>
        <Footer>2025 | Desenvolvido para DESKTOP</Footer>
      </FormPanel>
      <ImagePanel />
    </LoginPage>
  );
};

export default Login;