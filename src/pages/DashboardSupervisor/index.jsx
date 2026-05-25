import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FcaGlobal, FcaWrap, Topbar, BrandRow, BrandLogo, BrandMeta, SessionPill,
  Shell, AppLayout, SideNav, NavBtn, ContentArea,
  PageTitle, Card, CardLabel, FGrid, Fld, Lbl, Sel, Btn,
  TblWrap, Tbl, RBadge, WinBadge, MetricsRow, Metric, Empty,
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
  const [loading,      setLoading]  = useState(false);

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
                          <th>Nome</th><th>Matrícula</th><th>Perfil</th>
                          <th>Território</th><th>Cargo</th><th>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subordinates.map((u) => (
                          <tr key={u.id}>
                            <td><strong>{u.name}</strong></td>
                            <td style={{ color: '#9a948f' }}>{u.employee_id || '—'}</td>
                            <td><RBadge $r={u.role}>{ROLE_LABELS[u.role] || u.role}</RBadge></td>
                            <td>{u.territory || '—'}</td>
                            <td style={{ color: '#9a948f', fontSize: '0.8rem' }}>{u.title || '—'}</td>
                            <td>
                              <Btn $v="danger" className="sm" onClick={() => handleUnlink(u.id)}>Desvincular</Btn>
                            </td>
                          </tr>
                        ))}
                        {subordinates.length === 0 && (
                          <tr>
                            <td colSpan={6}>
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
                <PageTitle>Vincular <em>Técnico</em></PageTitle>
                <Card style={{ maxWidth: 500 }}>
                  <CardLabel>Novo vínculo</CardLabel>
                  {winData && (
                    <div style={{ margin: '0.8rem 0 1rem' }}>
                      <WinBadge $open={winData.status.is_open}>
                        <span className="dot" />
                        {winData.status.is_open ? 'Janela aberta — vínculo imediato' : 'Janela fechada — enviará para aprovação'}
                      </WinBadge>
                    </div>
                  )}
                  <form onSubmit={handleLink}>
                    <FGrid style={{ gridTemplateColumns: '1fr' }}>
                      <Fld>
                        <Lbl>Técnico disponível *</Lbl>
                        <Sel value={linkChild} onChange={(e) => setLinkChild(e.target.value)}>
                          <option value="">Selecione um técnico...</option>
                          {available.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}{t.territory ? ` — ${t.territory}` : ''}
                            </option>
                          ))}
                        </Sel>
                      </Fld>
                    </FGrid>
                    <Btn type="submit" disabled={loading || !linkChild}>
                      {loading ? 'Salvando...' : winData?.status?.is_open ? 'Vincular agora' : 'Enviar solicitação'}
                    </Btn>
                  </form>
                  {available.length === 0 && (
                    <p style={{ fontSize: '0.8rem', color: '#9a948f', marginTop: '0.75rem' }}>
                      Nenhum técnico disponível para vínculo no momento.
                    </p>
                  )}
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
