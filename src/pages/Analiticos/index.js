import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import {
  FiPlus, FiEdit2, FiTrash2, FiUsers, FiBriefcase,
  FiMap, FiAward, FiSearch, FiX, FiAlertTriangle, FiUser,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import {
  AdminContainer, StatsRow, StatCard,
  TabBar, TabButton,
  SectionCard, CardHeader, CardTitle, CardActions, SearchBar, AddButton,
  StyledTable, Avatar, UserCell, Chip, ActionGroup, IconBtn, EmptyState,
  ModalOverlay, ModalBox, ModalHeader, ModalClose, ModalBody, ModalFooter,
  FormGrid, FieldLabel, FieldInput, FieldSelect,
  SaveButton, CancelButton,
  ConfirmBox, ConfirmBody, ConfirmFooter, DeleteButton,
} from './styles';

// ── helpers ──────────────────────────────────────────────────
const initials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

// ── User form modal ───────────────────────────────────────────
const UserModal = ({ user, empresas, cargos, regionais, onClose, onSave }) => {
  const [form, setForm] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    password: '',
    empresa_id: user?.empresa_id || '',
    cargo_id: user?.cargo_id || '',
    regional_id: user?.regional_id || '',
    territorio: user?.territorio || '',
  });

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalBox as="form" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <ModalHeader>
          <h3><FiUser /> {user ? 'Editar Usuário' : 'Novo Usuário'}</h3>
          <ModalClose type="button" onClick={onClose}><FiX /></ModalClose>
        </ModalHeader>
        <ModalBody>
          <FormGrid>
            <FieldLabel>
              Nome completo
              <FieldInput name="nome" value={form.nome} onChange={set} placeholder="João Silva" required />
            </FieldLabel>
            <FieldLabel>
              E-mail
              <FieldInput name="email" type="email" value={form.email} onChange={set} placeholder="joao@empresa.com" required />
            </FieldLabel>
            <FieldLabel>
              {user ? 'Nova senha (opcional)' : 'Senha'}
              <FieldInput name="password" type="password" value={form.password} onChange={set} placeholder="••••••••" required={!user} />
            </FieldLabel>
            <FieldLabel>
              Empresa
              <FieldSelect name="empresa_id" value={form.empresa_id} onChange={set}>
                <option value="">Selecione...</option>
                {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </FieldSelect>
            </FieldLabel>
            <FieldLabel>
              Cargo
              <FieldSelect name="cargo_id" value={form.cargo_id} onChange={set}>
                <option value="">Selecione...</option>
                {cargos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </FieldSelect>
            </FieldLabel>
            <FieldLabel>
              Regional
              <FieldSelect name="regional_id" value={form.regional_id} onChange={set}>
                <option value="">Selecione...</option>
                {regionais.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
              </FieldSelect>
            </FieldLabel>
            <FieldLabel>
              Territorio
              <FieldInput name="territorio" value={form.territorio} onChange={set} placeholder="Ex.: Barretos" />
            </FieldLabel>
          </FormGrid>
        </ModalBody>
        <ModalFooter>
          <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
          <SaveButton type="submit">Salvar usuário</SaveButton>
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};

// ── Simple form modal (empresa / regional / cargo) ────────────
const SimpleModal = ({ entity, item, onClose, onSave }) => {
  const isRegional = entity === 'regionais';
  const label = entity === 'empresas' ? 'Empresa' : entity === 'regionais' ? 'Regional' : 'Cargo';
  const [nome, setNome] = useState(item?.nome || '');
  const [uf, setUf] = useState(item?.uf || '');

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalBox as="form" onSubmit={(e) => { e.preventDefault(); onSave(isRegional ? { nome, uf } : { nome }); }}>
        <ModalHeader>
          <h3><FiBriefcase /> {item ? `Editar ${label}` : `Nova ${label}`}</h3>
          <ModalClose type="button" onClick={onClose}><FiX /></ModalClose>
        </ModalHeader>
        <ModalBody>
          <FieldLabel>
            Nome
            <FieldInput value={nome} onChange={e => setNome(e.target.value)} placeholder={`Nome d${label === 'Empresa' ? 'a' : 'o'} ${label}`} required autoFocus />
          </FieldLabel>
          {isRegional && (
            <FieldLabel>
              UF
              <FieldInput value={uf} onChange={e => setUf(e.target.value)} placeholder="SP" maxLength={2} required />
            </FieldLabel>
          )}
        </ModalBody>
        <ModalFooter>
          <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
          <SaveButton type="submit">Salvar</SaveButton>
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  );
};

// ── Delete confirm modal ──────────────────────────────────────
const ConfirmDelete = ({ name, onClose, onConfirm }) => (
  <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
    <ConfirmBox>
      <ConfirmBody>
        <div className="icon"><FiAlertTriangle /></div>
        <h3>Confirmar exclusão</h3>
        <p>Tem certeza que deseja excluir <strong style={{ color: '#f1f5f9' }}>{name}</strong>? Esta ação não pode ser desfeita.</p>
      </ConfirmBody>
      <ConfirmFooter>
        <CancelButton onClick={onClose}>Cancelar</CancelButton>
        <DeleteButton onClick={onConfirm}><FiTrash2 /> Excluir</DeleteButton>
      </ConfirmFooter>
    </ConfirmBox>
  </ModalOverlay>
);

// ── Main component ────────────────────────────────────────────
const Admin = () => {
  const { user, logout, apiFetch } = useAuth();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  const [users, setUsers]       = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [cargos, setCargos]     = useState([]);
  const [regionais, setRegionais] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('users');
  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState({ type: null, data: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [u, e, c, r] = await Promise.all([
        apiFetch('/api/users'), apiFetch('/api/empresas'),
        apiFetch('/api/cargos'), apiFetch('/api/regionais'),
      ]);
      setUsers(Array.isArray(u) ? u : []);
      setEmpresas(Array.isArray(e) ? e : []);
      setCargos(Array.isArray(c) ? c : []);
      setRegionais(Array.isArray(r) ? r : []);
    } catch {
      toast.error('Falha ao carregar dados.');
    } finally {
      setIsLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // reset search when tab changes
  useEffect(() => { setSearch(''); }, [activeTab]);

  const openModal  = (type, data = null) => setModal({ type, data });
  const closeModal = () => setModal({ type: null, data: null });

  const handleSave = async (entity, data) => {
    const isEditing = modal.data;
    const endpoint  = isEditing ? `/api/${entity}/${modal.data.id}` : `/api/${entity}`;
    const method    = isEditing ? 'PUT' : 'POST';
    try {
      await apiFetch(endpoint, { method, data });
      toast.success('Salvo com sucesso!');
      await fetchData();
      closeModal();
    } catch {
      toast.error('Erro ao salvar.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiFetch(`/api/${deleteTarget.entity}/${deleteTarget.id}`, { method: 'DELETE' });
      toast.success('Excluído com sucesso!');
      await fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erro ao excluir.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const tabs = [
    { id: 'users',    label: 'Usuários',  icon: <FiUsers />,    count: users.length },
    { id: 'empresas', label: 'Empresas',  icon: <FiBriefcase />, count: empresas.length },
    { id: 'regionais',label: 'Regionais', icon: <FiMap />,      count: regionais.length },
    { id: 'cargos',   label: 'Cargos',    icon: <FiAward />,    count: cargos.length },
  ];

  // filtered lists
  const term = search.toLowerCase();
  const filteredUsers = useMemo(() =>
    users.filter(u =>
      u.nome?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.empresa?.nome?.toLowerCase().includes(term) ||
      u.territorio?.toLowerCase().includes(term)
    ), [users, term]);

  const filteredEmpresas = useMemo(() =>
    empresas.filter(e => e.nome?.toLowerCase().includes(term)), [empresas, term]);

  const filteredRegionais = useMemo(() =>
    regionais.filter(r => r.nome?.toLowerCase().includes(term) || r.uf?.toLowerCase().includes(term)), [regionais, term]);

  const filteredCargos = useMemo(() =>
    cargos.filter(c => c.nome?.toLowerCase().includes(term)), [cargos, term]);

  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />

      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>Administração do Sistema</HeaderTitle>
          <UserProfile>
            <span>{user?.nome}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>

        <AdminContainer>
          {/* Stats */}
          <StatsRow>
            <StatCard color="rgba(168,55,44,0.18)" iconColor="#e05a50">
              <div className="icon"><FiUsers /></div>
              <div className="info">
                <h4>{isLoading ? '—' : users.length}</h4>
                <p>Usuários</p>
              </div>
            </StatCard>
            <StatCard color="rgba(14,165,233,0.15)" iconColor="#38bdf8">
              <div className="icon"><FiBriefcase /></div>
              <div className="info">
                <h4>{isLoading ? '—' : empresas.length}</h4>
                <p>Empresas</p>
              </div>
            </StatCard>
            <StatCard color="rgba(99,102,241,0.15)" iconColor="#818cf8">
              <div className="icon"><FiMap /></div>
              <div className="info">
                <h4>{isLoading ? '—' : regionais.length}</h4>
                <p>Regionais</p>
              </div>
            </StatCard>
            <StatCard color="rgba(16,185,129,0.15)" iconColor="#34d399">
              <div className="icon"><FiAward /></div>
              <div className="info">
                <h4>{isLoading ? '—' : cargos.length}</h4>
                <p>Cargos</p>
              </div>
            </StatCard>
          </StatsRow>

          {/* Tabs */}
          <TabBar>
            {tabs.map(t => (
              <TabButton key={t.id} active={activeTab === t.id} onClick={() => setActiveTab(t.id)}>
                {t.icon}
                {t.label}
                <span className="count">{t.count}</span>
              </TabButton>
            ))}
          </TabBar>

          {/* ── Usuários ── */}
          {activeTab === 'users' && (
            <SectionCard>
              <CardHeader>
                <CardTitle><FiUsers /> Controle de Usuários</CardTitle>
                <CardActions>
                  <SearchBar>
                    <FiSearch />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuário..." />
                  </SearchBar>
                  <AddButton onClick={() => openModal('users')}>
                    <FiPlus /> Novo usuário
                  </AddButton>
                </CardActions>
              </CardHeader>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Empresa</th>
                    <th>Cargo</th>
                    <th>Regional</th>
                    <th>Territorio</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.3)' }}>Carregando...</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan={6}><EmptyState><FiUsers /><p>Nenhum usuário encontrado</p></EmptyState></td></tr>
                  ) : filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <UserCell>
                          <Avatar>{initials(u.nome)}</Avatar>
                          <div>
                            <div className="name">{u.nome}</div>
                            <div className="email">{u.email}</div>
                          </div>
                        </UserCell>
                      </td>
                      <td><Chip>{u.empresa?.nome || '—'}</Chip></td>
                      <td><Chip>{u.cargo?.nome || '—'}</Chip></td>
                      <td>{u.regional?.nome || '—'}</td>
                      <td>{u.territorio || '—'}</td>
                      <td>
                        <ActionGroup style={{ justifyContent: 'flex-end' }}>
                          <IconBtn title="Editar" onClick={() => openModal('users', u)}><FiEdit2 /></IconBtn>
                          <IconBtn variant="danger" title="Excluir" onClick={() => setDeleteTarget({ entity: 'users', id: u.id, name: u.nome })}><FiTrash2 /></IconBtn>
                        </ActionGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </SectionCard>
          )}

          {/* ── Empresas ── */}
          {activeTab === 'empresas' && (
            <SectionCard>
              <CardHeader>
                <CardTitle><FiBriefcase /> Empresas</CardTitle>
                <CardActions>
                  <SearchBar>
                    <FiSearch />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar empresa..." />
                  </SearchBar>
                  <AddButton onClick={() => openModal('empresas')}>
                    <FiPlus /> Nova empresa
                  </AddButton>
                </CardActions>
              </CardHeader>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={2} style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.3)' }}>Carregando...</td></tr>
                  ) : filteredEmpresas.length === 0 ? (
                    <tr><td colSpan={2}><EmptyState><FiBriefcase /><p>Nenhuma empresa encontrada</p></EmptyState></td></tr>
                  ) : filteredEmpresas.map(e => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{e.nome}</td>
                      <td>
                        <ActionGroup style={{ justifyContent: 'flex-end' }}>
                          <IconBtn title="Editar" onClick={() => openModal('empresas', e)}><FiEdit2 /></IconBtn>
                          <IconBtn variant="danger" title="Excluir" onClick={() => setDeleteTarget({ entity: 'empresas', id: e.id, name: e.nome })}><FiTrash2 /></IconBtn>
                        </ActionGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </SectionCard>
          )}

          {/* ── Regionais ── */}
          {activeTab === 'regionais' && (
            <SectionCard>
              <CardHeader>
                <CardTitle><FiMap /> Regionais</CardTitle>
                <CardActions>
                  <SearchBar>
                    <FiSearch />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar regional..." />
                  </SearchBar>
                  <AddButton onClick={() => openModal('regionais')}>
                    <FiPlus /> Nova regional
                  </AddButton>
                </CardActions>
              </CardHeader>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>UF</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={3} style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.3)' }}>Carregando...</td></tr>
                  ) : filteredRegionais.length === 0 ? (
                    <tr><td colSpan={3}><EmptyState><FiMap /><p>Nenhuma regional encontrada</p></EmptyState></td></tr>
                  ) : filteredRegionais.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{r.nome}</td>
                      <td><Chip>{r.uf}</Chip></td>
                      <td>
                        <ActionGroup style={{ justifyContent: 'flex-end' }}>
                          <IconBtn title="Editar" onClick={() => openModal('regionais', r)}><FiEdit2 /></IconBtn>
                          <IconBtn variant="danger" title="Excluir" onClick={() => setDeleteTarget({ entity: 'regionais', id: r.id, name: r.nome })}><FiTrash2 /></IconBtn>
                        </ActionGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </SectionCard>
          )}

          {/* ── Cargos ── */}
          {activeTab === 'cargos' && (
            <SectionCard>
              <CardHeader>
                <CardTitle><FiAward /> Cargos</CardTitle>
                <CardActions>
                  <SearchBar>
                    <FiSearch />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cargo..." />
                  </SearchBar>
                  <AddButton onClick={() => openModal('cargos')}>
                    <FiPlus /> Novo cargo
                  </AddButton>
                </CardActions>
              </CardHeader>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={2} style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.3)' }}>Carregando...</td></tr>
                  ) : filteredCargos.length === 0 ? (
                    <tr><td colSpan={2}><EmptyState><FiAward /><p>Nenhum cargo encontrado</p></EmptyState></td></tr>
                  ) : filteredCargos.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{c.nome}</td>
                      <td>
                        <ActionGroup style={{ justifyContent: 'flex-end' }}>
                          <IconBtn title="Editar" onClick={() => openModal('cargos', c)}><FiEdit2 /></IconBtn>
                          <IconBtn variant="danger" title="Excluir" onClick={() => setDeleteTarget({ entity: 'cargos', id: c.id, name: c.nome })}><FiTrash2 /></IconBtn>
                        </ActionGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </SectionCard>
          )}
        </AdminContainer>
      </ContentArea>

      {/* Modals */}
      {modal.type === 'users' && (
        <UserModal
          user={modal.data}
          empresas={empresas}
          cargos={cargos}
          regionais={regionais}
          onClose={closeModal}
          onSave={(data) => handleSave('users', data)}
        />
      )}
      {modal.type === 'empresas' && (
        <SimpleModal entity="empresas" item={modal.data} onClose={closeModal} onSave={(data) => handleSave('empresas', data)} />
      )}
      {modal.type === 'regionais' && (
        <SimpleModal entity="regionais" item={modal.data} onClose={closeModal} onSave={(data) => handleSave('regionais', data)} />
      )}
      {modal.type === 'cargos' && (
        <SimpleModal entity="cargos" item={modal.data} onClose={closeModal} onSave={(data) => handleSave('cargos', data)} />
      )}

      {deleteTarget && (
        <ConfirmDelete
          name={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </LayoutContainer>
  );
};

export default Admin;
