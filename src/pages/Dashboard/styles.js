import styled from 'styled-components';

// --- LAYOUT PRINCIPAL ---
export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-0); // Adicionado para consistência de fundo
`;

export const ContentArea = styled.main`
  flex: 1;
  min-width: 0; /* A MUDANÇA MAIS IMPORTANTE ESTÁ AQUI */
  padding: 32px;
  margin-left: ${({ isMenuExpanded }) => (isMenuExpanded ? '250px' : '80px')};
  transition: margin-left 0.3s ease-in-out;
  overflow-y: auto; // Garante que o scroll vertical fique só no conteúdo

  @media (max-width: 992px) {
    margin-left: 0;
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

// --- HEADER ---
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

export const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: var(--ink-0);
  letter-spacing: -0.5px;
`;

export const HeaderSubTitle = styled.p`
  margin: 6px 0 0;
  color: var(--ink-2);
  font-size: 1rem;
`;

export const HeaderMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border-0);
  background: #fff;
  color: var(--ink-1);
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: var(--accent-1);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
  }
`;

export const HeaderBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(29, 78, 216, 0.12);
  color: var(--accent-0);
  font-size: 0.8rem;
  font-weight: 800;
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  color: var(--ink-0);

  button {
    background: transparent;
    border: none;
    color: var(--accent-2);
    cursor: pointer;
    font-size: 0.9rem;
    &:hover { text-decoration: underline; }
  }
`;

// --- ESTILOS DO DASHBOARD (Mantidos como estavam) ---

export const DashboardGrid = styled.div`
   display: grid;
  gap: 24px;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: auto;
  grid-template-areas:
    "kpi1 kpi2 kpi3 kpi4 kpi5 kpi6"
    "chart1 chart1 chart1 chart2 chart2 chart2"
    "chart3 chart3 chart4 chart4 chart4 chart4"
    "chart5 chart5 chart5 chart6 chart6 chart6";

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      "kpi1 kpi2 kpi3"
      "kpi4 kpi5 kpi6"
      "chart1 chart1 chart1"
      "chart2 chart2 chart2"
      "chart3 chart3 chart3"
      "chart4 chart4 chart4";
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: "kpi1" "kpi2" "kpi3" "kpi4" "kpi5" "kpi6" "chart1" "chart2" "chart3" "chart4";
  }
`;

export const Card = styled.div`
  background-color: var(--bg-1);
  padding: 24px;
  border-radius: var(--radius-2);
  box-shadow: var(--shadow-1);
  border: 1px solid var(--border-0);
  grid-area: ${({ area }) => area};
  display: flex;
  flex-direction: column;
  transition: transform 0.12s ease, box-shadow 0.12s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const KpiCard = styled(Card)`
  h3 {
    font-size: 0.9rem;
    color: var(--ink-2);
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

export const StatChange = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ type }) => (type === 'positive' ? 'var(--success)' : 'var(--danger)')};
`;

export const ChartContainer = styled(Card)``;

export const ChartWrapper = styled.div`
  flex-grow: 1;
  position: relative;
  height: 250px;

  @media (min-width: 1200px) {
    height: 300px;
  }
`;


export const Skeleton = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(-90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%);
  background-size: 400% 400%;
  animation: pulse 1.2s ease-in-out infinite;
  
  @keyframes pulse {
    0% { background-position: 0% 0%; }
    100% { background-position: -135% 0%; }
  }
`;

// Sobreposição para o aviso "Em Desenvolvimento"
export const DevelopmentWarning = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.75);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  border-radius: var(--radius-2); 
  z-index: 10;
  backdrop-filter: blur(2px);

  svg {
    font-size: 2.5rem;
    color: var(--warning);
  }

  p {
    font-weight: 600;
    color: var(--ink-2);
  }
`;


