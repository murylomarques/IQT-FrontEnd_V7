import styled, { css } from 'styled-components';

export const DashboardContainer = styled.main`
  background: var(--bg-0);
  min-height: 100vh;
  color: var(--ink-0);
  font-family: 'Manrope', system-ui, sans-serif;
  padding: 28px 32px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Header = styled.header`
  margin-bottom: 24px;
`;

export const WelcomeHeader = styled.div`
  h1 { margin: 0; font-size: 1.9rem; font-weight: 800; }
  p { margin: 6px 0 0; color: var(--ink-2); font-size: 1rem; }
`;

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

export const TableSection = styled.section`
  margin-top: 26px;
  background-color: var(--bg-1);
  border-radius: var(--radius-2);
  padding: 22px;
  border: 1px solid var(--border-0);
  box-shadow: var(--shadow-1);
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  h2 { margin: 0; font-size: 1.25rem; font-weight: 800; }
`;

export const ActionButton = styled.button`
  background-image: linear-gradient(120deg, var(--accent-0), var(--accent-1));
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.12s ease, box-shadow 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(29, 78, 216, 0.2);
  }
`;

export const TableActionButton = styled.button`
  background-color: var(--accent-1);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.12s ease, opacity 0.12s ease;

  &:hover:not(:disabled) { transform: translateY(-1px); }
  &:disabled { background-color: #94a3b8; cursor: not-allowed; opacity: 0.7; }
`;

export const FilterSelect = styled.select`
  background-color: #fff;
  color: var(--ink-1);
  border: 1px solid var(--border-0);
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover, &:focus {
    outline: none;
    border-color: var(--accent-1);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
`;

export const Thead = styled.thead`
  background-color: #f8fafc;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid var(--border-0);
  &:last-of-type { border-bottom: none; }

  ${Tbody} &:hover {
    background-color: rgba(15, 23, 42, 0.03);
  }
`;

export const Th = styled.th`
  padding: 14px;
  text-align: left;
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Td = styled.td`
  padding: 14px;
  font-size: 0.92rem;
  color: var(--ink-1);
  vertical-align: middle;

  ${({ isActionCell }) =>
    isActionCell &&
    css`
      text-align: right;
    `}
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  text-align: center;
  border: 1px dashed var(--border-0);
  border-radius: 12px;

  h3 { margin: 16px 0 8px; font-size: 1.05rem; }
  p { margin: 0; color: var(--ink-2); max-width: 420px; }
`;

export const IconWrapper = styled.div`
  font-size: 2.4rem;
  color: var(--accent-0);
`;
