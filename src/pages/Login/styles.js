import styled, { css, keyframes } from 'styled-components';

const palette = {
  surface: 'rgba(255, 255, 255, 0.9)',
  surfaceStrong: 'rgba(255, 255, 255, 0.98)',
  ink: '#292522',
  inkMuted: '#35302d',
  border: 'rgba(83, 17, 16, 0.15)',
  brandDark: '#531110',
  brandRed: '#ae2e2a',
  brandGold: '#f4ba44',
  brandGoldAlt: '#dca83d',
  gradientA: '#a8372c',
  gradientB: '#f6c1b0',
  warning: '#f4ba44',
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 0 rgba(244, 186, 68, 0); }
  50% { box-shadow: 0 0 28px rgba(244, 186, 68, 0.18); }
`;

const sheen = keyframes`
  0% { transform: translateX(-120%); opacity: 0; }
  30% { opacity: 0.6; }
  100% { transform: translateX(120%); opacity: 0; }
`;

const floatSoft = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(10px); }
`;

export const LoginPage = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100svh;
  width: 100%;
  justify-content: center;
  background:
    radial-gradient(1200px 600px at -10% -10%, rgba(174, 46, 42, 0.16) 0%, transparent 60%),
    radial-gradient(900px 500px at 110% -20%, rgba(244, 186, 68, 0.22) 0%, transparent 55%),
    linear-gradient(120deg, #f7f2e8 0%, #f0e8d8 40%, #efe4d3 100%);
  color: ${palette.ink};
  font-family: 'Manrope', system-ui, sans-serif;
  overscroll-behavior: none;
  align-items: stretch;
  isolation: isolate;

  @media (min-width: 900px) {
    flex-direction: row;
  }

  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 999px;
    filter: blur(40px);
    opacity: 0.28;
    animation: ${floatSoft} 10s ease-in-out infinite;
    z-index: 0;
  }

  &::before {
    width: 280px;
    height: 280px;
    background: rgba(174, 46, 42, 0.22);
    top: -80px;
    left: -60px;
  }

  &::after {
    width: 320px;
    height: 320px;
    background: rgba(244, 186, 68, 0.28);
    bottom: -120px;
    right: -80px;
    animation-delay: 2s;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      animation: none;
    }
  }
`;

export const FormPanel = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: clamp(20px, 4vh, 48px) clamp(16px, 4vw, 28px);
  animation: ${fadeIn} 0.6s ease-out;
  min-height: 0;
  flex: 1;
  gap: 14px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(6px);

  @media (min-width: 900px) {
    padding: clamp(24px, 6vh, 72px) clamp(24px, 6vw, 64px);
  }

  @media (max-height: 720px) {
    padding: 18px 14px;
  }
`;

export const ImagePanel = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #2f2a27, #b58a2f);
  color: #fff;
  overflow: hidden;
  flex: 1;
  padding: clamp(24px, 6vh, 64px);

  @media (min-width: 900px) {
    display: flex;
  }

  .welcome-panel {
    max-width: 320px;
    text-align: center;
    display: grid;
    gap: 12px;
    z-index: 1;
  }

  .welcome-brand {
    font-weight: 800;
    letter-spacing: 0.2em;
    font-size: 1.1rem;
    opacity: 0.9;
  }

  h2 {
    margin: 0;
    font-size: clamp(1.6rem, 3.5vh, 2.2rem);
    font-weight: 800;
  }

  p {
    margin: 0;
    color: rgba(255,255,255,0.85);
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .welcome-ghost {
    margin-top: 8px;
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255,255,255,0.5);
    padding: 10px 18px;
    border-radius: 999px;
    font-weight: 700;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
  }

  .welcome-ghost:hover {
    transform: translateY(-1px);
    background: rgba(255,255,255,0.12);
  }

  &::before {
    content: '';
    position: absolute;
    inset: -30%;
    background:
      radial-gradient(500px 300px at 70% 20%, rgba(244,186,68,0.25), transparent 60%),
      radial-gradient(400px 260px at 20% 80%, rgba(255,255,255,0.12), transparent 60%);
    opacity: 0.7;
  }

  @media (prefers-reduced-motion: reduce) {
    .welcome-ghost { transition: none; }
  }

  .welcome-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0.6;
  }
`;

export const LoginForm = styled.form`
  display: grid;
  gap: clamp(8px, 2vh, 14px);
  width: 100%;
  max-width: 460px;
  background: ${palette.surfaceStrong};
  border: 1px solid rgba(83, 17, 16, 0.18);
  border-radius: 22px;
  padding: clamp(18px, 3.5vh, 28px);
  box-shadow: 0 28px 60px rgba(83, 17, 16, 0.22);
  backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
  animation: ${glow} 7s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(140deg, rgba(244,186,68,0.12), transparent 35%);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    &:hover {
      transform: none;
    }
  }

  @media (min-width: 900px) {
    padding: 36px;
  }

  @media (max-height: 720px) {
    padding: 16px;
    gap: 8px;
  }

  .login-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 0.04em;
  }

  .login-dot {
    width: 12px;
    height: 12px;
    border-radius: 999px;
    background: linear-gradient(120deg, ${palette.brandGold}, ${palette.brandRed});
    box-shadow: 0 6px 14px rgba(244, 186, 68, 0.45);
  }

  .login-subtitle {
    margin: 0;
    color: ${palette.inkMuted};
    font-size: clamp(0.78rem, 2.2vh, 0.95rem);
    line-height: 1.5;
  }

  @media (max-height: 680px) {
    .login-subtitle { font-size: 0.8rem; }
  }
`;

export const Title = styled.h1`
  font-size: clamp(1.6rem, 4.5vh, 2.1rem);
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
  color: ${palette.brandDark};

  @media (min-width: 900px) {
    font-size: 2.6rem;
  }

  @media (max-height: 720px) {
    font-size: 1.8rem;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 6px;
  position: relative;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 0.82rem;
  font-weight: 700;
  color: ${palette.inkMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const Input = styled.input`
  width: 100%;
  padding: clamp(10px, 2.4vh, 12px) 14px;
  background-color: #fff;
  border: 1px solid rgba(83, 17, 16, 0.18);
  border-radius: 12px;
  color: ${palette.ink};
  font-size: 1rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${palette.brandGold};
    box-shadow: 0 0 0 3px rgba(244, 186, 68, 0.22);
  }

  ${({ hasError }) =>
    hasError &&
    css`
      border-color: ${palette.warning};
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
    `}

  @media (max-height: 720px) {
    padding: 10px 12px;
  }
`;

export const StyledLink = styled.a`
  color: ${palette.inkMuted};
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: 6px;
  align-self: flex-start;

  &:first-of-type {
    align-self: flex-end;
    margin-top: -8px;
    margin-bottom: 10px;
  }

  &:hover {
    color: ${palette.brandRed};
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const ButtonSpinner = styled.div`
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const GradientButton = styled.button`
  width: 100%;
  padding: clamp(10px, 2.4vh, 12px) 16px;
  border: none;
  border-radius: 12px;
  background-image: linear-gradient(120deg, #2f2a27, #dca83d);
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  margin: 6px 0 8px;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 12px 26px rgba(83, 17, 16, 0.28);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.75;
  }

  @media (max-height: 720px) {
    font-size: 0.95rem;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -20% 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.5) 45%, transparent 70%);
    transform: translateX(-120%);
    animation: ${sheen} 3.6s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
`;

/* prefers-reduced-motion handled inside components */

export const Footer = styled.p`
  font-size: 0.8rem;
  color: ${palette.inkMuted};
  text-align: center;
  margin-top: clamp(8px, 2vh, 16px);
`;
