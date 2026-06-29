import styled, { createGlobalStyle, css, keyframes } from 'styled-components';

// ─── Tokens (diretos, sem CSS vars) ──────────────────────────────────────────
const C = {
  bg:           '#eae6db',
  bgGrad:       'radial-gradient(circle at 8% 0%, rgba(244,186,68,0.22) 0%, transparent 42%), radial-gradient(circle at 96% 100%, rgba(168,55,44,0.18) 0%, transparent 42%), #eae6db',
  cardBg:       'rgba(255,255,255,0.82)',
  cardBgStrong: 'rgba(255,255,255,0.96)',
  cardBorder:   'rgba(53,48,45,0.11)',
  cardBorderH:  'rgba(53,48,45,0.20)',
  topbarBg:     'rgba(255,255,255,0.88)',
  sideBg:       'rgba(255,255,255,0.70)',
  textDark:     '#2e2a26',
  textMid:      '#5a5551',
  textLight:    '#9a948f',
  primary:      '#ae2e2a',
  primaryDark:  '#7c1f1c',
  gold:         '#f4ba44',
  goldDark:     '#c9950c',
  orange:       '#d47120',
  success:      '#2f7a3f',
  successBg:    'rgba(47,122,63,0.12)',
  successBdr:   'rgba(47,122,63,0.30)',
  danger:       '#9d2926',
  dangerBg:     'rgba(157,41,38,0.10)',
  dangerBdr:    'rgba(157,41,38,0.30)',
  warn:         '#b86c10',
  warnBg:       'rgba(184,108,16,0.10)',
  warnBdr:      'rgba(184,108,16,0.30)',
  border:       'rgba(53,48,45,0.12)',
  borderMid:    'rgba(53,48,45,0.20)',
  shadowSm:     '0 2px 8px rgba(41,37,34,0.07)',
  shadowMd:     '0 8px 24px rgba(41,37,34,0.11)',
  shadowLg:     '0 20px 48px rgba(41,37,34,0.16)',
  shadowBtn:    '0 6px 20px rgba(108,27,11,0.25)',
  gradHero:     'linear-gradient(130deg, #a8372c 0%, #6c1b0b 100%)',
  gradGold:     'linear-gradient(130deg, #dca83d 0%, #f4ba44 100%)',
};

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeUp   = keyframes`from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn   = keyframes`from{opacity:0}to{opacity:1}`;
const pulseDot = keyframes`0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.8)}`;
const shimmer  = keyframes`0%{background-position:200% 0}100%{background-position:-200% 0}`;
const slideUp  = keyframes`from{transform:translateY(100%)}to{transform:translateY(0)}`;

// ─── Global ───────────────────────────────────────────────────────────────────
export const FcaGlobal = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sora:wght@300;400;500;600;700;800&display=swap');
`;

// ─── Page wrapper ─────────────────────────────────────────────────────────────
export const FcaWrap = styled.div`
  font-family: 'Sora','Segoe UI',sans-serif;
  min-height: 100vh;
  background: ${C.bgGrad};
  color: ${C.textDark};
  overflow-x: hidden;
  position: relative;

  /* decorative orbs */
  &::before, &::after {
    content: '';
    position: fixed;
    border-radius: 999px;
    pointer-events: none;
    z-index: 0;
    filter: blur(1px);
  }
  &::before {
    top: -110px; right: -90px;
    width: 340px; height: 340px;
    background: radial-gradient(circle, rgba(244,186,68,.30), rgba(244,186,68,.02));
  }
  &::after {
    bottom: -200px; left: -130px;
    width: 440px; height: 440px;
    background: radial-gradient(circle, rgba(168,55,44,.22), rgba(168,55,44,.01));
  }
`;

// ─── Topbar ───────────────────────────────────────────────────────────────────
export const Topbar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.85rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: ${C.topbarBg};
  border-bottom: 1px solid ${C.border};
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: ${C.shadowSm};

  @media (max-width: 680px) { padding: 0.75rem 1rem; }
`;

export const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const BrandLogo = styled.div`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.6rem;
  line-height: 1;
  color: ${C.gold};
  -webkit-text-stroke: 1px ${C.primaryDark};
  text-shadow: 1px 2px 0 rgba(255,255,255,.35);
  letter-spacing: 1px;
  user-select: none;

  @media (max-width: 680px) { font-size: 2rem; }
`;

export const BrandMeta = styled.div`
  .title {
    font-size: .95rem;
    font-weight: 800;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: ${C.textDark};
  }
  .sub {
    font-size: .72rem;
    color: ${C.textMid};
    margin-top: 1px;
  }
  @media (max-width: 480px) { .sub { display: none; } }
`;

export const SessionPill = styled.div`
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .45rem .8rem;
  border-radius: 999px;
  background: rgba(255,255,255,.72);
  border: 1px solid ${C.border};
  backdrop-filter: blur(6px);
  box-shadow: ${C.shadowSm};

  .sname { font-size: .82rem; font-weight: 700; color: ${C.textDark}; white-space: nowrap; }
  .srole { font-size: .68rem; color: ${C.textMid}; text-transform: uppercase; letter-spacing: .06em; white-space: nowrap; }

  @media (max-width: 380px) {
    .sname, .srole { display: none; }
    gap: 0;
    padding: .4rem .6rem;
  }
`;

// ─── Main shell ───────────────────────────────────────────────────────────────
export const Shell = styled.div`
  position: relative;
  z-index: 1;
  padding: 1.6rem 2rem 3rem;
  animation: ${fadeIn} .3s ease;

  @media (max-width: 1020px) { padding-inline: 1rem; }
  @media (max-width: 680px)  { padding: 1rem 0.75rem 2rem; }
`;

// ─── App layout (sidebar + content) ──────────────────────────────────────────
export const AppLayout = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1.2rem;
  align-items: start;

  @media (max-width: 1020px) {
    grid-template-columns: 1fr;
  }
`;

export const SideNav = styled.nav`
  background: ${C.sideBg};
  border: 1px solid ${C.cardBorder};
  border-radius: 18px;
  box-shadow: ${C.shadowSm};
  backdrop-filter: blur(8px);
  padding: .7rem;
  display: flex;
  flex-direction: column;
  gap: .35rem;
  position: sticky;
  top: calc(60px + 1.6rem);

  @media (max-width: 1020px) {
    position: static;
    flex-direction: row;
    overflow-x: auto;
    padding: .55rem;
    gap: .4rem;
    border-radius: 14px;
    &::-webkit-scrollbar { display: none; }
  }
`;

export const NavBtn = styled.button`
  display: flex;
  align-items: center;
  gap: .45rem;
  text-align: left;
  padding: .72rem .9rem;
  border-radius: 12px;
  border: none;
  font-family: 'Sora', sans-serif;
  font-size: .84rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .18s, color .18s, box-shadow .18s;
  white-space: nowrap;

  ${({ $active }) => $active ? css`
    background: ${C.textDark};
    color: #fff;
    box-shadow: ${C.shadowMd};
  ` : css`
    background: transparent;
    color: ${C.textMid};
    &:hover { background: rgba(53,48,45,.09); color: ${C.textDark}; }
  `}

  @media (max-width: 1020px) {
    min-width: 110px;
    justify-content: center;
    padding: .6rem .9rem;
    border-radius: 10px;
  }
`;

export const NavBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 800;
  background: ${C.gold};
  color: ${C.textDark};
`;

export const ContentArea = styled.main`
  min-width: 0;
`;

// ─── Cards ────────────────────────────────────────────────────────────────────
export const Card = styled.div`
  background: ${C.cardBg};
  border: 1px solid ${C.cardBorder};
  border-radius: 20px;
  box-shadow: ${C.shadowSm};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: ${({ $p }) => $p || '1.4rem'};
  margin-bottom: 1.1rem;
  animation: ${fadeUp} .4s ease;
  transition: box-shadow .22s;

  &:hover { box-shadow: ${C.shadowMd}; }

  @media (max-width: 680px) {
    padding: ${({ $p }) => $p || '1rem'};
    border-radius: 16px;
  }
`;

export const CardRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: .6rem;
  margin-bottom: 1rem;
`;

export const CardLabel = styled.h2`
  margin: 0;
  font-size: .72rem;
  font-weight: 700;
  color: ${C.textLight};
  text-transform: uppercase;
  letter-spacing: .09em;
`;

export const PageTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${C.textDark};
  letter-spacing: .03em;
  text-transform: uppercase;
  margin: 0 0 1.1rem;

  em { font-style: normal; color: ${C.primary}; }
`;

// ─── Metrics ─────────────────────────────────────────────────────────────────
export const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
  gap: .8rem;
  margin-bottom: 1.2rem;

  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
    gap: .55rem;
  }
`;

export const Metric = styled.div`
  width: 100%;
  appearance: none;
  font-family: 'Sora', sans-serif;
  text-align: left;
  background: ${C.cardBg};
  border: 1px solid ${({ $active }) => ($active ? C.primary : C.cardBorder)};
  border-radius: 16px;
  padding: 1rem;
  box-shadow: ${C.shadowSm};
  backdrop-filter: blur(6px);
  animation: ${fadeUp} .45s ease;
  transition: transform .18s, box-shadow .18s, border-color .18s, background .18s;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};

  &:hover { transform: translateY(-3px); box-shadow: ${C.shadowMd}; }
  &:focus-visible {
    outline: 3px solid rgba(174,46,42,.20);
    outline-offset: 2px;
  }

  ${({ $active }) => $active && css`
    background: ${C.cardBgStrong};
    box-shadow: ${C.shadowMd};
  `}

  .label {
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: ${C.textMid};
  }

  .value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.4rem;
    letter-spacing: .03em;
    color: ${C.primary};
    margin-top: .2rem;
    line-height: 1;
  }

  @media (max-width: 500px) {
    padding: .8rem;
    .value { font-size: 2rem; }
  }
`;

// ─── Table ────────────────────────────────────────────────────────────────────
export const TblWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 14px;
  border: 1px solid ${C.border};
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(53,48,45,.18); border-radius: 2px; }
`;

export const Tbl = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 540px;
  background: rgba(255,255,255,.90);

  thead tr {
    background: rgba(207,203,187,.40);
  }

  th {
    padding: .6rem .85rem;
    font-size: .67rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .09em;
    color: ${C.textMid};
    text-align: left;
    border-bottom: 1px solid ${C.border};
    white-space: nowrap;
  }

  td {
    padding: .75rem .85rem;
    font-size: .84rem;
    border-bottom: 1px solid rgba(53,48,45,.07);
    color: ${C.textDark};
    vertical-align: middle;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr { transition: background .14s; }
  tbody tr:hover { background: rgba(244,186,68,.08); }

  @media (max-width: 600px) {
    min-width: 480px;
    th { padding: .5rem .6rem; font-size: .62rem; }
    td { padding: .6rem .6rem; font-size: .8rem; }
  }
`;

// ─── Form ────────────────────────────────────────────────────────────────────
export const FGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(195px, 1fr));
  gap: .85rem;
  margin-bottom: 1rem;

  @media (max-width: 680px) { grid-template-columns: 1fr; }
`;

export const Fld = styled.div`
  display: grid;
  gap: .3rem;
`;

export const Lbl = styled.label`
  font-size: .76rem;
  font-weight: 700;
  color: ${C.textDark};
`;

export const Inp = styled.input`
  width: 100%;
  border-radius: 10px;
  border: 1.5px solid ${({ $err }) => $err ? C.danger : C.borderMid};
  background: rgba(255,255,255,.92);
  padding: .62rem .8rem;
  font-family: 'Sora', sans-serif;
  font-size: .88rem;
  color: ${C.textDark};
  outline: none;
  transition: border-color .18s, box-shadow .18s;

  &:focus {
    border-color: ${C.orange};
    box-shadow: 0 0 0 3px rgba(212,113,32,.15);
  }
  &::placeholder { color: ${C.textLight}; }
  &:disabled { background: rgba(53,48,45,.06); color: ${C.textMid}; cursor: not-allowed; }
`;

export const Sel = styled.select`
  width: 100%;
  border-radius: 10px;
  border: 1.5px solid ${({ $err }) => $err ? C.danger : C.borderMid};
  background: rgba(255,255,255,.92) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 10px center;
  padding: .62rem .8rem;
  padding-right: 2rem;
  font-family: 'Sora', sans-serif;
  font-size: .88rem;
  color: ${C.textDark};
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: border-color .18s, box-shadow .18s;

  &:focus {
    border-color: ${C.orange};
    box-shadow: 0 0 0 3px rgba(212,113,32,.15);
  }
`;

// ─── Button ───────────────────────────────────────────────────────────────────
export const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .4rem;
  border-radius: 999px;
  padding: .6rem 1.15rem;
  font-family: 'Sora', sans-serif;
  font-size: .81rem;
  font-weight: 700;
  letter-spacing: .01em;
  border: none;
  cursor: pointer;
  transition: all .18s;
  white-space: nowrap;
  flex-shrink: 0;

  ${({ $v }) =>
    $v === 'outline' ? css`
      background: transparent;
      border: 1.5px solid ${C.borderMid};
      color: ${C.textDark};
      &:hover { border-color: ${C.primary}; color: ${C.primary}; background: ${C.dangerBg}; }
    ` :
    $v === 'ghost' ? css`
      background: rgba(53,48,45,.09);
      color: ${C.textDark};
      border: 1px solid transparent;
      &:hover { background: rgba(53,48,45,.16); }
    ` :
    $v === 'danger' ? css`
      background: ${C.danger};
      color: #fff;
      box-shadow: 0 4px 14px rgba(157,41,38,.28);
      &:hover { filter: brightness(1.1); box-shadow: 0 6px 18px rgba(157,41,38,.38); transform: translateY(-1px); }
      &:active { transform: translateY(0); }
    ` :
    $v === 'success' ? css`
      background: ${C.success};
      color: #fff;
      box-shadow: 0 4px 14px rgba(47,122,63,.28);
      &:hover { filter: brightness(1.1); transform: translateY(-1px); }
    ` :
    css`
      background: ${C.gradHero};
      color: #fff;
      box-shadow: ${C.shadowBtn};
      &:hover { box-shadow: 0 10px 26px rgba(108,27,11,.38); filter: brightness(1.07); transform: translateY(-1px); }
      &:active { transform: translateY(0); }
    `
  }

  &:disabled { opacity: .52; cursor: not-allowed; transform: none !important; box-shadow: none !important; filter: none !important; }

  /* small modifier */
  &.sm { padding: .32rem .7rem; font-size: .74rem; border-radius: 8px; }
`;

// ─── Badges ───────────────────────────────────────────────────────────────────
const roleStyle = {
  admin:       `background:rgba(168,55,44,.16);color:#6c1b0b;`,
  coordenacao: `background:rgba(212,113,32,.16);color:#7a3b00;`,
  supervisao:  `background:rgba(220,168,61,.22);color:#6b4e00;`,
  tecnico:     `background:rgba(47,122,63,.16);color:#1a5028;`,
  consulta:    `background:rgba(53,48,45,.12);color:#3d3a37;`,
};

export const RBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: .2rem .55rem;
  border-radius: 999px;
  font-size: .67rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  ${({ $r }) => roleStyle[$r] || roleStyle.consulta}
`;

const stStyle = {
  pending:  `background:rgba(184,108,16,.14);color:#7a4a00;`,
  approved: `background:rgba(47,122,63,.14);color:#1a5028;`,
  rejected: `background:rgba(157,41,38,.14);color:#6d1e1a;`,
};

export const SPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 74px;
  padding: .24rem .6rem;
  border-radius: 999px;
  font-size: .69rem;
  font-weight: 700;
  text-transform: capitalize;
  ${({ $s }) => stStyle[$s] || stStyle.pending}
`;

// ─── Window badge ─────────────────────────────────────────────────────────────
export const WinBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: .55rem 1rem;
  border-radius: 10px;
  font-size: .82rem;
  font-weight: 700;

  ${({ $open }) => $open ? css`
    background: ${C.successBg};
    border: 1px solid ${C.successBdr};
    color: #255b31;
  ` : css`
    background: ${C.dangerBg};
    border: 1px solid ${C.dangerBdr};
    color: #6d1e1a;
  `}

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
    ${({ $open }) => $open && css`animation: ${pulseDot} 1.5s infinite;`}
  }
`;

// ─── Modal ────────────────────────────────────────────────────────────────────
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(30,25,20,.50);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  animation: ${fadeIn} .2s ease;

  @media (max-width: 600px) {
    align-items: flex-end;
    padding: 0;
  }
`;

export const ModalBox = styled.div`
  background: ${C.cardBgStrong};
  border: 1px solid ${C.cardBorder};
  border-radius: 22px;
  box-shadow: ${C.shadowLg};
  padding: 2rem;
  width: 100%;
  max-width: 530px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${fadeUp} .25s ease;

  h3 {
    margin: 0 0 1.3rem;
    font-size: 1rem;
    font-weight: 800;
    color: ${C.textDark};
    text-transform: uppercase;
    letter-spacing: .04em;
  }

  .mfooter {
    display: flex;
    gap: .6rem;
    justify-content: flex-end;
    margin-top: 1.3rem;
    padding-top: 1rem;
    border-top: 1px solid ${C.border};
  }

  @media (max-width: 600px) {
    max-width: 100%;
    border-radius: 22px 22px 0 0;
    padding: 1rem 1.1rem 2rem;
    max-height: 88vh;
    animation: ${slideUp} .3s ease;

    &::before {
      content: '';
      display: block;
      width: 40px; height: 4px;
      border-radius: 2px;
      background: rgba(53,48,45,.18);
      margin: 0 auto .9rem;
    }

    .mfooter {
      flex-direction: column-reverse;
      button { width: 100%; justify-content: center; padding: .75rem; font-size: .88rem; border-radius: 14px; }
    }
  }
`;

// ─── Empty state ──────────────────────────────────────────────────────────────
export const Empty = styled.div`
  padding: 2.5rem 1rem;
  text-align: center;
  color: ${C.textLight};
  font-size: .86rem;
  line-height: 1.6;

  .icon { font-size: 2rem; margin-bottom: .4rem; opacity: .4; }
`;

// ─── Alert banner ─────────────────────────────────────────────────────────────
export const Alert = styled.div`
  padding: .75rem 1rem;
  border-radius: 12px;
  font-size: .84rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: .6rem;

  ${({ $t }) =>
    $t === 'warn' ? css`background:${C.warnBg};border:1px solid ${C.warnBdr};color:#7a4a00;` :
    $t === 'success' ? css`background:${C.successBg};border:1px solid ${C.successBdr};color:#255b31;` :
    css`background:${C.dangerBg};border:1px solid ${C.dangerBdr};color:#6d1e1a;`
  }
`;

// ─── Login ────────────────────────────────────────────────────────────────────
export const LoginShell = styled.div`
  font-family: 'Sora','Segoe UI',sans-serif;
  min-height: 100vh;
  background: ${C.bgGrad};
  display: flex;
  align-items: stretch;
  padding: 1.5rem;
  gap: 1.4rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: fixed;
    top: -100px; right: -80px;
    width: 320px; height: 320px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(244,186,68,.30), transparent);
    pointer-events: none; z-index: 0;
  }
  &::after {
    content: '';
    position: fixed;
    bottom: -190px; left: -120px;
    width: 420px; height: 420px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(168,55,44,.22), transparent);
    pointer-events: none; z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    align-items: center;
    justify-content: center;
  }
`;

export const LoginHero = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
  background: linear-gradient(148deg, rgba(168,55,44,.10) 0%, rgba(220,168,61,.22) 100%);
  border: 1px solid ${C.cardBorder};
  border-radius: 22px;
  box-shadow: ${C.shadowMd};
  backdrop-filter: blur(8px);
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${fadeUp} .6s ease;

  .kicker {
    font-size: .68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .12em;
    color: ${C.orange};
    margin-bottom: .5rem;
  }

  .brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 5rem;
    line-height: .9;
    color: ${C.primary};
    -webkit-text-stroke: 1px ${C.primaryDark};
    text-shadow: 2px 2px 0 rgba(255,255,255,.38);
    letter-spacing: 2px;
    margin-bottom: .8rem;
  }

  .headline {
    font-size: clamp(1.2rem, 2.2vw, 1.8rem);
    font-weight: 800;
    color: ${C.textDark};
    line-height: 1.2;
    max-width: 380px;
  }

  .desc {
    font-size: .88rem;
    color: ${C.textMid};
    line-height: 1.75;
    margin-top: .75rem;
    max-width: 360px;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
    margin-top: 1.6rem;
  }

  .chip {
    padding: .36rem .75rem;
    border-radius: 999px;
    background: rgba(53,48,45,.10);
    border: 1px solid rgba(53,48,45,.14);
    font-size: .74rem;
    font-weight: 700;
    color: ${C.textDark};
  }

  @media (max-width: 768px) { display: none; }
`;

export const LoginCard = styled.div`
  width: 400px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  background: ${C.cardBgStrong};
  border: 1px solid ${C.cardBorder};
  border-radius: 22px;
  box-shadow: ${C.shadowLg};
  backdrop-filter: blur(10px);
  padding: 2.5rem 2.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${fadeUp} .75s ease;

  .logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.4rem;
    letter-spacing: 3px;
    color: ${C.primary};
    -webkit-text-stroke: .8px ${C.primaryDark};
    line-height: 1;
    margin-bottom: .25rem;
  }

  .sub {
    font-size: .72rem;
    font-weight: 700;
    color: ${C.textLight};
    text-transform: uppercase;
    letter-spacing: .1em;
    margin-bottom: 2.2rem;
  }

  @media (max-width: 768px) { width: 100%; max-width: 400px; padding: 2rem 1.5rem; }
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const LoginBtn = styled.button`
  margin-top: .4rem;
  padding: .82rem;
  background: ${C.gradHero};
  color: #fff;
  border: none;
  border-radius: 999px;
  font-family: 'Sora', sans-serif;
  font-size: .9rem;
  font-weight: 800;
  letter-spacing: .05em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: ${C.shadowBtn};
  transition: all .22s;

  &:hover:not(:disabled) {
    box-shadow: 0 10px 28px rgba(108,27,11,.40);
    filter: brightness(1.08);
    transform: translateY(-1px);
  }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: .55; cursor: not-allowed; box-shadow: none; }
`;

export { C };
