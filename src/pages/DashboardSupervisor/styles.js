import styled, { css } from 'styled-components';

// --- PALETA DE CORES CENTRALIZADA ---
const colors = {
  background: '#16161F',      // Um preto mais suave
  surface: '#1E1E28',        // Cor para os cards e seções
  primary: '#8A4FFF',        // Um roxo vibrante para destaques
  success: '#2ecc71',        // Verde para botões de ação positiva
  successHover: '#27ae60',    // Verde mais escuro para hover
  info: '#3498db',            // Azul para ações informativas/de atualização
  infoHover: '#2980b9',      // Azul mais escuro para hover
  text: '#EAEAEA',
  textSecondary: '#A0A0B0',
  border: '#333344',
};

// --- LAYOUT PRINCIPAL ---
export const DashboardContainer = styled.main`
  background-color: ${colors.background};
  min-height: 100vh;
  color: ${colors.text};
  font-family: 'Poppins', sans-serif;
  padding: 30px 40px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Header = styled.header`
  margin-bottom: 40px;
`;

export const WelcomeHeader = styled.div`
  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }
  p {
    margin: 8px 0 0;
    color: ${colors.textSecondary};
    font-size: 1.1rem;
  }
`;

// --- GRID DE KPIs ---
export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
`;

// --- SEÇÃO DA TABELA E AÇÕES ---
export const TableSection = styled.section`
  margin-top: 40px;
  background-color: ${colors.surface};
  border-radius: 12px;
  padding: 30px;
  border: 1px solid ${colors.border};
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

// --- BOTÕES ---
export const ActionButton = styled.button`
  background-color: ${colors.success};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${colors.successHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(46, 204, 113, 0.2);
  }
`;

export const TableActionButton = styled.button`
  background-color: ${colors.info};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${colors.infoHover};
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// --- FILTRO ---
export const FilterSelect = styled.select`
  background-color: #2c2c3e;
  color: ${colors.text};
  border: 1px solid ${colors.border};
  padding: 12px 18px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover, &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

// --- ESTILOS DA TABELA ---
export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

export const Thead = styled.thead`
  background-color: #2a2a38;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid ${colors.border};

  &:last-of-type {
    border-bottom: none;
  }

  ${Tbody} &:hover {
    background-color: #252530;
  }
`;

export const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Td = styled.td`
  padding: 16px;
  font-size: 0.95rem;
  color: ${colors.text};
  vertical-align: middle;

  /* Variação para células que contêm botões de ação */
  ${({ isActionCell }) =>
    isActionCell &&
    css`
      text-align: right;
    `}
`;

// --- COMPONENTE DE ESTADO VAZIO ---
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  border: 2px dashed ${colors.border};
  border-radius: 8px;

  h3 {
    margin: 20px 0 10px;
    font-size: 1.2rem;
    color: ${colors.text};
  }
  p {
    margin: 0;
    color: ${colors.textSecondary};
    max-width: 400px;
  }
`;

export const IconWrapper = styled.div`
  font-size: 3rem;
  color: ${colors.primary};
`;