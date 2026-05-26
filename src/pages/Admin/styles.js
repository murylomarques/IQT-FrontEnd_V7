import styled, { keyframes, css } from 'styled-components';

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.45); }
  50%       { box-shadow: 0 0 0 5px rgba(245, 158, 11, 0); }
`;

// ─── HERO ─────────────────────────────────────────────────────────────────────
export const Hero = styled.section`
  background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 55%, #b45309 100%);
  border-radius: var(--radius-3);
  padding: 28px;
  display: grid;
  gap: 22px;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;

  &::before {
    content: '';
    position: absolute;
    top: -70px; right: -70px;
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(255,255,255,0.07), transparent 65%);
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -80px; left: 22%;
    width: 240px; height: 240px;
    background: radial-gradient(circle, rgba(255,200,80,0.1), transparent 65%);
    pointer-events: none;
  }
`;

export const HeroHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1;
`;

export const HeroTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.3px;
`;

export const HeroSubtitle = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.9rem;
`;

export const StatGrid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
  z-index: 1;
`;

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-2);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: background 0.2s;

  &:hover { background: rgba(255, 255, 255, 0.17); }
`;

export const StatLabel = styled.span`
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

export const StatValue = styled.span`
  font-size: 2.1rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
`;

export const StatDelta = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ tone }) =>
    tone === 'up' ? 'rgba(134, 239, 172, 0.9)' : 'rgba(252, 165, 165, 0.85)'};
`;

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
export const Grid = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  align-items: start;
  margin-bottom: 18px;
`;

export const WideGrid = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr 2fr;
  align-items: start;
  margin-bottom: 18px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

export const Panel = styled.section`
  background: var(--bg-1);
  border-radius: var(--radius-2);
  border: 1px solid var(--border-0);
  box-shadow: var(--shadow-1);
  padding: 20px;
  display: grid;
  gap: 16px;
  align-self: start;
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-1);

  svg {
    color: var(--ink-3);
    font-size: 1.1rem;
    flex-shrink: 0;
    margin-top: 3px;
  }
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--ink-0);
`;

export const PanelSubtitle = styled.p`
  margin: 4px 0 0;
  font-size: 0.78rem;
  color: var(--ink-3);
  font-weight: 500;
`;

export const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  background: #eff6ff;
  color: var(--accent-0);
  border: 1px solid #dbeafe;
  white-space: nowrap;
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  background: ${({ tone }) =>
    tone === 'critical' ? 'var(--danger-bg)' :
    tone === 'warning'  ? 'var(--warning-bg)' :
    tone === 'success'  ? 'var(--success-bg)' :
                          'var(--border-1)'};
  color: ${({ tone }) =>
    tone === 'critical' ? '#b91c1c' :
    tone === 'warning'  ? '#b45309' :
    tone === 'success'  ? '#15803d' :
                          'var(--ink-2)'};
`;

// ─── ACTION CARDS ─────────────────────────────────────────────────────────────
export const ActionGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;
`;

export const ActionIconWrap = styled.div`
  width: 38px;
  height: 38px;
  border-radius: var(--radius-1);
  background: ${({ bg }) => bg || 'var(--bg-2)'};
  color: ${({ color }) => color || 'var(--ink-2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  transition: transform 0.15s ease;
`;

export const ActionCard = styled.button`
  border: 1px solid var(--border-0);
  border-radius: var(--radius-2);
  background: var(--bg-1);
  padding: 14px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.18s ease;

  strong {
    font-size: 0.855rem;
    color: var(--ink-0);
    font-weight: 700;
    line-height: 1.2;
  }

  span {
    font-size: 0.73rem;
    color: var(--ink-3);
    font-weight: 500;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-2);
    border-color: var(--border-0);

    ${ActionIconWrap} { transform: scale(1.1); }
  }
`;

// ─── STATUS LIST ──────────────────────────────────────────────────────────────
export const StatusList = styled.div`
  display: grid;
  gap: 8px;
`;

export const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-radius: var(--radius-1);
  background: var(--bg-2);
  border: 1px solid var(--border-1);
  font-size: 0.855rem;
  color: var(--ink-1);
  font-weight: 500;
  gap: 12px;

  > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ tone }) =>
    tone === 'critical' ? 'var(--danger)' :
    tone === 'warning'  ? 'var(--warning)' :
                          'var(--success)'};
  box-shadow: ${({ tone }) =>
    tone === 'ok'      ? '0 0 0 3px rgba(22,163,74,0.15)' :
    tone === 'warning' ? '0 0 0 3px rgba(245,158,11,0.15)' : 'none'};
  ${({ tone }) => tone === 'warning' && css`animation: ${pulse} 2s infinite;`}
`;

// ─── ACTIVITY ─────────────────────────────────────────────────────────────────
export const ActivityList = styled.div`
  display: grid;
  gap: 0;
`;

export const ActivityItem = styled.div`
  display: grid;
  gap: 3px;
  padding: 12px 0 12px 18px;
  border-left: 2px solid var(--border-1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -5px;
    top: 15px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--brand);
    border: 2px solid var(--bg-1);
    box-shadow: 0 0 0 1px var(--border-0);
  }

  strong {
    font-size: 0.855rem;
    color: var(--ink-0);
    font-weight: 600;
    line-height: 1.3;
  }
`;

export const ActivityMeta = styled.span`
  font-size: 0.73rem;
  color: var(--ink-3);
  font-weight: 500;
`;

// ─── TABELA ───────────────────────────────────────────────────────────────────
export const SimpleTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 8px 10px;
    border-bottom: 2px solid var(--border-1);
    font-size: 0.67rem;
    text-transform: uppercase;
    color: var(--ink-3);
    letter-spacing: 0.07em;
    font-weight: 700;
    white-space: nowrap;
  }

  td {
    text-align: left;
    padding: 11px 10px;
    border-bottom: 1px solid var(--bg-2);
    color: var(--ink-1);
    font-weight: 500;
    font-size: 0.855rem;
    vertical-align: middle;
  }

  tbody tr {
    transition: background 0.12s;
    cursor: pointer;
    &:hover { background: var(--bg-2); }
    &:last-child td { border-bottom: none; }
  }
`;

export const TableActions = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const TableBtn = styled.button`
  padding: 5px 11px;
  border-radius: 7px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const DetailBtn = styled(TableBtn)`
  border: 1px solid var(--border-0);
  background: var(--bg-1);
  color: var(--ink-1);
  &:hover:not(:disabled) { background: var(--bg-2); border-color: var(--ink-3); }
`;

export const ApproveBtn = styled(TableBtn)`
  border: none;
  background: var(--success-bg);
  color: #15803d;
  &:hover:not(:disabled) { background: var(--success); color: #fff; }
`;

export const RejectBtn = styled(TableBtn)`
  border: none;
  background: var(--danger-bg);
  color: #b91c1c;
  &:hover:not(:disabled) { background: var(--danger); color: #fff; }
`;

// ─── MODAL ────────────────────────────────────────────────────────────────────
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
  animation: admFadeIn 0.15s ease;

  @keyframes admFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

export const ModalContent = styled.div`
  width: 100%;
  max-width: 640px;
  background: var(--bg-1);
  border-radius: var(--radius-3);
  box-shadow: 0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08);
  overflow: hidden;
  animation: admSlideUp 0.2s ease;

  @keyframes admSlideUp {
    from { opacity: 0; transform: translateY(18px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 22px 26px 18px;
  border-bottom: 1px solid var(--border-1);

  h3 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--ink-0);
    letter-spacing: -0.2px;
  }

  .modal-meta {
    font-size: 0.77rem;
    color: var(--ink-3);
    margin-top: 5px;
    font-weight: 500;
  }
`;

export const ModalCloseBtn = styled.button`
  background: var(--bg-2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  color: var(--ink-2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
  &:hover:not(:disabled) { background: var(--border-0); color: var(--ink-0); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const ModalBody = styled.div`
  padding: 20px 26px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const ModalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 0.67rem;
    color: var(--ink-3);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  span {
    font-size: 0.875rem;
    color: var(--ink-0);
    font-weight: 600;
    word-break: break-word;
  }
`;

export const ObservacaoBox = styled.div`
  padding: 4px 26px 12px;

  strong {
    font-size: 0.67rem;
    color: var(--ink-3);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: block;
    margin-bottom: 8px;
  }

  div {
    padding: 12px 14px;
    border: 1px solid var(--border-0);
    border-radius: var(--radius-1);
    min-height: 52px;
    font-size: 0.875rem;
    color: var(--ink-1);
    background: var(--bg-2);
    line-height: 1.5;
    font-weight: 500;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 26px 22px;
  border-top: 1px solid var(--border-1);
`;

export const ModalApproveBtn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-1);
  background: linear-gradient(135deg, var(--success), #15803d);
  color: #fff;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.18s ease;
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(22,163,74,0.35);
  }
  &:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
`;

export const ModalRejectBtn = styled.button`
  padding: 10px 20px;
  border: 1px solid var(--danger-bg);
  border-radius: var(--radius-1);
  background: #fff5f5;
  color: #b91c1c;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.18s ease;
  &:hover:not(:disabled) { background: var(--danger); border-color: var(--danger); color: #fff; }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

// Mantido para compatibilidade com outras páginas que importam daqui
export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: #fff;
  padding: 9px 18px;
  border: none;
  border-radius: var(--radius-1);
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(168, 55, 44, 0.4);
  }
  &:disabled { background: var(--border-0); color: var(--ink-3); cursor: not-allowed; }
`;
