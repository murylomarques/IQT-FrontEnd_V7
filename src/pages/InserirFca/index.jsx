import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FcaGlobal, FcaWrap, Topbar, BrandRow, BrandLogo, BrandMeta, SessionPill,
  Shell, Card, CardLabel, PageTitle, TblWrap, Tbl,
  RBadge, Btn, WinBadge,
} from '../FCA/theme';
import { fcaStorage, fcaFetch, ROLE_LABELS } from '../FCA/api';

const FcaViewer = () => {
  const navigate = useNavigate();
  const name     = fcaStorage.get('name') || 'Usuário';
  const role     = fcaStorage.get('role');

  const [me,      setMe]      = useState(null);
  const [manager, setManager] = useState(null);
  const [winData, setWinData] = useState(null);

  useEffect(() => {
    if (!fcaStorage.get('token')) { navigate('/login/GH'); return; }
    if (role === 'admin')       navigate('/dashboard/gh-adm');
    if (role === 'coordenacao') navigate('/dashboard/gh-coordenador');
    if (role === 'supervisao')  navigate('/dashboard/gh-supervisor');
  }, [navigate, role]);

  const loadData = useCallback(async () => {
    try {
      const [meData, win] = await Promise.all([fcaFetch('/fca/me'), fcaFetch('/fca/window')]);
      setMe(meData);
      setWinData(win);
      if (meData.manager_id) {
        const dash = await fcaFetch('/fca/dashboard');
        setManager((dash.visible_users || []).find((u) => u.id === meData.manager_id) || null);
      }
    } catch (err) { toast.error(err.message); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const logout = () => { fcaStorage.clear(); navigate('/login/GH'); };

  const thStyle = { color: '#9a948f', width: 140, fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' };

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
        <PageTitle>Minha <em>Posição</em></PageTitle>

        {winData && (
          <div style={{ marginBottom: '1.2rem' }}>
            <WinBadge $open={winData.status.is_open}>
              <span className="dot" />
              {winData.status.is_open
                ? `Janela de vínculos aberta — dias ${winData.config.start_day} a ${winData.config.end_day}`
                : 'Janela de vínculos fechada'}
            </WinBadge>
          </div>
        )}

        {me && (
          <Card style={{ maxWidth: 600 }}>
            <CardLabel>Seus dados</CardLabel>
            <TblWrap style={{ marginTop: '0.8rem' }}>
              <Tbl style={{ minWidth: 0 }}>
                <tbody>
                  <tr><td style={thStyle}>Nome</td><td><strong>{me.name}</strong></td></tr>
                  <tr><td style={thStyle}>Usuário</td><td>{me.usuario}</td></tr>
                  <tr><td style={thStyle}>Perfil</td><td><RBadge $r={me.role}>{ROLE_LABELS[me.role] || me.role}</RBadge></td></tr>
                  <tr><td style={thStyle}>Matrícula</td><td>{me.employee_id || '—'}</td></tr>
                  <tr><td style={thStyle}>Território</td><td>{me.territory || '—'}</td></tr>
                  <tr><td style={thStyle}>Regional</td><td>{me.regional || '—'}</td></tr>
                  <tr><td style={thStyle}>Cargo</td><td>{me.title || '—'}</td></tr>
                  <tr>
                    <td style={thStyle}>Superior direto</td>
                    <td>
                      {manager ? (
                        <>
                          <strong>{manager.name}</strong>
                          <RBadge $r={manager.role} style={{ marginLeft: 8 }}>{ROLE_LABELS[manager.role]}</RBadge>
                        </>
                      ) : (
                        <span style={{ background: 'rgba(184,108,16,0.14)', color: '#7a4a00', padding: '3px 10px', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 700 }}>
                          Não vinculado
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Tbl>
            </TblWrap>
          </Card>
        )}

        {me && !me.manager_id && (
          <Card style={{ maxWidth: 600, background: 'rgba(184,108,16,0.08)', borderColor: 'rgba(184,108,16,0.3)' }}>
            <p style={{ fontSize: '0.88rem', color: '#7a4a00', fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
              ⚠️ Você ainda não está vinculado a um superior. Entre em contato com seu supervisor ou administrador para solicitar o vínculo.
            </p>
          </Card>
        )}
      </Shell>
    </FcaWrap>
  );
};

export default FcaViewer;
