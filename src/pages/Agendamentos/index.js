import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu';
import { toast } from 'react-toastify';
import BacklogSkeleton from '../../components/BacklogSkeleton';

import {
  LayoutContainer,
  ContentArea,
  Header,
  HeaderTitle,
  UserProfile,
} from '../Dashboard/styles';

import {
  Table, TableHeader, TableRow, TableCell, ActionButton,
  StatsContainer, StatCard, StatCardValue, StatCardLabel,
  SectionTitle, FiscaisCarousel, FiscalCard, FiscalName, FiscalStat,
} from './styles';

const Agendamentos = () => {
  const { user, logout, apiFetch } = useAuth();
  const navigate = useNavigate();

  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [atendimentos, setAtendimentos] = useState([]);
  const [stats, setStats] = useState({ global: {}, fiscais: [] });

  const [filtros, setFiltros] = useState({
    tecnico: '',
    empresa: '',
    cto: '',
    sa: '',
    endereco: '',
  });

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

      const response = await apiFetch(`/api/atendimentos?${params.toString()}`);

      setAtendimentos(Array.isArray(response?.data) ? response.data : []);
      setStats(response?.stats || { global: {}, fiscais: [] });
      setTotalPages(Number(response?.last_page || 1));
      setTotalRecords(Number(response?.total || 0));
    } catch (error) {
      toast.error('Erro ao carregar atendimentos.');
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch, currentPage, filtros]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const handleApplyFilters = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      return;
    }
    fetchPage();
  };

  const handleAgendarClick = (atendimento) => {
    navigate(`/agendamento/${atendimento.ID}`, {
      state: { atendimento },
    });
  };

  if (isLoading) {
    return (
      <LayoutContainer>
        <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
        <ContentArea isMenuExpanded={isMenuExpanded}>
          <Header>
            <HeaderTitle>Atendimentos para Agendar</HeaderTitle>
            <UserProfile>
              <span>{user?.nome}</span>
              <button onClick={logout}>Sair</button>
            </UserProfile>
          </Header>
          <BacklogSkeleton kpis={3} filters={5} rows={6} cols={7} />
        </ContentArea>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>Atendimentos para Agendar</HeaderTitle>
          <UserProfile>
            <span>{user?.nome}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>

        <SectionTitle>Filtros</SectionTitle>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 15,
          marginBottom: 25,
          background: '#f8f8f8',
          padding: 15,
          borderRadius: 10,
          border: '1px solid #ddd',
          alignItems: 'center',
        }}>
          <input type="text" placeholder="Tecnico" value={filtros.tecnico} onChange={(e) => setFiltros({ ...filtros, tecnico: e.target.value })} style={inputStyle} />
          <input type="text" placeholder="Empresa" value={filtros.empresa} onChange={(e) => setFiltros({ ...filtros, empresa: e.target.value })} style={inputStyle} />
          <input type="text" placeholder="CTO" value={filtros.cto} onChange={(e) => setFiltros({ ...filtros, cto: e.target.value })} style={inputStyle} />
          <input type="text" placeholder="SA" value={filtros.sa} onChange={(e) => setFiltros({ ...filtros, sa: e.target.value })} style={inputStyle} />
          <input type="text" placeholder="Endereco" value={filtros.endereco} onChange={(e) => setFiltros({ ...filtros, endereco: e.target.value })} style={{ ...inputStyle, width: 260 }} />
          <button onClick={handleApplyFilters} style={buttonFiltrarStyle}>Aplicar Filtros</button>
        </div>

        <SectionTitle>Resumo Geral</SectionTitle>
        <StatsContainer>
          <StatCard>
            <StatCardValue>{stats.global?.total_agendamentos ?? 0}</StatCardValue>
            <StatCardLabel>Agendamentos</StatCardLabel>
          </StatCard>
          <StatCard>
            <StatCardValue>{stats.global?.pendentes_hoje ?? 0}</StatCardValue>
            <StatCardLabel>Pendentes Hoje</StatCardLabel>
          </StatCard>
          <StatCard>
            <StatCardValue>{stats.global?.total_concluidos ?? 0}</StatCardValue>
            <StatCardLabel>Concluidos</StatCardLabel>
          </StatCard>
        </StatsContainer>

        <SectionTitle>Agenda por Fiscal</SectionTitle>
        <FiscaisCarousel>
          {(stats.fiscais || []).map((fiscal, index) => (
            <FiscalCard key={index}>
              <FiscalName>{fiscal.nome}</FiscalName>
              <FiscalStat>
                <span>Hoje: <strong>{fiscal.agendados_hoje}</strong></span>
                <span>Futuro: <strong>{fiscal.agendados_futuro}</strong></span>
              </FiscalStat>
            </FiscalCard>
          ))}
        </FiscaisCarousel>

        <SectionTitle>Fila de Atendimento ({totalRecords})</SectionTitle>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>SA</TableHeader>
              <TableHeader>Empresa</TableHeader>
              <TableHeader>Tecnico</TableHeader>
              <TableHeader>Telefone</TableHeader>
              <TableHeader>Endereco</TableHeader>
              <TableHeader>CTO</TableHeader>
              <TableHeader>Acao</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {atendimentos.map((at) => (
              <TableRow key={at.ID}>
                <TableCell>{at.NumeroCompromisso}</TableCell>
                <TableCell>{at.Empresa}</TableCell>
                <TableCell>{at.Tecnico}</TableCell>
                <TableCell>{at.Telefone}</TableCell>
                <TableCell>{at.Endereco}</TableCell>
                <TableCell>{at.CTO}</TableCell>
                <TableCell>
                  <ActionButton onClick={() => handleAgendarClick(at)}>Agendar</ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 10 }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            style={simplePaginationButtonStyle}
          >
            Anterior
          </button>

          <span style={{ alignSelf: 'center' }}>Pagina {currentPage} de {totalPages}</span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            style={simplePaginationButtonStyle}
          >
            Proxima
          </button>
        </div>
      </ContentArea>
    </LayoutContainer>
  );
};

const inputStyle = {
  padding: 10,
  width: 200,
  borderRadius: 8,
  border: '1px solid #ccc',
  fontSize: 15,
  background: '#fff',
};

const buttonFiltrarStyle = {
  padding: '10px 20px',
  background: '#6c1b0b',
  color: '#fff',
  borderRadius: 8,
  border: 'none',
  fontWeight: 'bold',
  cursor: 'pointer',
  height: 42,
};

const simplePaginationButtonStyle = {
  padding: '8px 16px',
  background: '#6c1b0b',
  color: '#fff',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: 14,
  minWidth: 90,
  transition: 'all 0.2s',
  outline: 'none',
};

export default Agendamentos;

