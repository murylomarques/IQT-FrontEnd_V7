import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../../contexts/AuthContext';

import {
  LoginPage, FormPanel, ImagePanel, LoginForm, Title,
  InputGroup, Label, Input, StyledLink, GradientButton, Footer,
  ButtonSpinner // 1. IMPORTE O NOVO SPINNER
} from './styles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const formPanelRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  useGSAP(() => {
    gsap.from(formPanelRef.current, { x: -200, opacity: 0, duration: 1.2, ease: 'power3.out' });
  }, { scope: formPanelRef });

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
      // Se o login for válido, o AuthContext fará o redirecionamento.
      // A tela permanece a mesma até a navegação acontecer.
    } catch (error) {
      // O erro já é tratado no context.
    } finally {
      // Se a chamada falhar, o setIsLoading(false) vai remover o spinner.
      setIsLoading(false);
    }
  };

  return (
    <LoginPage>
      <FormPanel ref={formPanelRef}>
        <LoginForm onSubmit={handleSubmit} noValidate>
          <Title>IQT<span>.</span></Title>

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

          {/* 2. ALTERE O CONTEÚDO DO BOTÃO */}
          <GradientButton type="submit" disabled={isLoading}>
            {isLoading ? <ButtonSpinner /> : 'Entrar'}
          </GradientButton>

          <StyledLink href="#">Ainda não tenho uma conta</StyledLink>
        </LoginForm>
        <Footer>2024 | Desenvolvido para DESKTOP</Footer>
      </FormPanel>
      <ImagePanel />
    </LoginPage>
  );
};

export default Login;