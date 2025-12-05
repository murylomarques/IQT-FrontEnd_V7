import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Menu from "../../components/Menu";
import { toast } from "react-toastify";

import {
    LayoutContainer,
    ContentArea,
    Header,
    HeaderTitle,
    UserProfile
} from "../Dashboard/styles";

import {
    Table, TableHeader, TableRow, TableCell, ActionButton,
    StatsContainer, StatCard, StatCardValue, StatCardLabel,
    SectionTitle, FiscaisCarousel, FiscalCard, FiscalName, FiscalStat
} from "./styles";

const Agendamentos = () => {
    const { user, logout, apiFetch } = useAuth();
    const navigate = useNavigate();

    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [todosAtendimentos, setTodosAtendimentos] = useState([]);
    const [atendimentos, setAtendimentos] = useState([]);
    const [stats, setStats] = useState({ global: {}, fiscais: [] });
    const [totalAtendimentos, setTotalAtendimentos] = useState(0);

    // FILTROS
    const [filtros, setFiltros] = useState({
        tecnico: "",
        empresa: "",
        cto: "",
        sa: "",
        endereco: ""
    });

    // PAGINAÇÃO
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 15;
    const totalPages = Math.ceil(atendimentos.length / recordsPerPage);

    // BUSCAR DADOS
    const fetchAllPages = async () => {
        setIsLoading(true);
        try {
            let page = 1;
            let all = [];
            let lastPage = 1;

            do {
                const response = await apiFetch(`/api/atendimentos?page=${page}`);
                if (!response || !response.data) break;
                all = [...all, ...response.data];
                if (page === 1) {
                    setStats(response.stats);
                    setTotalAtendimentos(response.total);
                    lastPage = response.last_page;
                }
                page++;
            } while (page <= lastPage);

            setTodosAtendimentos(all);
            setAtendimentos(all);

        } catch (error) {
            toast.error("Erro ao carregar atendimentos.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPages();
    }, []);

    // FILTROS
    const handleApplyFilters = () => {
        let data = [...todosAtendimentos];

        if (filtros.tecnico.trim() !== "") {
            data = data.filter(item =>
                item.Tecnico?.toLowerCase().includes(filtros.tecnico.toLowerCase())
            );
        }
        if (filtros.empresa.trim() !== "") {
            data = data.filter(item =>
                item.Empresa?.toLowerCase().includes(filtros.empresa.toLowerCase())
            );
        }
        if (filtros.cto.trim() !== "") {
            data = data.filter(item =>
                item.CTO?.toLowerCase().includes(filtros.cto.toLowerCase())
            );
        }
        if (filtros.sa.trim() !== "") {
            data = data.filter(item =>
                String(item.NumeroCompromisso)
                    .toLowerCase()
                    .includes(filtros.sa.toLowerCase())
            );
        }
        if (filtros.endereco.trim() !== "") {
            data = data.filter(item =>
                item.Endereco?.toLowerCase().includes(filtros.endereco.toLowerCase())
            );
        }

        setAtendimentos(data);
        setCurrentPage(1); // resetar página ao aplicar filtros
    };

    // --- CORREÇÃO AQUI ---
    // Recebe o objeto completo (atendimento) ao invés de apenas o ID
    const handleAgendarClick = (atendimento) => {
        navigate(`/agendamento/${atendimento.ID}`, { 
            state: { atendimento: atendimento } 
        });
    };

    // REGISTROS DA PÁGINA ATUAL
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = atendimentos.slice(indexOfFirstRecord, indexOfLastRecord);

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

                {/* FILTROS */}
                <SectionTitle>Filtros</SectionTitle>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 15,
                    marginBottom: 25,
                    background: "#f8f8f8",
                    padding: 15,
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    alignItems: "center"
                }}>
                    <input type="text" placeholder="Técnico" value={filtros.tecnico} onChange={(e) => setFiltros({ ...filtros, tecnico: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Empresa" value={filtros.empresa} onChange={(e) => setFiltros({ ...filtros, empresa: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="CTO" value={filtros.cto} onChange={(e) => setFiltros({ ...filtros, cto: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="SA" value={filtros.sa} onChange={(e) => setFiltros({ ...filtros, sa: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Endereço" value={filtros.endereco} onChange={(e) => setFiltros({ ...filtros, endereco: e.target.value })} style={{ ...inputStyle, width: 260 }} />
                    <button onClick={handleApplyFilters} style={buttonFiltrarStyle}>🔍 Aplicar Filtros</button>
                </div>

                {/* ESTATÍSTICAS */}
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
                        <StatCardLabel>Concluídos</StatCardLabel>
                    </StatCard>
                </StatsContainer>

                {/* FISCAIS */}
                <SectionTitle>Agenda por Fiscal</SectionTitle>
                <FiscaisCarousel>
                    {stats.fiscais.map((fiscal, index) => (
                        <FiscalCard key={index}>
                            <FiscalName>{fiscal.nome}</FiscalName>
                            <FiscalStat>
                                <span>Hoje: <strong>{fiscal.agendados_hoje}</strong></span>
                                <span>Futuro: <strong>{fiscal.agendados_futuro}</strong></span>
                            </FiscalStat>
                        </FiscalCard>
                    ))}
                </FiscaisCarousel>

                {/* TABELA */}
                <SectionTitle>Fila de Atendimento ({atendimentos.length})</SectionTitle>
                <Table>
                    <thead>
                        <TableRow>
                            <TableHeader>SA</TableHeader>
                            <TableHeader>Empresa</TableHeader>
                            <TableHeader>Técnico</TableHeader>
                            <TableHeader>Telefone</TableHeader>
                            <TableHeader>Endereço</TableHeader>
                            <TableHeader>CTO</TableHeader>
                            <TableHeader>Ação</TableHeader>
                        </TableRow>
                    </thead>
                    <tbody>
                        {currentRecords.map((at) => (
                            <TableRow key={at.ID}>
                                <TableCell>{at.NumeroCompromisso}</TableCell>
                                <TableCell>{at.Empresa}</TableCell>
                                <TableCell>{at.Tecnico}</TableCell>
                                <TableCell>{at.Telefone}</TableCell>
                                <TableCell>{at.Endereco}</TableCell>
                                <TableCell>{at.CTO}</TableCell>
                                <TableCell>
                                    {/* --- CORREÇÃO AQUI --- */}
                                    {/* Passa o objeto 'at' inteiro, não só o ID */}
                                    <ActionButton onClick={() => handleAgendarClick(at)}>Agendar</ActionButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>

                {/* PAGINAÇÃO SIMPLES */}
                <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10 }}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        style={simplePaginationButtonStyle}
                    >
                        ◀ Anterior
                    </button>

                    <span style={{ alignSelf: "center" }}>Página {currentPage} de {totalPages}</span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        style={simplePaginationButtonStyle}
                    >
                        Próxima ▶
                    </button>
                </div>

                {isLoading && <p>Carregando...</p>}
            </ContentArea>
        </LayoutContainer>
    );
};

// ESTILOS
const inputStyle = {
    padding: 10,
    width: 200,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 15,
    background: "#fff"
};

const buttonFiltrarStyle = {
    padding: "10px 20px",
    background: "#6c1b0b",
    color: "#fff",
    borderRadius: 8,
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    height: 42
};

const simplePaginationButtonStyle = {
    padding: "8px 16px",
    background: "#6c1b0b",
    color: "#fff",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 14,
    minWidth: 90,
    transition: "all 0.2s",
    outline: "none"
};

export default Agendamentos;