import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import Menu from '../../components/Menu';

import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import { SectionCard, SectionTitle, FormGrid, PrimaryButton } from '../../styles/GlobalStyle';
import { Input, RadioGroup, Label } from './styles';

// Função 1: Redimensiona a imagem, mas ainda retorna um objeto File.
const resizeImageFile = (file, options = { maxWidth: 1920, maxHeight: 1920, quality: 0.75 }) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                if (width > height) { if (width > options.maxWidth) { height *= options.maxWidth / width; width = options.maxWidth; } }
                else { if (height > options.maxHeight) { width *= options.maxHeight / height; height = options.maxHeight; } }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(blob => {
                    if (blob) {
                        const newFile = new File([blob], file.name, { type: file.type, lastModified: Date.now() });
                        resolve(newFile);
                    } else { reject(new Error('Falha ao converter canvas para blob')); }
                }, file.type, options.quality);
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

// Função 2: Converte um objeto File para uma string Base64.
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

const VistoriaSeguranca = () => {
    const { user, apiFetch, token } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [regionais, setRegionais] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [formData, setFormData] = useState({
        inspetor_id: user?.id || '', regional_id: '', cidade: '', nome_tecnico: '',
        empresa_id: '', modo_despache: '', tecnico_no_local: '', atividade_externa: '',
        cpf_tecnico: '', nome_supervisor: '', placa: '', uso_capacete: '', uso_cinto: '',
        uso_talabarte: '', uso_botas: '', escada_estavel: '', escada_amarrada: '',
        sinalizacao_cones: '', escada_bom_estado: '', observacoes: '',
    });
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (user?.id) setFormData(prev => ({ ...prev, inspetor_id: user.id }));
        const fetchDropdownData = async () => {
            try {
                const [regionaisData, empresasData] = await Promise.all([ apiFetch('/api/regionais'), apiFetch('/api/empresas') ]);
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
        setIsSubmitting(true);
        toast.info('Otimizando imagens, por favor aguarde...');
        try {
            const processingPromises = selectedFiles.map(file => {
                if (file.type.startsWith('image/')) { return resizeImageFile(file); }
                return Promise.resolve(file);
            });
            const processedFiles = await Promise.all(processingPromises);
            setFiles(processedFiles);
            toast.success('Imagens prontas para o envio!');
        } catch (error) {
            toast.error("Houve um erro ao otimizar as imagens.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user.token) { toast.error("Erro de autenticação."); return; }
        if (files.length === 0) { toast.error("Por favor, selecione pelo menos um arquivo de evidência."); return; }

        setIsSubmitting(true);

        try {
            const API_BASE_URL = 'https://iqt.desktop.com.br/api/api'; // URL base GARANTIDAMENTE CORRETA

            // --- ETAPA 1: Enviar apenas os dados do formulário (JSON) ---
            toast.info("Enviando dados da vistoria...");
            const createResponse = await fetch(`${API_BASE_URL}/vistorias-seguranca`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const createdVistoria = await createResponse.json();
            if (!createResponse.ok) { throw { isValidationError: true, data: createdVistoria }; }
            const vistoriaId = createdVistoria.id;

            // --- ETAPA 2: Enviar cada arquivo "disfarçado" como JSON Base64 ---
            toast.info(`Enviando ${files.length} arquivo(s)...`);
            for (const file of files) {
                const base64String = await fileToBase64(file);
                const uploadPayload = { arquivo: base64String };

                const uploadResponse = await fetch(`${API_BASE_URL}/vistorias-seguranca/${vistoriaId}/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${user.token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify(uploadPayload),
                });

                if (!uploadResponse.ok) { 
                    const errorJson = await uploadResponse.json();
                    toast.error(`Falha no upload de ${file.name}: ${errorJson.message}`);
                }
            }

            toast.success("Vistoria e arquivos enviados com sucesso!");
            navigate('/fiscal');

        } catch (error) {
            if (error.isValidationError && error.data && error.data.errors) {
                const firstError = Object.values(error.data.errors)[0][0];
                toast.error(`Erro de validação: ${firstError}`);
            } else {
                toast.error("Ocorreu um erro de comunicação com o servidor.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const checklistQuestions = [
        { label: 'Técnico estava no local?', name: 'tecnico_no_local' }, { label: 'Técnico estava com atividade externa?', name: 'atividade_externa' },
        { label: 'Técnico estava Utilizando o Capacete?', name: 'uso_capacete' }, { label: 'Técnico estava Utilizando o Cinto (Tipo Paraquedista)?', name: 'uso_cinto' },
        { label: 'Técnico estava Utilizando o Talabarte (Posicionamento)?', name: 'uso_talabarte' }, { label: 'Técnico estava Utilizando Botas de Segurança?', name: 'uso_botas' },
        { label: 'Escada estava Apoiada de maneira estável?', name: 'escada_estavel' }, { label: 'Escada estava Amarrada?', name: 'escada_amarrada' },
        { label: 'Técnico Sinalizou local (Cones)?', name: 'sinalizacao_cones' }, { label: 'Escada em bom estado de conservação?', name: 'escada_bom_estado' },
    ];
    const cidades = [
        "Aguaí","Americana","Araras","Arthur Nogueira","Casa Branca","Conchal","Cordeirópolis","Cosmópolis",
        "Engenheiro Coelho","Estiva Gerbi","Iracemápolis","Leme","Limeira","Mogi Guaçu","Mogi Mirim","Nova Odessa",
        "Paulínia","Piracicaba","Pirassununga","Porto Ferreira","Rio Claro","Santa Bárbara d'Oeste","Santa Cruz das Palmeiras",
        "Santa Gertrudes","Santa Rita do Passa Quatro","São João da Boa Vista","Sumaré","Tambaú","Alambari","Alumínio",
        "Angatuba","Araçoiaba da Serra","Bofete","Boituva","Buri","Campina do Monte Alegre","Capela do Alto","Capivari",
        "Cerquilho","Cesário Lange","Conchas","Elias Fausto","Iperó","Itapetininga","Itu","Jumirim","Laranjal Paulista",
        "Mairinque","Pereiras","Pilar do Sul","Porangaba","Porto Feliz","Quadra","Rafard","Rio das Pedras","Saltinho",
        "Salto","Salto de Pirapora","Sarapuí","Sorocaba","Tatuí","Tietê","Votorantim","Amparo","Campinas","Holambra",
        "Hortolândia","Jaguariúna","Lindóia","Monte Alegre do Sul","Monte Mor","Pedreira","Santo Antônio de Posse",
        "Serra Negra","Águas de Santa Bárbara","Agudos","Arandu","Areiópolis","Avaí","Avaré","Bariri","Barra Bonita",
        "Bauru","Bocaina","Borebi","Botucatu","Cafelândia","Cerqueira César","Dois Córregos","Dourado","Guarantã",
        "Iaras","Igaraçu do Tietê","Itaí","Itapuí","Itatinga","Jaú","Lençóis Paulista","Lins","Macatuba","Manduri",
        "Mineiros do Tietê","Óleo","Paranapanema","Pardinho","Pederneiras","Pirajuí","Piratininga","Pratânia",
        "Presidente Alves","São Manuel","Arealva","Américo Brasiliense","Araraquara","Boa Esperança do Sul",
        "Borborema","Cravinhos","Descalvado","Dobrada","Gavião Peixoto","Guariba","Guatapará","Ibaté","Ibitinga",
        "Itaju","Itápolis","Matão","Motuca","Nova Europa","Ribeirão Bonito","Ribeirão Preto","Rincão","Santa Ernestina",
        "Santa Lúcia","São Carlos","Serra Azul","Tabatinga","Taquaritinga","Trabiju","Bady Bassitt","Barretos","Bebedouro",
        "Cândido Rodrigues","Cedral","Colina","Cristais Paulista","Fernando Prestes","Franca","Guaíra","Guapiaçu",
        "Itajobi","Itirapuã","Ituverava","Jaborandi","Jaboticabal","Mirassol","Monte Alto","Novo Horizonte","Olímpia",
        "Patrocínio Paulista","Pindorama","Pitangueiras","Ribeirão Corrente","Santa Adélia","São José do Rio Preto",
        "Cubatão","Guarujá","Itanhaém","Mongaguá","Peruíbe","Praia Grande","Santos","São Bernardo do Campo","São Vicente",
        "Diadema","Santo André","São Caetano do Sul","Barueri","Biritiba Mirim","Caçapava","Cotia","Guararema","Guarulhos",
        "Igaratá","Jacareí","Mogi das Cruzes","Salesópolis","Santa Branca","São José dos Campos","São Paulo","Taubaté",
        "Tremembé","Araçariguama","Cabreúva","Campo Limpo Paulista","Itupeva","Jundiaí","Louveira","Várzea Paulista",
        "Indaiatuba","Valinhos","Vinhedo","Atibaia","Bom Jesus dos Perdões","Bragança Paulista","Jarinu","Mairiporã",
        "Nazaré Paulista","Piracaia","Caieiras","Francisco Morato","Franco da Rocha","Santa Rosa de Viterbo","Uchoa"
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
                            <select name="cidade" value={formData.cidade} onChange={handleChange} required>
                                <option value="">Selecione a Cidade</option>
                                {cidades.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <Input name="nome_tecnico" value={formData.nome_tecnico} onChange={handleChange} placeholder="Nome do Técnico" required />
                            <Input name="cpf_tecnico" value={formData.cpf_tecnico} onChange={handleChange} placeholder="CPF do Técnico" required />
                            <Input name="placa" value={formData.placa} onChange={handleChange} placeholder="Placa" required />
                            <Input name="nome_supervisor" value={formData.nome_supervisor} onChange={handleChange} placeholder="Nome do Supervisor" required />
                            <select
                                    name="modo_despache"
                                    value={formData.modo_despache}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Modo de Despache</option>
                                    <option value="Sistema">Sistema</option>
                                    <option value="Localizado em rota">Localizado em rota</option>
                                    <option value="Vistoria conjunta">Vistoria conjunta</option>
                                </select>

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
                                <input type="file" multiple onChange={handleFileChange} required accept="image/*,application/pdf" />
                            </div>
                            <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Observações" style={{minHeight: '100px', width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', gridColumn: '1 / -1'}}></textarea>
                        </FormGrid>
                        <PrimaryButton
                            type="submit"
                            style={{ marginTop: '2rem', width: '100%' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Vistoria'}
                        </PrimaryButton>
                    </SectionCard>
                </form>
            </ContentArea>
        </LayoutContainer>
    );
};

export default VistoriaSeguranca;