import styled, { createGlobalStyle } from 'styled-components';

// ==========================================================
// GLOBAL THEME + BASE RESET
// ==========================================================
export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

  :root {
    --bg-0: #f5f7fb;
    --bg-1: #ffffff;
    --ink-0: #0f172a;
    --ink-1: #334155;
    --ink-2: #64748b;
    --accent-0: #1d4ed8;
    --accent-1: #0ea5e9;
    --accent-2: #f97316;
    --success: #16a34a;
    --warning: #f59e0b;
    --danger: #dc2626;
    --border-0: #e2e8f0;
    --shadow-1: 0 10px 30px rgba(15, 23, 42, 0.08);
    --radius-1: 12px;
    --radius-2: 16px;
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
    background: radial-gradient(1200px 600px at -10% -10%, #eef2ff 0%, transparent 60%),
                radial-gradient(900px 500px at 110% -20%, #e0f2fe 0%, transparent 55%),
                var(--bg-0);
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
  padding: 1.5rem;
  max-width: 1050px;
  margin: 2rem auto;
  background-color: var(--bg-1);
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
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
  font-size: 1.35rem;
  color: var(--accent-0);
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
