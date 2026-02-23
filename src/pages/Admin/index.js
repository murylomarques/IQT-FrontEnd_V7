import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import { FiShield, FiUsers, FiActivity, FiServer, FiSettings, FiZap, FiLock } from 'react-icons/fi';

import {
  LayoutContainer,
  ContentArea,
  Header,
  HeaderTitle,
  UserProfile,
} from '../Dashboard/styles';

import {
  Hero,
  HeroHeader,
  HeroTitle,
  HeroSubtitle,
  StatGrid,
  StatCard,
  StatLabel,
  StatValue,
  StatDelta,
  Grid,
  Panel,
  PanelHeader,
  PanelTitle,
  PanelSubtitle,
  Badge,
  Pill,
  ActionGrid,
  ActionCard,
  StatusList,
  StatusRow,
  StatusDot,
  ActivityList,
  ActivityItem,
  ActivityMeta,
  SimpleTable,
} from './styles';

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

  const actions = [
    { title: 'Gerenciar usuários', subtitle: 'Perfis, cargos e acessos', icon: <FiUsers /> },
    { title: 'Seguranca e compliance', subtitle: 'Permissoes e auditoria', icon: <FiShield /> },
    { title: 'Automacao', subtitle: 'Regras e integracoes', icon: <FiZap /> },
    { title: 'Configurações', subtitle: 'Preferências do sistema', icon: <FiSettings /> },
  ];

  const statusItems = [
    { label: 'API de qualidade', value: 'Operacional', tone: 'ok' },
    { label: 'Serviço de relatórios', value: 'Operacional', tone: 'ok' },
    { label: 'Sincronização Salesforce', value: 'Operacional', tone: 'ok' },
    { label: 'Fila de processamento', value: 'Monitorando', tone: 'warning' },
  ];

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/api/admin/overview');
      setOverview({
        stats: data?.stats || {},
        recent_activities: Array.isArray(data?.recent_activities) ? data.recent_activities : [],
        pending_approvals: Array.isArray(data?.pending_approvals) ? data.pending_approvals : [],
      });
    } catch (error) {
      toast.error('Não foi possível carregar o painel administrativo.');
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const stats = useMemo(() => ([
    {
      label: 'Solicitações pendentes',
      value: String(overview?.stats?.pending_access_requests ?? 0),
      delta: 'Aguardando aprovação',
      tone: 'down',
    },
    {
      label: 'Itens reprovados',
      value: String(overview?.stats?.reprovados ?? 0),
      delta: 'Precisam de resposta',
      tone: 'down',
    },
    {
      label: 'Itens em análise',
      value: String(overview?.stats?.em_analise ?? 0),
      delta: 'Aguardando decisão',
      tone: 'up',
    },
    {
      label: 'Atividades recentes',
      value: String(overview?.stats?.recent_activity_count ?? 0),
      delta: 'Últimos eventos registrados',
      tone: 'up',
    },
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
    } catch (error) {
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

        <Grid>
          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Ações rápidas</PanelTitle>
                <PanelSubtitle>Atalhos para operações essenciais</PanelSubtitle>
              </div>
              <Badge>Prioridades</Badge>
            </PanelHeader>
            <ActionGrid>
              {actions.map((action) => (
                <ActionCard key={action.title} type="button">
                  {action.icon}
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
              {statusItems.map((item) => (
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

        <Grid>
          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Atividade recente</PanelTitle>
                <PanelSubtitle>Operacoes e alertas mais recentes</PanelSubtitle>
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
                    {formatDate(activity.created_at)} • {activity.user || 'Sistema'} • {activity.action}
                  </ActivityMeta>
                </ActivityItem>
              ))}
            </ActivityList>
          </Panel>

          <Panel>
            <PanelHeader>
              <div>
                <PanelTitle>Aprovações críticas</PanelTitle>
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
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan="5">Carregando aprovações...</td>
                  </tr>
                )}
                {!isLoading && overview.pending_approvals.length === 0 && (
                  <tr>
                    <td colSpan="5">Nenhuma solicitação pendente.</td>
                  </tr>
                )}
                {!isLoading && overview.pending_approvals.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => openApprovalDetails(item.id)}
                    style={{ cursor: 'pointer' }}
                    title="Clique para ver os detalhes da solicitação"
                  >
                    <td>#{item.id}</td>
                    <td>{item.nome}</td>
                    <td>{item.email}</td>
                    <td>
                      <Pill tone="warning">Pendente</Pill>
                    </td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openApprovalDetails(item.id);
                        }}
                        style={{
                          border: '1px solid #ddd',
                          borderRadius: 8,
                          padding: '6px 10px',
                          cursor: 'pointer',
                          background: '#fff',
                          color: '#1f2937',
                          fontWeight: 600,
                        }}
                      >
                        Detalhes
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleApprove(item.id);
                        }}
                        disabled={isApproving}
                        style={{
                          border: 'none',
                          borderRadius: 8,
                          padding: '6px 10px',
                          cursor: 'pointer',
                          background: '#16a34a',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      >
                        Aprovar
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleReject(item.id);
                        }}
                        disabled={isApproving}
                        style={{
                          border: 'none',
                          borderRadius: 8,
                          padding: '6px 10px',
                          cursor: 'pointer',
                          background: '#dc2626',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      >
                        Rejeitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </SimpleTable>
          </Panel>
        </Grid>

        {(selectedApproval || isDetailsLoading) && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: 16,
            }}
            onClick={closeApprovalDetails}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 680,
                background: '#fff',
                borderRadius: 16,
                padding: 20,
                display: 'grid',
                gap: 14,
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#111827' }}>
                  {isDetailsLoading
                    ? 'Carregando detalhes...'
                    : `Solicitacao #${selectedApproval?.id || ''}`}
                </h3>
                <button
                  type="button"
                  onClick={closeApprovalDetails}
                  disabled={isApproving}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: 20,
                    cursor: 'pointer',
                    lineHeight: 1,
                  }}
                >
                  x
                </button>
              </div>

              {!isDetailsLoading && selectedApproval && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><strong>Nome:</strong> {selectedApproval.nome || '-'}</div>
                    <div><strong>Email:</strong> {selectedApproval.email || '-'}</div>
                    <div><strong>Telefone:</strong> {selectedApproval.numero || '-'}</div>
                    <div><strong>CPF:</strong> {selectedApproval.cpf || '-'}</div>
                    <div><strong>Empresa:</strong> {selectedApproval.empresa?.nome || '-'}</div>
                    <div><strong>Cargo:</strong> {selectedApproval.cargo?.nome || '-'}</div>
                    <div><strong>Regional:</strong> {selectedApproval.regional?.nome || '-'}</div>
                    <div><strong>Solicitado em:</strong> {formatDate(selectedApproval.created_at)}</div>
                  </div>

                  <div>
                    <strong>Observacao:</strong>
                    <div
                      style={{
                        marginTop: 6,
                        padding: 10,
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        minHeight: 50,
                        color: '#374151',
                        background: '#fafafa',
                      }}
                    >
                      {selectedApproval.observacao || 'Sem observacao'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => handleReject(selectedApproval.id)}
                      disabled={isApproving}
                      style={{
                        border: 'none',
                        borderRadius: 8,
                        padding: '10px 14px',
                        cursor: 'pointer',
                        background: '#dc2626',
                        color: '#fff',
                        fontWeight: 700,
                      }}
                    >
                      Rejeitar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedApproval.id)}
                      disabled={isApproving}
                      style={{
                        border: 'none',
                        borderRadius: 8,
                        padding: '10px 14px',
                        cursor: 'pointer',
                        background: '#16a34a',
                        color: '#fff',
                        fontWeight: 700,
                      }}
                    >
                      Aprovar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </ContentArea>
    </LayoutContainer>
  );
};

export default Admin;

