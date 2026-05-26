import styled from 'styled-components';

// ─── FILTROS ──────────────────────────────────────────────────────────────────
export const FilterPanel = styled.div`
  background: var(--bg-1);
  border-radius: var(--radius-2);
  padding: 18px 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
`;

export const FilterPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;

  span {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ink-3);
  }
`;

export const FilterGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-end;
`;

export const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 140px;
  max-width: 210px;

  label {
    font-size: 0.67rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--ink-3);
  }
`;

export const FilterFieldWide = styled(FilterField)`
  max-width: 280px;
`;

export const FilterInput = styled.input`
  padding: 9px 12px;
  border-radius: var(--radius-1);
  border: 1px solid var(--border-0);
  background: var(--bg-2);
  font-size: 0.875rem;
  color: var(--ink-0);
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;

  &::placeholder { color: var(--ink-3); }

  &:focus {
    border-color: var(--brand);
    background: var(--bg-1);
    box-shadow: 0 0 0 3px rgba(168, 55, 44, 0.08);
  }
`;

export const FilterActions = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding-bottom: 1px;
`;

export const FilterBtn = styled.button`
  padding: 9px 18px;
  border: none;
  border-radius: var(--radius-1);
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: #fff;
  font-weight: 700;
  font-size: 0.855rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(168, 55, 44, 0.35);
  }
`;

export const ClearBtn = styled.button`
  padding: 9px 14px;
  border: 1px solid var(--border-0);
  border-radius: var(--radius-1);
  background: var(--bg-1);
  color: var(--ink-2);
  font-weight: 600;
  font-size: 0.855rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.18s ease;

  &:hover {
    border-color: var(--ink-3);
    color: var(--ink-0);
    background: var(--bg-2);
  }
`;

// ─── SEÇÃO ────────────────────────────────────────────────────────────────────
export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  margin-top: 24px;

  &::before {
    content: '';
    width: 3px;
    height: 18px;
    background: var(--brand);
    border-radius: 2px;
    flex-shrink: 0;
  }

  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--ink-1);
`;

// ─── STATS ────────────────────────────────────────────────────────────────────
export const StatsContainer = styled.div`
  display: flex;
  gap: 14px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

export const StatCard = styled.div`
  flex: 1;
  min-width: 140px;
  background: var(--bg-1);
  border-radius: var(--radius-2);
  padding: 16px 20px;
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
  border-left: 4px solid ${props => props.accent || 'var(--brand)'};
`;

export const StatCardValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.color || 'var(--ink-0)'};
  line-height: 1;
`;

export const StatCardLabel = styled.div`
  font-size: 0.72rem;
  color: var(--ink-2);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 6px;
`;

// ─── FISCAIS CAROUSEL ─────────────────────────────────────────────────────────
export const FiscaisCarousel = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 10px;
  margin-bottom: 8px;

  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-track { background: var(--border-1); border-radius: 4px; }
  &::-webkit-scrollbar-thumb { background: var(--border-0); border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background: var(--ink-3); }
`;

export const FiscalCard = styled.div`
  flex: 0 0 220px;
  background: var(--bg-1);
  padding: 14px 16px;
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: box-shadow 0.15s, border-color 0.15s;

  &:hover {
    box-shadow: var(--shadow-2);
    border-color: var(--brand);
  }
`;

export const FiscalAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 9px;
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

export const FiscalInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

export const FiscalName = styled.div`
  font-size: 0.845rem;
  font-weight: 700;
  color: var(--ink-0);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 6px;
`;

export const FiscalStat = styled.div`
  display: flex;
  gap: 6px;
`;

export const FiscalBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  background: ${props => props.variant === 'hoje' ? 'var(--warning-bg)' : '#dbeafe'};
  color: ${props => props.variant === 'hoje' ? '#b45309' : '#1d4ed8'};
`;

// ─── TABELA ───────────────────────────────────────────────────────────────────
export const TableWrapper = styled.div`
  background: var(--bg-1);
  border-radius: var(--radius-2);
  border: 1px solid var(--border-0);
  box-shadow: var(--shadow-1);
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  background: var(--bg-2);
  padding: 10px 14px;
  text-align: left;
  font-size: 0.67rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--ink-3);
  border-bottom: 2px solid var(--border-0);
  white-space: nowrap;
`;

export const TableRow = styled.tr`
  transition: background 0.12s;

  &:hover { background: var(--bg-2); }
  &:last-child td { border-bottom: none; }
`;

export const TableCell = styled.td`
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-1);
  color: var(--ink-1);
  font-size: 0.855rem;
  font-weight: 500;
  max-width: ${props => props.maxWidth || 'none'};
  white-space: ${props => props.truncate ? 'nowrap' : 'normal'};
  overflow: ${props => props.truncate ? 'hidden' : 'visible'};
  text-overflow: ${props => props.truncate ? 'ellipsis' : 'clip'};
`;

export const ActionButton = styled.button`
  padding: 6px 14px;
  border: none;
  border-radius: var(--radius-1);
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: #fff;
  font-weight: 700;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(168, 55, 44, 0.35);
  }

  &:disabled {
    background: var(--border-0);
    color: var(--ink-3);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: var(--ink-3);
  font-size: 0.9rem;
  font-weight: 500;
`;

// ─── PAGINAÇÃO ────────────────────────────────────────────────────────────────
export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 4px 0;
`;

export const PageBtn = styled.button`
  padding: 7px 18px;
  border-radius: var(--radius-1);
  border: 1px solid var(--border-0);
  background: var(--bg-1);
  color: var(--ink-1);
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover:not(:disabled) {
    background: var(--brand);
    border-color: var(--brand);
    color: #fff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const PageInfo = styled.span`
  font-size: 0.82rem;
  color: var(--ink-2);
  font-weight: 600;
  min-width: 120px;
  text-align: center;
`;

// ─── LEGADO (usado por Task.js / TaskModal.js desta pasta) ────────────────────
export const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  background: var(--bg-1);
  padding: 20px;
  border-radius: var(--radius-2);
  margin-bottom: 24px;
  box-shadow: var(--shadow-1);
`;

export const PrimaryButton = styled.button`
  padding: 9px 18px;
  border: none;
  border-radius: var(--radius-1);
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: #fff;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(168, 55, 44, 0.4);
  }
`;

export const GanttContainer = styled.div`
  border: 1px solid var(--border-0);
  border-radius: var(--radius-1);
  background: var(--bg-1);
  overflow-x: auto;
`;

export const GanttGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  min-width: 1500px;
`;

export const ResourceList = styled.div`
  border-right: 1px solid var(--border-0);
`;

export const ResourceHeader = styled.div`
  padding: 16px;
  font-weight: 600;
  border-bottom: 1px solid var(--border-0);
`;

export const ResourceItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-1);
  height: 60px;
  display: flex;
  align-items: center;
`;

export const TimelineWrapper = styled.div`
  position: relative;
`;

export const TimelineHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(24, 60px);
  border-bottom: 1px solid var(--border-0);

  div {
    padding: 16px 8px;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--ink-2);
    border-right: 1px solid var(--border-1);
  }
`;

export const TimelineRow = styled.div`
  display: grid;
  grid-template-columns: repeat(24, 60px);
  height: 61px;
  border-bottom: 1px solid var(--border-1);
  position: relative;
`;

export const TaskBar = styled.div.attrs(props => ({
  style: {
    left: `${props.start * 60}px`,
    width: `${props.duration * 60}px`,
    background: 'var(--brand)',
  },
}))`
  position: absolute;
  top: 5px;
  height: calc(100% - 10px);
  border-radius: 6px;
  padding: 4px 8px;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: grab;
  user-select: none;
  color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);

  &:active { cursor: grabbing; z-index: 10; }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: var(--bg-1);
  padding: 24px;
  border-radius: var(--radius-3);
  box-shadow: 0 24px 64px rgba(0,0,0,0.18);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-1);
  padding-bottom: 16px;
  margin-bottom: 16px;

  h2 { margin: 0; color: var(--brand-dark); font-size: 1.2rem; }
  button {
    background: var(--bg-2);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    color: var(--ink-2);
    &:hover { background: var(--border-0); color: var(--ink-0); }
  }
`;

export const ModalBody = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const InfoItem = styled.div`
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
  span { font-size: 0.9rem; color: var(--ink-0); font-weight: 500; }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  border-top: 1px solid var(--border-1);
  padding-top: 16px;
`;

export const RescheduleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="date"] {
    padding: 8px 11px;
    border-radius: var(--radius-1);
    border: 1px solid var(--border-0);
    background: var(--bg-2);
    font-size: 0.875rem;
    color: var(--ink-0);
    outline: none;
    &:focus { border-color: var(--brand); }
  }
`;

export const DeleteButton = styled.button`
  padding: 9px 18px;
  border: 1px solid var(--danger-bg);
  border-radius: var(--radius-1);
  background: #fff5f5;
  color: #b91c1c;
  font-weight: 700;
  font-size: 0.855rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover { background: #b91c1c; border-color: #b91c1c; color: #fff; }
`;
