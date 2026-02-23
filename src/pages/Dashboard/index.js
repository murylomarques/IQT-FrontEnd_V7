import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import DataLoader from '../../components/DataLoader';
import { FiArrowUp, FiArrowDown, FiRefreshCcw, FiTrendingUp } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

import {
  LayoutContainer,
  ContentArea,
  Header,
  HeaderTitle,
  HeaderSubTitle,
  HeaderMeta,
  HeaderActions,
  HeaderBadge,
  ActionButton,
  UserProfile,
  DashboardGrid,
  KpiCard,
  StatChange,
  ChartContainer,
  ChartWrapper,
  CardHeader,
} from './styles';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ChartTitle, Tooltip, Legend);

const barChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    { label: 'Resolvidos', data: [120, 150, 180, 165, 190, 210], backgroundColor: '#0ea5e9' },
    { label: 'Abertos', data: [130, 155, 182, 170, 195, 218], backgroundColor: '#1d4ed8' },
  ],
};

const lineChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Qualidade (%)',
      data: [92, 94, 98, 95, 96, 99],
      borderColor: '#1d4ed8',
      backgroundColor: 'rgba(29, 78, 216, 0.12)',
      fill: true,
      tension: 0.35,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
  },
};

const Kpi = ({ title, value, change, type, area }) => (
  <KpiCard area={area}>
    <DataLoader duration={800} variant="block">
      <CardHeader>
        <h3>{title}</h3>
        <HeaderBadge>
          <FiTrendingUp />
          {type === 'positive' ? '+' : '-'}{change}%
        </HeaderBadge>
      </CardHeader>
      <p>{value}</p>
      <StatChange type={type}>
        {type === 'positive' ? <FiArrowUp /> : <FiArrowDown />}
        {change}% no per?odo
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
          <HeaderMeta>
            <HeaderTitle>Dashboard de Qualidade</HeaderTitle>
            <HeaderSubTitle>Vis?o geral da opera??o, desempenho e sa?de dos laudos</HeaderSubTitle>
          </HeaderMeta>
          <HeaderActions>
            <ActionButton type="button">
              <FiRefreshCcw /> Atualizar
            </ActionButton>
            <UserProfile>
              <span>{user?.nome ?? user?.name ?? 'Usu?rio'}</span>
              <button onClick={logout}>Sair</button>
            </UserProfile>
          </HeaderActions>
        </Header>

        <DashboardGrid>
          <Kpi title="Laudos Totais" value="1.284" change={12.4} type="positive" area="kpi1" />
          <Kpi title="Pend?ncias" value="86" change={4.1} type="negative" area="kpi2" />
          <Kpi title="Conformidade" value="97,8%" change={1.2} type="positive" area="kpi3" />
          <Kpi title="Tempo M?dio" value="1h 22m" change={3.6} type="negative" area="kpi4" />
          <Kpi title="Recorr?ncias" value="14" change={2.1} type="negative" area="kpi5" />
          <Kpi title="NPS T?cnico" value="9,3" change={0.8} type="positive" area="kpi6" />

          <ChartContainer area="chart1">
            <CardHeader>
              <h3>Qualidade ao longo dos meses</h3>
              <HeaderBadge>Meta 98%</HeaderBadge>
            </CardHeader>
            <ChartWrapper>
              <Line data={lineChartData} options={chartOptions} />
            </ChartWrapper>
          </ChartContainer>

          <ChartContainer area="chart2">
            <CardHeader>
              <h3>Volume de laudos</h3>
              <HeaderBadge>?ltimos 6 meses</HeaderBadge>
            </CardHeader>
            <ChartWrapper>
              <Bar data={barChartData} options={chartOptions} />
            </ChartWrapper>
          </ChartContainer>

          <ChartContainer area="chart3">
            <DataLoader inDevelopment={true} variant="block" />
          </ChartContainer>

          <ChartContainer area="chart4">
            <DataLoader inDevelopment={true} variant="block" />
          </ChartContainer>
        </DashboardGrid>
      </ContentArea>
    </LayoutContainer>
  );
};

export default Dashboard;
