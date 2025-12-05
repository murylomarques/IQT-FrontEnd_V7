import styled, { css, keyframes } from 'styled-components'; // Adicionado keyframes
import backgroundImage from '../../assets/night-sky.jpg';

// Paleta de cores... (sem alteração)
const desktopColors = {
  dark_maroon: '#531110', dark_red: '#ae2e2a', gold: '#f4ba44',
  white: '#ffffff', black: '#000000', light_beige: '#e5e1cf',
  dark_gray: '#292522', terracotta: '#a8372c', bordeaux: '#6c1b0b',
};

// ... LoginPage, FormPanel, ImagePanel, etc. (sem alteração)
export const LoginPage = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${desktopColors.dark_gray};
  color: ${desktopColors.light_beige};
  font-family: 'Poppins', sans-serif;
`;

export const FormPanel = styled.div`
  flex: 1;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 60px 80px;
  background-color: ${desktopColors.dark_gray};
  z-index: 2;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 40px;
  }
`;

export const ImagePanel = styled.div`
  flex: 1;
  background-image: linear-gradient(to right, rgba(41, 37, 34, 0.9) 0%, transparent 50%), url(${backgroundImage});
  background-size: cover;
  background-position: left;
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto 0;
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 40px;
  color: ${desktopColors.white};

  span {
    color: ${desktopColors.gold};
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 24px;
  position: relative;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: ${desktopColors.light_beige};
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px;
  background-color: #35302d;
  border: 1px solid #555;
  border-radius: 12px;
  color: ${desktopColors.white};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px ${desktopColors.gold};
    background-image: 
      linear-gradient(to right, #35302d, #35302d), 
      linear-gradient(to right, ${desktopColors.gold}, ${desktopColors.dark_red});
    background-origin: border-box;
    background-clip: padding-box, border-box;
  }

  ${({ hasError }) =>
    hasError &&
    css`
      border-color: transparent !important;
      box-shadow: 0 0 0 2px ${desktopColors.dark_red};
    `}
`;

export const StyledLink = styled.a`
  color: #aaa;
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: 8px;
  align-self: flex-start;
  transition: color 0.3s ease;

  &:first-of-type {
    align-self: flex-end;
    margin-top: -12px;
    margin-bottom: 24px;
  }

  &:hover {
    color: ${desktopColors.gold};
    text-decoration: underline;
  }
`;

// ==========================================================
// ==================== INÍCIO DA CORREÇÃO ==================
// ==========================================================

// 1. ANIMAÇÃO PARA O SPINNER DO BOTÃO
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// 2. SPINNER PEQUENO PARA SER USADO DENTRO DO BOTÃO
export const ButtonSpinner = styled.div`
  width: 24px; /* Tamanho menor */
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: ${desktopColors.white};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

// 3. AJUSTE NO BOTÃO
export const GradientButton = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background-image: linear-gradient(90deg, ${desktopColors.terracotta}, ${desktopColors.bordeaux});
  background-size: 200% auto;
  color: ${desktopColors.white};
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin: 16px 0;
  transition: all 0.4s ease;
  
  /* Adicionado para centralizar o spinner */
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover:not(:disabled) { /* O efeito de hover não se aplica quando desabilitado */
    background-position: right center;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(168, 55, 44, 0.5);
  }

  &:disabled {
    cursor: wait; /* Muda o cursor para indicar espera */
    opacity: 0.8;
  }
`;

// ==========================================================
// ===================== FIM DA CORREÇÃO ====================
// ==========================================================

export const Footer = styled.p`
  font-size: 0.8rem;
  color: #666;
  text-align: center;
`;