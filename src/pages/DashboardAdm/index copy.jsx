// src/pages/DashboardAdm/index.jsx
import { useState, useMemo } from 'react';
import { USERS } from '../../data/users';
import { TASKS } from '../../data/tasks';
import DashboardCard from '../../components/DashboardCard';
import UserTable from '../../components/UserTable';
import ActionTable from '../../components/ActionTable';
import StatusChart from '../../components/StatusChart';
import TasksBySupervisorChart from '../../components/TasksBySupervisorChart';
import DashboardFilters from '../../components/DashboardFilters'; // Importa a barra de filtros
import { FaUsers, FaUserShield, FaUserTie, FaUserCog, FaPlay, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaListUl } from 'react-icons/fa';
import './styles.css';

function DashboardAdm() {
  // Estado central para todos os filtros
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'todos',
    supervisor: 'todos',
    userSearch: '',
  });

  // Pega a lista de supervisores para o dropdown do filtro
  const supervisors = useMemo(() => {
    const supervisorSet = new Set(TASKS.map(task => task.responsavel));
    return ['todos', ...supervisorSet];
  }, []);

  // Lógica de filtragem das TAREFAS
  const filteredTasks = useMemo(() => {
    let tasks = [...TASKS];

    if (filters.startDate) {
      tasks = tasks.filter(t => new Date(t.dataInicio) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      tasks = tasks.filter(t => new Date(t.dataInicio) <= new Date(filters.endDate));
    }
    if (filters.status !== 'todos') {
      tasks = tasks.filter(t => t.status === filters.status);
    }
    if (filters.supervisor !== 'todos') {
      tasks = tasks.filter(t => t.responsavel === filters.supervisor);
    }

    return tasks;
  }, [filters]);

  // Lógica de filtragem dos USUÁRIOS
  const filteredUsers = useMemo(() => {
    if (!filters.userSearch) return USERS;
    return USERS.filter(user =>
      user.name.toLowerCase().includes(filters.userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.userSearch.toLowerCase())
    );
  }, [filters.userSearch]);

  // KPIs de tarefas agora são calculados com base nos dados JÁ FILTRADOS
  const taskStats = useMemo(() => ({
    total: filteredTasks.length,
    pendentes: filteredTasks.filter(t => t.status === 'Pendente' || t.status === 'Vencido').length,
    emExecucao: filteredTasks.filter(t => t.status === 'Em Execução').length,
    finalizado: filteredTasks.filter(t => t.status === 'Finalizado').length,
    naoExecutado: filteredTasks.filter(t => t.status === 'Não Executado').length,
  }), [filteredTasks]);

  // KPIs de usuários (são estáticos, não mudam com filtros de tarefas)
  const userStats = useMemo(() => ({
    total: USERS.length,
    admins: USERS.filter(u => u.role === 'ADM').length,
    supervisors: USERS.filter(u => u.role === 'SUPERVISOR').length,
    coordinators: USERS.filter(u => u.role === 'COORDENADOR').length
  }), []);

  // Função para atualizar o estado dos filtros
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main>
      <div className="page-header">
        <h1>Painel do Administrador</h1>
        <p>Visão geral do sistema, relatórios e gerenciamento de usuários.</p>
      </div>

      {/* A BARRA DE FILTROS VAI AQUI */}
      <DashboardFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        supervisors={supervisors}
      />

      <h2 className="section-title">Visão Geral Dinâmica</h2>
      <div className="kpi-grid">
        {/* NOVO: Card de Total de Tarefas adicionado */}
        <DashboardCard title="Total de Tarefas" value={taskStats.total} icon={<FaListUl />} color="#1abc9c" />
        <DashboardCard title="Tarefas Pendentes" value={taskStats.pendentes} icon={<FaExclamationTriangle />} color="#f39c12" />
        <DashboardCard title="Em Execução" value={taskStats.emExecucao} icon={<FaPlay />} color="#3498db" />
        <DashboardCard title="Finalizadas" value={taskStats.finalizado} icon={<FaCheckCircle />} color="#2ecc71" />
        <DashboardCard title="Não Executadas" value={taskStats.naoExecutado} icon={<FaTimesCircle />} color="#e74c3c" />
        <DashboardCard title="Total de Usuários" value={userStats.total} icon={<FaUsers />} color="#8e44ad" />
        <DashboardCard title="Administradores" value={userStats.admins} icon={<FaUserShield />} color="#e74c3c" />
        <DashboardCard title="Supervisores" value={userStats.supervisors} icon={<FaUserTie />} color="#3498db" />
        <DashboardCard title="Coordenadores" value={userStats.coordinators} icon={<FaUserCog />} color="#f1c40f" />
      </div>

      <h2 className="section-title">Relatórios Visuais (Filtro)</h2>
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Tarefas por Status</h3>
          <StatusChart data={taskStats} />
        </div>
        <div className="chart-container">
          <h3>Tarefas por Supervisor</h3>
          {/* O gráfico de barras agora recebe as tarefas já filtradas */}
          <TasksBySupervisorChart tasks={filteredTasks} />
        </div>
      </div>
      
      <div className="table-section">
        <div className="table-header">
          <h2>Plano de Ação (Geral)</h2>
        </div>
        <ActionTable tasks={filteredTasks} />
      </div>

      <div className="table-section">
        <div className="table-header">
          <h2>Gerenciamento de Usuários</h2>
        </div>
        <UserTable users={filteredUsers} />
      </div>
    </main>
  );
}

export default DashboardAdm;