import styled from 'styled-components';

export const KpiGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  margin-bottom: 32px;
`;

export const KpiCard = styled.div`
  background-color: var(--bg-1);
  padding: 24px;
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 0.9rem;
    color: var(--brand-dark);
    margin: 0 0 8px 0;
    font-weight: 500;
  }
  p {
    font-size: 2rem;
    font-weight: 700;
    color: var(--ink-0);
    margin: 0;
  }
`;

export const FiltersContainer = styled.div`
  background-color: var(--bg-1);
  border-radius: var(--radius-2);
  padding: 24px;
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

export const FilterField = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--brand-dark);
  }

  input, select {
    box-sizing: border-box;
    width: 100%;
    padding: 12px 16px;
    padding-left: 40px;
    border-radius: 8px;
    border: 1px solid var(--border-0);
    background-color: var(--bg-2);
    font-size: 0.9rem;
    color: var(--ink-0);
    &:focus {
      outline: none;
      border-color: var(--brand-light);
      box-shadow: 0 0 0 2px rgba(168, 55, 44, 0.15);
    }
  }

  .filter-icon {
    position: absolute;
    left: 12px;
    top: 38px;
    color: var(--brand);
  }
`;

export const TableContainer = styled.div`
  background-color: var(--bg-1);
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid var(--border-1);
    vertical-align: middle;
  }
  th { font-size: 0.8rem; font-weight: 600; color: var(--brand); text-transform: uppercase; }
  td { font-size: 0.9rem; color: var(--ink-0); }

  tbody tr {
    background-color: ${props => props.isReprovada ? 'rgba(220, 38, 38, 0.04)' : 'transparent'};
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${props => props.isReprovada ? 'rgba(168, 55, 44, 0.1)' : 'var(--bg-2)'};
    }
  }
`;

export const SkeletonText = styled.div`
  width: ${({ width }) => width || '90%'};
  height: ${({ height }) => height || '14px'};
  border-radius: 4px;
  background: linear-gradient(-90deg, var(--border-1) 0%, var(--bg-2) 50%, var(--border-1) 100%);
  background-size: 400% 400%;
  animation: pulse 1.2s ease-in-out infinite;

  @keyframes pulse {
    0% { background-position: 0% 0%; }
    100% { background-position: -135% 0%; }
  }
`;

export const StatusTag = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ status }) => {
    if (status === 'Aprovado') return 'var(--success)';
    if (status === 'Vencido' || status === 'Reprovado') return 'var(--danger)';
    if (status === 'Aguardando resposta') return 'var(--danger)';
    if (status === 'Respondido (em análise)' || status === 'Respondido (em analise)') return 'var(--warning)';
    if (status === 'Sem pendência' || status === 'Sem pendencia') return 'var(--success)';
    return 'var(--brand-dark)';
  }};
  background-color: ${({ status }) => {
    if (status === 'Aprovado') return 'var(--success-bg)';
    if (status === 'Vencido' || status === 'Reprovado') return 'var(--danger-bg)';
    if (status === 'Aguardando resposta') return 'var(--danger-bg)';
    if (status === 'Respondido (em análise)' || status === 'Respondido (em analise)') return 'var(--warning-bg)';
    if (status === 'Sem pendência' || status === 'Sem pendencia') return 'var(--success-bg)';
    return 'rgba(123, 31, 26, 0.08)';
  }};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--brand-dark);
    transition: color 0.2s ease;

    &:hover {
      color: var(--brand);
    }

    svg {
      font-size: 1.2rem;
    }
  }
`;

export const NotificationBell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  color: var(--brand-dark);
  font-size: 1.5rem;
  margin-right: 24px;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: var(--brand);
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -8px;
  background-color: var(--brand);
  color: #fff;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fff;
`;
