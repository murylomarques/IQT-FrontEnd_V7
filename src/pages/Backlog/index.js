// Backlog.jsx
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu';
import { FiUser, FiBriefcase, FiMap, FiFileText, FiCalendar, FiCheckSquare, FiEye, FiAlertCircle, FiBell, FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import { 
  KpiGrid, KpiCard, FiltersContainer, FilterField,
  TableContainer, StyledTable, SkeletonText,
  StatusTag, ActionButtons,
  NotificationBell, NotificationBadge
} from './styles';

const KpiSkeleton = () => ( <KpiCard><SkeletonText width="60%" style={{ marginBottom: '16px' }} /><SkeletonText width="30%" height="28px" /></KpiCard> );
const TableSkeleton = () => ( <tbody>{[...Array(5)].map((_, index) => (<tr key={index}>{[...Array(12)].map((__, i) => (<td key={i}><SkeletonText /></td>))}</tr>))}</tbody> );
const Kpi = ({ title, value }) => ( <KpiCard><h3>{title}</h3><p>{value}</p></KpiCard> );

const Backlog = () => {
  const { user, logout, apiFetch } = useAuth();
  const navigate = useNavigate();

  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [kpiData, setKpiData] = useState({});
  
  const [filters, setFilters] = useState({
    tecnico: '',
    empresa: 'Todas',
    regional: 'Todas',
    sa: '',
    dataLaudo: '',
    status: 'Todos',
  });

  const [empresaOptions, setEmpresaOptions] = useState([]);

  useEffect(() => {
    const fetchBacklogData = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch('/api/vistorias/backlog');
        setTableData(response.tableData || []);
        setKpiData(response.kpiData || {});

        // popular opções de empresas dinamicamente
        const empresas = Array.from(new Set((response.tableData || []).map(r => r.empresa))).sort();
        setEmpresaOptions(['Todas', ...empresas]);
      } catch (error) {
        toast.error("Não foi possível carregar os dados do backlog.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBacklogData();
  }, [apiFetch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  
  const handleBellClick = () => {
    const newStatus = filters.status === 'Reprovado' ? 'Todos' : 'Reprovado';
    setFilters(prevFilters => ({
      ...prevFilters,
      status: newStatus,
    }));
    // manter select sincronizado (opcional se estiver usando controlled select)
    const sel = document.querySelector('select[name="status"]');
    if (sel) sel.value = newStatus;
  };

  // LÓGICA DE FILTRO
  const filteredData = useMemo(() => {
    return tableData.filter(row => {
      // Ajuste para exibir status real: se "Em Execução" e reprovada -> "Reprovado"
      // (não altera o objeto original, só a exibição)
      // lógica de status para filtragem:
      const displayStatus = (row.statusLaudo === 'Em Execução' && row.reprovada) ? 'Reprovado' : row.statusLaudo;

      // condição de status
      const statusMatch = () => {
        if (filters.status === 'Todos') return true;
        if (filters.status === 'Reprovado') return !!row.reprovada;
        return displayStatus === filters.status;
      };

      // outras condições
      const dataMatch = filters.dataLaudo ? row.data === filters.dataLaudo : true;
      const saMatch = filters.sa ? (row.protocolo || '').toLowerCase().includes(filters.sa.toLowerCase()) : true;
      const empresaMatch = filters.empresa !== 'Todas' ? row.empresa === filters.empresa : true;
      const tecnicoMatch = filters.tecnico ? ((row.fiscal || '').toLowerCase().includes(filters.tecnico.toLowerCase())) : true;
      const regionalMatch = filters.regional !== 'Todas' ? row.regional === filters.regional : true;

      return dataMatch && saMatch && empresaMatch && statusMatch() && tecnicoMatch && regionalMatch;
    });
  }, [tableData, filters]);

  const reprovadosCount = useMemo(() => {
    return tableData.filter(item => item.reprovada).length;
  }, [tableData]);

  const handleResolverClick = (item) => {
    navigate(`/resolver-qualidade/${item.id}`, { state: { sa: item.protocolo } });
  };

  // opções de regional dinâmicas (se quiser)
  const regionalOptions = useMemo(() => {
    const regs = Array.from(new Set(tableData.map(r => r.regional))).sort();
    return ['Todas', ...regs];
  }, [tableData]);

  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>Gerenciamento de Backlog</HeaderTitle>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {reprovadosCount > 0 && (
              <NotificationBell 
                onClick={handleBellClick}
                title={filters.status === 'Reprovado' ? "Limpar filtro de reprovados" : `Filtrar por ${reprovadosCount} laudo(s) reprovado(s)`}
              >
                <FiBell />
                <NotificationBadge>{reprovadosCount}</NotificationBadge>
              </NotificationBell>
            )}
            <UserProfile>
              <span>{user?.nome}</span>
              <button onClick={logout}>Sair</button>
            </UserProfile>
          </div>
        </Header>

        <KpiGrid>
          {isLoading ? <><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /></> : (
            <>
              <Kpi title="Total Backlog" value={kpiData.totalBacklog ?? '0'} />
              <Kpi title="SLA Vencido" value={kpiData.slaVencido ?? '0'} />
              <Kpi title="Concluídos" value={kpiData.concluidos ?? '0'} />
            </>
          )}
        </KpiGrid>

        <FiltersContainer>
          <FilterField>
            <label>Técnico</label><FiUser className="filter-icon" />
            <input type="text" name="tecnico" placeholder="Nome ou matrícula" value={filters.tecnico} onChange={handleFilterChange} />
          </FilterField>

          <FilterField>
            <label>Empresa</label><FiBriefcase className="filter-icon" />
            <select name="empresa" value={filters.empresa} onChange={handleFilterChange}>
              {empresaOptions.map(emp => <option key={emp} value={emp}>{emp}</option>)}
            </select>
          </FilterField>

          <FilterField>
            <label>Territorio </label><FiMap className="filter-icon" />
            <select name="regional" value={filters.territorio} onChange={handleFilterChange}>
              {regionalOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </FilterField>

          <FilterField>
            <label>SA</label><FiFileText className="filter-icon" />
            <input type="text" name="sa" placeholder="Número da SA" value={filters.sa} onChange={handleFilterChange} />
          </FilterField>

          <FilterField>
            <label>Data Laudo</label><FiCalendar className="filter-icon" />
            <input type="date" name="dataLaudo" value={filters.dataLaudo} onChange={handleFilterChange} />
          </FilterField>

          <FilterField>
            <label>Status</label><FiAlertCircle className="filter-icon" />
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option>Todos</option>
              <option>Pendente</option>
              <option>Em Correção</option>
              <option>Em Execução</option>
              <option>Aprovado</option>
              <option>Reprovado</option>
            </select>
          </FilterField>
        </FiltersContainer>

        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th> 
                <th>Territorio</th>
                <th>Empresa</th>
                <th>ID Vistoria</th>
                <th>Supervisor</th>
                <th>Técnico</th>
                <th>SA</th>
                <th>Data Laudo</th>
                <th>Data SLA</th>
                <th>SLA</th>
                <th>Status Laudo</th>
                <th>Ações</th>
              </tr>
            </thead>
            {isLoading ? <TableSkeleton /> : (
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map(row => {
                    const displayStatus = (row.statusLaudo === 'Em Execução' && row.reprovada) ? 'Reprovado' : row.statusLaudo;
                    return (
                      <tr key={row.id} isReprovada={row.reprovada}>
                        <td>
                          {row.reprovada && (
                            <FiAlertTriangle 
                              color="#ae2e2a" 
                              title="Este laudo foi reprovado" 
                            />
                          )}
                        </td>
                        <td>{row.territorio}</td>
                        <td>{row.empresa}</td>
                        <td>{row.id}</td>
                        <td>{row.supervisor}</td>
                        <td>{row.tecnico}</td>
                        <td>{row.protocolo}</td>
                        <td>{row.data}</td>
                        <td>{row.dataSla}</td>
                        <td><StatusTag status={row.sla}>{row.sla}</StatusTag></td>
                        <td><StatusTag status={displayStatus}>{displayStatus}</StatusTag></td>
                        <td>
                          <ActionButtons>
                            <button title="Ver Detalhes"><FiEye /></button>
                            <button title="Resolver" onClick={() => handleResolverClick(row)}>
                              <FiCheckSquare />
                            </button>
                          </ActionButtons>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12" style={{ textAlign: "center", padding: "16px" }}>
                      Nenhum backlog com inconformidades encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </StyledTable>
        </TableContainer>
      </ContentArea>
    </LayoutContainer>
  );
};

export default Backlog;
