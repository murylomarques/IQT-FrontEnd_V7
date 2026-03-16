import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaListUl,
  FaPlay,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaChartLine,
} from 'react-icons/fa';

import {
  DashboardContainer, Header, WelcomeHeader, KpiGrid, TableSection,
  TableHeader, FilterGroup, FilterSelect, EmptyState, IconWrapper,
  StyledTable, Thead, Tbody, Tr, Th, Td,
} from './styles';
import DashboardCard from '../../components/DashboardCard/index'; // Reutilizando o mesmo card

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';


const DashboardCoordenador = () => {
  // --- ESTADOS ---
  const [allTasks, setAllTasks] = useState([]); // Guarda TODOS os registros da API
  const [filteredTasks, setFilteredTasks] = useState([]); // Registros para a tabela, após filtros
  const [supervisors, setSupervisors] = useState([]); // Lista de supervisores para o filtro

  // Estados dos filtros
  const [timeFilter, setTimeFilter] = useState('todos');
  const [supervisorFilter, setSupervisorFilter] = useState('todos');

  const [userName, setUserName] = useState('Carregando...');
  const navigate = useNavigate();

  // --- API ---
  const fetchRegistrosCoordenador = useCallback(async () => {
    try {
      const token = localStorage.getItem('FCA-token');
      const nome = localStorage.getItem('FCA-nome');
      if (nome) setUserName(nome);

      if (!token) {
        toast.error('Token não encontrado.');
        navigate('/login/FCA');
        return;
      }

      // Assumindo que a API retorna os dados de todos os supervisores para um coordenador logado
      const response = await axios.get(`${API_BASE_URL}/api/fca/registros/coordenador`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar registros do coordenador:', error);
      toast.error('Falha ao buscar os dados do servidor.');
    }
  }, [navigate]);

  useEffect(() => {
    fetchRegistrosCoordenador();
  }, [fetchRegistrosCoordenador]);

  // --- PROCESSAMENTO DE DADOS ---

  // Extrai a lista única de supervisores dos dados recebidos
  useEffect(() => {
    if (allTasks.length > 0) {
      // Assumindo que a API retorna um campo 'nome_supervisor'
      const supervisorNames = [...new Set(allTasks.map(task => task.nome_supervisor))];
      setSupervisors(supervisorNames.sort());
    }
  }, [allTasks]);

  // Aplica os filtros para atualizar a tabela
  useEffect(() => {
    let tasksToFilter = [...allTasks];

    // 1. Filtro por Supervisor
    if (supervisorFilter !== 'todos') {
      tasksToFilter = tasksToFilter.filter(t => t.nome_supervisor === supervisorFilter);
    }

    // 2. Filtro por Tempo (aplicado sobre o resultado anterior)
    if (timeFilter === 'mes') {
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();
      tasksToFilter = tasksToFilter.filter(t => {
        const dataInicio = new Date(t.data_inicio);
        return dataInicio.getMonth() === mesAtual && dataInicio.getFullYear() === anoAtual;
      });
    } else if (timeFilter === 'vencidos') {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      tasksToFilter = tasksToFilter.filter(
        t => t.status === 'Vencido' || (t.data_fim && new Date(t.data_fim) < hoje)
      );
    }

    setFilteredTasks(tasksToFilter);
  }, [allTasks, timeFilter, supervisorFilter]);

  // Calcula os KPIs baseados nos DADOS FILTRADOS
  const kpiData = useMemo(() => {
    return {
      total: filteredTasks.length,
      pendentes: filteredTasks.filter(t => t.status === 'Pendente').length,
      emExecucao: filteredTasks.filter(t => t.status === 'Em Execução').length,
      finalizado: filteredTasks.filter(t => t.status === 'Concluído').length,
      naoExecutado: filteredTasks.filter(t => t.status === 'Vencido').length,
    };
  }, [filteredTasks]);


  // --- RENDERIZAÇÃO ---
  return (
    <DashboardContainer>
      <Header>
        <WelcomeHeader>
          <h1>Visão do Coordenador, {userName}!</h1>
          <p>Monitore o progresso dos planos de ação de sua equipe.</p>
        </WelcomeHeader>
      </Header>

      <KpiGrid>
        <DashboardCard title="Total Filtrado" value={kpiData.total} icon={<FaListUl />} color="#8e44ad" />
        <DashboardCard title="Pendentes" value={kpiData.pendentes} icon={<FaExclamationTriangle />} color="#f39c12" />
        <DashboardCard title="Em Execução" value={kpiData.emExecucao} icon={<FaPlay />} color="#3498db" />
        <DashboardCard title="Finalizadas" value={kpiData.finalizado} icon={<FaCheckCircle />} color="#2ecc71" />
        <DashboardCard title="Não Executadas" value={kpiData.naoExecutado} icon={<FaTimesCircle />} color="#e74c3c" />
      </KpiGrid>

      <TableSection>
        <TableHeader>
          <h2>Visão Geral do Plano de Ação</h2>
          <FilterGroup>
            <FilterSelect value={supervisorFilter} onChange={(e) => setSupervisorFilter(e.target.value)}>
              <option value="todos">Todos os Supervisores</option>
              {supervisors.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </FilterSelect>
            <FilterSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
              <option value="todos">Todo o Período</option>
              <option value="mes">Este Mês</option>
              <option value="vencidos">Vencidas</option>
            </FilterSelect>
          </FilterGroup>
        </TableHeader>

        {filteredTasks.length === 0 ? (
          <EmptyState>
            <IconWrapper><FaChartLine /></IconWrapper>
            <h3>Nenhuma ação encontrada para os filtros selecionados</h3>
            <p>Tente selecionar outros filtros ou aguarde o cadastro de novas ações pela equipe.</p>
          </EmptyState>
        ) : (
          <StyledTable>
            <Thead>
              <Tr>
                <Th>Supervisor</Th>
                <Th>Nome Técnico</Th>
                <Th>Status</Th>
                <Th>Início</Th>
                <Th>Fim</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredTasks.map((task) => (
                <Tr key={task.id}>
                  <Td>{task.nome_supervisor || 'N/A'}</Td>
                  <Td>{task.nome_tecnico}</Td>
                  <Td>{task.status}</Td>
                  <Td>{new Date(task.data_inicio).toLocaleDateString()}</Td>
                  <Td>{task.data_fim ? new Date(task.data_fim).toLocaleDateString() : '-'}</Td>
                </Tr>
              ))}
            </Tbody>
          </StyledTable>
        )}
      </TableSection>
    </DashboardContainer>
  );
};

export default DashboardCoordenador;
