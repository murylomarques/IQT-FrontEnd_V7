import styled, { createGlobalStyle } from 'styled-components';

// ==========================================================
// GLOBAL THEME + BASE RESET
// ==========================================================
export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

  :root {
    /* ── Backgrounds ─────────────────────────────── */
    --bg-0: #f0f2f5;
    --bg-1: #ffffff;
    --bg-2: #f8fafc;

    /* ── Text ────────────────────────────────────── */
    --ink-0: #0f172a;
    --ink-1: #334155;
    --ink-2: #64748b;
    --ink-3: #94a3b8;

    /* ── Marca (brand) ───────────────────────────── */
    --brand:       #a8372c;
    --brand-dark:  #7b1f1a;
    --brand-light: #c0564b;

    /* ── Acentos (info / dados) ──────────────────── */
    --accent-0: #1d4ed8;
    --accent-1: #0ea5e9;
    --accent-2: #f97316;

    /* ── Semântica ───────────────────────────────── */
    --success:    #16a34a;
    --success-bg: #dcfce7;
    --warning:    #f59e0b;
    --warning-bg: #fef3c7;
    --danger:     #dc2626;
    --danger-bg:  #fee2e2;

    /* ── Estrutura ───────────────────────────────── */
    --border-0: #e2e8f0;
    --border-1: #f1f5f9;
    --shadow-1: 0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04);
    --shadow-2: 0 4px 24px rgba(0,0,0,0.08);
    --radius-1: 10px;
    --radius-2: 16px;
    --radius-3: 20px;
  }

  * {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }


  body {
    margin: 0;
    font-family: 'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif;
    color: var(--ink-0);
    background: var(--bg-0);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: var(--accent-0);
    text-decoration: none;
  }

  button {
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
  }
`;

// ==========================================================
// SHARED LAYOUT COMPONENTS
// ==========================================================
export const VistoriaContainer = styled.div`
  padding: 16px;
  max-width: 1050px;
  margin: 0 auto;
  background-color: var(--bg-0);
  min-height: 100vh;

  @media (min-width: 768px) {
    padding: 2rem;
    margin: 1.5rem auto;
    background-color: var(--bg-1);
    border-radius: var(--radius-2);
    box-shadow: var(--shadow-1);
    min-height: unset;
  }
`;

export const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--ink-0);
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const SectionCard = styled.div`
  background-color: #ffffff;
  border: 1px solid var(--border-0);
  border-radius: var(--radius-2);
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--brand-dark);
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid var(--border-0);
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.75rem 1rem;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--ink-2);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`;

export const InfoValue = styled.span`
  font-size: 0.98rem;
  color: var(--ink-1);
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--accent-0), var(--accent-1));
  color: #fff;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  box-shadow: 0 6px 16px rgba(29, 78, 216, 0.25);

  &:hover {
    transform: translateY(-1px);
    opacity: 0.95;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  & > input,
  & > select,
  & > textarea {
    width: 100%;
    padding: 0.75rem 0.85rem;
    border: 1px solid var(--border-0);
    border-radius: 10px;
    box-sizing: border-box;
    font-size: 0.95rem;
    background-color: #fff;
    color: var(--ink-1);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  & > input:focus,
  & > select:focus,
  & > textarea:focus {
    outline: none;
    border-color: var(--accent-1);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }

  .full-width {
    grid-column: 1 / -1;
  }
`;
