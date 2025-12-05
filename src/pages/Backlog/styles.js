import styled from 'styled-components';

// --- ESTILOS REUTILIZADOS ---

export const KpiGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  margin-bottom: 32px;
`;

export const KpiCard = styled.div`
  background-color: #ffffff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 0.9rem;
    color: #531110;
    margin: 0 0 8px 0;
    font-weight: 500;
  }
  p {
    font-size: 2rem;
    font-weight: 700;
    color: #35302d;
    margin: 0;
  }
`;

export const FiltersContainer = styled.div`
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
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
    color: #531110;
  }

  input, select {
    // --- CORREÇÃO APLICADA AQUI ---
    box-sizing: border-box; /* Garante que o padding não aumente a largura total */
    width: 100%;
    padding: 12px 16px;
    padding-left: 40px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background-color: #f9f9f9;
    font-size: 0.9rem;
    color: #35302d;
    &:focus {
      outline: none;
      border-color: #f4ba44;
      box-shadow: 0 0 0 2px rgba(244, 186, 68, 0.3);
    }
  }

  .filter-icon {
    position: absolute;
    left: 12px;
    top: 38px;
    color: #ae2e2a;
  }
`;

export const TableContainer = styled.div`
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td { 
    padding: 16px; 
    text-align: left; 
    border-bottom: 1px solid #f0f0f0; 
    vertical-align: middle;
  }
  th { font-size: 0.8rem; font-weight: 600; color: #ae2e2a; text-transform: uppercase; }
  td { font-size: 0.9rem; color: #35302d; }
  
  tbody tr {
    background-color: ${props => props.isReprovada ? '#fceeeedc' : 'transparent'};
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${props => props.isReprovada ? 'rgba(174, 46, 42, 0.2)' : '#f9f5f5'};
    }
  }
`;

export const SkeletonText = styled.div`
  width: ${({ width }) => width || '90%'};
  height: ${({ height }) => height || '14px'};
  border-radius: 4px;
  background: linear-gradient(-90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%);
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
    if (status === 'Aprovado') return '#28a745';
    if (status === 'Vencido' || status === 'Reprovado') return '#ae2e2a';
    return '#531110';
  }};
  background-color: ${({ status }) => {
    if (status === 'Aprovado') return 'rgba(40, 167, 69, 0.1)';
    if (status === 'Vencido' || status === 'Reprovado') return 'rgba(174, 46, 42, 0.1)';
    return 'rgba(83, 17, 16, 0.1)';
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
    color: #531110;
    transition: color 0.2s ease;

    &:hover {
      color: #ae2e2a;
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
  color: #531110;
  font-size: 1.5rem;
  margin-right: 24px;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #ae2e2a;
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -8px;
  background-color: #ae2e2a;
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