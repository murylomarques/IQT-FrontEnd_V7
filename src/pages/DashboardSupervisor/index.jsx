import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FcaGlobal, AppBg, Topbar, BrandWrap, BrandCode, BrandText, SessionBox,
  MainShell, AppLayout, Sidebar, NavBtn, ContentShell,
  PageTitle, Card, CardTitle, FormGrid, Field, Label, Select, Btn,
  TableWrap, Table, RoleBadge, WindowBadge, MetricsGrid, MiniCard, EmptyState,
} from '../FCA/theme';
import { fcaStorage, fcaFetch, ROLE_LABELS } from '../FCA/api';

const TABS = ['Minha Equipe', 'Vincular'];

const DashboardSupervisor = () => {
  const navigate = useNavigate();
  const name     = fcaStorage.get('name') || 'Supervisor';
  const role     = fcaStorage.get('role');
  const myId     = fcaStorage.get('id');

  const [tab,          setTab]      = useState('Minha Equipe');
  const [subordinates, setSubs]     = useState([]);
  const [available,    setAvailable]= useState([]);
  const [winData,      setWinData]  = useState(null);
  const [linkChild,    setLinkChild]= useState('');
  const [metrics,      setMetrics]  = useState(null);
  const [loading,      setLoading]  = useState(false);

  useEffect(() => {
    if (!fcaStorage.get('token') || role !== 'supervisao') navigate('/login/FCA');
  }, [navigate, role]);

  const loadData = useCallback(async () => {
    try {
      const [sub, win, dash] = await Promise.all([
        fcaFetch('/fca/hierarchy'),
        fcaFetch('/fca/window'),
        fcaFetch('/fca/dashboard'),
      ]);
      setSubs(sub.direct);
      setWinData(win);
      setMetrics(dash.metrics);
      setAvailable((dash.visible_users || []).filter((u) => u.role === 'tecnico' && !u.manager_id));
    } catch (err) { toast.error(err.message); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLink = async (e) => {
    e.preventDefault();
    if (!linkChild) { toast.error('Selecione um técnico.'); return; }
    setLoading(true);
    try {
      const res = await fcaFetch('/fca/hierarchy/link', { method: 'POST', body: JSON.stringify({ parent_id: +myId, child_id: +linkChild }) });
      toast.success(res.applied ? 'Vínculo criado.' : 'Solicitação enviada para aprovação.');
      setLinkChild('');
      loadData();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const handleUnlink = async (childId) => {
    if (!window.confirm('Remover vínculo?')) return;
    try { await fcaFetch(`/fca/hierarchy/unlink/${childId}`, { method: 'DELETE' }); toast.success('Vínculo removido.'); loadData(); }
    catch (err) { toast.error(err.message); }
  };

  const logout = () => { fcaStorage.clear(); navigate('/login/FCA'); };

  return (
    <div className="fca-root">
      <FcaGlobal />
      <AppBg>
        <Topbar>
          <BrandWrap>
            <BrandCode>GH</BrandCode>
            <BrandText>
              <div className="brand-title">FCA</div>
              <div className="brand-sub">Gestão de Hierarquia por Perfil</div>
            </BrandText>
          </BrandWrap>
          <SessionBox>
            <div>
              <div className="session-name">{name}</div>
              <div className="session-role">{ROLE_LABELS[role] || role}</div>
            </div>
            <Btn $variant="outline" className="btn-sm" onClick={logout}>Sair</Btn>
          </SessionBox>
        </Topbar>

        <MainShell>
          <AppLayout>
            <Sidebar>
              {TABS.map((t) => (
                <NavBtn key={t} $active={tab === t} onClick={() => setTab(t)}>{t}</NavBtn>
              ))}
            </Sidebar>

            <ContentShell>
              {/* ── MINHA EQUIPE ── */}
              {tab === 'Minha Equipe' && (
                <>
                  <PageTitle>Minha <span>Equipe</span></PageTitle>

                  {metrics && (
                    <MetricsGrid>
                      <MiniCard>
                        <div className="mini-label">Técnicos vinculados</div>
                        <span className="mini-value">{subordinates.length}</span>
                      </MiniCard>
                      <MiniCard>
                        <div className="mini-label">Disponíveis p/ vínculo</div>
                        <span className="mini-value">{available.length}</span>
                      </MiniCard>
                    </MetricsGrid>
                  )}

                  {winData && (
                    <div style={{ marginBottom: '1.1rem' }}>
                      <WindowBadge $open={winData.status.is_open}>
                        <span className="dot" />
                        {winData.status.is_open
                          ? `Janela aberta — dias ${winData.config.start_day} a ${winData.config.end_day}`
                          : `Janela fechada — abre dia ${winData.config.start_day}`}
                      </WindowBadge>
                      {!winData.status.is_open && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
                          Fora da janela, vínculos são enviados para aprovação do administrador.
                        </p>
                      )}
                    </div>
                  )}

                  <Card>
                    <CardTitle>Técnicos vinculados a você</CardTitle>
                    <TableWrap>
                      <Table>
                        <thead><tr><th>Nome</th><th>Matrícula</th><th>Perfil</th><th>Território</th><th>Cargo</th><th>Ação</th></tr></thead>
                        <tbody>
                          {subordinates.map((u) => (
                            <tr key={u.id}>
                              <td><strong>{u.name}</strong></td>
                              <td style={{ color: 'var(--text-muted)' }}>{u.employee_id || '—'}</td>
                              <td><RoleBadge $role={u.role}>{ROLE_LABELS[u.role] || u.role}</RoleBadge></td>
                              <td>{u.territory || '—'}</td>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.title || '—'}</td>
                              <td>
                                <Btn $variant="danger" className="btn-sm" onClick={() => handleUnlink(u.id)}>Desvincular</Btn>
                              </td>
                            </tr>
                          ))}
                          {subordinates.length === 0 && (
                            <tr><td colSpan={6}><EmptyState><div className="empty-icon">👥</div>Nenhum técnico vinculado ainda.</EmptyState></td></tr>
                          )}
                        </tbody>
                      </Table>
                    </TableWrap>
                  </Card>
                </>
              )}

              {/* ── VINCULAR ── */}
              {tab === 'Vincular' && (
                <>
                  <PageTitle>Vincular <span>Técnico</span></PageTitle>
                  <Card style={{ maxWidth: 500 }}>
                    <CardTitle>Novo vínculo</CardTitle>
                    {winData && (
                      <div style={{ marginBottom: '1rem' }}>
                        <WindowBadge $open={winData.status.is_open}>
                          <span className="dot" />
                          {winData.status.is_open ? 'Janela aberta — vínculo imediato' : 'Janela fechada — enviará para aprovação'}
                        </WindowBadge>
                      </div>
                    )}
                    <form onSubmit={handleLink}>
                      <FormGrid style={{ gridTemplateColumns: '1fr' }}>
                        <Field>
                          <Label>Técnico disponível *</Label>
                          <Select value={linkChild} onChange={(e) => setLinkChild(e.target.value)}>
                            <option value="">Selecione um técnico...</option>
                            {available.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}{t.territory ? ` — ${t.territory}` : ''}
                              </option>
                            ))}
                          </Select>
                        </Field>
                      </FormGrid>
                      <Btn type="submit" disabled={loading || !linkChild}>
                        {loading ? 'Salvando...' : winData?.status?.is_open ? 'Vincular agora' : 'Enviar solicitação'}
                      </Btn>
                    </form>
                    {available.length === 0 && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                        Nenhum técnico disponível para vínculo no momento.
                      </p>
                    )}
                  </Card>
                </>
              )}
            </ContentShell>
          </AppLayout>
        </MainShell>
      </AppBg>
    </div>
  );
};

export default DashboardSupervisor;
