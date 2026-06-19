import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FcaGlobal, FcaWrap, Topbar, BrandRow, BrandLogo, BrandMeta, SessionPill,
  Shell, AppLayout, SideNav, NavBtn, ContentArea,
  PageTitle, Card, CardLabel, MetricsRow, Metric,
  FGrid, Fld, Lbl, Inp, Sel, Btn, TblWrap, Tbl,
  WinBadge, Empty, Alert, Overlay, ModalBox,
} from '../FCA/theme';
import { fcafStorage, fcafFetch, FCAF_ROLE_LABELS } from '../FCAF/api';
import { CHECKLIST_SECTIONS, PO_QUESTIONS, buildEmptyChecklist, buildEmptyPo } from '../FCAF/questions';

const TABS = ['Analítico', 'Checklist', 'PO'];

const statusStyle = {
  realizado:     { bg: 'rgba(47,122,63,.14)',   color: '#1a5028' },
  nao_iniciado:  { bg: 'rgba(53,48,45,.10)',    color: '#5a5551' },
  em_andamento:  { bg: 'rgba(184,108,16,.14)',  color: '#7a4a00' },
  pendente:      { bg: 'rgba(184,108,16,.14)',  color: '#7a4a00' },
  vencido:       { bg: 'rgba(157,41,38,.14)',   color: '#6d1e1a' },
};

const STATUS_LABELS = {
  realizado: 'Realizado',
  nao_iniciado: 'Nao iniciado',
  em_andamento: 'Em andamento',
  pendente: 'Pendente',
  vencido: 'Vencido',
};

const fmtDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

const StatusChip = ({ s }) => (
  <span style={{ background: statusStyle[s]?.bg, color: statusStyle[s]?.color, padding: '3px 10px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700 }}>
    {STATUS_LABELS[s] || s}
  </span>
);
const CertChip = ({ v }) => (
  <span style={{
    background: v === 'Sim' ? 'rgba(47,122,63,.14)' : 'rgba(53,48,45,.1)',
    color: v === 'Sim' ? '#1a5028' : '#5a5551',
    padding: '2px 9px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
  }}>{v}</span>
);

const DashboardFcaSupervisor = () => {
  const navigate = useNavigate();
  const name     = fcafStorage.get('name') || 'Supervisor';
  const role     = fcafStorage.get('role');

  const [tab,         setTab]       = useState('Analítico');
  const [analytics,   setAnalytics] = useState(null);
  const [selectedTec, setSelectedTec] = useState('');
  const [tecDetail,   setTecDetail]   = useState(null);

  // Checklist state
  const [clAnswers,   setClAnswers]   = useState([]);
  const [clLoaded,    setClLoaded]    = useState(false);
  const [clSaving,    setClSaving]    = useState(false);
  const [viewCl,      setViewCl]      = useState(false);

  // PO state
  const [poList,      setPoList]      = useState([]);
  const [poModal,     setPoModal]     = useState(false);
  const [poAnswers,   setPoAnswers]   = useState([]);
  const [poDate,      setPoDate]      = useState('');
  const [poSaving,    setPoSaving]    = useState(false);

  useEffect(() => {
    if (!fcafStorage.get('token') || role !== 'supervisao') navigate('/login/FCA');
  }, [navigate, role]);

  const loadAnalytics = useCallback(async () => {
    try { setAnalytics(await fcafFetch('/fcaf/analytics')); }
    catch (err) { toast.error(err.message); }
  }, []);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

  const logout = () => { fcafStorage.clear(); navigate('/login/FCA'); };

  const tecnicos = analytics?.tecnicos || [];
  const period   = analytics?.period;
  const detailChecklistCount = tecDetail?.checklist_count ?? (tecDetail?.has_checklist ? 1 : 0);
  const detailRequiredChecklists = tecDetail?.required_checklists ?? tecDetail?.required_pos ?? 0;
  const detailPoCount = tecDetail?.po_count ?? 0;
  const detailPoProgress = tecDetail?.po_progress ?? tecDetail?.po_days ?? 0;
  const canCreateChecklist = Boolean(tecDetail && period && !period.is_expired
    && (tecDetail.can_create_checklist ?? (detailChecklistCount < detailRequiredChecklists)));
  const canCreatePo = Boolean(tecDetail && period && !period.is_expired
    && (tecDetail.can_create_po ?? (detailChecklistCount > detailPoCount)));

  // ── Load technician detail + forms ───────────────────────────────────────
  const loadTecDetail = useCallback(async (id) => {
    if (!id) { setTecDetail(null); setClAnswers([]); setClLoaded(false); setPoList([]); return; }
    try {
      const [det, cl, pos] = await Promise.all([
        fcafFetch(`/fcaf/tecnico/${id}`),
        fcafFetch(`/fcaf/tecnico/${id}/checklist`),
        fcafFetch(`/fcaf/tecnico/${id}/pos`),
      ]);
      setTecDetail(det);
      if (cl && Array.isArray(cl.answers) && cl.answers.length > 0) {
        setClAnswers(cl.answers);
        setClLoaded(true);
      } else {
        setClAnswers(buildEmptyChecklist());
        setClLoaded(false);
      }
      setPoList(pos);
    } catch (err) { toast.error(err.message); }
  }, []);

  const onSelectTec = (id) => {
    setSelectedTec(id);
    setViewCl(false);
    loadTecDetail(id || null);
  };

  // ── Checklist submit ──────────────────────────────────────────────────────
  const submitChecklist = async (e) => {
    e.preventDefault();
    const unanswered = clAnswers.filter((a) => a.answer === null);
    if (unanswered.length > 0) { toast.error(`${unanswered.length} pergunta(s) sem resposta.`); return; }
    setClSaving(true);
    try {
      await fcafFetch('/fcaf/checklist', { method: 'POST', body: JSON.stringify({ tecnico_id: +selectedTec, answers: clAnswers }) });
      toast.success('Checklist salvo!');
      setClLoaded(true);
      loadTecDetail(selectedTec);
      loadAnalytics();
    } catch (err) { toast.error(err.message); }
    finally { setClSaving(false); }
  };

  const setClAnswer = (idx, field, value) => {
    setClAnswers((prev) => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  };

  const startNewChecklist = () => {
    setClAnswers(buildEmptyChecklist());
    setClLoaded(false);
    setViewCl(false);
  };

  // ── PO submit ─────────────────────────────────────────────────────────────
  const openPoModal = () => {
    setPoAnswers(buildEmptyPo());
    setPoDate(new Date().toISOString().slice(0, 10));
    setPoModal(true);
  };

  const submitPo = async (e) => {
    e.preventDefault();
    const unanswered = poAnswers.filter((a) => a.answer === null);
    if (unanswered.length > 0) { toast.error(`${unanswered.length} pergunta(s) sem resposta.`); return; }
    if (!poDate) { toast.error('Informe a data do PO.'); return; }
    setPoSaving(true);
    try {
      await fcafFetch('/fcaf/po', { method: 'POST', body: JSON.stringify({ tecnico_id: +selectedTec, answers: poAnswers, po_date: poDate }) });
      toast.success('PO registrado!');
      setPoModal(false);
      loadTecDetail(selectedTec);
      loadAnalytics();
    } catch (err) { toast.error(err.message); }
    finally { setPoSaving(false); }
  };

  const setPoAnswer = (idx, field, value) => {
    setPoAnswers((prev) => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  };

  return (
    <FcaWrap>
      <FcaGlobal />
      <Topbar>
        <BrandRow>
          <BrandLogo>FCA</BrandLogo>
          <BrandMeta>
            <div className="title">Avaliação de Campo</div>
            <div className="sub">Painel do Supervisor</div>
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
                <PageTitle>Meu <em>Analítico</em></PageTitle>

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
                  <Alert $t="warn">⚠️ Nenhum período ativo no momento.</Alert>
                )}

                {analytics?.metrics && (
                  <MetricsRow>
                    <Metric><div className="label">Total</div><div className="value">{analytics.metrics.total}</div></Metric>
                    <Metric><div className="label">Realizado</div><div className="value">{analytics.metrics.realizado}</div></Metric>
                    <Metric><div className="label">Nao iniciado</div><div className="value">{analytics.metrics.nao_iniciado || 0}</div></Metric>
                    <Metric><div className="label">Em andamento</div><div className="value">{analytics.metrics.em_andamento || 0}</div></Metric>
                    <Metric><div className="label">Vencido</div><div className="value">{analytics.metrics.vencido}</div></Metric>
                  </MetricsRow>
                )}

                <Card>
                  <CardLabel>Meus Técnicos no Período</CardLabel>
                  <TblWrap style={{ marginTop: '0.8rem' }}>
                    <Tbl>
                      <thead>
                        <tr>
                          <th>Técnico</th><th>Certificado</th>
                          <th>Checklist</th><th>POs</th><th>Status</th><th>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tecnicos.map((t) => {
                          const checklistCount = t.checklist_count ?? (t.has_checklist ? 1 : 0);
                          const requiredChecklists = t.required_checklists ?? t.required_pos;
                          const poProgress = t.po_progress ?? t.po_days;

                          return (
                            <tr key={t.id}>
                              <td><strong>{t.nome}</strong></td>
                              <td><CertChip v={t.certificado} /></td>
                              <td>
                                <span style={{ fontWeight: 700, color: checklistCount >= requiredChecklists ? '#1a5028' : '#9a948f', fontSize: '0.82rem' }}>
                                  {checklistCount}/{requiredChecklists}
                                </span>
                              </td>
                              <td style={{ fontSize: '0.82rem' }}>
                                <span style={{ fontWeight: 700, color: poProgress >= t.required_pos ? '#1a5028' : '#9a948f' }}>
                                  {poProgress}/{t.required_pos}
                                </span>
                                <span style={{ color: '#9a948f', fontSize: '0.72rem' }}> {t.isCertificado ? 'POs' : 'dias'}</span>
                              </td>
                              <td><StatusChip s={t.status} /></td>
                              <td>
                                <Btn className="sm" onClick={() => { setTab('Checklist'); onSelectTec(String(t.id)); }}>
                                  Avaliar
                                </Btn>
                              </td>
                            </tr>
                          );
                        })}
                        {tecnicos.length === 0 && (
                          <tr><td colSpan={6}><Empty><div className="icon">👥</div>Nenhum técnico vinculado na base atual.</Empty></td></tr>
                        )}
                      </tbody>
                    </Tbl>
                  </TblWrap>
                </Card>
              </>
            )}

            {/* ── CHECKLIST ── */}
            {tab === 'Checklist' && (
              <>
                <PageTitle>Preencher <em>Checklist</em></PageTitle>

                <Card style={{ maxWidth: 540, marginBottom: '1.2rem' }}>
                  <CardLabel>Selecione o técnico</CardLabel>
                  <Sel style={{ marginTop: '0.6rem' }} value={selectedTec} onChange={(e) => onSelectTec(e.target.value)}>
                    <option value="">Selecione...</option>
                    {tecnicos.map((t) => {
                      const checklistCount = t.checklist_count ?? (t.has_checklist ? 1 : 0);
                      const requiredChecklists = t.required_checklists ?? t.required_pos;
                      return (
                        <option key={t.id} value={t.id}>
                          {t.nome} — Checklist {checklistCount}/{requiredChecklists}
                        </option>
                      );
                    })}
                  </Sel>
                </Card>

                {selectedTec && tecDetail && (
                  <>
                    {/* Info bar */}
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
                      <CertChip v={tecDetail.certificado} />
                      <StatusChip s={tecDetail.status} />
                      <span style={{ fontSize: '0.82rem', color: '#5a5551', fontWeight: 600 }}>
                        Checklists: <strong>{detailChecklistCount}</strong>/{detailRequiredChecklists}
                      </span>
                      {clLoaded && (
                        <Btn $v="ghost" className="sm" onClick={() => setViewCl(!viewCl)}>
                          {viewCl ? 'Ocultar respostas' : 'Ver respostas preenchidas'}
                        </Btn>
                      )}
                      {canCreateChecklist && (
                        <Btn className="sm" onClick={startNewChecklist}>+ Novo Checklist</Btn>
                      )}
                    </div>

                    {!canCreateChecklist && detailChecklistCount < detailRequiredChecklists && tecDetail.next_checklist_at && (
                      <Alert $t="warn" style={{ marginBottom: '1rem' }}>
                        Proximo Checklist deste tecnico liberado em {fmtDateTime(tecDetail.next_checklist_at)}.
                      </Alert>
                    )}

                    {clLoaded && !viewCl && (
                      <Alert $t={detailChecklistCount >= detailRequiredChecklists ? 'success' : 'warn'}>
                        Checklist mais recente carregado. Realizados: {detailChecklistCount}/{detailRequiredChecklists}.
                      </Alert>
                    )}

                    {(!clLoaded || viewCl) && (
                      <form onSubmit={clLoaded ? (e) => e.preventDefault() : submitChecklist}>
                        {CHECKLIST_SECTIONS.map((sec, si) => {
                          const startIdx   = clAnswers.findIndex((a) => a.section === sec.id);
                          return (
                            <Card key={sec.id} $p="1.1rem">
                              <CardLabel style={{ marginBottom: '0.8rem' }}>
                                {sec.id} — {sec.title}
                              </CardLabel>
                              {sec.questions.map((q, qi) => {
                                const absIdx = startIdx + qi;
                                const ans    = clAnswers[absIdx];
                                return (
                                  <div key={qi} style={{ borderBottom: '1px solid rgba(53,48,45,.07)', paddingBottom: '0.9rem', marginBottom: '0.9rem' }}>
                                    <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#2e2a26', marginBottom: '0.45rem', lineHeight: 1.5 }}>
                                      {q}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                      {['Sim', 'Não'].map((opt) => {
                                        const sel = ans?.answer === opt;
                                        const isSim = opt === 'Sim';
                                        return (
                                          <label key={opt} style={{
                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                            padding: '0.45rem 1.1rem', borderRadius: '999px', minHeight: '40px', minWidth: '72px',
                                            cursor: clLoaded ? 'default' : 'pointer', fontSize: '0.82rem', fontWeight: 700,
                                            userSelect: 'none', transition: 'all .15s',
                                            background: sel ? (isSim ? 'rgba(47,122,63,.16)' : 'rgba(157,41,38,.16)') : 'rgba(53,48,45,.07)',
                                            color: sel ? (isSim ? '#1a5028' : '#6d1e1a') : '#9a948f',
                                            border: `1.5px solid ${sel ? (isSim ? 'rgba(47,122,63,.4)' : 'rgba(157,41,38,.4)') : 'transparent'}`,
                                          }}>
                                            <input type="radio" name={`q-${absIdx}`} value={opt} checked={sel} disabled={clLoaded}
                                              onChange={() => setClAnswer(absIdx, 'answer', opt)}
                                              style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                                            />
                                            {opt}
                                          </label>
                                        );
                                      })}
                                      <Inp
                                        style={{ flex: 1, minWidth: 140, fontSize: '0.78rem', padding: '0.42rem 0.7rem' }}
                                        placeholder="Observação (opcional)"
                                        value={ans?.observation || ''}
                                        onChange={(e) => setClAnswer(absIdx, 'observation', e.target.value)}
                                        disabled={clLoaded}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </Card>
                          );
                        })}

                        {!clLoaded && (
                          <Btn type="submit" disabled={clSaving} style={{ marginTop: '0.5rem' }}>
                            {clSaving ? 'Salvando...' : 'Salvar Checklist'}
                          </Btn>
                        )}
                      </form>
                    )}
                  </>
                )}
              </>
            )}

            {/* ── PO ── */}
            {tab === 'PO' && (
              <>
                <PageTitle>Registrar <em>PO</em></PageTitle>

                <Card style={{ maxWidth: 540, marginBottom: '1.2rem' }}>
                  <CardLabel>Selecione o técnico</CardLabel>
                  <Sel style={{ marginTop: '0.6rem' }} value={selectedTec} onChange={(e) => onSelectTec(e.target.value)}>
                    <option value="">Selecione...</option>
                    {tecnicos.map((t) => {
                      const poProgress = t.po_progress ?? t.po_days;
                      return (
                        <option key={t.id} value={t.id}>
                          {t.nome} — PO {poProgress}/{t.required_pos}
                        </option>
                      );
                    })}
                  </Sel>
                </Card>

                {selectedTec && tecDetail && (
                  <>
                    {!tecDetail.has_checklist && (
                      <Alert $t="warn" style={{ marginBottom: '1rem' }}>
                        ⚠️ Preencha o Checklist deste técnico antes de registrar um PO.
                      </Alert>
                    )}
                    {period && !period.is_expired && tecDetail.has_checklist && detailPoCount >= detailChecklistCount && detailPoCount < detailRequiredChecklists && (
                      <Alert $t="warn" style={{ marginBottom: '1rem' }}>
                        Realize mais um Checklist deste técnico antes de registrar outro PO.
                      </Alert>
                    )}

                    {period && !period.is_expired && tecDetail.has_checklist && !canCreatePo && detailPoCount < detailRequiredChecklists && detailPoCount < detailChecklistCount && tecDetail.next_po_at && (
                      <Alert $t="warn" style={{ marginBottom: '1rem' }}>
                        Proximo PO deste tecnico liberado em {fmtDateTime(tecDetail.next_po_at)}.
                      </Alert>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
                      <CertChip v={tecDetail.certificado} />
                      <span style={{ fontSize: '0.82rem', color: '#5a5551', fontWeight: 600 }}>
                        POs registrados: <strong>{detailPoCount}</strong> ({detailPoProgress}/{tecDetail.required_pos} {tecDetail.isCertificado ? 'POs' : 'dias distintos'} necessários)
                      </span>
                      {canCreatePo && (
                        <Btn className="sm" onClick={openPoModal}>+ Novo PO</Btn>
                      )}
                    </div>

                    {tecDetail?.legacy_po_warning && !tecDetail.isCertificado && tecDetail.has_checklist && (
                      <Alert $t="warn" style={{ marginBottom: '1rem' }}>
                        Técnico não certificado — necessita {tecDetail.required_pos} POs em dias diferentes. Máximo 1 PO por dia.
                      </Alert>
                    )}

                    {!tecDetail.isCertificado && tecDetail.has_checklist && (
                      <Alert $t="warn" style={{ marginBottom: '1rem' }}>
                        Tecnico nao certificado: necessita {tecDetail.required_pos} POs com intervalo minimo de 72 horas por tecnico.
                      </Alert>
                    )}

                    <Card>
                      <CardLabel>POs Realizados</CardLabel>
                      <TblWrap style={{ marginTop: '0.8rem' }}>
                        <Tbl>
                          <thead><tr><th>#</th><th>Data PO</th><th>Registrado em</th><th>Respostas</th></tr></thead>
                          <tbody>
                            {poList.map((p, i) => (
                              <tr key={p.id}>
                                <td style={{ color: '#9a948f', fontSize: '0.76rem' }}>{i + 1}</td>
                                <td style={{ fontWeight: 700 }}>{new Date(p.po_date + 'T12:00:00').toLocaleDateString('pt-BR')}</td>
                                <td style={{ color: '#9a948f', fontSize: '0.76rem' }}>{fmtDateTime(p.created_at)}</td>
                                <td style={{ fontSize: '0.78rem', color: '#5a5551' }}>
                                  {p.answers.filter((a) => a.answer === 'Sim').length}/{p.answers.length} Sim
                                </td>
                              </tr>
                            ))}
                            {poList.length === 0 && (
                              <tr><td colSpan={4}><Empty><div className="icon">📋</div>Nenhum PO registrado ainda.</Empty></td></tr>
                            )}
                          </tbody>
                        </Tbl>
                      </TblWrap>
                    </Card>
                  </>
                )}
              </>
            )}
          </ContentArea>
        </AppLayout>
      </Shell>

      {/* ── Modal novo PO ── */}
      {poModal && (
        <Overlay onClick={() => setPoModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <h3>Novo PO — {tecDetail?.nome}</h3>

            <form onSubmit={submitPo}>
              <FGrid style={{ gridTemplateColumns: '1fr', marginBottom: '1.2rem' }}>
                <Fld>
                  <Lbl>Data da Observação *</Lbl>
                  <Inp type="date" value={poDate} onChange={(e) => setPoDate(e.target.value)} max={new Date().toISOString().slice(0, 10)} required />
                </Fld>
              </FGrid>

              {PO_QUESTIONS.map((q, idx) => {
                const ans = poAnswers[idx];
                return (
                  <div key={idx} style={{ borderBottom: '1px solid rgba(53,48,45,.07)', paddingBottom: '0.85rem', marginBottom: '0.85rem' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2e2a26', marginBottom: '0.4rem', lineHeight: 1.5 }}>
                      {idx + 1}. {q}
                    </p>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['Sim', 'Não'].map((opt) => {
                        const sel = ans?.answer === opt;
                        const isSim = opt === 'Sim';
                        return (
                          <label key={opt} style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            padding: '0.45rem 1.1rem', borderRadius: '999px', minHeight: '40px', minWidth: '72px',
                            cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700,
                            userSelect: 'none', transition: 'all .15s',
                            background: sel ? (isSim ? 'rgba(47,122,63,.16)' : 'rgba(157,41,38,.16)') : 'rgba(53,48,45,.07)',
                            color: sel ? (isSim ? '#1a5028' : '#6d1e1a') : '#9a948f',
                            border: `1.5px solid ${sel ? (isSim ? 'rgba(47,122,63,.4)' : 'rgba(157,41,38,.4)') : 'transparent'}`,
                          }}>
                            <input type="radio" name={`po-q-${idx}`} value={opt} checked={sel}
                              onChange={() => setPoAnswer(idx, 'answer', opt)}
                              style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                            />
                            {opt}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="mfooter">
                <Btn $v="outline" type="button" onClick={() => setPoModal(false)}>Cancelar</Btn>
                <Btn type="submit" disabled={poSaving}>{poSaving ? 'Salvando...' : 'Salvar PO'}</Btn>
              </div>
            </form>
          </ModalBox>
        </Overlay>
      )}
    </FcaWrap>
  );
};

export default DashboardFcaSupervisor;
