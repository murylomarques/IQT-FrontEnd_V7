import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import DataLoader from '../../components/DataLoader'; // IMPORTAR O NOVO COMPONENTE
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

import {
  LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile, DashboardGrid, KpiCard, StatChange, ChartContainer, ChartWrapper
} from './styles';

ChartJS.register( CategoryScale, LinearScale, BarElement, PointElement, LineElement, ChartTitle, Tooltip, Legend );

const barChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    { label: 'Resolvidos', data: [120, 150, 180, 165, 190, 210], backgroundColor: '#f4ba44' },
    { label: 'Abertos', data: [130, 155, 182, 170, 195, 218], backgroundColor: '#531110' },
  ],
};
const lineChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [{
    label: 'Qualidade (%)', data: [92, 94, 98, 95, 96, 99],
    borderColor: '#ae2e2a', backgroundColor: 'rgba(174, 46, 42, 0.1)',
    fill: true, tension: 0.4,
  }],
};
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const Kpi = ({ title, value, change, type, area }) => (
  <KpiCard area={area}>
    <DataLoader duration={800}>
      <h3>{title}</h3>
      <p>{value}</p>
      <StatChange type={type}>
        {type === 'positive' ? <FiArrowUp /> : <FiArrowDown />}
        {change}%
      </StatChange>
    </DataLoader>
  </KpiCard>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
      
      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>Dashboard de Qualidade</HeaderTitle>
          <UserProfile>
            <span>{user?.name}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>

        <DashboardGrid>
          

          {/* NOVAS DIVS DE EXEMPLO */}
          <ChartContainer area="chart5" style={{gridArea: 'chart5'}}>
             <DataLoader inDevelopment={true} />
          </ChartContainer>
           <ChartContainer area="chart6" style={{gridArea: 'chart6'}}>
             <DataLoader inDevelopment={true} />
          </ChartContainer>

        </DashboardGrid>
      </ContentArea>
    </LayoutContainer>
  );
};

export default Dashboard;