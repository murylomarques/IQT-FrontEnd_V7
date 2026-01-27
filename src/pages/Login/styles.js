import styled, { css, keyframes } from 'styled-components';
import backgroundImage from '../../assets/night-sky.jpg';

// Paleta de cores (sem alteração)
const desktopColors = {
  dark_maroon: '#531110', dark_red: '#ae2e2a', gold: '#f4ba44',
  white: '#ffffff', black: '#000000', light_beige: '#e5e1cf',
  dark_gray: '#292522', terracotta: '#a8372c', bordeaux: '#6c1b0b',
};

// ==========================================================
// ==================== CÓDIGO CORRIGIDO ====================
// ==========================================================

export const LoginPage = styled.div`
  display: flex;
  min-height: 100vh; /* [CORRIGIDO] Garante que a página ocupe a altura toda da tela, mesmo em mobile */
  background-color: ${desktopColors.dark_gray};
  color: ${desktopColors.light_beige};
  font-family: 'Poppins', sans-serif;
  overflow-x: hidden; /* [CORRIGIDO] Impede a criação da barra de rolagem horizontal */
`;

export const FormPanel = styled.div`
  width: 100%; /* [CORRIGIDO] Por padrão (mobile), o formulário ocupa toda a largura */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 24px; /* [CORRIGIDO] Padding menor para dispositivos móveis */
  background-color: ${desktopColors.dark_gray};
  z-index: 2;

  /* Estilos aplicados apenas em telas com 768px ou mais (tablets e desktops) */
  @media (min-width: 768px) {
    width: 50%; /* Em telas maiores, ocupa metade do espaço */
    max-width: 500px; /* Limita a largura máxima em monitores grandes */
    padding: 60px 80px; /* Restaura o padding original para telas maiores */
  }
`;

export const ImagePanel = styled.div`
  display: none; /* [CORRIGIDO] A imagem fica escondida por padrão (mobile) */
  background-image: linear-gradient(to right, rgba(41, 37, 34, 0.9) 0%, transparent 50%), url(${backgroundImage});
  background-size: cover;
  background-position: left;
  z-index: 1;
  
  /* A imagem só aparece em telas com 768px ou mais */
  @media (min-width: 768px) {
    display: block; /* Mostra a imagem */
    width: 100%; /* Faz a imagem ocupar a outra metade da tela */
  }
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto 0;
`;

export const Title = styled.h1`
  font-size: 2.5rem; /* [AJUSTADO] Fonte um pouco menor para celulares */
  font-weight: 600;
  margin-bottom: 30px;
  color: ${desktopColors.white};

  span {
    color: ${desktopColors.gold};
  }

  /* Retorna ao tamanho original em telas maiores */
  @media (min-width: 768px) {
    font-size: 3rem;
    margin-bottom: 40px;
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

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const ButtonSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: ${desktopColors.white};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

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
  
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover:not(:disabled) {
    background-position: right center;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(168, 55, 44, 0.5);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.8;
  }
`;

export const Footer = styled.p`
  font-size: 0.8rem;
  color: #666;
  text-align: center;
`;