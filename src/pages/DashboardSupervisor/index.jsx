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
  FaPlus,
  FaSyncAlt,
} from 'react-icons/fa';

// Importando todos os componentes de estilo do arquivo styles.js
import {
  DashboardContainer,
  Header,
  WelcomeHeader,
  KpiGrid,
  TableSection,
  TableHeader,
  HeaderActions,
  ActionButton,
  FilterSelect,
  EmptyState,
  IconWrapper,
  StyledTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableActionButton,
} from './styles';

// Importando o componente de card reutilizável
import DashboardCard from '../../components/DashboardCard/index';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';


const DashboardSupervisor = () => {
  // --- ESTADOS DO COMPONENTE ---
  const [tasks, setTasks] = useState([]); // Armazena TODOS os registros da API
  const [tableTasks, setTableTasks] = useState([]); // Armazena os registros filtrados para a tabela
  const [timeFilter, setTimeFilter] = useState('todos'); // Estado do filtro de tempo
  const [userName, setUserName] = useState('Carregando...'); // Nome do usuário logado
  const navigate = useNavigate(); // Hook para navegação programática

  // --- FUNÇÃO PARA BUSCAR DADOS (reutilizável com useCallback) ---
  const fetchRegistros = useCallback(async () => {
    try {
      const token = localStorage.getItem('FCA-token');
      const nome = localStorage.getItem('FCA-nome');
      if (nome) setUserName(nome);

      if (!token) {
        toast.error('Token não encontrado. Faça login novamente.');
        navigate('/login/FCA'); // Redireciona para o login FCA se não houver token
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/fca/registros`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      toast.error('Falha ao buscar os dados do servidor.');
    }
  }, [navigate]); // navigate é uma dependência estável

  // --- EFEITOS (LIFECYCLE) ---

  // Efeito para buscar os dados da API quando o componente é montado
  useEffect(() => {
    fetchRegistros();
  }, [fetchRegistros]); // O array de dependência garante que o fetch ocorra na montagem

  // Efeito para filtrar os dados da tabela sempre que o filtro ou os dados principais mudarem
  useEffect(() => {
    let filtered = tasks.filter((t) => t.realizado === 1 || t.realizado === true);

    if (timeFilter === 'mes') {
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();
      filtered = filtered.filter((t) => {
        const dataInicio = new Date(t.data_inicio);
        return dataInicio.getMonth() === mesAtual && dataInicio.getFullYear() === anoAtual;
      });
    } else if (timeFilter === 'vencidos') {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data
      filtered = filtered.filter(
        (t) => t.status === 'Vencido' || (t.data_fim && new Date(t.data_fim) < hoje)
      );
    }

    setTableTasks(filtered);
  }, [timeFilter, tasks]);

  // --- DADOS MEMORIZADOS ---

  // Calcula os KPIs de forma otimizada, apenas quando a lista de 'tasks' muda
  const kpiData = useMemo(() => {
    return {
      total: tasks.length,
      pendentes: tasks.filter((t) => t.status === 'Pendente').length,
      emExecucao: tasks.filter((t) => t.status === 'Em Execução').length,
      finalizado: tasks.filter((t) => t.status === 'Concluído').length,
      naoExecutado: tasks.filter((t) => t.status === 'Vencido').length,
    };
  }, [tasks]);

  // --- FUNÇÕES DE MANIPULAÇÃO DE EVENTOS ---

  // Navega para a página de inserção de FCA
  const handleNavigateToInsert = () => {
    navigate('/dashboard/inserir-fca');
  };

  // Altera o status de uma tarefa
  const handleChangeStatus = async (taskId) => {
    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (!taskToUpdate) return;

    // Define a ordem de progressão dos status
    const statusCycle = {
      'Pendente': 'Em Execução',
      'Em Execução': 'Concluído',
    };
    const nextStatus = statusCycle[taskToUpdate.status];

    // Se não houver próximo status, a ação não pode progredir
    if (!nextStatus) {
      toast.info('Esta ação já foi concluída ou vencida e não pode ser avançada.');
      return;
    }

    try {
      const token = localStorage.getItem('FCA-token');
      // Rota para atualizar um registro específico
      await axios.put(
        `${API_BASE_URL}/api/fca/registros/${taskId}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualiza o estado local para refletir a mudança imediatamente (Atualização Otimista)
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: nextStatus } : task
        )
      );

      toast.success(`Ação #${taskId} atualizada para "${nextStatus}"!`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Não foi possível atualizar o status da ação.');
    }
  };

  // --- RENDERIZAÇÃO DO COMPONENTE ---
  return (
    <DashboardContainer>
      <Header>
        <WelcomeHeader>
          <h1>Bem-vindo de volta, {userName}!</h1>
          <p>Aqui está o resumo dos planos de ação de hoje.</p>
        </WelcomeHeader>
      </Header>

      <KpiGrid>
        <DashboardCard title="Total de Ações" value={kpiData.total} icon={<FaListUl />} color="#8e44ad" />
        <DashboardCard title="Pendentes" value={kpiData.pendentes} icon={<FaExclamationTriangle />} color="#f39c12" />
        <DashboardCard title="Em Execução" value={kpiData.emExecucao} icon={<FaPlay />} color="#3498db" />
        <DashboardCard title="Finalizadas" value={kpiData.finalizado} icon={<FaCheckCircle />} color="#2ecc71" />
        <DashboardCard title="Não Executadas" value={kpiData.naoExecutado} icon={<FaTimesCircle />} color="#e74c3c" />
      </KpiGrid>

      <TableSection>
        <TableHeader>
          <HeaderActions>
            <h2>Plano de Ação Detalhado</h2>
            <ActionButton onClick={handleNavigateToInsert}>
              <FaPlus />
              Inserir FCA
            </ActionButton>
          </HeaderActions>
          
          <FilterSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <option value="todos">Mostrar Todos</option>
            <option value="mes">Ações do Mês</option>
            <option value="vencidos">Ações Vencidas</option>
          </FilterSelect>
        </TableHeader>

        {tableTasks.length === 0 ? (
          <EmptyState>
            <IconWrapper>
              <FaChartLine />
            </IconWrapper>
            <h3>Nenhuma ação encontrada para este filtro</h3>
            <p>Os dados do plano de ação aparecerão aqui assim que forem cadastrados ou o filtro for alterado.</p>
          </EmptyState>
        ) : (
          <StyledTable>
            <Thead>
              <Tr>
                <Th>Nome Técnico</Th>
                <Th>Status</Th>
                <Th>Responsável</Th>
                <Th>Início</Th>
                <Th>Fim</Th>
                <Th style={{ textAlign: 'right' }}>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tableTasks.map((task) => (
                <Tr key={task.id}>
                  <Td>{task.nome_tecnico}</Td>
                  <Td>{task.status}</Td>
                  <Td>{task.responsavel || 'Não atribuído'}</Td>
                  <Td>{new Date(task.data_inicio).toLocaleDateString()}</Td>
                  <Td>{task.data_fim ? new Date(task.data_fim).toLocaleDateString() : '-'}</Td>
                  <Td isActionCell>
                    <TableActionButton
                      onClick={() => handleChangeStatus(task.id)}
                      disabled={task.status === 'Concluído' || task.status === 'Vencido'}
                    >
                      <FaSyncAlt size={12} />
                      Avançar Status
                    </TableActionButton>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </StyledTable>
        )}
      </TableSection>
    </DashboardContainer>
  );
};

export default DashboardSupervisor;
