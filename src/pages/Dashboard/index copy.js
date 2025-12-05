import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';

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
    <h3>{title}</h3>
    <p>{value}</p>
    <StatChange type={type}>
      {type === 'positive' ? <FiArrowUp /> : <FiArrowDown />}
      {change}%
    </StatChange>
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
          <Kpi title="Tickets Resolvidos" value="6.902" change="10" type="positive" area="kpi1" />
          <Kpi title="SLA Cumprido" value="99.8%" change="1" type="positive" area="kpi2" />
          <Kpi title="Chamadas Abandonadas" value="90" change="80" type="negative" area="kpi3" />
          <Kpi title="Satisfação Cliente" value="98%" change="2" type="positive" area="kpi4" />
          <Kpi title="Técnicos Ativos" value="36" change="5" type="positive" area="kpi5" />
          <Kpi title="Outras Informações" value="90" change="5" type="negative" area="kpi6" />

          <ChartContainer area="chart1">
            <h3>Evolução da Qualidade Geral</h3>
            <ChartWrapper>
              <Line data={lineChartData} options={chartOptions} />
            </ChartWrapper>
          </ChartContainer>

          <ChartContainer area="chart2">
            <h3>Volume de Tickets</h3>
            <ChartWrapper>
              <Bar data={barChartData} options={chartOptions} />
            </ChartWrapper>
          </ChartContainer>

          <ChartContainer area="chart3"><h3>Performance por Técnico</h3></ChartContainer>
          <ChartContainer area="chart4"><h3>Mapa de Ocorrências</h3></ChartContainer>

            


        </DashboardGrid>
      </ContentArea>
    </LayoutContainer>
  );
};

export default Dashboard;