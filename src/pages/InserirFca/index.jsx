import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FcaGlobal, AppBg, Topbar, BrandWrap, BrandCode, BrandText, SessionBox,
  MainShell, Card, CardTitle, PageTitle, TableWrap, Table,
  RoleBadge, Btn, WindowBadge,
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
    if (!fcaStorage.get('token')) { navigate('/login/FCA'); return; }
    if (role === 'admin')       navigate('/dashboard/adm');
    if (role === 'coordenacao') navigate('/dashboard/coordenador');
    if (role === 'supervisao')  navigate('/dashboard/supervisor');
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
          <PageTitle>Minha <span>Posição</span></PageTitle>

          {winData && (
            <div style={{ marginBottom: '1.2rem' }}>
              <WindowBadge $open={winData.status.is_open}>
                <span className="dot" />
                {winData.status.is_open
                  ? `Janela de vínculos aberta — dias ${winData.config.start_day} a ${winData.config.end_day}`
                  : 'Janela de vínculos fechada'}
              </WindowBadge>
            </div>
          )}

          {me && (
            <Card style={{ maxWidth: 600 }}>
              <CardTitle>Seus dados</CardTitle>
              <TableWrap>
                <Table style={{ minWidth: 0 }}>
                  <tbody>
                    <tr><td style={{ color: 'var(--text-muted)', width: 140, fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nome</td><td><strong>{me.name}</strong></td></tr>
                    <tr><td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Usuário</td><td>{me.usuario}</td></tr>
                    <tr><td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Perfil</td><td><RoleBadge $role={me.role}>{ROLE_LABELS[me.role] || me.role}</RoleBadge></td></tr>
                    <tr><td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Matrícula</td><td>{me.employee_id || '—'}</td></tr>
                    <tr><td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Território</td><td>{me.territory || '—'}</td></tr>
                    <tr><td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Regional</td><td>{me.regional || '—'}</td></tr>
                    <tr><td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cargo</td><td>{me.title || '—'}</td></tr>
                    <tr>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Superior direto</td>
                      <td>
                        {manager ? (
                          <>
                            <strong>{manager.name}</strong>
                            <RoleBadge $role={manager.role} style={{ marginLeft: 8 }}>{ROLE_LABELS[manager.role]}</RoleBadge>
                          </>
                        ) : (
                          <span style={{ background: 'rgba(184,108,16,0.14)', color: '#7a4a00', padding: '3px 10px', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 700 }}>
                            Não vinculado
                          </span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </TableWrap>
            </Card>
          )}

          {me && !me.manager_id && (
            <Card style={{ maxWidth: 600, background: 'rgba(184,108,16,0.08)', borderColor: 'rgba(184,108,16,0.3)' }}>
              <p style={{ fontSize: '0.88rem', color: '#7a4a00', fontWeight: 600, lineHeight: 1.6 }}>
                ⚠️ Você ainda não está vinculado a um superior. Entre em contato com seu supervisor ou administrador para solicitar o vínculo.
              </p>
            </Card>
          )}
        </MainShell>
      </AppBg>
    </div>
  );
};

export default FcaViewer;
