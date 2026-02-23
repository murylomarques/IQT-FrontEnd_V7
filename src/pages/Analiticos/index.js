import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import BacklogSkeleton from '../../components/BacklogSkeleton';
import {
  AdminContainer, SectionCard, CardHeader, CardTitle, CardActions,
  PrimaryButton, SecondaryButton, Table, Thead, Tbody, Tr,
  TableCell, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, FormGrid
} from './styles';

// ==========================================================
// ============ COMPONENTES DE FORMULÁRIO (MODAIS) ==========
// ==========================================================

const UserFormModal = ({ user, empresas, cargos, regionais, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nome: user?.nome || '', email: user?.email || '', password: '',
        empresa_id: user?.empresa_id || '', cargo_id: user?.cargo_id || '', regional_id: user?.regional_id || '',
    });
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return (
        <Modal><ModalContent as="form" onSubmit={handleSubmit}><ModalHeader><h3>{user ? 'Editar Usuário' : 'Novo Usuário'}</h3></ModalHeader><ModalBody><FormGrid><Input name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome Completo" required /><Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required /><Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder={user ? "Nova Senha (opcional)" : "Senha"} required={!user} /><select name="empresa_id" value={formData.empresa_id} onChange={handleChange}><option value="">Selecione a Empresa</option>{empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</select><select name="cargo_id" value={formData.cargo_id} onChange={handleChange}><option value="">Selecione o Cargo</option>{cargos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select><select name="regional_id" value={formData.regional_id} onChange={handleChange}><option value="">Selecione a Regional</option>{regionais.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}</select></FormGrid></ModalBody><ModalFooter><SecondaryButton type="button" onClick={onClose}>Cancelar</SecondaryButton><PrimaryButton type="submit">Salvar</PrimaryButton></ModalFooter></ModalContent></Modal>
    );
};

const SimpleFormModal = ({ entity, item, onClose, onSave }) => {
    const [nome, setNome] = useState(item?.nome || '');
    const isRegional = entity === 'regionais';
    const [uf, setUf] = useState(isRegional ? item?.uf || '' : '');
    const handleSubmit = (e) => { e.preventDefault(); onSave(isRegional ? { nome, uf } : { nome }); };
    const entityName = entity.charAt(0).toUpperCase() + entity.slice(1, -1);
    return (
        <Modal><ModalContent as="form" onSubmit={handleSubmit}><ModalHeader><h3>{item ? `Editar ${entityName}` : `Nov${entityName === 'Empresa' ? 'a' : 'o'} ${entityName}`}</h3></ModalHeader><ModalBody><FormGrid style={{ gridTemplateColumns: '1fr' }}><Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder={`Nome d${entityName === 'Empresa' ? 'a' : 'o'} ${entityName}`} required autoFocus />{isRegional && <Input value={uf} onChange={(e) => setUf(e.target.value)} placeholder="UF" required maxLength="2" />}</FormGrid></ModalBody><ModalFooter><SecondaryButton type="button" onClick={onClose}>Cancelar</SecondaryButton><PrimaryButton type="submit">Salvar</PrimaryButton></ModalFooter></ModalContent></Modal>
    );
};


// ==========================================================
// =================== COMPONENTE PRINCIPAL =================
// ==========================================================

const Admin = () => {
    const { user, logout, apiFetch } = useAuth();
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [users, setUsers] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [regionais, setRegionais] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState({ type: null, data: null });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [usersData, empresasData, cargosData, regionaisData] = await Promise.all([
                apiFetch('/api/users'), apiFetch('/api/empresas'),
                apiFetch('/api/cargos'), apiFetch('/api/regionais'),
            ]);
            setUsers(Array.isArray(usersData) ? usersData : []);
            setEmpresas(Array.isArray(empresasData) ? empresasData : []);
            setCargos(Array.isArray(cargosData) ? cargosData : []);
            setRegionais(Array.isArray(regionaisData) ? regionaisData : []);
        } catch (error) { toast.error("Falha ao carregar dados administrativos."); } 
        finally { setIsLoading(false); }
    }, [apiFetch]);
    
    useEffect(() => { fetchData(); }, [fetchData]);

    const openModal = (type, data = null) => setModal({ type, data });
    const closeModal = () => setModal({ type: null, data: null });

    const handleSave = async (entity, data) => {
        const isEditing = modal.data;
        const endpoint = isEditing ? `/api/${entity}/${modal.data.id}` : `/api/${entity}`;
        const method = isEditing ? 'PUT' : 'POST';
        try {
            await apiFetch(endpoint, { method, data });
            toast.success(`${entity.slice(0, -1)} salvo com sucesso!`);
            await fetchData(); closeModal();
        } catch (error) { toast.error(`Erro ao salvar ${entity.slice(0, -1)}.`); }
    };

    const handleDelete = async (entity, id) => {
        if (window.confirm("Tem certeza que deseja deletar este item?")) {
            try {
                await apiFetch(`/api/${entity}/${id}`, { method: 'DELETE' });
                toast.success(`${entity.slice(0, -1)} deletado com sucesso!`);
                await fetchData();
            } catch (error) {
                const errorMessage = error.response?.data?.message || `Erro ao deletar.`;
                toast.error(errorMessage);
            }
        }
    };

    if (isLoading) {
        return (
            <LayoutContainer>
                <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
                <ContentArea isMenuExpanded={isMenuExpanded}>
                    <Header>
                        <HeaderTitle>Administração do Sistema</HeaderTitle>
                        <UserProfile><span>{user?.nome}</span><button onClick={logout}>Sair</button></UserProfile>
                    </Header>
                    <BacklogSkeleton kpis={3} filters={6} rows={6} cols={6} />
                </ContentArea>
            </LayoutContainer>
        );
    }

    return (
        <LayoutContainer>
            <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
            <ContentArea isMenuExpanded={isMenuExpanded}>
                <Header>
                    <HeaderTitle>Administração do Sistema</HeaderTitle>
                    <UserProfile><span>{user?.nome}</span><button onClick={logout}>Sair</button></UserProfile>
                </Header>

                <AdminContainer>
                    {/* Card de Empresas */}
                    <SectionCard>
                        <CardHeader><CardTitle>Empresas</CardTitle><CardActions><PrimaryButton onClick={() => openModal('empresas')}><FiPlus /> Nova</PrimaryButton></CardActions></CardHeader>
                        <Table>
                            <Thead><Tr columns="1fr auto"><TableCell>Nome</TableCell><TableCell style={{ justifyContent: 'flex-end' }}>Ações</TableCell></Tr></Thead>
                            <Tbody>{empresas.map(e => (<Tr key={e.id} columns="1fr auto"><TableCell>{e.nome}</TableCell><TableCell style={{ justifyContent: 'flex-end' }}><SecondaryButton onClick={() => openModal('empresas', e)}><FiEdit size={14} /></SecondaryButton><PrimaryButton style={{backgroundColor: '#e74c3c', marginLeft: '8px'}} onClick={() => handleDelete('empresas', e.id)}><FiTrash2 size={14} /></PrimaryButton></TableCell></Tr>))}</Tbody>
                        </Table>
                    </SectionCard>

                    {/* Card de Regionais */}
                    <SectionCard>
                        <CardHeader><CardTitle>Regionais</CardTitle><CardActions><PrimaryButton onClick={() => openModal('regionais')}><FiPlus /> Nova</PrimaryButton></CardActions></CardHeader>
                        <Table>
                            <Thead><Tr columns="2fr 1fr auto"><TableCell>Nome</TableCell><TableCell>UF</TableCell><TableCell style={{ justifyContent: 'flex-end' }}>Ações</TableCell></Tr></Thead>
                            <Tbody>{regionais.map(r => (<Tr key={r.id} columns="2fr 1fr auto"><TableCell>{r.nome}</TableCell><TableCell>{r.uf}</TableCell><TableCell style={{ justifyContent: 'flex-end' }}><SecondaryButton onClick={() => openModal('regionais', r)}><FiEdit size={14} /></SecondaryButton><PrimaryButton style={{backgroundColor: '#e74c3c', marginLeft: '8px'}} onClick={() => handleDelete('regionais', r.id)}><FiTrash2 size={14} /></PrimaryButton></TableCell></Tr>))}</Tbody>
                        </Table>
                    </SectionCard>
                    
                    {/* Card de Cargos */}
                    <SectionCard>
                        <CardHeader><CardTitle>Cargos</CardTitle><CardActions><PrimaryButton onClick={() => openModal('cargos')}><FiPlus /> Novo</PrimaryButton></CardActions></CardHeader>
                        <Table>
                            <Thead><Tr columns="1fr auto"><TableCell>Nome</TableCell><TableCell style={{ justifyContent: 'flex-end' }}>Ações</TableCell></Tr></Thead>
                            <Tbody>{cargos.map(c => (<Tr key={c.id} columns="1fr auto"><TableCell>{c.nome}</TableCell><TableCell style={{ justifyContent: 'flex-end' }}><SecondaryButton onClick={() => openModal('cargos', c)}><FiEdit size={14} /></SecondaryButton><PrimaryButton style={{backgroundColor: '#e74c3c', marginLeft: '8px'}} onClick={() => handleDelete('cargos', c.id)}><FiTrash2 size={14} /></PrimaryButton></TableCell></Tr>))}</Tbody>
                        </Table>
                    </SectionCard>
                    
                    {/* Card de Usuários */}
                    <SectionCard style={{ gridColumn: '1 / -1' }}> {/* Ocupa a largura total */}
                        <CardHeader><CardTitle>Controle de Usuários</CardTitle><CardActions><PrimaryButton onClick={() => openModal('users')}><FiPlus /> Novo Usuário</PrimaryButton></CardActions></CardHeader>
                        <Table>
                            <Thead><Tr columns="2fr 2fr 1.5fr 1.5fr auto"><TableCell>Nome</TableCell><TableCell>Email</TableCell><TableCell>Empresa</TableCell><TableCell>Cargo</TableCell><TableCell style={{ justifyContent: 'flex-end' }}>Ações</TableCell></Tr></Thead>
                            <Tbody>{users.map(u => (<Tr key={u.id} columns="2fr 2fr 1.5fr 1.5fr auto"><TableCell>{u.nome}</TableCell><TableCell>{u.email}</TableCell><TableCell>{u.empresa?.nome || 'N/A'}</TableCell><TableCell>{u.cargo?.nome || 'N/A'}</TableCell><TableCell style={{ justifyContent: 'flex-end' }}><SecondaryButton onClick={() => openModal('users', u)}><FiEdit size={14} /></SecondaryButton><PrimaryButton style={{backgroundColor: '#e74c3c', marginLeft: '8px'}} onClick={() => handleDelete('users', u.id)}><FiTrash2 size={14} /></PrimaryButton></TableCell></Tr>))}</Tbody>
                        </Table>
                    </SectionCard>
                </AdminContainer>

                {/* Renderização condicional dos Modais */}
                {modal.type === 'users' && <UserFormModal user={modal.data} empresas={empresas} cargos={cargos} regionais={regionais} onClose={closeModal} onSave={(data) => handleSave('users', data)} />}
                {modal.type === 'cargos' && <SimpleFormModal entity="cargos" item={modal.data} onClose={closeModal} onSave={(data) => handleSave('cargos', data)} />}
                {modal.type === 'empresas' && <SimpleFormModal entity="empresas" item={modal.data} onClose={closeModal} onSave={(data) => handleSave('empresas', data)} />}
                {modal.type === 'regionais' && <SimpleFormModal entity="regionais" item={modal.data} onClose={closeModal} onSave={(data) => handleSave('regionais', data)} />}
            </ContentArea>
        </LayoutContainer>
    );
};

export default Admin;
