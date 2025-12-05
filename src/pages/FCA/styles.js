import styled, { css, keyframes } from 'styled-components';
import backgroundImage from '../../assets/night-sky.jpg';

// Paleta de Cores (sem alteração)
const desktopColors = {
  dark_maroon: '#531110', dark_red: '#ae2e2a', gold: '#f4ba44',
  white: '#ffffff', black: '#000000', light_beige: '#e5e1cf',
  dark_gray: '#292522', terracotta: '#a8372c', bordeaux: '#6c1b0b',
  gray_text: '#8f8f8f',
};

// --- ESTRUTURA PRINCIPAL ---
export const LoginPage = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${desktopColors.dark_gray};
  color: ${desktopColors.light_beige};
  font-family: 'Poppins', sans-serif;
  overflow: hidden; // Previne barras de rolagem durante animações
`;

export const FormPanel = styled.div`
  flex: 1;
  max-width: 550px; // Um pouco mais de espaço
  display: flex;
  flex-direction: column;
  justify-content: center; // Centraliza o formulário verticalmente
  padding: 0 90px;
  background-color: ${desktopColors.dark_gray};
  z-index: 2;

  @media (max-width: 900px) {
    max-width: 100%;
    padding: 0 40px;
  }
`;

export const ImagePanel = styled.div`
  flex: 1.2; // Dá um pouco mais de destaque para a imagem
  background-image: linear-gradient(to right, rgba(41, 37, 34, 1) 0%, transparent 40%), url(${backgroundImage});
  background-size: cover;
  background-position: center; // Centraliza melhor a imagem
  z-index: 1;

  @media (max-width: 900px) {
    display: none;
  }
`;

// --- ELEMENTOS DO FORMULÁRIO ---
export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: -1px; // Um toque de design
  margin-bottom: 8px; // Reduzido para aproximar do subtítulo
  color: ${desktopColors.white};
  span {
    color: ${desktopColors.gold};
  }
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${desktopColors.gray_text};
  margin-bottom: 48px; // Aumenta o espaço para os inputs
`;

export const InputGroup = styled.div`
  position: relative;
  margin-bottom: 28px;
`;

export const Label = styled.label`
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 1rem;
  color: ${desktopColors.gray_text};
  pointer-events: none;
  transition: all 0.2s ease-out;
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px 14px 10px; // Ajuste para o label flutuante
  background-color: #35302d;
  border: 1px solid #555;
  border-radius: 12px;
  color: ${desktopColors.white};
  font-size: 1rem;
  transition: border-color 0.3s ease;

  // Animação do Label Flutuante
  &:focus + ${Label},
  &:valid + ${Label} {
    top: 5px;
    font-size: 0.75rem;
    color: ${desktopColors.gold};
  }

  &:focus {
    outline: none;
    border-color: ${desktopColors.gold};
  }

  ${({ hasError }) => hasError && css`
    border-color: ${desktopColors.dark_red} !important;
    & + ${Label} {
      color: ${desktopColors.dark_red};
    }
  `}
`;

export const FormActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px; // Espaço entre o botão e o link
  margin-top: 20px;
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
  transition: all 0.4s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 58px;

  &:hover:not(:disabled) {
    background-position: right center;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(168, 55, 44, 0.4);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.7;
    background-image: linear-gradient(90deg, #555, #444); // Cor diferente para desabilitado
  }
`;

const spin = keyframes`to { transform: rotate(360deg); }`;
export const ButtonSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: ${desktopColors.white};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const AuthLink = styled.a`
  color: ${desktopColors.gray_text};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${desktopColors.gold};
    text-decoration: underline;
  }
`;

export const AltActions = styled.div`
  text-align: center;
  margin-top: 32px;
  font-size: 0.9rem;
  color: ${desktopColors.gray_text};
`;


// --- FOOTER ---
export const Footer = styled.p`
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  max-width: 550px; // Alinhado com a largura do FormPanel
  
  @media (max-width: 900px) {
    max-width: 100%;
  }
`;