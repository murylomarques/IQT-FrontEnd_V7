import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FcaGlobal, FcaWrap, Topbar, BrandRow, BrandLogo, BrandMeta, SessionPill,
  Shell, AppLayout, SideNav, NavBtn, NavBadge, ContentArea,
  PageTitle, Card, CardRow, CardLabel, MetricsRow, Metric,
  FGrid, Fld, Lbl, Inp, Sel, Btn, TblWrap, Tbl,
  RBadge, SPill, Overlay, ModalBox, WinBadge, Empty, Alert,
} from '../FCA/theme';
import { fcaStorage, fcaFetch, ROLE_LABELS } from '../FCA/api';

const TABS = ['Dashboard', 'Usuários', 'Hierarquia', 'Vínculos', 'Configurações'];

// ── Hierarchy helpers ─────────────────────────────────────────────────────────
const hierMatchStr = (node, q) =>
  !q ||
  (node.name        || '').toLowerCase().includes(q.toLowerCase()) ||
  (node.employee_id || '').toLowerCase().includes(q.toLowerCase()) ||
  (node.cpf         || '').toLowerCase().includes(q.toLowerCase());

const hierMatchNode = (node, q) =>
  hierMatchStr(node, q) ||
  (node.subordinates || []).some((s) =>
    hierMatchStr(s, q) || (s.subordinates || []).some((t) => hierMatchStr(t, q))
  );

const LEVEL_STYLE = {
  0: { bg: 'rgba(174,46,42,0.08)', border: 'rgba(174,46,42,0.25)', label: 'Coordenador', labelColor: '#ae2e2a' },
  1: { bg: 'rgba(212,113,32,0.07)', border: 'rgba(212,113,32,0.22)', label: 'Supervisor', labelColor: '#d47120' },
  2: { bg: 'rgba(53,48,45,0.04)', border: 'rgba(53,48,45,0.12)', label: 'Técnico', labelColor: '#5a5551' },
};

const HierNode = ({ node, depth = 0, search = '' }) => {
  const s = LEVEL_STYLE[depth] || LEVEL_STYLE[2];
  const subs = node.subordinates || [];
  const visibleSubs = search
    ? subs.filter((sub) =>
        hierMatchStr(sub, search) || (sub.subordinates || []).some((t) => hierMatchStr(t, search))
      )
    : subs;

  return (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 10,
      padding: depth === 0 ? '1rem 1.1rem' : depth === 1 ? '0.75rem 1rem' : '0.55rem 0.9rem',
      marginLeft: depth * 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: s.labelColor,
          background: 'rgba(255,255,255,0.7)', borderRadius: 4,
          padding: '2px 7px', border: `1px solid ${s.border}`,
        }}>
          {s.label}
        </span>
        <span style={{ fontWeight: depth === 0 ? 700 : depth === 1 ? 600 : 500, fontSize: depth === 0 ? '0.97rem' : '0.88rem' }}>
          {node.name}
        </span>
        {node.employee_id && (
          <span style={{ fontSize: '0.76rem', color: '#9a948f', background: 'rgba(255,255,255,0.6)', borderRadius: 4, padding: '1px 6px' }}>
            Mat: <strong>{node.employee_id}</strong>
          </span>
        )}
        {node.cpf && (
          <span style={{ fontSize: '0.76rem', color: '#9a948f', background: 'rgba(255,255,255,0.6)', borderRadius: 4, padding: '1px 6px' }}>
            CPF: <strong>{node.cpf}</strong>
          </span>
        )}
        {node.empresa && (
          <span style={{ fontSize: '0.74rem', color: '#5a5551', background: 'rgba(255,255,255,0.75)', borderRadius: 4, padding: '1px 7px', fontStyle: 'italic' }}>
            {node.empresa}
          </span>
        )}
        {node.regional && (
          <span style={{ fontSize: '0.72rem', color: '#9a948f', marginLeft: 'auto' }}>{node.regional}</span>
        )}
      </div>
      {visibleSubs.length > 0 && (
        <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {visibleSubs.map((sub) => (
            <HierNode key={sub.id} node={sub} depth={depth + 1} search={search} />
          ))}
        </div>
      )}
    </div>
  );
};
const EMPTY = { name: '', usuario: '', email: '', password: '', role: 'consulta', employee_id: '', cpf: '', empresa: '', territory: '', regional: '', title: '', manager_id: '', data_admissao: '', data_demissao: '', observacao: '' };

const monthLabelFromDate = (value) => {
  if (!value) return '';
  const raw = String(value).trim();
  const iso = raw.match(/^(\d{4})-(\d{2})-\d{2}/);
  if (iso) return `${iso[2]}/${iso[1]}`;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return '';

  return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

const currentBaseLabelFromUsers = (users) => {
  const counts = users.reduce((acc, user) => {
    if (!['tecnico', 'supervisao', 'coordenacao'].includes(user.role)) return acc;
    const label = monthLabelFromDate(user.created_at);
    if (!label) return acc;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const [label] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [];
  return label ? `Base ${label}` : 'Base vigente';
};

const DashboardAdm = () => {
  const navigate = useNavigate();
  const name     = fcaStorage.get('name') || 'Admin';
  const role     = fcaStorage.get('role');
  const isReadOnly = role === 'consulta';

  const [tab,        setTab]        = useState('Dashboard');
  const [metrics,    setMetrics]    = useState(null);
  const [visUsers,   setVisUsers]   = useState([]);
  const [users,      setUsers]      = useState([]);
  const [requests,   setRequests]   = useState([]);
  const [hierarchy,  setHierarchy]  = useState([]);
  const [winData,    setWinData]    = useState(null);
  const [windowForm, setWindowForm] = useState({ start_day: 1, end_day: 7 });
  const [userForm,   setUserForm]   = useState(EMPTY);
  const [editUser,   setEditUser]   = useState(null);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [search,     setSearch]     = useState('');
  const [hierSearch, setHierSearch] = useState('');
  const [superSearch, setSuperSearch] = useState('');
  const [superOpen,   setSuperOpen]   = useState(false);
  const [metricFilter, setMetricFilter] = useState('');
  const [importHistory, setImportHistory] = useState([]);
  const [exportImportId, setExportImportId] = useState('');

  useEffect(() => {
    if (!fcaStorage.get('token') || !['admin', 'consulta'].includes(role)) navigate('/login/GH');
  }, [navigate, role]);

  const loadDashboard = useCallback(async () => {
    try {
      const d = await fcaFetch('/fca/dashboard');
      setMetrics(d.metrics);
      setVisUsers(d.visible_users);
    } catch (err) { toast.error(err.message); }
  }, []);

  const loadUsers     = useCallback(async () => { try { setUsers(await fcaFetch('/fca/users')); } catch (e) { toast.error(e.message); } }, []);
  const loadRequests  = useCallback(async () => { try { setRequests(await fcaFetch('/fca/link-requests')); } catch (e) { toast.error(e.message); } }, []);
  const loadHierarchy = useCallback(async () => { try { setHierarchy(await fcaFetch('/fca/hierarchy/full-tree')); } catch (e) { toast.error(e.message); } }, []);
  const loadImports   = useCallback(async () => {
    if (isReadOnly) { setImportHistory([]); return; }
    try { setImportHistory(await fcaFetch('/fca/users/imports')); } catch (e) { toast.error(e.message); }
  }, [isReadOnly]);
  const loadWindow   = useCallback(async () => {
    try {
      const d = await fcaFetch('/fca/window');
      setWinData(d);
      setWindowForm({ start_day: d.config.start_day, end_day: d.config.end_day });
    } catch (e) { toast.error(e.message); }
  }, []);

  useEffect(() => {
    loadDashboard(); loadUsers(); loadRequests(); loadHierarchy(); loadImports(); loadWindow();
  }, [loadDashboard, loadUsers, loadRequests, loadHierarchy, loadImports, loadWindow]);

  const logout = () => { fcaStorage.clear(); navigate('/login/GH'); };

  // ── User CRUD ──
  const openCreate = () => {
    if (isReadOnly) return;
    setEditUser(null); setUserForm(EMPTY); setSuperSearch(''); setSuperOpen(false); setModalOpen(true);
  };
  const openEdit   = (u) => {
    if (isReadOnly) return;
    setEditUser(u);
    setUserForm({ name: u.name, usuario: u.usuario, email: u.email || '', password: '', role: u.role, employee_id: u.employee_id || '', cpf: u.cpf || '', empresa: u.empresa || '', territory: u.territory || '', regional: u.regional || '', title: u.title || '', manager_id: u.manager_id || '', data_admissao: u.data_admissao || '', data_demissao: u.data_demissao || '', observacao: u.observacao || '' });
    setSuperSearch(''); setSuperOpen(false);
    setModalOpen(true);
  };

  const saveUser = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    setSaving(true);
    try {
      const body = { ...userForm };
      if (!body.password) delete body.password;
      if (!body.email) body.email = null;
      if (!body.manager_id) body.manager_id = null;
      if (!body.data_admissao) body.data_admissao = null;
      if (!body.data_demissao) body.data_demissao = null;
      if (!body.observacao) body.observacao = null;
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
    if (isReadOnly) return;
    if (!window.confirm(`Excluir ${u.name}?`)) return;
    try {
      await fcaFetch(`/fca/users/${u.id}`, { method: 'DELETE' });
      toast.success('Usuário excluído.');
      loadUsers(); loadDashboard();
    } catch (err) { toast.error(err.message); }
  };

  // ── CSV ──
  const exportCsv = async () => {
    if (isReadOnly) return;
    try {
      const qs = exportImportId ? `?import_id=${encodeURIComponent(exportImportId)}` : '';
      const blob = await fcaFetch(`/fca/users/export-csv${qs}`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `usuarios_gh_hierarquia_${Date.now()}.csv`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { toast.error(err.message); }
  };

  const importCsv = async (e) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0]; if (!file) return;
    const form = new FormData(); form.append('file', file);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br'}/api/fca/users/import-csv`, { method: 'POST', headers: { Authorization: `Bearer ${fcaStorage.get('token')}` }, body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Erro no servidor');
      if ((data.created ?? 0) === 0 && (data.updated ?? 0) === 0) {
        toast.warn(data.message + (data.errors?.length ? ` — ${data.errors.length} erro(s).` : ''));
      } else {
        toast.success(data.message);
      }
      if (data.errors?.length) console.warn('Import errors:', data.errors);
      loadUsers(); loadHierarchy(); loadImports();
    } catch (err) { toast.error(err.message); }
    e.target.value = '';
  };

  // ── Link Requests ──
  const decide = async (id, action) => {
    if (isReadOnly) return;
    try {
      await fcaFetch(`/fca/link-requests/${id}/${action}`, { method: 'PUT', body: JSON.stringify({ note: action === 'approve' ? 'Aprovado.' : 'Reprovado.' }) });
      toast.success(action === 'approve' ? 'Vínculo aprovado.' : 'Reprovado.');
      loadRequests(); loadUsers();
    } catch (err) { toast.error(err.message); }
  };

  // ── Window ──
  const saveWindow = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    try { await fcaFetch('/fca/window', { method: 'PUT', body: JSON.stringify(windowForm) }); toast.success('Janela atualizada.'); loadWindow(); }
    catch (err) { toast.error(err.message); }
  };

  const filtered = users.filter((u) => [u.name, u.usuario, u.email, u.role, u.territory].some((v) => (v || '').toLowerCase().includes(search.toLowerCase())));
  const pending  = requests.filter((r) => r.status === 'pending');
  const selectedSuperior = users.find((u) => String(u.id) === String(userForm.manager_id));
  const filteredSupers   = users.filter((u) => !superSearch || u.name.toLowerCase().includes(superSearch.toLowerCase()));
  const currentBaseLabel = useMemo(() => currentBaseLabelFromUsers(users), [users]);
  const dashboardRows = visUsers.filter((u) => {
    if (!metricFilter) return true;
    if (metricFilter === 'nao_vinculados') {
      return ['tecnico', 'supervisao'].includes(u.role) && !u.manager_id;
    }
    return u.role === metricFilter;
  });

  return (
    <FcaWrap>
      <FcaGlobal />
      {/* ── Topbar ── */}
      <Topbar>
        <BrandRow>
          <BrandLogo>GH</BrandLogo>
          <BrandMeta>
            <div className="title">FCA</div>
            <div className="sub">Gestão de Hierarquia por Perfil</div>
          </BrandMeta>
        </BrandRow>
        <SessionPill>
          <div>
            <div className="sname">{name}</div>
            <div className="srole">{ROLE_LABELS[role] || role}</div>
          </div>
          <Btn $v="outline" className="sm" onClick={logout}>Sair</Btn>
        </SessionPill>
      </Topbar>

      <Shell>
        <AppLayout>
          {/* ── Sidebar ── */}
          <SideNav>
            {TABS.map((t) => (
              <NavBtn key={t} $active={tab === t} onClick={() => setTab(t)}>
                {t}
                {t === 'Vínculos' && pending.length > 0 && <NavBadge>{pending.length}</NavBadge>}
              </NavBtn>
            ))}
          </SideNav>

          {/* ── Content ── */}
          <ContentArea>

            {/* DASHBOARD */}
            {tab === 'Dashboard' && (
              <>
                <PageTitle>Dashboard <em>Geral</em></PageTitle>
                {metrics && (
                  <MetricsRow>
                    <Metric as="button" type="button" $active={!metricFilter} onClick={() => setMetricFilter('')}>
                      <div className="label">Total</div><div className="value">{metrics.total}</div>
                    </Metric>
                    <Metric as="button" type="button" $active={metricFilter === 'tecnico'} onClick={() => setMetricFilter(metricFilter === 'tecnico' ? '' : 'tecnico')}>
                      <div className="label">Técnicos</div><div className="value">{metrics.tecnico}</div>
                    </Metric>
                    <Metric as="button" type="button" $active={metricFilter === 'supervisao'} onClick={() => setMetricFilter(metricFilter === 'supervisao' ? '' : 'supervisao')}>
                      <div className="label">Supervisão</div><div className="value">{metrics.supervisao}</div>
                    </Metric>
                    <Metric as="button" type="button" $active={metricFilter === 'coordenacao'} onClick={() => setMetricFilter(metricFilter === 'coordenacao' ? '' : 'coordenacao')}>
                      <div className="label">Coordenação</div><div className="value">{metrics.coordenacao}</div>
                    </Metric>
                    <Metric as="button" type="button" $active={metricFilter === 'nao_vinculados'} onClick={() => setMetricFilter(metricFilter === 'nao_vinculados' ? '' : 'nao_vinculados')}>
                      <div className="label">Não vinculados</div><div className="value">{metrics.nao_vinculados}</div>
                    </Metric>
                  </MetricsRow>
                )}
                <Card>
                  <CardLabel>Todos os usuários</CardLabel>
                  <TblWrap style={{ marginTop: '0.8rem' }}>
                    <Tbl>
                      <thead><tr><th>Nome</th><th>Usuário</th><th>Perfil</th><th>Território</th><th>Superior</th></tr></thead>
                      <tbody>
                        {dashboardRows.map((u) => (
                          <tr key={u.id}>
                            <td><strong>{u.name}</strong></td>
                            <td style={{ color: '#9a948f' }}>{u.usuario}</td>
                            <td><RBadge $r={u.role}>{ROLE_LABELS[u.role] || u.role}</RBadge></td>
                            <td>{u.territory || '—'}</td>
                            <td style={{ color: '#9a948f' }}>{u.manager_name || '—'}</td>
                          </tr>
                        ))}
                        {dashboardRows.length === 0 && (
                          <tr><td colSpan={5}><Empty><div className="icon">👥</div>Nenhum usuário cadastrado.</Empty></td></tr>
                        )}
                      </tbody>
                    </Tbl>
                  </TblWrap>
                </Card>
              </>
            )}

            {/* USUÁRIOS */}
            {tab === 'Usuários' && (
              <>
                <PageTitle>Gestão de <em>Usuários</em></PageTitle>
                <Card>
                  <CardRow>
                    <Inp style={{ maxWidth: 280, borderRadius: '999px' }} placeholder="🔍  Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    {!isReadOnly && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Btn onClick={openCreate}>+ Adicionar</Btn>
                        <Sel
                          value={exportImportId}
                          onChange={(e) => setExportImportId(e.target.value)}
                          style={{ width: 240, minHeight: 36 }}
                          title="Periodo da extracao"
                        >
                          <option value="">{currentBaseLabel}</option>
                          {importHistory.map((item) => (
                            <option key={item.id} value={item.id}>
                              {(item.label || 'Importacao')}{item.created_at ? ` - ${new Date(item.created_at).toLocaleDateString('pt-BR')}` : ''}
                            </option>
                          ))}
                        </Sel>
                        <Btn $v="ghost" onClick={exportCsv}>↓ Exportar CSV</Btn>
                        <label style={{ cursor: 'pointer' }}>
                          <Btn $v="ghost" as="span">↑ Importar CSV</Btn>
                          <input type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={importCsv} />
                        </label>
                      </div>
                    )}
                  </CardRow>
                  <TblWrap>
                    <Tbl>
                      <thead>
                        <tr>
                          <th>Nome</th><th>Usuário</th><th>E-mail</th><th>Perfil</th><th>Território</th><th>Superior</th><th>Admissão</th><th>Demissão</th><th>Observação</th>
                          {!isReadOnly && <th>Ações</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((u) => (
                          <tr key={u.id}>
                            <td><strong>{u.name}</strong></td>
                            <td style={{ color: '#9a948f' }}>{u.usuario}</td>
                            <td style={{ color: '#9a948f' }}>{u.email || '—'}</td>
                            <td><RBadge $r={u.role}>{ROLE_LABELS[u.role] || u.role}</RBadge></td>
                            <td>{u.territory || '—'}</td>
                            <td>{u.manager_name || '—'}</td>
                            <td style={{ color: '#9a948f', whiteSpace: 'nowrap' }}>{u.data_admissao ? new Date(u.data_admissao + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td>
                            <td style={{ color: u.data_demissao ? '#ae2e2a' : '#9a948f', whiteSpace: 'nowrap', fontWeight: u.data_demissao ? 600 : 400 }}>{u.data_demissao ? new Date(u.data_demissao + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td>
                            <td style={{ color: '#9a948f', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={u.observacao || ''}>{u.observacao || '—'}</td>
                            {!isReadOnly && (
                              <td>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <Btn $v="ghost" className="sm" onClick={() => openEdit(u)}>Editar</Btn>
                                  <Btn $v="danger" className="sm" onClick={() => deleteUser(u)}>Excluir</Btn>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                        {filtered.length === 0 && (
                          <tr><td colSpan={isReadOnly ? 9 : 10}><Empty><div className="icon">🔍</div>Nenhum resultado encontrado.</Empty></td></tr>
                        )}
                      </tbody>
                    </Tbl>
                  </TblWrap>
                </Card>
              </>
            )}

            {/* HIERARQUIA */}
            {tab === 'Hierarquia' && (
              <>
                <PageTitle>Árvore de <em>Hierarquia</em></PageTitle>
                <Card>
                  <CardRow>
                    <Inp
                      style={{ maxWidth: 300, borderRadius: '999px' }}
                      placeholder="🔍  Buscar nome, matrícula ou CPF..."
                      value={hierSearch}
                      onChange={(e) => setHierSearch(e.target.value)}
                    />
                    <Btn $v="ghost" onClick={loadHierarchy}>↻ Atualizar</Btn>
                  </CardRow>

                  {hierarchy.length === 0 && (
                    <Empty style={{ marginTop: '2rem' }}>
                      <div className="icon">🏢</div>
                      Nenhum coordenador cadastrado. Importe um CSV ou vincule usuários.
                    </Empty>
                  )}

                  <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {hierarchy
                      .filter((coord) => hierMatchNode(coord, hierSearch))
                      .map((coord) => (
                        <HierNode key={coord.id} node={coord} search={hierSearch} />
                      ))}
                  </div>
                </Card>
              </>
            )}

            {/* VÍNCULOS */}
            {tab === 'Vínculos' && (
              <>
                <PageTitle>Solicitações de <em>Vínculo</em></PageTitle>
                {pending.length > 0 && (
                  <Alert $t="warn">
                    ⚠️ {pending.length} solicitação{pending.length > 1 ? 'ões' : ''} {isReadOnly ? 'pendente.' : 'aguardando sua decisão.'}
                  </Alert>
                )}
                <Card>
                  <CardLabel>Todos os pedidos ({requests.length})</CardLabel>
                  <TblWrap style={{ marginTop: '0.8rem' }}>
                    <Tbl>
                      <thead>
                        <tr>
                          <th>#</th><th>Solicitante</th><th>Superior</th><th>Colaborador</th><th>Data</th><th>Status</th>
                          {!isReadOnly && <th>Ação</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((r) => (
                          <tr key={r.id}>
                            <td style={{ color: '#9a948f', fontSize: '0.76rem' }}>{r.id}</td>
                            <td>{r.requester?.name || '—'}</td>
                            <td>
                              <strong>{r.parent?.name || '—'}</strong>
                              <RBadge $r={r.parent_role} style={{ marginLeft: 4 }}>{r.parent_role}</RBadge>
                            </td>
                            <td>
                              <strong>{r.child?.name || '—'}</strong>
                              <RBadge $r={r.child_role} style={{ marginLeft: 4 }}>{r.child_role}</RBadge>
                            </td>
                            <td style={{ fontSize: '0.78rem', color: '#9a948f' }}>{r.requested_at ? new Date(r.requested_at).toLocaleDateString('pt-BR') : '—'}</td>
                            <td><SPill $s={r.status}>{r.status}</SPill></td>
                            {!isReadOnly && (
                              <td>
                                {r.status === 'pending' && (
                                  <div style={{ display: 'flex', gap: 6 }}>
                                    <Btn $v="success" className="sm" onClick={() => decide(r.id, 'approve')}>Aprovar</Btn>
                                    <Btn $v="danger"  className="sm" onClick={() => decide(r.id, 'reject')}>Reprovar</Btn>
                                  </div>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                        {requests.length === 0 && (
                          <tr><td colSpan={isReadOnly ? 6 : 7}><Empty><div className="icon">✅</div>Nenhuma solicitação pendente.</Empty></td></tr>
                        )}
                      </tbody>
                    </Tbl>
                  </TblWrap>
                </Card>
              </>
            )}

            {/* CONFIGURAÇÕES */}
            {tab === 'Configurações' && (
              <>
                <PageTitle><em>Configurações</em></PageTitle>
                <Card style={{ maxWidth: 500 }}>
                  <CardLabel>Janela de Seleção Mensal</CardLabel>
                  {winData && (
                    <div style={{ margin: '0.8rem 0 1.2rem' }}>
                      <WinBadge $open={winData.status.is_open}>
                        <span className="dot" />
                        {winData.status.is_open ? 'Janela aberta' : 'Janela fechada'}
                      </WinBadge>
                      <p style={{ fontSize: '0.8rem', color: '#9a948f', marginTop: 8, lineHeight: 1.5 }}>
                        Dias <strong>{winData.config.start_day}</strong> a <strong>{winData.config.end_day}</strong> de cada mês.
                        {' '}Próxima mudança: <strong>{new Date(winData.status.next_change_at).toLocaleDateString('pt-BR')}</strong>.
                      </p>
                    </div>
                  )}
                  <form onSubmit={saveWindow}>
                    <FGrid style={{ gridTemplateColumns: '1fr 1fr' }}>
                      <Fld>
                        <Lbl>Dia de início</Lbl>
                        <Inp type="number" min={1} max={31} value={windowForm.start_day} disabled={isReadOnly} onChange={(e) => setWindowForm((p) => ({ ...p, start_day: +e.target.value }))} />
                      </Fld>
                      <Fld>
                        <Lbl>Dia de fim</Lbl>
                        <Inp type="number" min={1} max={31} value={windowForm.end_day} disabled={isReadOnly} onChange={(e) => setWindowForm((p) => ({ ...p, end_day: +e.target.value }))} />
                      </Fld>
                    </FGrid>
                    {!isReadOnly && <Btn type="submit" style={{ marginTop: 4 }}>Salvar Janela</Btn>}
                  </form>
                </Card>

              </>
            )}
          </ContentArea>
        </AppLayout>
      </Shell>

      {/* ── Modal criar / editar ── */}
      {modalOpen && !isReadOnly && (
        <Overlay onClick={() => setModalOpen(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <h3>{editUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <form onSubmit={saveUser}>
              <FGrid>
                <Fld><Lbl>Nome *</Lbl><Inp value={userForm.name} onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))} required /></Fld>
                <Fld><Lbl>Usuário *</Lbl><Inp value={userForm.usuario} onChange={(e) => setUserForm((p) => ({ ...p, usuario: e.target.value }))} required /></Fld>
                <Fld><Lbl>E-mail</Lbl><Inp type="email" value={userForm.email} onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))} /></Fld>
                <Fld><Lbl>{editUser ? 'Nova senha (opcional)' : 'Senha *'}</Lbl><Inp type="password" value={userForm.password} onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))} required={!editUser} /></Fld>
                <Fld>
                  <Lbl>Perfil *</Lbl>
                  <Sel value={userForm.role} onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value }))}>
                    {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </Sel>
                </Fld>
                <Fld><Lbl>Matrícula</Lbl><Inp value={userForm.employee_id} onChange={(e) => setUserForm((p) => ({ ...p, employee_id: e.target.value }))} /></Fld>
                <Fld><Lbl>CPF</Lbl><Inp value={userForm.cpf} onChange={(e) => setUserForm((p) => ({ ...p, cpf: e.target.value }))} placeholder="000.000.000-00" /></Fld>
                <Fld><Lbl>Empresa</Lbl><Inp value={userForm.empresa} onChange={(e) => setUserForm((p) => ({ ...p, empresa: e.target.value }))} /></Fld>
                <Fld><Lbl>Território</Lbl><Inp value={userForm.territory} onChange={(e) => setUserForm((p) => ({ ...p, territory: e.target.value }))} /></Fld>
                <Fld><Lbl>Regional</Lbl><Inp value={userForm.regional} onChange={(e) => setUserForm((p) => ({ ...p, regional: e.target.value }))} /></Fld>
                <Fld><Lbl>Cargo / Título</Lbl><Inp value={userForm.title} onChange={(e) => setUserForm((p) => ({ ...p, title: e.target.value }))} /></Fld>
                <Fld><Lbl>Data de Admissão</Lbl><Inp type="date" value={userForm.data_admissao} onChange={(e) => setUserForm((p) => ({ ...p, data_admissao: e.target.value }))} /></Fld>
                <Fld>
                  <Lbl>Data de Demissão {role !== 'admin' && <span style={{ fontSize: '0.72rem', color: '#9a948f' }}>(somente admin)</span>}</Lbl>
                  <Inp type="date" value={userForm.data_demissao} disabled={role !== 'admin'} onChange={(e) => setUserForm((p) => ({ ...p, data_demissao: e.target.value }))} />
                </Fld>
                <Fld style={{ gridColumn: '1 / -1' }}>
                  <Lbl>Observação</Lbl>
                  <Inp as="textarea" rows={3} value={userForm.observacao} onChange={(e) => setUserForm((p) => ({ ...p, observacao: e.target.value }))} style={{ resize: 'vertical', minHeight: 64 }} />
                </Fld>
                <Fld style={{ position: 'relative' }}>
                  <Lbl>Superior</Lbl>
                  <Inp
                    value={superOpen ? superSearch : (selectedSuperior ? selectedSuperior.name : '')}
                    placeholder="(opcional) buscar por nome..."
                    autoComplete="off"
                    onFocus={() => { setSuperOpen(true); setSuperSearch(''); }}
                    onChange={(e) => setSuperSearch(e.target.value)}
                    onBlur={() => setTimeout(() => setSuperOpen(false), 150)}
                  />
                  {superOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999,
                      background: '#fff', border: '1px solid #d4c8c0', borderRadius: 6,
                      maxHeight: 220, overflowY: 'auto',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    }}>
                      <div
                        style={{ padding: '8px 12px', cursor: 'pointer', color: '#888', borderBottom: '1px solid #f0ebe6', fontSize: '0.85rem' }}
                        onMouseDown={() => { setUserForm((p) => ({ ...p, manager_id: '' })); setSuperOpen(false); }}
                      >
                        (sem superior)
                      </div>
                      {filteredSupers.map((u) => (
                        <div
                          key={u.id}
                          style={{
                            padding: '8px 12px', cursor: 'pointer', fontSize: '0.88rem',
                            background: String(u.id) === String(userForm.manager_id) ? 'rgba(174,46,42,0.08)' : 'transparent',
                            borderBottom: '1px solid #f8f4f1',
                          }}
                          onMouseDown={() => { setUserForm((p) => ({ ...p, manager_id: String(u.id) })); setSuperOpen(false); setSuperSearch(''); }}
                        >
                          {u.name} <span style={{ fontSize: '0.75rem', color: '#9a948f' }}>({ROLE_LABELS[u.role] || u.role})</span>
                        </div>
                      ))}
                      {filteredSupers.length === 0 && (
                        <div style={{ padding: '8px 12px', color: '#999', fontSize: '0.85rem' }}>Nenhum usuário encontrado</div>
                      )}
                    </div>
                  )}
                </Fld>
              </FGrid>
              <div className="mfooter">
                <Btn $v="outline" type="button" onClick={() => setModalOpen(false)}>Cancelar</Btn>
                <Btn type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Btn>
              </div>
            </form>
          </ModalBox>
        </Overlay>
      )}
    </FcaWrap>
  );
};

export default DashboardAdm;
