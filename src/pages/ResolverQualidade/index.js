import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMapPin, FiHash, FiFileText, FiCheckCircle } from 'react-icons/fi';

import Menu from '../../components/Menu';
import ItemCorrecao from '../../components/ItemCorrecao';
import GerarPDFTeste from './GerarPDFTeste';

import {
    LayoutContainer,
    ContentArea,
    Header,
    HeaderTitle,
    UserProfile,
} from '../Dashboard/styles';

import {
    PageHero, HeroLeft, HeroBadge, HeroTitle, HeroMeta, HeroRight,
    SummaryGrid, SummaryCard, SummaryValue, SummaryLabel,
    ProgressSection, ProgressBar, ProgressFill, ProgressLabel,
    DetailCard, DetailGrid, DetailItem, DetailIcon, DetailLabel, DetailValue,
    ItemsSection, ItemsSectionHeader, ItemsSectionTitle, ItemsCount,
    EmptyState, LoadingCard,
} from './styles';

const ResolverQualidade = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, logout, apiFetch } = useAuth();

    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [vistoria, setVistoria] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchVistoriaDetails = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await apiFetch(`/api/vistorias/${id}`);
            if (!data.checklist_itens) data.checklist_itens = [];
            setVistoria(data);
        } catch {
            toast.error('Erro ao buscar vistoria.');
            navigate('/backlog');
        } finally {
            setIsLoading(false);
        }
    }, [apiFetch, id, navigate]);

    useEffect(() => { fetchVistoriaDetails(); }, [fetchVistoriaDetails]);

    const handleItemUpdate = async (itemId, data) => {
        setIsSubmitting(true);
        try {
            if (data.action === 'resolver') {
                const formData = new FormData();
                formData.append('foto_correcao', data.foto_correcao);
                if (data.observacao_correcao) formData.append('observacao_correcao', data.observacao_correcao);
                await apiFetch(`/api/checklist-itens/${itemId}/resolver`, { method: 'POST', data: formData });
                toast.success('Correção enviada!');
            } else if (data.action === 'avaliar') {
                await apiFetch(`/api/checklist-itens/${itemId}/avaliar`, { method: 'POST', data: { status: data.status } });
                toast.info('Avaliação registrada!');
            }
            await fetchVistoriaDetails();
        } catch {
            toast.error('Erro ao atualizar.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const itensNaoConformes = useMemo(
        () => vistoria?.checklist_itens?.filter(i => i.status === 'Não Conforme') || [],
        [vistoria],
    );

    const counts = useMemo(() => ({
        total:      itensNaoConformes.length,
        pendentes:  itensNaoConformes.filter(i => !i.status_correcao || i.status_correcao === 'Pendente' || i.status_correcao === 'Reprovado').length,
        emAnalise:  itensNaoConformes.filter(i => i.status_correcao === 'Em Análise').length,
        aprovados:  itensNaoConformes.filter(i => i.status_correcao === 'Aprovado').length,
    }), [itensNaoConformes]);

    const progress = counts.total > 0 ? Math.round((counts.aprovados / counts.total) * 100) : 0;

    return (
        <LayoutContainer>
            <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
            <ContentArea isMenuExpanded={isMenuExpanded}>

                <Header>
                    <HeaderTitle>Resolver Qualidade</HeaderTitle>
                    <UserProfile>
                        <span>{user?.nome}</span>
                        <button onClick={logout}>Sair</button>
                    </UserProfile>
                </Header>

                {isLoading ? (
                    <LoadingCard>Carregando vistoria...</LoadingCard>
                ) : !vistoria ? (
                    <LoadingCard>Vistoria não encontrada.</LoadingCard>
                ) : (
                    <>
                        {/* ── Hero ── */}
                        <PageHero>
                            <HeroLeft>
                                <HeroBadge>SA #{vistoria.agenda?.numero_compromisso || 'N/A'}</HeroBadge>
                                <HeroTitle>{vistoria.agenda?.nome_conta || '—'}</HeroTitle>
                                <HeroMeta>
                                    <FiMapPin />
                                    {vistoria.agenda?.endereco || '—'}
                                </HeroMeta>
                            </HeroLeft>
                            <HeroRight>
                                <GerarPDFTeste vistoria={vistoria} />
                            </HeroRight>
                        </PageHero>

                        {/* ── KPIs ── */}
                        <SummaryGrid>
                            <SummaryCard accent="var(--ink-2)">
                                <SummaryValue>{counts.total}</SummaryValue>
                                <SummaryLabel>Total de Itens</SummaryLabel>
                            </SummaryCard>
                            <SummaryCard accent="var(--warning)">
                                <SummaryValue color="var(--warning)">{counts.pendentes}</SummaryValue>
                                <SummaryLabel>Pendentes</SummaryLabel>
                            </SummaryCard>
                            <SummaryCard accent="var(--accent-1)">
                                <SummaryValue color="var(--accent-1)">{counts.emAnalise}</SummaryValue>
                                <SummaryLabel>Em Análise</SummaryLabel>
                            </SummaryCard>
                            <SummaryCard accent="var(--success)">
                                <SummaryValue color="var(--success)">{counts.aprovados}</SummaryValue>
                                <SummaryLabel>Aprovados</SummaryLabel>
                            </SummaryCard>
                        </SummaryGrid>

                        {/* ── Progresso ── */}
                        <ProgressSection>
                            <ProgressLabel>
                                <span>Progresso de aprovações</span>
                                <strong>{progress}%</strong>
                            </ProgressLabel>
                            <ProgressBar>
                                <ProgressFill width={progress} />
                            </ProgressBar>
                        </ProgressSection>

                        {/* ── Detalhes ── */}
                        <DetailCard>
                            <DetailGrid>
                                <DetailItem>
                                    <DetailIcon><FiHash /></DetailIcon>
                                    <div>
                                        <DetailLabel>ID Vistoria</DetailLabel>
                                        <DetailValue>#{vistoria.id}</DetailValue>
                                    </div>
                                </DetailItem>
                                {user?.role === 'admin' && (
                                    <DetailItem>
                                        <DetailIcon><FiUser /></DetailIcon>
                                        <div>
                                            <DetailLabel>Fiscal</DetailLabel>
                                            <DetailValue>{vistoria.fiscal?.nome || '—'}</DetailValue>
                                        </div>
                                    </DetailItem>
                                )}
                                <DetailItem>
                                    <DetailIcon><FiFileText /></DetailIcon>
                                    <div>
                                        <DetailLabel>Cliente</DetailLabel>
                                        <DetailValue>{vistoria.agenda?.nome_conta || '—'}</DetailValue>
                                    </div>
                                </DetailItem>
                                <DetailItem>
                                    <DetailIcon><FiMapPin /></DetailIcon>
                                    <div>
                                        <DetailLabel>Endereço</DetailLabel>
                                        <DetailValue>{vistoria.agenda?.endereco || '—'}</DetailValue>
                                    </div>
                                </DetailItem>
                            </DetailGrid>
                        </DetailCard>

                        {/* ── Itens ── */}
                        <ItemsSection>
                            <ItemsSectionHeader>
                                <ItemsSectionTitle>Itens a Corrigir</ItemsSectionTitle>
                                {itensNaoConformes.length > 0 && (
                                    <ItemsCount>
                                        {itensNaoConformes.length} {itensNaoConformes.length === 1 ? 'item' : 'itens'}
                                    </ItemsCount>
                                )}
                            </ItemsSectionHeader>

                            {itensNaoConformes.length === 0 ? (
                                <EmptyState>
                                    <FiCheckCircle />
                                    <p>Nenhum item não conforme nesta vistoria.</p>
                                </EmptyState>
                            ) : (
                                itensNaoConformes.map((item, idx) => (
                                    <ItemCorrecao
                                        key={item.id}
                                        item={item}
                                        index={idx + 1}
                                        total={itensNaoConformes.length}
                                        onItemUpdate={handleItemUpdate}
                                        isSubmitting={isSubmitting}
                                    />
                                ))
                            )}
                        </ItemsSection>
                    </>
                )}
            </ContentArea>
        </LayoutContainer>
    );
};

export default ResolverQualidade;
