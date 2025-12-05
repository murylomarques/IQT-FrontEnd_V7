import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaUsers, 
  FaUserShield, 
  FaUserTie, 
  FaPlay, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle, 
  FaListUl 
} from 'react-icons/fa';
import './styles.css';

// --- COMPONENTE DE CARD ---
function DashboardCard({ title, value, icon, color }) {
  const cardStyle = { borderLeft: `5px solid ${color}` };
  const iconStyle = { backgroundColor: `${color}20`, color: color };

  return (
    <div className="dashboard-card" style={cardStyle}>
      <div className="card-icon" style={iconStyle}>{icon}</div>
      <div className="card-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL DO DASHBOARD ---
function DashboardAdm() {
  const navigate = useNavigate();

  // --- ESTADOS GERAIS ---
  const [allTasks, setAllTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userName, setUserName] = useState('Admin');
  
  // --- ESTADOS DOS FILTROS ---
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'todos',
    supervisor: 'todos',
    userSearch: '',
  });

  // --- ESTADOS DO MODAL DE EDIÇÃO ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newCargo, setNewCargo] = useState('');

  // --- BUSCA DE DADOS DA API ---
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('FCA-token');
      if (!token) {
        toast.error('Token não encontrado. Faça login novamente.');
        navigate('/');
        return;
      }
      
      const headers = { Authorization: token };
      const nome = localStorage.getItem('FCA-nome');
      if (nome) setUserName(nome);

      const [tasksResponse, usersResponse] = await Promise.all([
        axios.get('https://iqt.desktop.com.br/api/api/fca/registros/all', { headers }),
        axios.get('https://iqt.desktop.com.br/api/api/fca/users', { headers }),
      ]);
      
      setAllTasks(tasksResponse.data);
      setAllUsers(usersResponse.data);

    } catch (error) {
      console.error("Erro ao buscar dados do administrador:", error);
      toast.error('Falha ao carregar dados. Verifique suas permissões de administrador.');
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- PROCESSAMENTO DE DADOS (MEMOIZADO PARA PERFORMANCE) ---
  const supervisors = useMemo(() => {
    const supervisorNames = [...new Set(allTasks.map(task => task.nome_supervisor).filter(Boolean))];
    return supervisorNames.sort();
  }, [allTasks]);

  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      const taskDate = new Date(task.data_inicio);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      if (startDate && taskDate < startDate) return false;
      if (endDate && taskDate > endDate) return false;
      if (filters.status !== 'todos' && task.status !== filters.status) return false;
      if (filters.supervisor !== 'todos' && task.nome_supervisor !== filters.supervisor) return false;
      
      return true;
    });
  }, [allTasks, filters]);

  const filteredUsers = useMemo(() => {
    if (!filters.userSearch) return allUsers;
    const searchLower = filters.userSearch.toLowerCase();
    return allUsers.filter(user => 
      user.nome.toLowerCase().includes(searchLower) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      user.cargo.toLowerCase().includes(searchLower)
    );
  }, [allUsers, filters.userSearch]);

  const taskStats = useMemo(() => ({
    total: filteredTasks.length,
    pendentes: filteredTasks.filter(t => t.status === 'Pendente').length,
    emExecucao: filteredTasks.filter(t => t.status === 'Em Execução').length,
    finalizado: filteredTasks.filter(t => t.status === 'Concluído').length,
    naoExecutado: filteredTasks.filter(t => t.status === 'Vencido').length,
  }), [filteredTasks]);

  const userStats = useMemo(() => ({
    total: allUsers.length,
    admins: allUsers.filter(u => u.cargo === 'Administrador').length,
    coordinators: allUsers.filter(u => u.cargo === 'coordenador').length,
    supervisors: allUsers.filter(u => u.cargo === 'supervisor').length,
  }), [allUsers]);

  // --- FUNÇÕES DE MANIPULAÇÃO DE EVENTOS ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setNewEmail(user.email);
    setNewCargo(user.cargo);
    setNewPassword('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    const payload = {};
    if (newEmail && newEmail !== editingUser.email) payload.email = newEmail;
    if (newCargo && newCargo !== editingUser.cargo) payload.cargo = newCargo;
    if (newPassword) payload.password = newPassword;

    if (Object.keys(payload).length === 0) {
      toast.info("Nenhuma alteração foi feita.");
      closeModal();
      return;
    }

    try {
      const token = localStorage.getItem('FCA-token');
      const response = await axios.put(
        `https://iqt.desktop.com.br/api/api/fca/users/${editingUser.id}`,
        payload,
        { headers: { Authorization: token } }
      );

      setAllUsers(prevUsers => prevUsers.map(u => 
        u.id === editingUser.id ? { ...u, ...response.data.user } : u
      ));

      toast.success(`Usuário ${editingUser.nome} atualizado com sucesso!`);
      closeModal();

    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      const errorMessage = error.response?.data?.errors?.email?.[0] || error.response?.data?.message || 'Falha ao atualizar usuário.';
      toast.error(errorMessage);
    }
  };

  // --- NOVO: FUNÇÕES DE EXPORTAÇÃO ---

  // Função auxiliar para baixar o conteúdo CSV
  const downloadCSV = (csvContent, fileName) => {
    // BOM para garantir a codificação UTF-8 correta no Excel
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para exportar dados dos usuários
  const exportUsersToCSV = useCallback(() => {
    if (filteredUsers.length === 0) {
      toast.warn("Nenhum usuário para exportar.");
      return;
    }
    
    // Cabeçalhos do CSV
    const headers = ['Nome', 'Email', 'Usuário', 'Cargo'];
    
    // Mapeia os dados para as linhas do CSV
    const rows = filteredUsers.map(user => 
      [
        `"${user.nome || ''}"`,
        `"${user.email || ''}"`,
        `"${user.usuario || ''}"`,
        `"${user.cargo || ''}"`
      ].join(',')
    );
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadCSV(csvContent, 'extracao_usuarios.csv');

  }, [filteredUsers]);

  // Função para exportar dados dos registros
  const exportRecordsToCSV = useCallback(() => {
    if (filteredTasks.length === 0) {
        toast.warn("Nenhum registro para exportar com os filtros atuais.");
        return;
    }

    // Cabeçalhos do CSV
    const headers = ['Nome Supervisor', 'Nome Técnico', 'Status', 'Data Início', 'Data Fim'];

    // Mapeia os dados para as linhas do CSV
    const rows = filteredTasks.map(task => {
      const startDate = new Date(task.data_inicio).toLocaleDateString();
      const endDate = task.data_fim ? new Date(task.data_fim).toLocaleDateString() : 'N/A';
      return [
        `"${task.nome_supervisor || ''}"`,
        `"${task.nome_tecnico || ''}"`,
        `"${task.status || ''}"`,
        `"${startDate}"`,
        `"${endDate}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadCSV(csvContent, 'extracao_registros.csv');

  }, [filteredTasks]);


  // --- RENDERIZAÇÃO DO COMPONENTE ---
  return (
    <main className="dashboard-adm-page">
      <div className="page-header">
        <h1>Painel do Administrador</h1>
        <p>Visão geral do sistema, relatórios e gerenciamento de usuários, {userName}.</p>
      </div>

      <div className="dashboard-filters">
        <div className="filter-group">
          <label htmlFor="startDate">Data de Início (Tarefas)</label>
          <input type="date" id="startDate" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
        </div>
        <div className="filter-group">
          <label htmlFor="endDate">Data de Fim (Tarefas)</label>
          <input type="date" id="endDate" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
        </div>
        <div className="filter-group">
          <label htmlFor="status">Status da Tarefa</label>
          <select id="status" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="todos">Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Execução">Em Execução</option>
            <option value="Concluído">Concluído</option>
            <option value="Vencido">Vencido</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="supervisor">Supervisor</label>
          <select id="supervisor" name="supervisor" value={filters.supervisor} onChange={handleFilterChange}>
            <option value="todos">Todos</option>
            {supervisors.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
      </div>

      <h2 className="section-title">Visão Geral Dinâmica</h2>
      <div className="kpi-grid">
        <DashboardCard title="Total de Tarefas (Filtrado)" value={taskStats.total} icon={<FaListUl />} color="#1abc9c" />
        <DashboardCard title="Pendentes" value={taskStats.pendentes} icon={<FaExclamationTriangle />} color="#f39c12" />
        <DashboardCard title="Em Execução" value={taskStats.emExecucao} icon={<FaPlay />} color="#3498db" />
        <DashboardCard title="Finalizadas" value={taskStats.finalizado} icon={<FaCheckCircle />} color="#2ecc71" />
        <DashboardCard title="Não Executadas" value={taskStats.naoExecutado} icon={<FaTimesCircle />} color="#e74c3c" />
      </div>
      <div className="kpi-grid" style={{marginTop: '25px'}}>
        <DashboardCard title="Total de Usuários" value={userStats.total} icon={<FaUsers />} color="#8e44ad" />
        <DashboardCard title="Administradores" value={userStats.admins} icon={<FaUserShield />} color="#e67e22" />
        <DashboardCard title="Coordenadores" value={userStats.coordinators} icon={<FaUserTie />} color="#34495e" />
        <DashboardCard title="Supervisores" value={userStats.supervisors} icon={<FaUserTie />} color="#95a5a6" />
      </div>

      <div className="table-section">
        <div className="table-header">
          <h2>Plano de Ação (Geral)</h2>
          {/* NOVO: Botão de exportar registros */}
          <button className="export-button" onClick={exportRecordsToCSV}>
            Exportar Registros (CSV)
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Supervisor</th><th>Técnico</th><th>Status</th><th>Responsável</th><th>Início</th><th>Fim</th></tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <tr key={task.id}>
                  <td>{task.nome_supervisor}</td><td>{task.nome_tecnico}</td><td>{task.status}</td><td>{task.responsavel}</td>
                  <td>{new Date(task.data_inicio).toLocaleDateString()}</td><td>{task.data_fim ? new Date(task.data_fim).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="empty-state">Nenhuma tarefa encontrada para os filtros selecionados.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-section">
        <div className="table-header">
          <h2>Gerenciamento de Usuários</h2>
          {/* NOVO: Botão de exportar usuários */}
          <button className="export-button" onClick={exportUsersToCSV}>
            Exportar Usuários (CSV)
          </button>
          <div className="filter-group table-search">
            <input type="search" name="userSearch" placeholder="Buscar por nome, email, cargo..." value={filters.userSearch} onChange={handleFilterChange} />
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Nome</th><th>Email</th><th>Usuário</th><th>Cargo</th><th>Data de Criação</th><th className="actions-cell">Ações</th></tr>
          </thead>
          <tbody>
          {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.nome}</td><td>{user.email || 'N/A'}</td><td>{user.usuario}</td><td>{user.cargo}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="action-button" onClick={() => openEditModal(user)}>Editar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="empty-state">Nenhum usuário encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Usuário: {editingUser?.nome}</h2>
            
            <div className="filter-group">
              <label htmlFor="newEmail">Novo Email</label>
              <input type="email" id="newEmail" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            </div>

            <div className="filter-group" style={{marginTop: '15px'}}>
              <label htmlFor="newCargo">Novo Cargo</label>
              <input type="text" id="newCargo" value={newCargo} onChange={(e) => setNewCargo(e.target.value)} />
            </div>

            <div className="filter-group" style={{marginTop: '15px'}}>
              <label htmlFor="newPassword">Nova Senha (deixe em branco para não alterar)</label>
              <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="******" />
            </div>

            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={closeModal}>Cancelar</button>
              <button className="modal-btn-save" onClick={handleUpdateUser}>Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default DashboardAdm;