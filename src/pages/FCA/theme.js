import styled, { createGlobalStyle, css, keyframes } from 'styled-components';

// ─── Animations ──────────────────────────────────────────────────────────────

const lift = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const reveal = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.85); }
`;

// ─── Global ───────────────────────────────────────────────────────────────────

export const FcaGlobal = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sora:wght@300;400;500;600;700;800&display=swap');

  .fca-root {
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    font-family: 'Sora', 'Segoe UI', sans-serif;
    min-height: 100vh;
    color: var(--text-dark);
    overflow-x: hidden;

    /* ── Design tokens ── */
    --p900: #531110;
    --p700: #ae2e2a;
    --p500: #f4ba44;
    --p400: #dca83d;
    --s900: #35302d;
    --s800: #292522;
    --s400: #cfcbbb;
    --s300: #e5e1cf;
    --s200: #ece8d8;
    --a700: #d47120;
    --a600: #a8372c;
    --success: #2f7a3f;
    --danger: #9d2926;
    --warn: #b86c10;
    --text-dark: #35302d;
    --text-muted: #6b6560;
    --text-light: #9a948f;
    --white-glass: rgba(255, 255, 255, 0.72);
    --white-glass-strong: rgba(255, 255, 255, 0.92);
    --border-light: rgba(53, 48, 45, 0.12);
    --border-mid: rgba(53, 48, 45, 0.2);
    --shadow-sm: 0 6px 14px rgba(41, 37, 34, 0.10);
    --shadow-md: 0 14px 28px rgba(41, 37, 34, 0.14);
    --shadow-lg: 0 24px 48px rgba(41, 37, 34, 0.18);
    --radius-xl: 20px;
    --radius-md: 12px;
    --radius-sm: 8px;
    --radius-full: 999px;
    --gradient-hero: linear-gradient(120deg, #a8372c 0%, #6c1b0b 100%);
    --gradient-gold: linear-gradient(120deg, #dca83d 0%, #f4ba44 100%);
  }
`;

// ─── Page background with orbs ─────────────────────────────────────────────

export const AppBg = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(circle at 10% 0%, rgba(244,186,68,0.22), transparent 42%),
    radial-gradient(circle at 96% 98%, rgba(168,55,44,0.18), transparent 42%),
    var(--s300);
  position: relative;

  &::before, &::after {
    content: '';
    position: fixed;
    border-radius: 999px;
    pointer-events: none;
    z-index: 0;
  }

  &::before {
    top: -110px;
    right: -90px;
    width: 340px;
    height: 340px;
    background: radial-gradient(circle, rgba(244,186,68,0.32), rgba(244,186,68,0.02));
    filter: blur(2px);
  }

  &::after {
    bottom: -190px;
    left: -130px;
    width: 440px;
    height: 440px;
    background: radial-gradient(circle, rgba(168,55,44,0.22), rgba(168,55,44,0.01));
    filter: blur(2px);
  }
`;

// ─── Topbar ───────────────────────────────────────────────────────────────────

export const Topbar = styled.header`
  position: relative;
  z-index: 10;
  padding: 1.1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 680px) { padding: 0.9rem 1rem; }
`;

export const BrandWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

export const BrandCode = styled.div`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.8rem;
  line-height: 0.9;
  color: var(--p500);
  -webkit-text-stroke: 1.1px var(--s900);
  text-shadow: 1px 1px 0 var(--s200);
  letter-spacing: 1px;

  @media (max-width: 680px) { font-size: 2.2rem; }
`;

export const BrandText = styled.div`
  .brand-title {
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-dark);
  }
  .brand-sub {
    font-size: 0.82rem;
    color: var(--text-muted);
    margin-top: 1px;
  }
`;

export const SessionBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.55rem 0.9rem;
  border-radius: var(--radius-full);
  background: rgba(255,255,255,0.7);
  border: 1px solid var(--border-light);
  backdrop-filter: blur(6px);
  box-shadow: var(--shadow-sm);

  .session-name { font-size: 0.85rem; font-weight: 700; color: var(--text-dark); white-space: nowrap; }
  .session-role { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; }
`;

// ─── App layout ───────────────────────────────────────────────────────────────

export const MainShell = styled.div`
  position: relative;
  z-index: 1;
  padding: 0 2rem 2.5rem;
  animation: ${reveal} 0.35s ease;

  @media (max-width: 1020px) { padding-inline: 1rem; }
`;

export const AppLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 1.1rem;

  @media (max-width: 1020px) { grid-template-columns: 1fr; }
`;

export const Sidebar = styled.nav`
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  align-self: flex-start;
  position: sticky;
  top: 1rem;

  @media (max-width: 1020px) {
    position: static;
    flex-direction: row;
    overflow-x: auto;
    padding: 0.5rem 0;
    gap: 0.4rem;
    &::-webkit-scrollbar { display: none; }
  }
`;

export const NavBtn = styled.button`
  text-align: left;
  padding: 0.78rem 0.9rem;
  border-radius: var(--radius-md);
  border: none;
  font-family: 'Sora', sans-serif;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  position: relative;
  white-space: nowrap;

  ${({ $active }) => $active ? css`
    background: var(--s900);
    color: #fff;
    box-shadow: var(--shadow-md);
  ` : css`
    background: rgba(53,48,45,0.08);
    color: var(--text-dark);
    &:hover { background: rgba(53,48,45,0.14); }
  `}

  @media (max-width: 1020px) {
    min-width: 130px;
    text-align: center;
    padding: 0.65rem 1rem;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--p500);
  color: var(--s900);
  font-size: 10px;
  font-weight: 800;
  padding: 0 4px;
  margin-left: 6px;
  vertical-align: middle;
`;

export const ContentShell = styled.main`
  min-width: 0;
`;

// ─── Cards ────────────────────────────────────────────────────────────────────

export const Card = styled.div`
  background: var(--white-glass);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(6px);
  padding: ${({ $compact }) => $compact ? '1rem' : '1.4rem'};
  margin-bottom: 1.1rem;
  animation: ${lift} 0.45s ease;
`;

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const CardTitle = styled.h2`
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0;
`;

export const PageTitle = styled.h1`
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-dark);
  letter-spacing: 0.02em;
  margin: 0 0 1.1rem;
  text-transform: uppercase;

  span { color: var(--a600); }
`;

// ─── Metrics ─────────────────────────────────────────────────────────────────

export const MetricsGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(148px, 1fr));
  margin-bottom: 1.1rem;
`;

export const MiniCard = styled.div`
  border-radius: var(--radius-md);
  background: rgba(255,255,255,0.8);
  border: 1px solid var(--border-light);
  padding: 0.9rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.18s, box-shadow 0.18s;

  &:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

  .mini-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .mini-value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    letter-spacing: 0.04em;
    color: var(--p700);
    margin-top: 0.3rem;
    display: block;
  }
`;

// ─── Table ────────────────────────────────────────────────────────────────────

export const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  background: rgba(255,255,255,0.88);

  th {
    padding: 0.6rem 0.8rem;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--text-muted);
    background: rgba(207,203,187,0.42);
    text-align: left;
    border-bottom: 1px solid var(--border-light);
    white-space: nowrap;
  }

  td {
    padding: 0.7rem 0.8rem;
    font-size: 0.84rem;
    border-bottom: 1px solid rgba(53,48,45,0.07);
    color: var(--text-dark);
    vertical-align: middle;
  }

  tbody tr:last-child td { border-bottom: none; }

  tbody tr:hover { background: rgba(244,186,68,0.07); }
`;

// ─── Forms ────────────────────────────────────────────────────────────────────

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.85rem;
  margin-bottom: 1rem;

  @media (max-width: 680px) { grid-template-columns: 1fr; }
`;

export const Field = styled.div`
  display: grid;
  gap: 0.3rem;
`;

export const Label = styled.label`
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-dark);
  letter-spacing: 0.01em;
`;

export const Input = styled.input`
  width: 100%;
  border-radius: var(--radius-sm);
  border: 1px solid ${({ $err }) => $err ? 'var(--danger)' : 'var(--border-mid)'};
  background: rgba(255,255,255,0.88);
  padding: 0.65rem 0.8rem;
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  color: var(--text-dark);
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;

  &:focus {
    border-color: var(--a700);
    box-shadow: 0 0 0 3px rgba(212,113,32,0.18);
  }

  &::placeholder { color: var(--text-light); }
  &:disabled { background: rgba(53,48,45,0.07); color: var(--text-muted); cursor: not-allowed; }
`;

export const Select = styled.select`
  width: 100%;
  border-radius: var(--radius-sm);
  border: 1px solid ${({ $err }) => $err ? 'var(--danger)' : 'var(--border-mid)'};
  background: rgba(255,255,255,0.88);
  padding: 0.65rem 0.8rem;
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  color: var(--text-dark);
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;

  &:focus {
    border-color: var(--a700);
    box-shadow: 0 0 0 3px rgba(212,113,32,0.18);
  }
`;

// ─── Buttons ──────────────────────────────────────────────────────────────────

export const Btn = styled.button`
  border-radius: var(--radius-full);
  padding: 0.62rem 1.1rem;
  font-family: 'Sora', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  border: none;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  ${({ $variant }) => $variant === 'outline' ? css`
    background: transparent;
    border: 1px solid var(--border-mid);
    color: var(--text-dark);
    &:hover { border-color: var(--p700); color: var(--p700); background: rgba(174,46,42,0.06); }
  ` : $variant === 'danger' ? css`
    background: var(--danger);
    color: #fff;
    box-shadow: 0 4px 12px rgba(157,41,38,0.28);
    &:hover { filter: brightness(1.1); box-shadow: 0 6px 16px rgba(157,41,38,0.36); }
  ` : $variant === 'success' ? css`
    background: var(--success);
    color: #fff;
    box-shadow: 0 4px 12px rgba(47,122,63,0.28);
    &:hover { filter: brightness(1.1); }
  ` : $variant === 'ghost' ? css`
    background: rgba(53,48,45,0.09);
    color: var(--text-dark);
    &:hover { background: rgba(53,48,45,0.15); }
  ` : css`
    background: var(--gradient-hero);
    color: #fff;
    box-shadow: 0 8px 20px rgba(108,27,11,0.26);
    &:hover { box-shadow: 0 10px 24px rgba(108,27,11,0.34); filter: brightness(1.06); }
  `}

  &:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; filter: none; }

  &.btn-sm { padding: 0.32rem 0.65rem; font-size: 0.74rem; border-radius: var(--radius-sm); }
`;

// ─── Badges ───────────────────────────────────────────────────────────────────

const roleMap = {
  admin:       { bg: 'rgba(168,55,44,0.18)', color: '#6c1b0b'  },
  coordenacao: { bg: 'rgba(212,113,32,0.18)', color: '#7a3b00' },
  supervisao:  { bg: 'rgba(220,168,61,0.24)', color: '#6b4e00' },
  tecnico:     { bg: 'rgba(47,122,63,0.18)',  color: '#1a5028' },
  consulta:    { bg: 'rgba(53,48,45,0.14)',   color: '#4a4540' },
};

export const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.22rem 0.55rem;
  border-radius: var(--radius-full);
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: ${({ $role }) => (roleMap[$role] || roleMap.consulta).bg};
  color: ${({ $role }) => (roleMap[$role] || roleMap.consulta).color};
`;

const statusMap = {
  pending:  { bg: 'rgba(184,108,16,0.18)',  color: '#7a4a00' },
  approved: { bg: 'rgba(47,122,63,0.18)',   color: '#1a5028' },
  rejected: { bg: 'rgba(157,41,38,0.18)',   color: '#6d1e1a' },
};

export const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 76px;
  padding: 0.28rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 700;
  background: ${({ $status }) => (statusMap[$status] || statusMap.pending).bg};
  color: ${({ $status }) => (statusMap[$status] || statusMap.pending).color};
`;

// ─── Window badge ─────────────────────────────────────────────────────────────

export const WindowBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.55rem 0.9rem;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  font-weight: 700;
  border: 1px solid;

  ${({ $open }) => $open ? css`
    background: rgba(47,122,63,0.12);
    border-color: rgba(47,122,63,0.35);
    color: #255b31;
  ` : css`
    background: rgba(157,41,38,0.10);
    border-color: rgba(157,41,38,0.35);
    color: #6d1e1a;
  `}

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
    ${({ $open }) => $open && css`animation: ${pulse} 1.5s infinite;`}
  }
`;

// ─── Modal ────────────────────────────────────────────────────────────────────

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(35,28,22,0.52);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const Modal = styled.div`
  background: rgba(255,255,255,0.97);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: 1.8rem;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${lift} 0.3s ease;

  h3 {
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--text-dark);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 1.2rem;
  }

  .modal-actions {
    display: flex;
    gap: 0.6rem;
    justify-content: flex-end;
    margin-top: 1.3rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-light);
  }
`;

// ─── Login page ───────────────────────────────────────────────────────────────

export const LoginWrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  padding: 1.5rem;
  gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

export const LoginHero = styled.div`
  flex: 1;
  background: linear-gradient(145deg, rgba(168,55,44,0.12), rgba(212,168,61,0.24));
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(6px);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${lift} 0.6s ease;

  .hero-kicker {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--a600);
  }

  .hero-brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 4.5rem;
    line-height: 0.9;
    color: var(--p700);
    -webkit-text-stroke: 1px var(--s800);
    text-shadow: 2px 2px 0 rgba(255,255,255,0.4);
    margin: 0.6rem 0;
    letter-spacing: 2px;
  }

  .hero-title {
    font-size: clamp(1.2rem, 2.5vw, 1.9rem);
    font-weight: 800;
    color: var(--text-dark);
    line-height: 1.2;
    max-width: 380px;
  }

  .hero-desc {
    font-size: 0.88rem;
    color: var(--text-muted);
    line-height: 1.7;
    margin-top: 0.75rem;
    max-width: 360px;
  }

  .hero-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }

  .chip {
    padding: 0.38rem 0.75rem;
    border-radius: var(--radius-full);
    background: rgba(53,48,45,0.1);
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--text-dark);
    border: 1px solid rgba(53,48,45,0.15);
  }

  @media (max-width: 768px) { display: none; }
`;

export const LoginCard = styled.div`
  width: 420px;
  flex-shrink: 0;
  background: var(--white-glass-strong);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(8px);
  padding: 2.5rem 2.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${lift} 0.8s ease;

  .card-brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.4rem;
    letter-spacing: 3px;
    color: var(--p700);
    -webkit-text-stroke: 0.8px var(--s800);
    line-height: 1;
  }

  .card-kicker {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 0.3rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 420px;
    padding: 2rem 1.5rem;
  }
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const LoginBtn = styled.button`
  margin-top: 0.4rem;
  padding: 0.85rem;
  background: var(--gradient-hero);
  color: #fff;
  border: none;
  border-radius: var(--radius-full);
  font-family: 'Sora', sans-serif;
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 8px 22px rgba(108,27,11,0.28);

  &:hover:not(:disabled) {
    box-shadow: 0 10px 26px rgba(108,27,11,0.38);
    filter: brightness(1.08);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; }
`;

// ─── Misc ─────────────────────────────────────────────────────────────────────

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border-light);
  margin: 1rem 0;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--text-muted);
  font-size: 0.88rem;

  .empty-icon { font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.4; }
`;
