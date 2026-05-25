import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FcaGlobal, AppBg, Topbar, BrandWrap, BrandCode, BrandText, SessionBox,
  MainShell, AppLayout, Sidebar, NavBtn, Badge, ContentShell,
  PageTitle, Card, CardHead, CardTitle, MetricsGrid, MiniCard,
  FormGrid, Field, Label, Input, Select, Btn, TableWrap, Table,
  RoleBadge, StatusPill, Overlay, Modal, WindowBadge, EmptyState,
} from '../FCA/theme';
import { fcaStorage, fcaFetch, ROLE_LABELS } from '../FCA/api';

const TABS = ['Dashboard', 'Usuários', 'Vínculos', 'Configurações'];
const EMPTY = { name: '', usuario: '', email: '', password: '', role: 'consulta', employee_id: '', territory: '', regional: '', title: '', manager_id: '' };

const DashboardAdm = () => {
  const navigate = useNavigate();
  const name     = fcaStorage.get('name') || 'Admin';
  const role     = fcaStorage.get('role');

  const [tab,        setTab]        = useState('Dashboard');
  const [metrics,    setMetrics]    = useState(null);
  const [visUsers,   setVisUsers]   = useState([]);
  const [users,      setUsers]      = useState([]);
  const [requests,   setRequests]   = useState([]);
  const [winData,    setWinData]    = useState(null);
  const [windowForm, setWindowForm] = useState({ start_day: 1, end_day: 7 });
  const [userForm,   setUserForm]   = useState(EMPTY);
  const [editUser,   setEditUser]   = useState(null);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [search,     setSearch]     = useState('');

  useEffect(() => {
    if (!fcaStorage.get('token') || role !== 'admin') navigate('/login/FCA');
  }, [navigate, role]);

  const loadDashboard = useCallback(async () => {
    try {
      const d = await fcaFetch('/fca/dashboard');
      setMetrics(d.metrics);
      setVisUsers(d.visible_users);
    } catch (err) { toast.error(err.message); }
  }, []);

  const loadUsers    = useCallback(async () => { try { setUsers(await fcaFetch('/fca/users')); } catch (e) { toast.error(e.message); } }, []);
  const loadRequests = useCallback(async () => { try { setRequests(await fcaFetch('/fca/link-requests')); } catch (e) { toast.error(e.message); } }, []);
  const loadWindow   = useCallback(async () => {
    try {
      const d = await fcaFetch('/fca/window');
      setWinData(d);
      setWindowForm({ start_day: d.config.start_day, end_day: d.config.end_day });
    } catch (e) { toast.error(e.message); }
  }, []);

  useEffect(() => {
    loadDashboard(); loadUsers(); loadRequests(); loadWindow();
  }, [loadDashboard, loadUsers, loadRequests, loadWindow]);

  const logout = () => { fcaStorage.clear(); navigate('/login/FCA'); };

  // ── User CRUD ──
  const openCreate = () => { setEditUser(null); setUserForm(EMPTY); setModalOpen(true); };
  const openEdit   = (u) => {
    setEditUser(u);
    setUserForm({ name: u.name, usuario: u.usuario, email: u.email || '', password: '', role: u.role, employee_id: u.employee_id || '', territory: u.territory || '', regional: u.regional || '', title: u.title || '', manager_id: u.manager_id || '' });
    setModalOpen(true);
  };

  const saveUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...userForm };
      if (!body.password) delete body.password;
      if (!body.email) body.email = null;
      if (!body.manager_id) body.manager_id = null;
      if (editUser) {
        await fcaFetch(`/fca/users/${editUser.id}`, { method: 'PUT', body: JSON.stringify(body) });
        toast.success('Usuário atualizado.');
      } else {
        await fcaFetch('/fca/users', { method: 'POST', body: JSON.stringify(body) });
        toast.success('Usuário criado.');
      }
      setModalOpen(false);
      loadUsers(); loadDashboard();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const deleteUser = async (u) => {
    if (!window.confirm(`Excluir ${u.name}?`)) return;
    try {
      await fcaFetch(`/fca/users/${u.id}`, { method: 'DELETE' });
      toast.success('Usuário excluído.');
      loadUsers(); loadDashboard();
    } catch (err) { toast.error(err.message); }
  };

  // ── CSV ──
  const exportCsv = async () => {
    try {
      const blob = await fcaFetch('/fca/users/export-csv');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `usuarios_fca_${Date.now()}.csv`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { toast.error(err.message); }
  };

  const importCsv = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const form = new FormData(); form.append('file', file);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br'}/api/fca/users/import-csv`, { method: 'POST', headers: { Authorization: `Bearer ${fcaStorage.get('token')}` }, body: form });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Erro');
      toast.success(data.message); loadUsers();
    } catch (err) { toast.error(err.message); }
    e.target.value = '';
  };

  // ── Link Requests ──
  const decide = async (id, action) => {
    try {
      await fcaFetch(`/fca/link-requests/${id}/${action}`, { method: 'PUT', body: JSON.stringify({ note: action === 'approve' ? 'Aprovado.' : 'Reprovado.' }) });
      toast.success(action === 'approve' ? 'Vínculo aprovado.' : 'Reprovado.');
      loadRequests(); loadUsers();
    } catch (err) { toast.error(err.message); }
  };

  // ── Window ──
  const saveWindow = async (e) => {
    e.preventDefault();
    try { await fcaFetch('/fca/window', { method: 'PUT', body: JSON.stringify(windowForm) }); toast.success('Janela atualizada.'); loadWindow(); }
    catch (err) { toast.error(err.message); }
  };

  const filtered  = users.filter((u) => [u.name, u.usuario, u.email, u.role, u.territory].some((v) => (v || '').toLowerCase().includes(search.toLowerCase())));
  const pending   = requests.filter((r) => r.status === 'pending');

  return (
    <div className="fca-root">
      <FcaGlobal />
      <AppBg>
        {/* ── Topbar ── */}
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
            {/* ── Sidebar ── */}
            <Sidebar>
              {TABS.map((t) => (
                <NavBtn key={t} $active={tab === t} onClick={() => setTab(t)}>
                  {t}
                  {t === 'Vínculos' && pending.length > 0 && <Badge>{pending.length}</Badge>}
                </NavBtn>
              ))}
            </Sidebar>

            {/* ── Content ── */}
            <ContentShell>

              {/* DASHBOARD */}
              {tab === 'Dashboard' && (
                <>
                  <PageTitle>Dashboard <span>Geral</span></PageTitle>
                  {metrics && (
                    <MetricsGrid>
                      <MiniCard><div className="mini-label">Total</div><span className="mini-value">{metrics.total}</span></MiniCard>
                      <MiniCard><div className="mini-label">Técnicos</div><span className="mini-value">{metrics.tecnico}</span></MiniCard>
                      <MiniCard><div className="mini-label">Supervisão</div><span className="mini-value">{metrics.supervisao}</span></MiniCard>
                      <MiniCard><div className="mini-label">Coordenação</div><span className="mini-value">{metrics.coordenacao}</span></MiniCard>
                      <MiniCard><div className="mini-label">Não vinculados</div><span className="mini-value">{metrics.nao_vinculados}</span></MiniCard>
                    </MetricsGrid>
                  )}
                  <Card>
                    <CardTitle>Todos os usuários</CardTitle>
                    <TableWrap>
                      <Table>
                        <thead><tr><th>Nome</th><th>Usuário</th><th>Perfil</th><th>Território</th><th>Superior</th></tr></thead>
                        <tbody>
                          {visUsers.map((u) => (
                            <tr key={u.id}>
                              <td><strong>{u.name}</strong></td>
                              <td style={{ color: 'var(--text-muted)' }}>{u.usuario}</td>
                              <td><RoleBadge $role={u.role}>{ROLE_LABELS[u.role] || u.role}</RoleBadge></td>
                              <td>{u.territory || '—'}</td>
                              <td>{u.manager_name || <span style={{ color: 'var(--text-light)' }}>—</span>}</td>
                            </tr>
                          ))}
                          {visUsers.length === 0 && <tr><td colSpan={5}><EmptyState><div className="empty-icon">👥</div>Nenhum usuário cadastrado.</EmptyState></td></tr>}
                        </tbody>
                      </Table>
                    </TableWrap>
                  </Card>
                </>
              )}

              {/* USUÁRIOS */}
              {tab === 'Usuários' && (
                <>
                  <PageTitle>Gestão de <span>Usuários</span></PageTitle>
                  <Card>
                    <CardHead>
                      <Input style={{ maxWidth: 280, borderRadius: '999px' }} placeholder="🔍  Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Btn onClick={openCreate}>+ Adicionar</Btn>
                        <Btn $variant="ghost" onClick={exportCsv}>↓ Exportar CSV</Btn>
                        <label style={{ cursor: 'pointer' }}>
                          <Btn $variant="ghost" as="span">↑ Importar CSV</Btn>
                          <input type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={importCsv} />
                        </label>
                      </div>
                    </CardHead>
                    <TableWrap>
                      <Table>
                        <thead><tr><th>Nome</th><th>Usuário</th><th>E-mail</th><th>Perfil</th><th>Território</th><th>Superior</th><th>Ações</th></tr></thead>
                        <tbody>
                          {filtered.map((u) => (
                            <tr key={u.id}>
                              <td><strong>{u.name}</strong></td>
                              <td style={{ color: 'var(--text-muted)' }}>{u.usuario}</td>
                              <td style={{ color: 'var(--text-muted)' }}>{u.email || '—'}</td>
                              <td><RoleBadge $role={u.role}>{ROLE_LABELS[u.role] || u.role}</RoleBadge></td>
                              <td>{u.territory || '—'}</td>
                              <td>{u.manager_name || '—'}</td>
                              <td>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <Btn $variant="ghost" className="btn-sm" onClick={() => openEdit(u)}>Editar</Btn>
                                  <Btn $variant="danger" className="btn-sm" onClick={() => deleteUser(u)}>Excluir</Btn>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {filtered.length === 0 && <tr><td colSpan={7}><EmptyState><div className="empty-icon">🔍</div>Nenhum resultado encontrado.</EmptyState></td></tr>}
                        </tbody>
                      </Table>
                    </TableWrap>
                  </Card>
                </>
              )}

              {/* VÍNCULOS */}
              {tab === 'Vínculos' && (
                <>
                  <PageTitle>Solicitações de <span>Vínculo</span></PageTitle>
                  {pending.length > 0 && (
                    <div style={{ background: 'rgba(184,108,16,0.12)', border: '1px solid rgba(184,108,16,0.3)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.84rem', fontWeight: 700, color: '#7a4a00' }}>
                      ⚠️ {pending.length} solicitação{pending.length > 1 ? 'ões' : ''} aguardando sua decisão.
                    </div>
                  )}
                  <Card>
                    <CardTitle>Todos os pedidos ({requests.length})</CardTitle>
                    <TableWrap>
                      <Table>
                        <thead><tr><th>#</th><th>Solicitante</th><th>Superior</th><th>Colaborador</th><th>Data</th><th>Status</th><th>Ação</th></tr></thead>
                        <tbody>
                          {requests.map((r) => (
                            <tr key={r.id}>
                              <td style={{ color: 'var(--text-light)', fontSize: '0.76rem' }}>{r.id}</td>
                              <td>{r.requester?.name || '—'}</td>
                              <td><strong>{r.parent?.name || '—'}</strong> <RoleBadge $role={r.parent_role} style={{ marginLeft: 4 }}>{r.parent_role}</RoleBadge></td>
                              <td><strong>{r.child?.name || '—'}</strong> <RoleBadge $role={r.child_role} style={{ marginLeft: 4 }}>{r.child_role}</RoleBadge></td>
                              <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.requested_at ? new Date(r.requested_at).toLocaleDateString('pt-BR') : '—'}</td>
                              <td><StatusPill $status={r.status}>{r.status}</StatusPill></td>
                              <td>
                                {r.status === 'pending' && (
                                  <div style={{ display: 'flex', gap: 6 }}>
                                    <Btn $variant="success" className="btn-sm" onClick={() => decide(r.id, 'approve')}>Aprovar</Btn>
                                    <Btn $variant="danger"  className="btn-sm" onClick={() => decide(r.id, 'reject')}>Reprovar</Btn>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                          {requests.length === 0 && <tr><td colSpan={7}><EmptyState><div className="empty-icon">✅</div>Nenhuma solicitação pendente.</EmptyState></td></tr>}
                        </tbody>
                      </Table>
                    </TableWrap>
                  </Card>
                </>
              )}

              {/* CONFIGURAÇÕES */}
              {tab === 'Configurações' && (
                <>
                  <PageTitle><span>Configurações</span></PageTitle>
                  <Card style={{ maxWidth: 500 }}>
                    <CardTitle>Janela de Seleção Mensal</CardTitle>
                    {winData && (
                      <div style={{ marginBottom: '1.2rem' }}>
                        <WindowBadge $open={winData.status.is_open}>
                          <span className="dot" />
                          {winData.status.is_open ? 'Janela aberta' : 'Janela fechada'}
                        </WindowBadge>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
                          Dias <strong>{winData.config.start_day}</strong> a <strong>{winData.config.end_day}</strong> de cada mês.
                          {' '}Próxima mudança: <strong>{new Date(winData.status.next_change_at).toLocaleDateString('pt-BR')}</strong>.
                        </p>
                      </div>
                    )}
                    <form onSubmit={saveWindow}>
                      <FormGrid style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <Field>
                          <Label>Dia de início</Label>
                          <Input type="number" min={1} max={31} value={windowForm.start_day} onChange={(e) => setWindowForm((p) => ({ ...p, start_day: +e.target.value }))} />
                        </Field>
                        <Field>
                          <Label>Dia de fim</Label>
                          <Input type="number" min={1} max={31} value={windowForm.end_day} onChange={(e) => setWindowForm((p) => ({ ...p, end_day: +e.target.value }))} />
                        </Field>
                      </FormGrid>
                      <Btn type="submit" style={{ marginTop: 4 }}>Salvar Janela</Btn>
                    </form>
                  </Card>
                </>
              )}
            </ContentShell>
          </AppLayout>
        </MainShell>
      </AppBg>

      {/* ── Modal criar / editar ── */}
      {modalOpen && (
        <Overlay onClick={() => setModalOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3>{editUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <form onSubmit={saveUser}>
              <FormGrid>
                <Field><Label>Nome *</Label><Input value={userForm.name} onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))} required /></Field>
                <Field><Label>Usuário *</Label><Input value={userForm.usuario} onChange={(e) => setUserForm((p) => ({ ...p, usuario: e.target.value }))} required /></Field>
                <Field><Label>E-mail</Label><Input type="email" value={userForm.email} onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))} /></Field>
                <Field><Label>{editUser ? 'Nova senha (opcional)' : 'Senha *'}</Label><Input type="password" value={userForm.password} onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))} required={!editUser} /></Field>
                <Field>
                  <Label>Perfil *</Label>
                  <Select value={userForm.role} onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value }))}>
                    {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </Select>
                </Field>
                <Field><Label>Matrícula</Label><Input value={userForm.employee_id} onChange={(e) => setUserForm((p) => ({ ...p, employee_id: e.target.value }))} /></Field>
                <Field><Label>Território</Label><Input value={userForm.territory} onChange={(e) => setUserForm((p) => ({ ...p, territory: e.target.value }))} /></Field>
                <Field><Label>Regional</Label><Input value={userForm.regional} onChange={(e) => setUserForm((p) => ({ ...p, regional: e.target.value }))} /></Field>
                <Field><Label>Cargo / Título</Label><Input value={userForm.title} onChange={(e) => setUserForm((p) => ({ ...p, title: e.target.value }))} /></Field>
                <Field><Label>ID do Superior</Label><Input type="number" value={userForm.manager_id} onChange={(e) => setUserForm((p) => ({ ...p, manager_id: e.target.value }))} placeholder="(opcional)" /></Field>
              </FormGrid>
              <div className="modal-actions">
                <Btn $variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancelar</Btn>
                <Btn type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Btn>
              </div>
            </form>
          </Modal>
        </Overlay>
      )}
    </div>
  );
};

export default DashboardAdm;
