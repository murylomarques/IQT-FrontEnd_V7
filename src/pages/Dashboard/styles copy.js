import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const ContentArea = styled.main`
  flex: 1;
  padding: 32px;
  margin-left: ${({ isMenuExpanded }) => (isMenuExpanded ? '250px' : '80px')};
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: 992px) {
    margin-left: 0;
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

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

export const DashboardGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: auto;
  grid-template-areas:
    "kpi1 kpi2 kpi3 kpi4 kpi5 kpi6"
    "chart1 chart1 chart1 chart2 chart2 chart2"
    "chart3 chart3 chart4 chart4 chart4 chart4";

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