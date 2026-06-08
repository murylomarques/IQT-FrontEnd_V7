import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FcaGlobal, FcaWrap, Topbar, BrandRow, BrandLogo, BrandMeta, SessionPill,
  Shell, AppLayout, SideNav, NavBtn, ContentArea,
  PageTitle, Card, CardRow, CardLabel, Inp, Btn,
  TblWrap, Tbl, RBadge, WinBadge, MetricsRow, Metric, Empty,
} from '../FCA/theme';
import { fcaStorage, fcaFetch, ROLE_LABELS } from '../FCA/api';

const TABS = ['Minha Equipe', 'Hierarquia', 'Vincular'];

const isCorporativo = (empresa) =>
  empresa && empresa.toLowerCase().includes('corporativo');

const matchesHierarchySearch = (supervisor, search) => {
  if (!search) return true;
  const query = search.toLowerCase();
  const supervisorMatch =
    (supervisor.name || '').toLowerCase().includes(query) ||
    (supervisor.employee_id || '').toLowerCase().includes(query) ||
    (supervisor.cpf || '').toLowerCase().includes(query);

  return supervisorMatch || (supervisor.subordinates || []).some((tecnico) =>
    (tecnico.name || '').toLowerCase().includes(query) ||
    (tecnico.employee_id || '').toLowerCase().includes(query) ||
    (tecnico.cpf || '').toLowerCase().includes(query)
  );
};

const DashboardCoordenador = () => {
  const navigate   = useNavigate();
  const name       = fcaStorage.get('name') || 'Coordenador';
  const role       = fcaStorage.get('role');
  const myId       = fcaStorage.get('id');
  const myRegional = (fcaStorage.get('regional') || '').toLowerCase();

  const [tab,          setTab]       = useState('Minha Equipe');
  const [subordinates, setSubs]      = useState([]);
  const [available,    setAvailable] = useState([]);
  const [winData,      setWinData]   = useState(null);
  const [selected,     setSelected]  = useState([]);
  const [linkSearch,   setLinkSearch]= useState('');
  const [hierSearch,   setHierSearch]= useState('');
  const [loading,      setLoading]   = useState(false);

  useEffect(() => {
    if (!fcaStorage.get('token') || role !== 'coordenacao') navigate('/login/GH');
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
      setAvailable((dash.visible_users || []).filter((u) => u.role === 'supervisao' && !u.manager_id));
    } catch (err) { toast.error(err.message); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const totalTecnicos = subordinates.reduce((acc, s) => acc + (s.subordinates?.length || 0), 0);
  const filteredHierarchy = subordinates.filter((supervisor) => matchesHierarchySearch(supervisor, hierSearch));

  // Filtra disponíveis: mesma regional OU corporativo OU sem regional
  const filteredAvailable = available.filter((u) => {
    const corp     = isCorporativo(u.empresa);
    const uReg     = (u.regional || '').toLowerCase();
    const regMatch = !myRegional || corp || !uReg || uReg === myRegional;
    const srch     = linkSearch.toLowerCase();
    const txtMatch = !srch ||
      u.name.toLowerCase().includes(srch) ||
      (u.employee_id || '').toLowerCase().includes(srch) ||
      (u.cpf         || '').toLowerCase().includes(srch);
    return regMatch && txtMatch;
  });

  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(selected.length === filteredAvailable.length ? [] : filteredAvailable.map((u) => u.id));

  const handleLinkMultiple = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      const res = await fcaFetch('/fca/hierarchy/bulk-link', {
        method: 'POST',
        body: JSON.stringify({ parent_id: +myId, child_ids: selected }),
      });
      if (res.linked > 0)
        toast.success(winData?.status?.is_open
          ? `${res.linked} vínculo(s) criado(s).`
          : `${res.linked} solicitação(ões) enviada(s) para aprovação.`);
      if (res.pending > 0)
        toast.info(`${res.pending} solicitação(ões) enviada(s) para aprovação.`);
      if (res.failed > 0)
        toast.warn(`${res.failed} vínculo(s) não puderam ser criados.`);
    } catch (err) { toast.error(err.message); }
    setSelected([]);
    loadData();
    setLoading(false);
  };

  const handleUnlink = async (childId) => {
    if (!window.confirm('Remover vínculo?')) return;
    try {
      await fcaFetch(`/fca/hierarchy/unlink/${childId}`, { method: 'DELETE' });
      toast.success('Vínculo removido.');
      loadData();
    } catch (err) { toast.error(err.message); }
  };

  const logout = () => { fcaStorage.clear(); navigate('/login/GH'); };

  return (
    <FcaWrap>
      <FcaGlobal />
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
          <SideNav>
            {TABS.map((t) => (
              <NavBtn key={t} $active={tab === t} onClick={() => setTab(t)}>{t}</NavBtn>
            ))}
          </SideNav>

          <ContentArea>
            {/* ── MINHA EQUIPE ── */}
            {tab === 'Minha Equipe' && (
              <>
                <PageTitle>Minha <em>Equipe</em></PageTitle>

                <MetricsRow>
                  <Metric>
                    <div className="label">Supervisores</div>
                    <div className="value">{subordinates.length}</div>
                  </Metric>
                  <Metric>
                    <div className="label">Técnicos (diretos)</div>
                    <div className="value">{totalTecnicos}</div>
                  </Metric>
                  <Metric>
                    <div className="label">Disponíveis p/ vínculo</div>
                    <div className="value">{available.length}</div>
                  </Metric>
                </MetricsRow>

                {winData && (
                  <div style={{ marginBottom: '1.1rem' }}>
                    <WinBadge $open={winData.status.is_open}>
                      <span className="dot" />
                      {winData.status.is_open
                        ? `Janela aberta — dias ${winData.config.start_day} a ${winData.config.end_day}`
                        : `Janela fechada — abre dia ${winData.config.start_day}`}
                    </WinBadge>
                  </div>
                )}

                <Card>
                  <CardLabel>Supervisores vinculados a você</CardLabel>
                  <TblWrap style={{ marginTop: '0.8rem' }}>
                    <Tbl>
                      <thead>
                        <tr>
                          <th>Nome</th><th>Matrícula</th><th>Regional</th>
                          <th>Empresa</th><th>Técnicos</th><th>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subordinates.map((u) => (
                          <tr key={u.id}>
                            <td><strong>{u.name}</strong></td>
                            <td style={{ color: '#9a948f' }}>{u.employee_id || '—'}</td>
                            <td>{u.regional || '—'}</td>
                            <td>
                              {u.empresa ? (
                                <span style={{
                                  fontSize: '0.72rem',
                                  background: isCorporativo(u.empresa) ? 'rgba(174,46,42,0.10)' : 'rgba(53,48,45,0.07)',
                                  color: isCorporativo(u.empresa) ? '#ae2e2a' : '#5a5551',
                                  borderRadius: 4, padding: '1px 7px',
                                }}>{u.empresa}</span>
                              ) : '—'}
                            </td>
                            <td>
                              <span style={{ background: 'rgba(47,122,63,0.14)', color: '#1a5028', borderRadius: '999px', padding: '2px 10px', fontSize: '0.76rem', fontWeight: 700 }}>
                                {u.subordinates?.length || 0} técnico{(u.subordinates?.length || 0) !== 1 ? 's' : ''}
                              </span>
                            </td>
                            <td>
                              <Btn $v="danger" className="sm" onClick={() => handleUnlink(u.id)}>Desvincular</Btn>
                            </td>
                          </tr>
                        ))}
                        {subordinates.length === 0 && (
                          <tr>
                            <td colSpan={6}>
                              <Empty><div className="icon">👥</div>Nenhum supervisor vinculado ainda.</Empty>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Tbl>
                  </TblWrap>
                </Card>
              </>
            )}

            {/* ── VINCULAR ── */}
            {tab === 'Hierarquia' && (
              <>
                <PageTitle>Hierarquia da <em>Equipe</em></PageTitle>

                <MetricsRow>
                  <Metric>
                    <div className="label">Supervisores vinculados</div>
                    <div className="value">{subordinates.length}</div>
                  </Metric>
                  <Metric>
                    <div className="label">Técnicos na hierarquia</div>
                    <div className="value">{totalTecnicos}</div>
                  </Metric>
                </MetricsRow>

                <Card>
                  <CardRow>
                    <CardLabel>Supervisores e técnicos vinculados</CardLabel>
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <Inp
                        style={{ maxWidth: 340, borderRadius: '999px' }}
                        placeholder="🔍  Buscar supervisor, técnico, matrícula ou CPF..."
                        value={hierSearch}
                        onChange={(e) => setHierSearch(e.target.value)}
                      />
                      <Btn $v="ghost" onClick={loadData}>↻ Atualizar</Btn>
                    </div>
                  </CardRow>

                  {filteredHierarchy.length === 0 && (
                    <Empty style={{ marginTop: '1.4rem' }}>
                      <div className="icon">👥</div>
                      {subordinates.length > 0
                        ? 'Nenhum supervisor ou técnico encontrado para a busca.'
                        : 'Nenhum supervisor vinculado a você ainda.'}
                    </Empty>
                  )}

                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {filteredHierarchy.map((supervisor) => {
                      const tecnicos = supervisor.subordinates || [];
                      const query = hierSearch.toLowerCase();
                      const supervisorMatches =
                        !query ||
                        (supervisor.name || '').toLowerCase().includes(query) ||
                        (supervisor.employee_id || '').toLowerCase().includes(query) ||
                        (supervisor.cpf || '').toLowerCase().includes(query);
                      const visibleTecnicos = supervisorMatches
                        ? tecnicos
                        : tecnicos.filter((tecnico) =>
                            (tecnico.name || '').toLowerCase().includes(query) ||
                            (tecnico.employee_id || '').toLowerCase().includes(query) ||
                            (tecnico.cpf || '').toLowerCase().includes(query)
                          );

                      return (
                        <div
                          key={supervisor.id}
                          style={{
                            border: '1px solid rgba(212,113,32,0.22)',
                            borderRadius: 8,
                            overflow: 'hidden',
                            background: 'rgba(212,113,32,0.04)',
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            flexWrap: 'wrap',
                            padding: '0.75rem 0.9rem',
                            borderBottom: '1px solid rgba(212,113,32,0.16)',
                            background: 'rgba(255,255,255,0.65)',
                          }}>
                            <RBadge $r="supervisao">Supervisor</RBadge>
                            <strong>{supervisor.name}</strong>
                            {supervisor.employee_id && (
                              <span style={{ fontSize: '0.78rem', color: '#9a948f' }}>Mat: {supervisor.employee_id}</span>
                            )}
                            {supervisor.regional && (
                              <span style={{ fontSize: '0.78rem', color: '#9a948f' }}>{supervisor.regional}</span>
                            )}
                            <span style={{
                              marginLeft: 'auto',
                              background: 'rgba(47,122,63,0.14)',
                              color: '#1a5028',
                              borderRadius: '999px',
                              padding: '2px 10px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                            }}>
                              {tecnicos.length} técnico{tecnicos.length !== 1 ? 's' : ''}
                            </span>
                          </div>

                          {visibleTecnicos.length > 0 ? (
                            <TblWrap style={{ marginTop: 0 }}>
                              <Tbl style={{ minWidth: 760 }}>
                                <thead>
                                  <tr>
                                    <th>Técnico</th>
                                    <th>Matrícula</th>
                                    <th>CPF</th>
                                    <th>Regional</th>
                                    <th>Empresa</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {visibleTecnicos.map((tecnico) => (
                                    <tr key={tecnico.id}>
                                      <td>
                                        <RBadge $r="tecnico" style={{ marginRight: 6 }}>Técnico</RBadge>
                                        <strong>{tecnico.name}</strong>
                                      </td>
                                      <td style={{ color: '#9a948f' }}>{tecnico.employee_id || '—'}</td>
                                      <td style={{ color: '#9a948f', fontSize: '0.8rem' }}>{tecnico.cpf || '—'}</td>
                                      <td>{tecnico.regional || '—'}</td>
                                      <td>
                                        {tecnico.empresa ? (
                                          <span style={{
                                            fontSize: '0.72rem',
                                            background: isCorporativo(tecnico.empresa) ? 'rgba(174,46,42,0.10)' : 'rgba(53,48,45,0.07)',
                                            color: isCorporativo(tecnico.empresa) ? '#ae2e2a' : '#5a5551',
                                            borderRadius: 4,
                                            padding: '1px 7px',
                                          }}>
                                            {tecnico.empresa}
                                          </span>
                                        ) : '—'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Tbl>
                            </TblWrap>
                          ) : (
                            <div style={{ padding: '0.9rem', color: '#9a948f', fontSize: '0.86rem' }}>
                              Nenhum técnico vinculado a este supervisor.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </>
            )}

            {tab === 'Vincular' && (
              <>
                <PageTitle>Vincular <em>Supervisores</em></PageTitle>

                {winData && (
                  <div style={{ marginBottom: '1rem' }}>
                    <WinBadge $open={winData.status.is_open}>
                      <span className="dot" />
                      {winData.status.is_open
                        ? 'Janela aberta — vínculo imediato'
                        : 'Janela fechada — enviará para aprovação'}
                    </WinBadge>
                  </div>
                )}

                <Card>
                  <CardRow>
                    <Inp
                      style={{ flex: 1, maxWidth: 340, borderRadius: '999px' }}
                      placeholder="🔍  Buscar nome ou matrícula..."
                      value={linkSearch}
                      onChange={(e) => { setLinkSearch(e.target.value); setSelected([]); }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.82rem', color: '#9a948f', whiteSpace: 'nowrap' }}>
                        {selected.length} selecionado{selected.length !== 1 ? 's' : ''}
                      </span>
                      <Btn
                        onClick={handleLinkMultiple}
                        disabled={loading || selected.length === 0}
                      >
                        {loading
                          ? 'Vinculando...'
                          : winData?.status?.is_open
                            ? `Vincular (${selected.length})`
                            : `Solicitar (${selected.length})`}
                      </Btn>
                    </div>
                  </CardRow>

                  <TblWrap style={{ marginTop: '0.8rem' }}>
                    <Tbl>
                      <thead>
                        <tr>
                          <th style={{ width: 36, textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={filteredAvailable.length > 0 && selected.length === filteredAvailable.length}
                              onChange={toggleAll}
                              title="Selecionar todos"
                            />
                          </th>
                          <th>Nome</th>
                          <th>Matrícula</th>
                          <th>CPF</th>
                          <th>Regional</th>
                          <th>Empresa</th>
                          <th>Cargo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAvailable.map((u) => (
                          <tr
                            key={u.id}
                            style={{
                              cursor: 'pointer',
                              background: selected.includes(u.id)
                                ? 'rgba(174,46,42,0.06)'
                                : undefined,
                            }}
                            onClick={() => toggleSelect(u.id)}
                          >
                            <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selected.includes(u.id)}
                                onChange={() => toggleSelect(u.id)}
                              />
                            </td>
                            <td><strong>{u.name}</strong></td>
                            <td style={{ color: '#9a948f' }}>{u.employee_id || '—'}</td>
                            <td style={{ color: '#9a948f', fontSize: '0.8rem' }}>{u.cpf || '—'}</td>
                            <td>{u.regional || '—'}</td>
                            <td>
                              {u.empresa ? (
                                <span style={{
                                  fontSize: '0.72rem',
                                  background: isCorporativo(u.empresa) ? 'rgba(174,46,42,0.10)' : 'rgba(53,48,45,0.07)',
                                  color: isCorporativo(u.empresa) ? '#ae2e2a' : '#5a5551',
                                  borderRadius: 4, padding: '1px 7px',
                                }}>{u.empresa}</span>
                              ) : '—'}
                            </td>
                            <td style={{ color: '#9a948f', fontSize: '0.8rem' }}>{u.title || '—'}</td>
                          </tr>
                        ))}
                        {filteredAvailable.length === 0 && (
                          <tr>
                            <td colSpan={7}>
                              <Empty>
                                <div className="icon">👥</div>
                                {available.length > 0
                                  ? 'Nenhum supervisor encontrado para esta regional / busca.'
                                  : 'Nenhum supervisor disponível para vínculo no momento.'}
                              </Empty>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Tbl>
                  </TblWrap>
                </Card>
              </>
            )}
          </ContentArea>
        </AppLayout>
      </Shell>
    </FcaWrap>
  );
};

export default DashboardCoordenador;
