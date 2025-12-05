import styled from 'styled-components';

// --- LAYOUT PRINCIPAL ---
export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f4f7fa; // Adicionado para consistência de fundo
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
  font-size: 1.8rem;
  font-weight: 700;
  color: #35302d;
  letter-spacing: -0.5px;
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  color: #35302d;

  button {
    background: transparent;
    border: none;
    color: #ae2e2a;
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
  background-color: #ffffff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  grid-area: ${({ area }) => area};
  display: flex;
  flex-direction: column;
`;

export const KpiCard = styled(Card)`
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

export const StatChange = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ type }) => (type === 'positive' ? '#28a745' : '#ae2e2a')};
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
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  border-radius: 16px; 
  z-index: 10;
  backdrop-filter: blur(2px);

  svg {
    font-size: 2.5rem;
    color: #f4ba44;
  }

  p {
    font-weight: 600;
    color: #531110;
  }
`;


