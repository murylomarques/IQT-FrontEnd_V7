import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FcaGlobal, FcaWrap, Topbar, BrandRow, BrandLogo, BrandMeta, SessionPill,
  Shell, AppLayout, SideNav, NavBtn, ContentArea,
  PageTitle, Card, CardRow, CardLabel, Inp, Btn,
  TblWrap, Tbl, WinBadge, MetricsRow, Metric, Empty,
} from '../FCA/theme';
import { fcaStorage, fcaFetch, ROLE_LABELS } from '../FCA/api';

const TABS = ['Minha Equipe', 'Vincular'];

const isCorporativo = (empresa) =>
  empresa && empresa.toLowerCase().includes('corporativo');

const DashboardSupervisor = () => {
  const navigate   = useNavigate();
  const name       = fcaStorage.get('name') || 'Supervisor';
  const role       = fcaStorage.get('role');
  const myId       = fcaStorage.get('id');
  const myRegional = (fcaStorage.get('regional') || '').toLowerCase();

  const [tab,          setTab]       = useState('Minha Equipe');
  const [subordinates, setSubs]      = useState([]);
  const [available,    setAvailable] = useState([]);
  const [winData,      setWinData]   = useState(null);
  const [selected,     setSelected]  = useState([]);
  const [linkSearch,   setLinkSearch]= useState('');
  const [loading,      setLoading]   = useState(false);

  useEffect(() => {
    if (!fcaStorage.get('token') || role !== 'supervisao') navigate('/login/GH');
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
      setAvailable((dash.visible_users || []).filter((u) => u.role === 'tecnico' && !u.manager_id));
    } catch (err) { toast.error(err.message); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

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
                    <div className="label">Técnicos vinculados</div>
                    <div className="value">{subordinates.length}</div>
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
                    {!winData.status.is_open && (
                      <p style={{ fontSize: '0.78rem', color: '#9a948f', marginTop: 6 }}>
                        Fora da janela, vínculos são enviados para aprovação do administrador.
                      </p>
                    )}
                  </div>
                )}

                <Card>
                  <CardLabel>Técnicos vinculados a você</CardLabel>
                  <TblWrap style={{ marginTop: '0.8rem' }}>
                    <Tbl>
                      <thead>
                        <tr>
                          <th>Nome</th><th>Matrícula</th><th>Regional</th>
                          <th>Empresa</th><th>Cargo</th>
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
                            <td style={{ color: '#9a948f', fontSize: '0.8rem' }}>{u.title || '—'}</td>
                          </tr>
                        ))}
                        {subordinates.length === 0 && (
                          <tr>
                            <td colSpan={5}>
                              <Empty><div className="icon">👥</div>Nenhum técnico vinculado ainda.</Empty>
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
            {tab === 'Vincular' && (
              <>
                <PageTitle>Vincular <em>Técnicos</em></PageTitle>

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
                      placeholder="🔍  Buscar nome, matrícula ou CPF..."
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
                                  ? 'Nenhum técnico encontrado para esta regional / busca.'
                                  : 'Nenhum técnico disponível para vínculo no momento.'}
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

export default DashboardSupervisor;
