import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu';
import { toast } from 'react-toastify';
import BacklogSkeleton from '../../components/BacklogSkeleton';

import {
  LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile,
} from '../Dashboard/styles';

import {
  FilterPanel, FilterPanelHeader, FilterGrid, FilterField, FilterFieldWide,
  FilterInput, FilterActions, FilterBtn, ClearBtn,
  SectionTitle,
  StatsContainer, StatCard, StatCardValue, StatCardLabel,
  FiscaisCarousel, FiscalCard, FiscalAvatar, FiscalInfo, FiscalName, FiscalStat, FiscalBadge,
  TableWrapper, Table, TableHeader, TableRow, TableCell, ActionButton, EmptyState,
  PaginationWrapper, PageBtn, PageInfo,
} from '../Agendamentos/styles';

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';

const FILTROS_VAZIOS = { tecnico: '', empresa: '', cto: '', sa: '', endereco: '' };

const AgendamentosManutencao = () => {
  const { user, logout, apiFetch } = useAuth();
  const navigate = useNavigate();

  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [atendimentos, setAtendimentos] = useState([]);
  const [stats, setStats] = useState({ global: {}, fiscais: [] });
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const recordsPerPage = 50;

  const fetchPage = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        per_page: String(recordsPerPage),
      });
      if (filtros.tecnico.trim()) params.set('tecnico', filtros.tecnico.trim());
      if (filtros.empresa.trim()) params.set('empresa', filtros.empresa.trim());
      if (filtros.cto.trim()) params.set('cto', filtros.cto.trim());
      if (filtros.sa.trim()) params.set('sa', filtros.sa.trim());
      if (filtros.endereco.trim()) params.set('endereco', filtros.endereco.trim());

      const response = await apiFetch(`/api/manutencao/atendimentos?${params.toString()}`);
      setAtendimentos(Array.isArray(response?.data) ? response.data : []);
      setStats(response?.stats || { global: {}, fiscais: [] });
      setTotalPages(Number(response?.last_page || 1));
      setTotalRecords(Number(response?.total || 0));
    } catch {
      toast.error('Erro ao carregar atendimentos de manutenção.');
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch, currentPage, filtros]);

  useEffect(() => { fetchPage(); }, [fetchPage]);

  const handleApplyFilters = () => {
    if (currentPage !== 1) { setCurrentPage(1); return; }
    fetchPage();
  };

  const handleClearFilters = () => {
    setFiltros(FILTROS_VAZIOS);
    setCurrentPage(1);
  };

  const handleAgendarClick = (atendimento) => {
    navigate(`/manutencao/agendamento/${atendimento.ID}`, { state: { atendimento } });
  };

  const setFiltro = (key) => (e) => setFiltros(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>Atendimentos para Agendar Manutenção</HeaderTitle>
          <UserProfile>
            <span>{user?.nome}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>

        {isLoading ? (
          <BacklogSkeleton kpis={3} filters={5} rows={6} cols={8} />
        ) : (
          <>
            <FilterPanel>
              <FilterPanelHeader>
                <span>Filtros de busca</span>
              </FilterPanelHeader>
              <FilterGrid>
                <FilterField>
                  <label>Técnico</label>
                  <FilterInput
                    type="text"
                    placeholder="Nome do técnico"
                    value={filtros.tecnico}
                    onChange={setFiltro('tecnico')}
                    onKeyDown={e => e.key === 'Enter' && handleApplyFilters()}
                  />
                </FilterField>

                <FilterField>
                  <label>Empresa</label>
                  <FilterInput
                    type="text"
                    placeholder="Nome da empresa"
                    value={filtros.empresa}
                    onChange={setFiltro('empresa')}
                    onKeyDown={e => e.key === 'Enter' && handleApplyFilters()}
                  />
                </FilterField>

                <FilterField>
                  <label>CTO</label>
                  <FilterInput
                    type="text"
                    placeholder="Código CTO"
                    value={filtros.cto}
                    onChange={setFiltro('cto')}
                    onKeyDown={e => e.key === 'Enter' && handleApplyFilters()}
                  />
                </FilterField>

                <FilterField>
                  <label>SA</label>
                  <FilterInput
                    type="text"
                    placeholder="Número SA"
                    value={filtros.sa}
                    onChange={setFiltro('sa')}
                    onKeyDown={e => e.key === 'Enter' && handleApplyFilters()}
                  />
                </FilterField>

                <FilterFieldWide>
                  <label>Endereço</label>
                  <FilterInput
                    type="text"
                    placeholder="Rua, bairro ou cidade"
                    value={filtros.endereco}
                    onChange={setFiltro('endereco')}
                    onKeyDown={e => e.key === 'Enter' && handleApplyFilters()}
                  />
                </FilterFieldWide>

                <FilterActions>
                  <FilterBtn onClick={handleApplyFilters}>Aplicar</FilterBtn>
                  <ClearBtn onClick={handleClearFilters}>Limpar</ClearBtn>
                </FilterActions>
              </FilterGrid>
            </FilterPanel>

            <SectionTitle>Resumo Geral</SectionTitle>
            <StatsContainer>
              <StatCard accent="var(--ink-2)">
                <StatCardValue>{stats.global?.total_agendamentos ?? 0}</StatCardValue>
                <StatCardLabel>Total Agendamentos</StatCardLabel>
              </StatCard>
              <StatCard accent="var(--warning)">
                <StatCardValue color="var(--warning)">{stats.global?.pendentes_hoje ?? 0}</StatCardValue>
                <StatCardLabel>Pendentes Hoje</StatCardLabel>
              </StatCard>
              <StatCard accent="var(--success)">
                <StatCardValue color="var(--success)">{stats.global?.total_concluidos ?? 0}</StatCardValue>
                <StatCardLabel>Concluídos</StatCardLabel>
              </StatCard>
            </StatsContainer>

            {(stats.fiscais || []).length > 0 && (
              <>
                <SectionTitle>Agenda por Fiscal</SectionTitle>
                <FiscaisCarousel>
                  {stats.fiscais.map((fiscal, i) => (
                    <FiscalCard key={i}>
                      <FiscalAvatar>{getInitials(fiscal.nome)}</FiscalAvatar>
                      <FiscalInfo>
                        <FiscalName title={fiscal.nome}>{fiscal.nome}</FiscalName>
                        <FiscalStat>
                          <FiscalBadge variant="hoje">Hoje: {fiscal.agendados_hoje}</FiscalBadge>
                          <FiscalBadge variant="futuro">Futuro: {fiscal.agendados_futuro}</FiscalBadge>
                        </FiscalStat>
                      </FiscalInfo>
                    </FiscalCard>
                  ))}
                </FiscaisCarousel>
              </>
            )}

            <SectionTitle>
              Fila de Manutenção
              {totalRecords > 0 && (
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  background: 'var(--bg-2)', color: 'var(--ink-2)',
                  padding: '3px 9px', borderRadius: '20px',
                  border: '1px solid var(--border-0)',
                  textTransform: 'none', letterSpacing: 0,
                }}>
                  {totalRecords} registros
                </span>
              )}
            </SectionTitle>

            <TableWrapper>
              <Table>
                <thead>
                  <TableRow>
                    <TableHeader>SA</TableHeader>
                    <TableHeader>Empresa</TableHeader>
                    <TableHeader>Técnico</TableHeader>
                    <TableHeader>Cidade</TableHeader>
                    <TableHeader>Motivo</TableHeader>
                    <TableHeader>Endereço</TableHeader>
                    <TableHeader>CTO</TableHeader>
                    <TableHeader>Ação</TableHeader>
                  </TableRow>
                </thead>
                <tbody>
                  {atendimentos.length === 0 && (
                    <tr>
                      <td colSpan={8}>
                        <EmptyState>Nenhum atendimento de manutenção encontrado.</EmptyState>
                      </td>
                    </tr>
                  )}
                  {atendimentos.map((at) => (
                    <TableRow key={at.ID}>
                      <TableCell style={{ fontWeight: 700, color: 'var(--ink-0)' }}>
                        {at.NumeroCompromisso || at.SA}
                      </TableCell>
                      <TableCell truncate maxWidth="150px">{at.Empresa}</TableCell>
                      <TableCell truncate maxWidth="150px">{at.Tecnico}</TableCell>
                      <TableCell truncate maxWidth="130px">{at.Cidade}</TableCell>
                      <TableCell truncate maxWidth="180px">{at.Motivo}</TableCell>
                      <TableCell truncate maxWidth="220px" title={at.Endereco}>{at.Endereco}</TableCell>
                      <TableCell>{at.CTO}</TableCell>
                      <TableCell>
                        <ActionButton onClick={() => handleAgendarClick(at)}>
                          Agendar
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>

            {totalPages > 1 && (
              <PaginationWrapper>
                <PageBtn disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                  &#8249; Anterior
                </PageBtn>
                <PageInfo>Página {currentPage} de {totalPages}</PageInfo>
                <PageBtn disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                  Próxima &#8250;
                </PageBtn>
              </PaginationWrapper>
            )}
          </>
        )}
      </ContentArea>
    </LayoutContainer>
  );
};

export default AgendamentosManutencao;
