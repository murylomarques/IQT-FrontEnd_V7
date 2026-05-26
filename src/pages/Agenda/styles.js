import styled from 'styled-components';

// Status colors — semânticos, intencionais, ficam hardcoded
const STATUS_MAP = {
  'Concluído':  { gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', dot: '#86efac' },
  'Pendente':   { gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', dot: '#93c5fd' },
  'Caminho':    { gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', dot: '#fde68a' },
  'Realizando': { gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', dot: '#c4b5fd' },
  'Reparo':     { gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', dot: '#fca5a5' },
  'Cancelado':  { gradient: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)', dot: '#e2e8f0' },
};

export const STATUS_BADGE_CONFIG = {
  'Concluído':  { bg: 'var(--success-bg)',  color: '#15803d' },
  'Pendente':   { bg: '#dbeafe',            color: '#1d4ed8' },
  'Caminho':    { bg: 'var(--warning-bg)',  color: '#b45309' },
  'Realizando': { bg: '#ede9fe',            color: '#6d28d9' },
  'Reparo':     { bg: 'var(--danger-bg)',   color: '#b91c1c' },
  'Cancelado':  { bg: 'var(--border-1)',    color: 'var(--ink-2)' },
};

// ─── STATS ROW ────────────────────────────────────────────────────────────────
export const StatsRow = styled.div`
  display: flex;
  gap: 14px;
  margin-bottom: 18px;
`;

export const StatCard = styled.div`
  flex: 1;
  background: var(--bg-1);
  border-radius: var(--radius-2);
  padding: 16px 20px;
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
  border-left: 4px solid ${props => props.accent || 'var(--border-0)'};
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const StatValue = styled.div`
  font-size: 1.9rem;
  font-weight: 800;
  color: ${props => props.color || 'var(--ink-0)'};
  line-height: 1;
`;

export const StatLabel = styled.div`
  font-size: 0.72rem;
  color: var(--ink-2);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 4px;
`;

// ─── PAINEL DE CONTROLE ───────────────────────────────────────────────────────
export const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: var(--bg-1);
  padding: 14px 22px;
  border-radius: var(--radius-2);
  margin-bottom: 18px;
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
`;

export const DateNavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const NavButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: var(--radius-1);
  border: 1px solid var(--border-0);
  background: var(--bg-1);
  color: var(--ink-2);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ease;

  &:hover {
    background: #fef2f2;
    border-color: var(--brand);
    color: var(--brand);
  }
`;

export const TodayButton = styled.button`
  padding: 6px 14px;
  border-radius: var(--radius-1);
  border: 1px solid var(--border-0);
  background: var(--bg-1);
  color: var(--ink-0);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: var(--brand-dark);
    border-color: var(--brand-dark);
    color: #fff;
  }
`;

export const DateDisplay = styled.div`
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--ink-0);
  min-width: 260px;
  text-align: center;
  text-transform: capitalize;
`;

export const DateInput = styled.input`
  padding: 7px 11px;
  border-radius: var(--radius-1);
  border: 1px solid var(--border-0);
  background: var(--bg-2);
  font-size: 0.85rem;
  color: var(--ink-0);
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--brand);
    box-shadow: 0 0 0 3px rgba(168,55,44,0.1);
  }
`;

export const ControlRight = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const LegendGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  color: var(--ink-2);
  font-weight: 600;
  white-space: nowrap;
`;

export const LegendDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.color || 'var(--ink-3)'};
`;

// ─── ESTRUTURA GANTT ──────────────────────────────────────────────────────────
export const GanttContainer = styled.div`
  border-radius: var(--radius-2);
  background: var(--bg-1);
  overflow: hidden;
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
  overflow-x: auto;
`;

export const GanttGrid = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  min-width: 1700px;
`;

// ─── COLUNA DE RECURSOS ───────────────────────────────────────────────────────
export const ResourceList = styled.div`
  border-right: 2px solid var(--border-0);
  position: sticky;
  left: 0;
  background: var(--bg-1);
  z-index: 10;
`;

export const ResourceHeader = styled.div`
  padding: 0 18px;
  font-weight: 700;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--ink-3);
  border-bottom: 1px solid var(--border-0);
  height: 54px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: var(--bg-2);
`;

export const ResourceItem = styled.div`
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-1);
  height: 68px;
  display: flex;
  align-items: center;
  gap: 11px;
  box-sizing: border-box;
  transition: background 0.15s;

  &:hover { background: var(--bg-2); }
`;

export const ResourceAvatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: var(--radius-1);
  background: linear-gradient(135deg, var(--brand-dark), var(--brand));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: 0.03em;
`;

export const ResourceInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const ResourceName = styled.div`
  font-size: 0.845rem;
  font-weight: 700;
  color: var(--ink-0);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ResourceMeta = styled.div`
  font-size: 0.7rem;
  color: var(--ink-3);
  margin-top: 2px;
  font-weight: 500;
`;

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
export const TimelineWrapper = styled.div`
  position: relative;
`;

export const TimelineHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(24, 60px);
  border-bottom: 2px solid var(--border-0);
  background: var(--bg-2);
  height: 54px;
  position: sticky;
  top: 0;
  z-index: 5;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--ink-3);
    border-right: 1px solid var(--border-1);
    gap: 1px;

    .period {
      font-size: 0.6rem;
      font-weight: 400;
      color: var(--ink-3);
      opacity: 0.7;
    }
  }
`;

export const TimelineRowsContainer = styled.div`
  position: relative;
`;

export const CurrentTimeIndicator = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${props => props.position}px;
  width: 2px;
  background: linear-gradient(to bottom, var(--danger), rgba(220,38,38,0.2));
  z-index: 8;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--danger);
    box-shadow: 0 0 0 2px var(--bg-1), 0 0 0 4px rgba(220,38,38,0.25);
  }
`;

export const TimelineRow = styled.div`
  display: block;
  height: 68px;
  border-bottom: 1px solid var(--border-1);
  position: relative;
  background: ${props => props.isEven ? 'var(--bg-2)' : 'var(--bg-1)'};
`;

// ─── TASK BAR ─────────────────────────────────────────────────────────────────
export const TaskBar = styled.div.attrs(props => ({
  style: {
    left: `${props.start * 60}px`,
    width: `${Math.max(props.duration * 60, 54)}px`,
  },
}))`
  position: absolute;
  top: 9px;
  height: calc(100% - 18px);
  border-radius: 8px;
  padding: 0 9px;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: grab;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 6px;

  background: ${props => STATUS_MAP[props.status]?.gradient || 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};

  color: #fff;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 6px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.18);
  z-index: 5;
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${props => STATUS_MAP[props.status]?.dot || '#93c5fd'};
    flex-shrink: 0;
    opacity: 0.85;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.18);
  }

  &:active {
    cursor: grabbing;
    box-shadow: 0 8px 22px rgba(0,0,0,0.25);
    z-index: 10;
  }
`;

// ─── MODAL ────────────────────────────────────────────────────────────────────
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ovFadeIn 0.15s ease;

  @keyframes ovFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

export const ModalContent = styled.div`
  background: var(--bg-1);
  border-radius: var(--radius-3);
  box-shadow: 0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08);
  width: 90%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  animation: mcSlideUp 0.2s ease;

  @keyframes mcSlideUp {
    from { opacity: 0; transform: translateY(18px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

export const ModalHeader = styled.div`
  padding: 24px 26px 20px;
  border-bottom: 1px solid var(--border-1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ModalTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ModalCaso = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--ink-0);
  letter-spacing: -0.3px;
`;

export const ModalSubtitle = styled.div`
  font-size: 0.8rem;
  color: var(--ink-2);
  font-weight: 500;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.73rem;
  font-weight: 700;
  background: ${props => props.bg || '#dbeafe'};
  color: ${props => props.color || 'var(--accent-0)'};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.7;
  }
`;

export const CloseButton = styled.button`
  background: var(--bg-2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  color: var(--ink-2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;

  &:hover { background: var(--border-0); color: var(--ink-0); }
`;

export const ModalBody = styled.div`
  padding: 20px 26px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 0.68rem;
    color: var(--ink-3);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  span {
    font-size: 0.875rem;
    color: var(--ink-0);
    font-weight: 500;
    word-break: break-word;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 26px 24px;
  border-top: 1px solid var(--border-1);
`;

export const RescheduleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="date"] {
    padding: 8px 11px;
    border-radius: var(--radius-1);
    border: 1px solid var(--border-0);
    font-size: 0.85rem;
    color: var(--ink-0);
    background: var(--bg-2);
    outline: none;

    &:focus {
      border-color: var(--brand);
      box-shadow: 0 0 0 3px rgba(168,55,44,0.1);
    }
  }
`;

export const PrimaryButton = styled.button`
  padding: 9px 18px;
  border: none;
  border-radius: var(--radius-1);
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(168,55,44,0.4);
  }

  &:disabled {
    background: var(--border-0);
    color: var(--ink-3);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const DeleteButton = styled.button`
  padding: 9px 18px;
  border: 1px solid var(--danger-bg);
  border-radius: var(--radius-1);
  background: #fff5f5;
  color: #b91c1c;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #b91c1c;
    border-color: #b91c1c;
    color: #fff;
  }
`;
