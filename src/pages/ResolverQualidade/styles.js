import styled from 'styled-components';

// ── Hero strip ────────────────────────────────────────────────
export const PageHero = styled.div`
  background: var(--bg-1);
  border: 1px solid var(--border-0);
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--brand);
  margin-bottom: 2px;
`;

export const HeroTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--ink-0);
  margin: 0;
`;

export const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--ink-2);
  margin-top: 2px;

  svg { color: var(--ink-3); flex-shrink: 0; }
`;

export const HeroRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

// ── Summary KPI cards ─────────────────────────────────────────
export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 14px;

  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
`;

export const SummaryCard = styled.div`
  background: var(--bg-1);
  border: 1px solid var(--border-0);
  border-left: 3px solid ${({ accent }) => accent || 'var(--brand)'};
  border-radius: var(--radius-1);
  box-shadow: var(--shadow-1);
  padding: 14px 16px;
`;

export const SummaryValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ color }) => color || 'var(--ink-0)'};
  line-height: 1;
  margin-bottom: 4px;
`;

export const SummaryLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--ink-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

// ── Progress bar ──────────────────────────────────────────────
export const ProgressSection = styled.div`
  margin-bottom: 20px;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 0.8rem;
  color: var(--ink-2);

  strong { color: var(--ink-0); font-weight: 700; }
`;

export const ProgressBar = styled.div`
  height: 6px;
  background: var(--border-0);
  border-radius: 999px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${({ width }) => width || 0}%;
  background: linear-gradient(90deg, var(--brand-dark), var(--brand-light));
  border-radius: 999px;
  transition: width 0.5s ease;
`;

// ── Detail info card ──────────────────────────────────────────
export const DetailCard = styled.div`
  background: var(--bg-1);
  border: 1px solid var(--border-0);
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
  padding: 18px 22px;
  margin-bottom: 20px;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const DetailIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(168, 55, 44, 0.08);
  color: var(--brand);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const DetailLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-3);
  margin-bottom: 2px;
`;

export const DetailValue = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--ink-0);
`;

// ── Items section ─────────────────────────────────────────────
export const ItemsSection = styled.div``;

export const ItemsSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
`;

export const ItemsSectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 800;
  color: var(--ink-0);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &::before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 14px;
    background: var(--brand);
    border-radius: 2px;
    margin-right: 10px;
    vertical-align: middle;
  }
`;

export const ItemsCount = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  background: var(--bg-2);
  color: var(--ink-2);
  padding: 3px 9px;
  border-radius: 20px;
  border: 1px solid var(--border-0);
`;

// ── Empty state ───────────────────────────────────────────────
export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  background: var(--bg-1);
  border: 1px solid var(--border-0);
  border-radius: var(--radius-2);
  color: var(--ink-3);

  svg { font-size: 36px; margin-bottom: 12px; color: var(--success); display: block; margin-inline: auto; }
  p { font-size: 0.9rem; margin: 0; }
`;

// ── Loading card ──────────────────────────────────────────────
export const LoadingCard = styled.div`
  background: var(--bg-1);
  border: 1px solid var(--border-0);
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
  padding: 32px;
  text-align: center;
  color: var(--ink-2);
  font-size: 0.9rem;
`;

// ── PDF button (styled) ───────────────────────────────────────
export const PdfButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--brand-dark), var(--brand-light));
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(168, 55, 44, 0.3);
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(168, 55, 44, 0.35);
  }

  svg { font-size: 16px; }
`;
