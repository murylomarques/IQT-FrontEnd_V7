// src/components/DashboardFilters/index.jsx
import './styles.css';

function DashboardFilters({ filters, onFilterChange, supervisors }) {
  const handleInputChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
  };

  return (
    <div className="filters-bar">
      {/* MUDANÇA: Troca dos inputs de data por um de mês */}
      <div className="filter-group">
        <label>Filtrar por Mês</label>
        <input
          type="month"
          name="month" // O nome do filtro agora é 'month'
          value={filters.month}
          onChange={handleInputChange}
        />
      </div>
      <div className="filter-group">
        <label>Status</label>
        <select name="status" value={filters.status} onChange={handleInputChange}>
          <option value="todos">Todos</option>
          <option value="Pendente">Pendente</option>
          <option value="Em Execução">Em Execução</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Não Executado">Não Executado</option>
          <option value="Vencido">Vencido</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Supervisor</label>
        <select name="supervisor" value={filters.supervisor} onChange={handleInputChange}>
          {supervisors.map(s => (
            <option key={s} value={s}>{s === 'todos' ? 'Todos' : s}</option>
          ))}
        </select>
      </div>
      <div className="filter-group user-search">
        <label>Buscar Usuário</label>
        <input
          type="text"
          name="userSearch"
          placeholder="Nome ou email..."
          value={filters.userSearch}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}

export default DashboardFilters;