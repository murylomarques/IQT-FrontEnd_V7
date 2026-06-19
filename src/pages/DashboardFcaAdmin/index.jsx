import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FcaGlobal, FcaWrap, Topbar, BrandRow, BrandLogo, BrandMeta, SessionPill,
  Shell, AppLayout, SideNav, NavBtn, ContentArea,
  PageTitle, Card, CardRow, CardLabel, MetricsRow, Metric,
  FGrid, Fld, Lbl, Sel, TblWrap, Tbl, Btn, SPill, WinBadge, Empty, Alert,
} from '../FCA/theme';
import { fcafStorage, fcafFetch, FCAF_ROLE_LABELS } from '../FCAF/api';

const TABS = ['Analítico', 'Base'];

const statusColor = {
  realizado:     { background: 'rgba(47,122,63,.14)', color: '#1a5028' },
  nao_iniciado:  { background: 'rgba(53,48,45,.10)', color: '#5a5551' },
  em_andamento:  { background: 'rgba(184,108,16,.14)', color: '#7a4a00' },
  pendente:      { background: 'rgba(184,108,16,.14)', color: '#7a4a00' },
  vencido:       { background: 'rgba(157,41,38,.14)',  color: '#6d1e1a' },
};

const STATUS_LABELS = {
  realizado: 'Realizado',
  nao_iniciado: 'Nao iniciado',
  em_andamento: 'Em andamento',
  vencido: 'Vencido',
};

const fmtDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('pt-BR');
};

const fmtDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

const StatusBadge = ({ status, children }) => (
  <span style={{ ...(statusColor[status] || statusColor.pendente), padding: '2px 10px', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 700 }}>
    {children || STATUS_LABELS[status] || status || '-'}
  </span>
);

const DashboardFcaAdmin = () => {
  const navigate  = useNavigate();
  const name      = fcafStorage.get('name') || 'Admin';
  const role      = fcafStorage.get('role');
  const isReadOnly = role === 'consulta';

  const [tab,      setTab]      = useState('Analítico');
  const [data,     setData]     = useState(null);
  const [history,  setHistory]  = useState([]);
  const [filters,  setFilters]  = useState({ period_id: '', regional: '', status: '' });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (!fcafStorage.get('token') || !['admin', 'consulta'].includes(role)) navigate('/login/FCA');
  }, [navigate, role]);

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.period_id) params.set('period_id', filters.period_id);
      if (filters.regional) params.set('regional', filters.regional);
      if (filters.status) params.set('status', filters.status);
      const qs = params.toString() ? `?${params.toString()}` : '';
      const [ana, hist] = await Promise.all([
        fcafFetch(`/fcaf/analytics/all${qs}`),
        fcafFetch('/fcaf/periods'),
      ]);
      setData(ana);
      setHistory(hist);
    } catch (err) { toast.error(err.message); }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const logout = () => { fcafStorage.clear(); navigate('/login/FCA'); };

  const downloadModelo = () => {
    if (isReadOnly) return;
    const rows = [
      ['Mes', 'mai/26', 'mai/26', 'mai/26', 'mai/26'],
      ['Nome', 'Prod_bruta', 'Revisita', 'Tec1', 'Certificado'],
      ['JOAO DA SILVA', '2.50', '0.14', '0.83', 'Sim'],
      ['MARIA SANTOS', '1.80', '0.10', '0.75', 'Não'],
      ['PEDRO OLIVEIRA', '3.20', '0.05', '0.90', 'Não'],
      ['ANA PAULA FERREIRA', '2.10', '0.20', '0.78', 'Sim'],
      ['CARLOS MENDES', '1.50', '', '0.65', '-'],
    ];
    const csv  = rows.map((r) => r.join(',')).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'modelo_base_fca.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async (e) => {
    if (isReadOnly) return;
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
  const totals = data?.metrics || supervisors.reduce(
    (acc, s) => ({
      total: acc.total + s.total,
      realizado: acc.realizado + s.realizado,
      nao_iniciado: acc.nao_iniciado + (s.nao_iniciado || 0),
      em_andamento: acc.em_andamento + (s.em_andamento || 0),
      pendente: acc.pendente + s.pendente,
      vencido: acc.vencido + s.vencido,
    }),
    { total: 0, realizado: 0, nao_iniciado: 0, em_andamento: 0, pendente: 0, vencido: 0 }
  );
  const regionalOptions = data?.filters?.regionals || [];
  const statusOptions = data?.filters?.statuses || [];
  const detailRows = supervisors.flatMap((s) => (s.tecnicos || []).map((t) => ({ supervisor: s, tecnico: t })));
  const updateFilter = (field, value) => setFilters((prev) => ({ ...prev, [field]: value }));

  return (
    <FcaWrap>
      <FcaGlobal />
      <Topbar>
        <BrandRow>
          <BrandLogo>FCA</BrandLogo>
          <BrandMeta>
            <div className="title">Avaliação de Campo</div>
            <div className="sub">{isReadOnly ? 'Painel de Consulta' : 'Painel do Administrador'}</div>
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

                <Card>
                  <CardLabel>Filtros</CardLabel>
                  <FGrid style={{ marginTop: '0.8rem' }}>
                    <Fld>
                      <Lbl>Extracao</Lbl>
                      <Sel value={filters.period_id} onChange={(e) => updateFilter('period_id', e.target.value)}>
                        <option value="">Atual ativa</option>
                        {history.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.mes} - {fmtDate(p.base_uploaded_at || p.created_at)}
                          </option>
                        ))}
                      </Sel>
                    </Fld>
                    <Fld>
                      <Lbl>Regional</Lbl>
                      <Sel value={filters.regional} onChange={(e) => updateFilter('regional', e.target.value)}>
                        <option value="">Todas</option>
                        {regionalOptions.map((regional) => (
                          <option key={regional} value={regional}>{regional}</option>
                        ))}
                      </Sel>
                    </Fld>
                    <Fld>
                      <Lbl>Situacao</Lbl>
                      <Sel value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
                        <option value="">Todas</option>
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </Sel>
                    </Fld>
                  </FGrid>
                </Card>

                <MetricsRow>
                  <Metric><div className="label">Supervisores</div><div className="value">{supervisors.length}</div></Metric>
                  <Metric><div className="label">Total Técnicos</div><div className="value">{totals.total}</div></Metric>
                  <Metric><div className="label">Realizados</div><div className="value">{totals.realizado}</div></Metric>
                  <Metric><div className="label">Nao iniciados</div><div className="value">{totals.nao_iniciado || 0}</div></Metric>
                  <Metric><div className="label">Em andamento</div><div className="value">{totals.em_andamento || 0}</div></Metric>
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

                <Card>
                  <CardLabel>Detalhe da Extracao</CardLabel>
                  <TblWrap style={{ marginTop: '0.8rem' }}>
                    <Tbl>
                      <thead>
                        <tr>
                          <th>Coordenador</th><th>Supervisor</th><th>Regional</th><th>Tecnico</th>
                          <th>Situacao</th><th>Checklist</th><th>PO</th>
                          <th>Inicio</th><th>Base subiu</th><th>Fim</th><th>Datas Checklist</th><th>Datas PO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailRows.map(({ supervisor, tecnico }) => (
                          <tr key={`${supervisor.id}-${tecnico.id}`}>
                            <td style={{ color: '#5a5551' }}>{tecnico.coordenador?.name || supervisor.coordenador?.name || '-'}</td>
                            <td><strong>{supervisor.name}</strong></td>
                            <td style={{ color: '#9a948f' }}>{tecnico.regional || supervisor.regional || '-'}</td>
                            <td><strong>{tecnico.nome}</strong></td>
                            <td><StatusBadge status={tecnico.status}>{tecnico.status_label || STATUS_LABELS[tecnico.status]}</StatusBadge></td>
                            <td>{tecnico.checklist_count}/{tecnico.required_checklists}</td>
                            <td>{tecnico.po_progress}/{tecnico.required_pos}</td>
                            <td style={{ color: '#9a948f', fontSize: '0.78rem' }}>{fmtDate(tecnico.period_started_at || period?.starts_at)}</td>
                            <td style={{ color: '#9a948f', fontSize: '0.78rem' }}>{fmtDate(tecnico.base_uploaded_at || period?.base_uploaded_at)}</td>
                            <td style={{ color: '#9a948f', fontSize: '0.78rem' }}>{fmtDate(tecnico.period_ends_at || period?.ends_at)}</td>
                            <td style={{ color: '#5a5551', fontSize: '0.75rem', minWidth: 150 }}>
                              {(tecnico.checklist_dates || []).map((item, idx) => (
                                <div key={item.id || idx}>{idx + 1}. {fmtDateTime(item.performed_at || item.created_at)}</div>
                              ))}
                              {(tecnico.checklist_dates || []).length === 0 && '-'}
                            </td>
                            <td style={{ color: '#5a5551', fontSize: '0.75rem', minWidth: 150 }}>
                              {(tecnico.po_dates || []).map((item, idx) => (
                                <div key={item.id || idx}>{idx + 1}. {fmtDate(item.performed_at || item.po_date)} <span style={{ color: '#9a948f' }}>({fmtDateTime(item.created_at)})</span></div>
                              ))}
                              {(tecnico.po_dates || []).length === 0 && '-'}
                            </td>
                          </tr>
                        ))}
                        {detailRows.length === 0 && (
                          <tr><td colSpan={12}><Empty><div className="icon">FCA</div>Nenhum tecnico encontrado para os filtros.</Empty></td></tr>
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

                {/* ── Formato esperado ── */}
                <Card>
                  <CardRow>
                    <CardLabel>Formato esperado da planilha</CardLabel>
                    {!isReadOnly && <Btn $v="ghost" className="sm" onClick={downloadModelo}>↓ Baixar modelo .csv</Btn>}
                  </CardRow>

                  <p style={{ fontSize: '0.8rem', color: '#5a5551', margin: '0.5rem 0 0.9rem', lineHeight: 1.6 }}>
                    A planilha deve ter exatamente 5 colunas na ordem abaixo. A primeira linha pode conter o mês (ex: <code style={{ background: 'rgba(53,48,45,.08)', padding: '1px 5px', borderRadius: 4 }}>mai/26</code>)
                    e a linha com os cabeçalhos deve ter <strong>Nome</strong> na primeira coluna.
                    Coluna <strong>Certificado</strong> aceita: <code style={{ background: 'rgba(53,48,45,.08)', padding: '1px 5px', borderRadius: 4 }}>Sim</code>, <code style={{ background: 'rgba(53,48,45,.08)', padding: '1px 5px', borderRadius: 4 }}>Não</code> ou <code style={{ background: 'rgba(53,48,45,.08)', padding: '1px 5px', borderRadius: 4 }}>-</code>.
                  </p>

                  <TblWrap>
                    <Tbl style={{ minWidth: 0 }}>
                      <thead>
                        <tr>
                          <th style={{ background: 'rgba(244,186,68,.18)' }}>Nome</th>
                          <th style={{ background: 'rgba(244,186,68,.18)' }}>Prod_bruta</th>
                          <th style={{ background: 'rgba(244,186,68,.18)' }}>Revisita</th>
                          <th style={{ background: 'rgba(244,186,68,.18)' }}>Tec1</th>
                          <th style={{ background: 'rgba(244,186,68,.18)' }}>Certificado</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>JOAO DA SILVA</td>
                          <td style={{ color: '#9a948f' }}>2.50</td>
                          <td style={{ color: '#9a948f' }}>0.14</td>
                          <td style={{ color: '#9a948f' }}>0.83</td>
                          <td><span style={{ background: 'rgba(47,122,63,.14)', color: '#1a5028', padding: '1px 8px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700 }}>Sim</span></td>
                        </tr>
                        <tr>
                          <td>MARIA SANTOS</td>
                          <td style={{ color: '#9a948f' }}>1.80</td>
                          <td style={{ color: '#9a948f' }}>0.10</td>
                          <td style={{ color: '#9a948f' }}>0.75</td>
                          <td><span style={{ background: 'rgba(53,48,45,.1)', color: '#5a5551', padding: '1px 8px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700 }}>Não</span></td>
                        </tr>
                        <tr>
                          <td>CARLOS MENDES</td>
                          <td style={{ color: '#9a948f' }}>1.50</td>
                          <td style={{ color: '#9a948f' }}>—</td>
                          <td style={{ color: '#9a948f' }}>0.65</td>
                          <td><span style={{ background: 'rgba(53,48,45,.1)', color: '#5a5551', padding: '1px 8px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700 }}>-</span></td>
                        </tr>
                      </tbody>
                    </Tbl>
                  </TblWrap>
                </Card>

                {/* ── Upload ── */}
                {!isReadOnly && (
                  <Card style={{ maxWidth: 540 }}>
                    <CardLabel>Importar Nova Base</CardLabel>
                    <p style={{ fontSize: '0.84rem', color: '#5a5551', marginTop: '0.5rem', lineHeight: 1.65 }}>
                      Após o upload um novo período de <strong>25 dias</strong> será criado. Períodos anteriores são desativados automaticamente.
                    </p>

                    {period && !period.is_expired && (
                      <Alert $t="warn" style={{ marginTop: '0.9rem' }}>
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
                )}

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
