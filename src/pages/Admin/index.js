import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import { FiShield, FiUsers, FiActivity, FiServer, FiSettings, FiZap, FiLock } from 'react-icons/fi';

import {
  LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile,
} from '../Dashboard/styles';

import {
  Hero, HeroHeader, HeroTitle, HeroSubtitle,
  StatGrid, StatCard, StatLabel, StatValue, StatDelta,
  Grid, WideGrid, Panel, PanelHeader, PanelTitle, PanelSubtitle,
  Badge, Pill,
  ActionGrid, ActionCard, ActionIconWrap,
  StatusList, StatusRow, StatusDot,
  ActivityList, ActivityItem, ActivityMeta,
  SimpleTable, TableActions, DetailBtn, ApproveBtn, RejectBtn,
  ModalOverlay, ModalContent, ModalHeader, ModalCloseBtn,
  ModalBody, ModalField, ObservacaoBox, ModalFooter,
  ModalApproveBtn, ModalRejectBtn,
} from './styles';

const ACTIONS = [
  { title: 'Gerenciar Usuários',    subtitle: 'Perfis, cargos e acessos',   icon: <FiUsers />,   color: '#2563eb', bg: '#eff6ff' },
  { title: 'Segurança',             subtitle: 'Permissões e auditoria',      icon: <FiShield />,  color: '#7c3aed', bg: '#f5f3ff' },
  { title: 'Automação',             subtitle: 'Regras e integrações',        icon: <FiZap />,     color: '#d97706', bg: '#fffbeb' },
  { title: 'Configurações',         subtitle: 'Preferências do sistema',     icon: <FiSettings />, color: '#0891b2', bg: '#ecfeff' },
];

const STATUS_ITEMS = [
  { label: 'API de Qualidade',        value: 'Operacional', tone: 'ok' },
  { label: 'Serviço de Relatórios',   value: 'Operacional', tone: 'ok' },
  { label: 'Sincronização Salesforce', value: 'Operacional', tone: 'ok' },
  { label: 'Fila de Processamento',   value: 'Monitorando', tone: 'warning' },
];

const Admin = () => {
  const { user, logout, apiFetch } = useAuth();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [overview, setOverview] = useState({
    stats: {},
    recent_activities: [],
    pending_approvals: [],
  });

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/api/admin/overview');
      setOverview({
        stats: data?.stats || {},
        recent_activities: Array.isArray(data?.recent_activities) ? data.recent_activities : [],
        pending_approvals: Array.isArray(data?.pending_approvals) ? data.pending_approvals : [],
      });
    } catch {
      toast.error('Não foi possível carregar o painel administrativo.');
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => { fetchOverview(); }, [fetchOverview]);

  const stats = useMemo(() => ([
    { label: 'Solicitações Pendentes', value: String(overview?.stats?.pending_access_requests ?? 0), delta: 'Aguardando aprovação', tone: 'down' },
    { label: 'Itens Reprovados',       value: String(overview?.stats?.reprovados ?? 0),              delta: 'Precisam de resposta', tone: 'down' },
    { label: 'Itens em Análise',       value: String(overview?.stats?.em_analise ?? 0),              delta: 'Aguardando decisão',  tone: 'up'   },
    { label: 'Atividades Recentes',    value: String(overview?.stats?.recent_activity_count ?? 0),   delta: 'Últimos eventos',     tone: 'up'   },
  ]), [overview]);

  const formatDate = (value) => {
    if (!value) return 'sem data';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'sem data';
    return date.toLocaleString('pt-BR');
  };

  const handleApprove = async (requestId) => {
    if (isApproving) return;
    setIsApproving(true);
    try {
      await apiFetch(`/api/admin/access-requests/${requestId}/approve`, { method: 'POST' });
      toast.success('Solicitação aprovada e usuário criado.');
      setSelectedApproval(null);
      await fetchOverview();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Erro ao aprovar solicitação.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (requestId) => {
    if (isApproving) return;
    const reviewNotes = window.prompt('Motivo da rejeição (opcional):', '') || '';
    setIsApproving(true);
    try {
      await apiFetch(`/api/admin/access-requests/${requestId}/reject`, {
        method: 'POST',
        data: { review_notes: reviewNotes },
      });
      toast.success('Solicitação rejeitada.');
      setSelectedApproval(null);
      await fetchOverview();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Erro ao rejeitar solicitação.');
    } finally {
      setIsApproving(false);
    }
  };

  const openApprovalDetails = async (requestId) => {
    if (!requestId) return;
    setIsDetailsLoading(true);
    try {
      const data = await apiFetch(`/api/admin/access-requests/${requestId}`);
      setSelectedApproval(data || null);
    } catch {
      toast.error('Não foi possível carregar os detalhes da solicitação.');
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const closeApprovalDetails = () => {
    if (isApproving) return;
    setSelectedApproval(null);
  };

  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />

      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>Painel de Administração</HeaderTitle>
          <UserProfile>
            <span>{user?.nome ?? user?.name ?? 'Administrador'}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>

        {/* ── Hero + KPIs ─────────────────────────────────────────────────── */}
        <Hero>
          <HeroHeader>
            <HeroTitle>Visão estratégica e governança operacional</HeroTitle>
            <HeroSubtitle>
              Controle de aprovações, trilha de auditoria e acompanhamento de resposta a laudos.
            </HeroSubtitle>
          </HeroHeader>

          <StatGrid>
            {stats.map((stat) => (
              <StatCard key={stat.label}>
                <StatLabel>{stat.label}</StatLabel>
                <StatValue>{stat.value}</StatValue>
                <StatDelta tone={stat.tone}>{stat.delta}</StatDelta>
              </StatCard>
            ))}
          </StatGrid>
        </Hero>

        {/* ── Ações Rápidas + Status de Serviços ──────────────────────────── */}
        <Grid>
          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Ações Rápidas</PanelTitle>
                <PanelSubtitle>Atalhos para operações essenciais</PanelSubtitle>
              </div>
              <Badge>Prioridades</Badge>
            </PanelHeader>
            <ActionGrid>
              {ACTIONS.map((action) => (
                <ActionCard key={action.title} type="button">
                  <ActionIconWrap color={action.color} bg={action.bg}>
                    {action.icon}
                  </ActionIconWrap>
                  <strong>{action.title}</strong>
                  <span>{action.subtitle}</span>
                </ActionCard>
              ))}
            </ActionGrid>
          </Panel>

          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Status de Serviços</PanelTitle>
                <PanelSubtitle>Monitoramento em tempo real</PanelSubtitle>
              </div>
              <FiServer />
            </PanelHeader>
            <StatusList>
              {STATUS_ITEMS.map((item) => (
                <StatusRow key={item.label}>
                  <div>
                    <StatusDot tone={item.tone} />
                    {item.label}
                  </div>
                  <Pill tone={item.tone === 'ok' ? 'success' : item.tone}>{item.value}</Pill>
                </StatusRow>
              ))}
            </StatusList>
          </Panel>
        </Grid>

        {/* ── Atividade Recente + Aprovações Críticas ──────────────────────── */}
        <WideGrid>
          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Atividade Recente</PanelTitle>
                <PanelSubtitle>Operações e alertas mais recentes</PanelSubtitle>
              </div>
              <FiActivity />
            </PanelHeader>
            <ActivityList>
              {isLoading && <ActivityMeta>Carregando atividades...</ActivityMeta>}
              {!isLoading && overview.recent_activities.length === 0 && (
                <ActivityMeta>Nenhuma atividade registrada ainda.</ActivityMeta>
              )}
              {!isLoading && overview.recent_activities.map((activity) => (
                <ActivityItem key={activity.id}>
                  <strong>{activity.description}</strong>
                  <ActivityMeta>
                    {formatDate(activity.created_at)} &bull; {activity.user || 'Sistema'} &bull; {activity.action}
                  </ActivityMeta>
                </ActivityItem>
              ))}
            </ActivityList>
          </Panel>

          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Aprovações Críticas</PanelTitle>
                <PanelSubtitle>Solicitações aguardando decisão</PanelSubtitle>
              </div>
              <FiLock />
            </PanelHeader>
            <SimpleTable>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Solicitante</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan="5">Carregando aprovações...</td></tr>
                )}
                {!isLoading && overview.pending_approvals.length === 0 && (
                  <tr><td colSpan="5">Nenhuma solicitação pendente.</td></tr>
                )}
                {!isLoading && overview.pending_approvals.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => openApprovalDetails(item.id)}
                    title="Clique para ver os detalhes"
                  >
                    <td>#{item.id}</td>
                    <td>{item.nome}</td>
                    <td>{item.email}</td>
                    <td><Pill tone="warning">Pendente</Pill></td>
                    <td>
                      <TableActions>
                        <DetailBtn
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openApprovalDetails(item.id); }}
                        >
                          Detalhes
                        </DetailBtn>
                        <ApproveBtn
                          type="button"
                          disabled={isApproving}
                          onClick={(e) => { e.stopPropagation(); handleApprove(item.id); }}
                        >
                          Aprovar
                        </ApproveBtn>
                        <RejectBtn
                          type="button"
                          disabled={isApproving}
                          onClick={(e) => { e.stopPropagation(); handleReject(item.id); }}
                        >
                          Rejeitar
                        </RejectBtn>
                      </TableActions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </SimpleTable>
          </Panel>
        </WideGrid>

        {/* ── Modal de Aprovação ───────────────────────────────────────────── */}
        {(selectedApproval || isDetailsLoading) && (
          <ModalOverlay onClick={closeApprovalDetails}>
            <ModalContent onClick={(e) => e.stopPropagation()}>

              <ModalHeader>
                <div>
                  <h3>
                    {isDetailsLoading
                      ? 'Carregando detalhes...'
                      : `Solicitação #${selectedApproval?.id || ''}`}
                  </h3>
                  {!isDetailsLoading && selectedApproval && (
                    <div className="modal-meta">
                      Solicitado em: {formatDate(selectedApproval.created_at)}
                    </div>
                  )}
                </div>
                <ModalCloseBtn
                  type="button"
                  onClick={closeApprovalDetails}
                  disabled={isApproving}
                >
                  &#10005;
                </ModalCloseBtn>
              </ModalHeader>

              {!isDetailsLoading && selectedApproval && (
                <>
                  <ModalBody>
                    <ModalField>
                      <strong>Nome</strong>
                      <span>{selectedApproval.nome || '—'}</span>
                    </ModalField>
                    <ModalField>
                      <strong>Email</strong>
                      <span>{selectedApproval.email || '—'}</span>
                    </ModalField>
                    <ModalField>
                      <strong>Telefone</strong>
                      <span>{selectedApproval.numero || '—'}</span>
                    </ModalField>
                    <ModalField>
                      <strong>CPF</strong>
                      <span>{selectedApproval.cpf || '—'}</span>
                    </ModalField>
                    <ModalField>
                      <strong>Empresa</strong>
                      <span>{selectedApproval.empresa?.nome || '—'}</span>
                    </ModalField>
                    <ModalField>
                      <strong>Cargo</strong>
                      <span>{selectedApproval.cargo?.nome || '—'}</span>
                    </ModalField>
                    <ModalField>
                      <strong>Regional</strong>
                      <span>{selectedApproval.regional?.nome || '—'}</span>
                    </ModalField>
                    <ModalField>
                      <strong>Status</strong>
                      <span><Pill tone="warning">Pendente</Pill></span>
                    </ModalField>
                  </ModalBody>

                  <ObservacaoBox>
                    <strong>Observação</strong>
                    <div>{selectedApproval.observacao || 'Sem observação'}</div>
                  </ObservacaoBox>

                  <ModalFooter>
                    <ModalRejectBtn
                      type="button"
                      onClick={() => handleReject(selectedApproval.id)}
                      disabled={isApproving}
                    >
                      {isApproving ? 'Aguarde...' : 'Rejeitar'}
                    </ModalRejectBtn>
                    <ModalApproveBtn
                      type="button"
                      onClick={() => handleApprove(selectedApproval.id)}
                      disabled={isApproving}
                    >
                      {isApproving ? 'Aguarde...' : 'Aprovar'}
                    </ModalApproveBtn>
                  </ModalFooter>
                </>
              )}

            </ModalContent>
          </ModalOverlay>
        )}

      </ContentArea>
    </LayoutContainer>
  );
};

export default Admin;
