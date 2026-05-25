import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FcaGlobal, FcaWrap, Topbar, BrandRow, BrandLogo, BrandMeta, SessionPill,
  Shell, AppLayout, SideNav, NavBtn, ContentArea,
  PageTitle, Card, CardRow, CardLabel, MetricsRow, Metric,
  TblWrap, Tbl, Btn, RBadge, SPill, WinBadge, Empty, Alert,
} from '../FCA/theme';
import { fcafStorage, fcafFetch, FCAF_ROLE_LABELS } from '../FCAF/api';

const TABS = ['Analítico', 'Base'];

const statusLabel = { realizado: 'Realizado', pendente: 'Pendente', vencido: 'Vencido' };
const statusColor = {
  realizado: { background: 'rgba(47,122,63,.14)', color: '#1a5028' },
  pendente:  { background: 'rgba(184,108,16,.14)', color: '#7a4a00' },
  vencido:   { background: 'rgba(157,41,38,.14)',  color: '#6d1e1a' },
};

const DashboardFcaAdmin = () => {
  const navigate  = useNavigate();
  const name      = fcafStorage.get('name') || 'Admin';
  const role      = fcafStorage.get('role');

  const [tab,      setTab]      = useState('Analítico');
  const [data,     setData]     = useState(null);
  const [history,  setHistory]  = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (!fcafStorage.get('token') || role !== 'admin') navigate('/login/FCA');
  }, [navigate, role]);

  const load = useCallback(async () => {
    try {
      const [ana, hist] = await Promise.all([
        fcafFetch('/fcaf/analytics/all'),
        fcafFetch('/fcaf/periods'),
      ]);
      setData(ana);
      setHistory(hist);
    } catch (err) { toast.error(err.message); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const logout = () => { fcafStorage.clear(); navigate('/login/FCA'); };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const form = new FormData(); form.append('file', file);
    setUploading(true);
    try {
      const res = await fcafFetch('/fcaf/period/upload', { method: 'POST', body: form });
      toast.success(res.message);
      load();
    } catch (err) { toast.error(err.message); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const period = data?.period;
  const supervisors = data?.supervisors || [];
  const totals = supervisors.reduce(
    (acc, s) => ({ total: acc.total + s.total, realizado: acc.realizado + s.realizado, pendente: acc.pendente + s.pendente, vencido: acc.vencido + s.vencido }),
    { total: 0, realizado: 0, pendente: 0, vencido: 0 }
  );

  return (
    <FcaWrap>
      <FcaGlobal />
      <Topbar>
        <BrandRow>
          <BrandLogo>FCA</BrandLogo>
          <BrandMeta>
            <div className="title">Avaliação de Campo</div>
            <div className="sub">Painel do Administrador</div>
          </BrandMeta>
        </BrandRow>
        <SessionPill>
          <div>
            <div className="sname">{name}</div>
            <div className="srole">{FCAF_ROLE_LABELS[role] || role}</div>
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

            {/* ── ANALÍTICO ── */}
            {tab === 'Analítico' && (
              <>
                <PageTitle>Analítico <em>Geral</em></PageTitle>

                {period ? (
                  <div style={{ marginBottom: '1rem' }}>
                    <WinBadge $open={!period.is_expired}>
                      <span className="dot" />
                      {period.is_expired
                        ? `Período ${period.mes} — VENCIDO`
                        : `Período ${period.mes} — ${period.days_left} dia${period.days_left !== 1 ? 's' : ''} restante${period.days_left !== 1 ? 's' : ''}`}
                    </WinBadge>
                  </div>
                ) : (
                  <Alert $t="warn" style={{ marginBottom: '1rem' }}>
                    ⚠️ Nenhuma base importada. Vá em "Base" para importar.
                  </Alert>
                )}

                <MetricsRow>
                  <Metric><div className="label">Supervisores</div><div className="value">{supervisors.length}</div></Metric>
                  <Metric><div className="label">Total Técnicos</div><div className="value">{totals.total}</div></Metric>
                  <Metric><div className="label">Realizados</div><div className="value">{totals.realizado}</div></Metric>
                  <Metric><div className="label">Pendentes</div><div className="value">{totals.pendente}</div></Metric>
                  <Metric><div className="label">Vencidos</div><div className="value">{totals.vencido}</div></Metric>
                </MetricsRow>

                <Card>
                  <CardLabel>Por Supervisor</CardLabel>
                  <TblWrap style={{ marginTop: '0.8rem' }}>
                    <Tbl>
                      <thead>
                        <tr>
                          <th>Supervisor</th><th>Território</th>
                          <th>Total</th><th>Realizado</th><th>Pendente</th><th>Vencido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supervisors.map((s) => (
                          <tr key={s.id}>
                            <td><strong>{s.name}</strong></td>
                            <td style={{ color: '#9a948f' }}>{s.territory || '—'}</td>
                            <td>{s.total}</td>
                            <td>
                              <span style={{ ...statusColor.realizado, padding: '2px 10px', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 700 }}>
                                {s.realizado}
                              </span>
                            </td>
                            <td>
                              <span style={{ ...statusColor.pendente, padding: '2px 10px', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 700 }}>
                                {s.pendente}
                              </span>
                            </td>
                            <td>
                              <span style={{ ...statusColor.vencido, padding: '2px 10px', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 700 }}>
                                {s.vencido}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {supervisors.length === 0 && (
                          <tr><td colSpan={6}><Empty><div className="icon">📊</div>Nenhum supervisor encontrado.</Empty></td></tr>
                        )}
                      </tbody>
                    </Tbl>
                  </TblWrap>
                </Card>
              </>
            )}

            {/* ── BASE ── */}
            {tab === 'Base' && (
              <>
                <PageTitle>Importar <em>Base</em></PageTitle>

                <Card style={{ maxWidth: 540 }}>
                  <CardLabel>Novo Período</CardLabel>
                  <p style={{ fontSize: '0.84rem', color: '#5a5551', marginTop: '0.6rem', lineHeight: 1.65 }}>
                    Faça upload da planilha xlsx com as colunas <strong>Nome</strong>, <strong>Prod_bruta</strong>, <strong>Revisita</strong>, <strong>Tec1</strong> e <strong>Certificado</strong>.
                    O período será de <strong>25 dias</strong> a partir do upload. Períodos anteriores são desativados automaticamente.
                  </p>

                  {period && !period.is_expired && (
                    <Alert $t="warn" style={{ marginTop: '1rem' }}>
                      ⚠️ Existe um período ativo ({period.mes}). Ao importar nova base o período atual será encerrado.
                    </Alert>
                  )}

                  <div style={{ marginTop: '1.1rem' }}>
                    <label style={{ cursor: 'pointer' }}>
                      <Btn as="span" disabled={uploading}>
                        {uploading ? 'Importando...' : '↑ Selecionar arquivo .xlsx'}
                      </Btn>
                      <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
                    </label>
                  </div>
                </Card>

                {history.length > 0 && (
                  <Card>
                    <CardLabel>Histórico de Períodos</CardLabel>
                    <TblWrap style={{ marginTop: '0.8rem' }}>
                      <Tbl>
                        <thead>
                          <tr><th>Mês</th><th>Técnicos</th><th>Início</th><th>Vencimento</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                          {history.map((p) => (
                            <tr key={p.id}>
                              <td><strong>{p.mes}</strong></td>
                              <td>{p.total}</td>
                              <td style={{ color: '#9a948f', fontSize: '0.8rem' }}>
                                {new Date(p.created_at).toLocaleDateString('pt-BR')}
                              </td>
                              <td style={{ color: '#9a948f', fontSize: '0.8rem' }}>
                                {new Date(p.expires_at).toLocaleDateString('pt-BR')}
                              </td>
                              <td>
                                <SPill $s={p.is_active && !p.is_expired ? 'approved' : p.is_expired ? 'rejected' : 'pending'}>
                                  {p.is_active && !p.is_expired ? 'Ativo' : p.is_expired ? 'Vencido' : 'Inativo'}
                                </SPill>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Tbl>
                    </TblWrap>
                  </Card>
                )}
              </>
            )}
          </ContentArea>
        </AppLayout>
      </Shell>
    </FcaWrap>
  );
};

export default DashboardFcaAdmin;
