import styled, { css, keyframes } from 'styled-components';
import backgroundImage from '../../assets/night-sky.jpg';

const palette = {
  surface: 'rgba(255, 255, 255, 0.75)',
  surfaceStrong: 'rgba(255, 255, 255, 0.92)',
  ink: 'var(--ink-0)',
  inkMuted: 'var(--ink-2)',
  border: 'var(--border-0)',
  accent: 'var(--accent-2)',
  accent2: 'var(--accent-1)',
  danger: 'var(--danger)',
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- ESTRUTURA PRINCIPAL ---
export const LoginPage = styled.div`
  position: relative;
  overflow: hidden;
  display: grid;
  min-height: 100vh;
  grid-template-columns: 1fr;
  background:
    radial-gradient(1000px 520px at -10% -10%, rgba(249, 115, 22, 0.18) 0%, transparent 60%),
    radial-gradient(900px 500px at 110% -20%, rgba(14, 165, 233, 0.18) 0%, transparent 55%),
    var(--bg-0);
  color: ${palette.ink};
  font-family: 'Manrope', system-ui, sans-serif;

  @media (min-width: 900px) {
    grid-template-columns: 1.05fr 0.95fr;
  }

  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 999px;
    filter: blur(40px);
    opacity: 0.35;
    animation: float 12s ease-in-out infinite;
    z-index: 0;
  }

  &::before {
    width: 280px;
    height: 280px;
    background: rgba(29, 78, 216, 0.35);
    top: -80px;
    left: -60px;
  }

  &::after {
    width: 320px;
    height: 320px;
    background: rgba(14, 165, 233, 0.35);
    bottom: -120px;
    right: -80px;
    animation-delay: 2s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(18px); }
  }
`;

export const FormPanel = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 56px 28px;
  animation: ${fadeIn} 0.6s ease-out;

  @media (min-width: 900px) {
    padding: 72px 64px;
  }
`;

export const ImagePanel = styled.div`
  position: relative;
  z-index: 1;
  display: none;
  background-image:
    linear-gradient(120deg, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.2)),
    url(${backgroundImage});
  background-size: cover;
  background-position: center;

  @media (min-width: 900px) {
    display: block;
  }
`;

// --- ELEMENTOS DO FORMULARIO ---
export const LoginForm = styled.form`
  display: grid;
  gap: 18px;
  background: ${palette.surface};
  border: 1px solid ${palette.border};
  border-radius: 18px;
  padding: 28px;
  box-shadow: var(--shadow-1);
  backdrop-filter: blur(8px);

  @media (min-width: 900px) {
    padding: 36px;
  }
`;

export const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
  color: ${palette.ink};
  span { color: ${palette.accent}; }
`;

export const Subtitle = styled.p`
  font-size: 0.95rem;
  color: ${palette.inkMuted};
  margin-bottom: 6px;
`;

export const InputGroup = styled.div`
  position: relative;
  margin-bottom: 4px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${palette.inkMuted};
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  background-color: #fff;
  border: 1px solid ${palette.border};
  border-radius: 12px;
  color: ${palette.ink};
  font-size: 1rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.18);
  }

  ${({ hasError }) =>
    hasError &&
    css`
      border-color: ${palette.danger};
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.18);
    `}
`;

export const FormActions = styled.div`
  display: grid;
  gap: 10px;
  align-items: center;
  margin-top: 6px;
`;

export const GradientButton = styled.button`
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: 12px;
  background-image: linear-gradient(120deg, ${palette.accent}, ${palette.accent2});
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(249, 115, 22, 0.25);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.75;
  }
`;

const spin = keyframes`to { transform: rotate(360deg); }`;
export const ButtonSpinner = styled.div`
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const AuthLink = styled.a`
  color: ${palette.inkMuted};
  text-decoration: none;
  font-size: 0.9rem;

  &:hover { color: ${palette.accent}; }
`;

export const AltActions = styled.div`
  text-align: center;
  margin-top: 6px;
  font-size: 0.9rem;
  color: ${palette.inkMuted};
`;

export const Footer = styled.p`
  font-size: 0.8rem;
  color: ${palette.inkMuted};
  text-align: center;
`;
