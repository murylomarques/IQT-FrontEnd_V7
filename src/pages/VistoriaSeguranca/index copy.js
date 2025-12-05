import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import Menu from '../../components/Menu';

import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import { SectionCard, SectionTitle, FormGrid, PrimaryButton } from '../../styles/GlobalStyle';
import { Input, RadioGroup, Label } from './styles';

// Função auxiliar para redimensionar imagens e retornar um ARQUIVO (File)
// Este método é muito mais eficiente que o Base64.
const resizeImageFile = (file, options = { maxWidth: 1920, maxHeight: 1920, quality: 0.8 }) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                if (width > height) {
                    if (width > options.maxWidth) {
                        height *= options.maxWidth / width;
                        width = options.maxWidth;
                    }
                } else {
                    if (height > options.maxHeight) {
                        width *= options.maxHeight / height;
                        height = options.maxHeight;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(blob => {
                    if (blob) {
                        const newFile = new File([blob], file.name, { type: file.type, lastModified: Date.now() });
                        resolve(newFile);
                    } else {
                        reject(new Error('Falha ao converter canvas para blob'));
                    }
                }, file.type, options.quality);
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

const VistoriaSeguranca = () => {
    const { user, apiFetch, token } = useAuth();
    const navigate = useNavigate();
    const [isProcessingImages, setIsProcessingImages] = useState(false);
    const [regionais, setRegionais] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [formData, setFormData] = useState({
        inspetor_id: user?.id || '', regional_id: '', cidade: '', nome_tecnico: '',
        empresa_id: '', modo_despache: '', tecnico_no_local: '', atividade_externa: '',
        cpf_tecnico: '', nome_supervisor: '', placa: '', uso_capacete: '', uso_cinto: '',
        uso_talabarte: '', uso_botas: '', escada_estavel: '', escada_amarrada: '',
        sinalizacao_cones: '', escada_bom_estado: '', observacoes: '',
    });
    // O estado 'files' armazena objetos de ARQUIVO, não strings.
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (user?.id) setFormData(prev => ({ ...prev, inspetor_id: user.id }));
        const fetchDropdownData = async () => {
            try {
                const [regionaisData, empresasData] = await Promise.all([
                    apiFetch('/api/regionais'), apiFetch('/api/empresas')
                ]);
                setRegionais(Array.isArray(regionaisData) ? regionaisData : []);
                setEmpresas(Array.isArray(empresasData) ? empresasData : []);
            } catch (error) { toast.error("Erro ao carregar dados de suporte."); }
        };
        fetchDropdownData();
    }, [apiFetch, user]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) { setFiles([]); return; }
        setIsProcessingImages(true);
        toast.info('Otimizando imagens, por favor aguarde...');
        try {
            const processingPromises = selectedFiles.map(file => {
                if (file.type.startsWith('image/')) {
                    return resizeImageFile(file);
                }
                return Promise.resolve(file);
            });
            const processedFiles = await Promise.all(processingPromises);
            setFiles(processedFiles);
            toast.success('Imagens prontas para o envio!');
        } catch (error) {
            toast.error("Houve um erro ao otimizar as imagens.");
        } finally {
            setIsProcessingImages(false);
        }
    };
    
    // O handleSubmit que usa FormData e a URL CORRETA.
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) { data.append(key, formData[key]); }
        files.forEach(file => { data.append('arquivos', file); });
        
        if (!user.token) { toast.error("Erro de autenticação."); return; }

        try {
            // ==========================================================
            // =====              A URL CORRETA E FINAL             =====
            // ==========================================================
            const response = await fetch('https://iqt.desktop.com.br/api/api/vistorias-seguranca', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Accept': 'application/json',
                },
                body: data,
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw { response: { data: responseData } };
            }
            toast.success("Vistoria de Segurança enviada com sucesso!");
            navigate('/fiscal');
        } catch (error) {
            const errorData = error.response?.data;
            if (errorData && errorData.errors) {
                const firstError = Object.values(errorData.errors)[0][0];
                toast.error(`Erro de validação: ${firstError}`);
            } else if (errorData && errorData.message) {
                 toast.error(errorData.message);
            } else {
                toast.error("Ocorreu um erro ao enviar a vistoria.");
            }
        }
    };

    const checklistQuestions = [
        { label: 'Técnico estava no local?', name: 'tecnico_no_local' },
        { label: 'Técnico estava com atividade externa?', name: 'atividade_externa' },
        { label: 'Técnico estava Utilizando o Capacete?', name: 'uso_capacete' },
        { label: 'Técnico estava Utilizando o Cinto (Tipo Paraquedista)?', name: 'uso_cinto' },
        { label: 'Técnico estava Utilizando o Talabarte (Posicionamento)?', name: 'uso_talabarte' },
        { label: 'Técnico estava Utilizando Botas de Segurança?', name: 'uso_botas' },
        { label: 'Escada estava Apoiada de maneira estável?', name: 'escada_estavel' },
        { label: 'Escada estava Amarrada?', name: 'escada_amarrada' },
        { label: 'Técnico Sinalizou local (Cones)?', name: 'sinalizacao_cones' },
        { label: 'Escada em bom estado de conservação?', name: 'escada_bom_estado' },
    ];
    
    return (
        <LayoutContainer>
            <ContentArea>
                <Header>
                    <HeaderTitle>Vistoria de Segurança do Técnico</HeaderTitle>
                    <UserProfile><span>{user?.nome}</span></UserProfile>
                </Header>
                <form onSubmit={handleSubmit} style={{ padding: '24px 0' }}>
                    <SectionCard>
                        <SectionTitle>Informações Gerais</SectionTitle>
                        <FormGrid>
                            <select name="regional_id" value={formData.regional_id} onChange={handleChange} required><option value="">Selecione a Regional</option>{regionais.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}</select>
                            <select name="empresa_id" value={formData.empresa_id} onChange={handleChange} required><option value="">Selecione a Empresa</option>{empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</select>
                            <Input name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade" required />
                            <Input name="nome_tecnico" value={formData.nome_tecnico} onChange={handleChange} placeholder="Nome do Técnico" required />
                            <Input name="cpf_tecnico" value={formData.cpf_tecnico} onChange={handleChange} placeholder="CPF do Técnico" required />
                            <Input name="placa" value={formData.placa} onChange={handleChange} placeholder="Placa" required />
                            <Input name="nome_supervisor" value={formData.nome_supervisor} onChange={handleChange} placeholder="Nome do Supervisor" required />
                            <select name="modo_despache" value={formData.modo_despache} onChange={handleChange} required><option value="">Modo de Despache</option><option value="APP">APP</option><option value="WEB">WEB</option></select>
                        </FormGrid>
                        <SectionTitle style={{ marginTop: '2rem' }}>Checklist de Segurança</SectionTitle>
                        {checklistQuestions.map(({ label, name }) => (
                            <RadioGroup key={name}>
                                <Label>{label}</Label>
                                <div>
                                    <input type="radio" id={`${name}_sim`} name={name} value="Sim" onChange={handleChange} required /><label htmlFor={`${name}_sim`}>Sim</label>
                                    <input type="radio" id={`${name}_nao`} name={name} value="Não" onChange={handleChange} style={{ marginLeft: '1rem' }}/><label htmlFor={`${name}_nao`}>Não</label>
                                </div>
                            </RadioGroup>
                        ))}
                        <SectionTitle style={{ marginTop: '2rem' }}>Evidências e Observações</SectionTitle>
                        <FormGrid>
                            <div>
                                <Label>Upload de Arquivos *</Label>
                                <input type="file" multiple onChange={handleFileChange} required />
                            </div>
                            <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Observações" style={{minHeight: '100px', width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', gridColumn: '1 / -1'}}></textarea>
                        </FormGrid>
                        <PrimaryButton
                            type="submit"
                            style={{ marginTop: '2rem', width: '100%' }}
                            disabled={isProcessingImages}
                        >
                            {isProcessingImages ? 'Processando Imagens...' : 'Enviar Vistoria'}
                        </PrimaryButton>
                    </SectionCard>
                </form>
            </ContentArea>
        </LayoutContainer>
    );
};

export default VistoriaSeguranca;