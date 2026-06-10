import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { fileToBase64, optimizeImageFile } from '../../utils/imageOptimization';

import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import { SectionCard, SectionTitle, FormGrid, PrimaryButton } from '../../styles/GlobalStyle';
import { Input, Select, TextArea, RadioGroup, Label, ChipButton, ChipGroup, ChipNote, FileUploadWrapper } from './styles';

const VistoriaSeguranca = () => {
  const { user, apiFetch } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regionais, setRegionais] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [files, setFiles] = useState([]);

  // Checklist (ordem importa!)
  const checklistQuestions = [
    { label: 'Técnico estava no local?', name: 'tecnico_no_local', allowNA: false },      // ✅ só Sim/Não
    { label: 'Técnico estava com atividade externa?', name: 'atividade_externa', allowNA: false }, // ✅ só Sim/Não
    { label: 'Técnico estava Utilizando o Capacete?', name: 'uso_capacete', allowNA: true },
    { label: 'Técnico estava Utilizando o Cinto (Tipo Paraquedista)?', name: 'uso_cinto', allowNA: true },
    { label: 'Técnico estava Utilizando o Talabarte (Posicionamento)?', name: 'uso_talabarte', allowNA: true },
    { label: 'Técnico estava Utilizando Botas de Segurança?', name: 'uso_botas', allowNA: true },
    { label: 'Escada estava Apoiada de maneira estável?', name: 'escada_estavel', allowNA: true },
    { label: 'Escada estava Amarrada?', name: 'escada_amarrada', allowNA: true },
    { label: 'Técnico Sinalizou local (Cones)?', name: 'sinalizacao_cones', allowNA: true },
    { label: 'Escada em bom estado de conservação?', name: 'escada_bom_estado', allowNA: true },
  ];

  const motivosSemExterna = [
    "Atividade interna",
    "Atividade finalizada",
    "Quebra de agenda",
    "Veículo de outro setor",
    "Endereço de base",
  ];

  const [formData, setFormData] = useState({
    inspetor_id: user?.id || '',
    regional_id: '',
    cidade: '',
    nome_tecnico: '',
    empresa_id: '',
    modo_despache: '',
    tecnico_no_local: '',
    atividade_externa: '',
    motivo_sem_atividade_externa: '',
    cpf_tecnico: '',
    nome_supervisor: '',
    placa: '',
    uso_capacete: '',
    uso_cinto: '',
    uso_talabarte: '',
    uso_botas: '',
    escada_estavel: '',
    escada_amarrada: '',
    sinalizacao_cones: '',
    escada_bom_estado: '',
    observacoes: '',
  });

  useEffect(() => {
    if (user?.id) setFormData(prev => ({ ...prev, inspetor_id: user.id }));

    const fetchDropdownData = async () => {
      try {
        const [regionaisData, empresasData] = await Promise.all([
          apiFetch('/api/regionais'),
          apiFetch('/api/empresas')
        ]);

        setRegionais(Array.isArray(regionaisData) ? regionaisData : []);
        setEmpresas(Array.isArray(empresasData) ? empresasData : []);
      } catch (error) {
        toast.error("Erro ao carregar dados de suporte.");
      }
    };

    fetchDropdownData();
  }, [apiFetch, user]);

  // ✅ Helper: seta todas as perguntas que PERMITEM NA como "Não se Aplica"
  const setAllAllowNAtoNA = (fromIndexExclusive = 0) => {
    setFormData(prev => {
      const next = { ...prev };

      checklistQuestions.forEach((q, idx) => {
        if (idx > fromIndexExclusive && q.allowNA) {
          next[q.name] = 'Não se Aplica';
        }
      });

      // Se travou o resto por causa de atividade externa, motivo pode continuar existindo apenas se atividade_externa for "Não"
      if (next.atividade_externa !== 'Não') {
        next.motivo_sem_atividade_externa = '';
      }

      return next;
    });
  };

  // ✅ Regra 1: tecnico_no_local = Não => tudo depois (que permite NA) vira NA
  const setTudoNaoSeAplicaPorTecnicoFora = () => {
    const idxTecnicoNoLocal = checklistQuestions.findIndex(q => q.name === 'tecnico_no_local');
    setAllAllowNAtoNA(idxTecnicoNoLocal);

    // também limpa motivo
    setFormData(prev => ({ ...prev, motivo_sem_atividade_externa: '' }));
  };

  // ✅ Regra 2: atividade_externa = Não => tudo depois (que permite NA) vira NA
  const setDepoisDaAtividadeExternaNaoSeAplica = () => {
    const idxAtiv = checklistQuestions.findIndex(q => q.name === 'atividade_externa');
    setAllAllowNAtoNA(idxAtiv);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const next = { ...prev, [name]: value };

      // Se mudar atividade_externa e não for "Não", limpa motivo
      if (name === 'atividade_externa' && value !== 'Não') {
        next.motivo_sem_atividade_externa = '';
      }

      return next;
    });

    // Automação 1: tecnico_no_local = Não => auto NA no resto
    if (name === 'tecnico_no_local' && value === 'Não') {
      setTudoNaoSeAplicaPorTecnicoFora();
      return;
    }

    // Automação 2: atividade_externa = Não => auto NA no resto
    if (name === 'atividade_externa' && value === 'Não') {
      setDepoisDaAtividadeExternaNaoSeAplica();
      return;
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) { setFiles([]); return; }

    setIsSubmitting(true);
    toast.info('Otimizando imagens, por favor aguarde...');

    try {
      const processingPromises = selectedFiles.map(file => {
        if (file.type.startsWith('image/')) return optimizeImageFile(file);
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

    if (!user?.token) { toast.error("Erro de autenticação."); return; }
    if (files.length === 0) { toast.error("Por favor, selecione pelo menos um arquivo de evidência."); return; }

    // ✅ validação: se atividade_externa = "Não", motivo é obrigatório
    if (formData.atividade_externa === 'Não' && !formData.motivo_sem_atividade_externa) {
      toast.error("Selecione o motivo do técnico não estar em atividade externa.");
      return;
    }

    setIsSubmitting(true);

    try {
      const API_BASE_URL = 'https://iqt.desktop.com.br/api/api';

      toast.info("Enviando dados da vistoria...");
      const createResponse = await fetch(`${API_BASE_URL}/vistorias-seguranca`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const createdVistoria = await createResponse.json();
      if (!createResponse.ok) {
        if (createdVistoria?.errors) {
          const first = Object.values(createdVistoria.errors)?.[0]?.[0];
          throw new Error(first || 'Erro de validação');
        }
        throw new Error(createdVistoria?.message || 'Erro ao criar vistoria');
      }

      const vistoriaId = createdVistoria.id;

      toast.info(`Enviando ${files.length} arquivo(s)...`);
      for (const file of files) {
        const base64String = await fileToBase64(file);

        const uploadResponse = await fetch(`${API_BASE_URL}/vistorias-seguranca/${vistoriaId}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ arquivo: base64String }),
        });

        if (!uploadResponse.ok) {
          const err = await uploadResponse.json().catch(() => ({}));
          toast.error(`Falha no upload de ${file.name}: ${err.message || 'erro no upload'}`);
        }
      }

      toast.success("Vistoria e arquivos enviados com sucesso!");
      navigate('/fiscal');

    } catch (error) {
      toast.error(error?.message || "Ocorreu um erro de comunicação com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // trava o resto se técnico não está no local
  const travarRestoPorTecnicoFora = (formData.tecnico_no_local === 'Não');

  // trava só as perguntas depois de atividade_externa se ela for "Não"
  const travarDepoisAtividadeExterna = (formData.atividade_externa === 'Não');

  const cidades = [
  "São Vicente",
  "Campinas",
  "Santa Bárbara d'Oeste",
  "Monte Mor",
  "Americana",
  "Sumaré",
  "Tremembé",
  "Atibaia",
  "Sorocaba",
  "Praia Grande",
  "Bebedouro",
  "Vinhedo",
  "Avaré",
  "Nova Odessa",
  "Paulínia",
  "Guarujá",
  "Cerquilho",
  "Indaiatuba",
  "São Carlos",
  "São José dos Campos",
  "Jaguariúna",
  "Ibitinga",
  "Pederneiras",
  "Araraquara",
  "Piracaia",
  "Ribeirão Preto",
  "Guariba",
  "Francisco Morato",
  "Cubatão",
  "Caçapava",
  "Franco da Rocha",
  "Hortolândia",
  "Capela do Alto",
  "Mogi das Cruzes",
  "Itanhaém",
  "Piracicaba",
  "Jaú",
  "São José do Rio Preto",
  "Taubaté",
  "Peruíbe",
  "Areiópolis",
  "Caieiras",
  "Ribeirão Bonito",
  "Amparo",
  "Barretos",
  "Itu",
  "Boituva",
  "Tietê",
  "Mongaguá",
  "Jaboticabal",
  "Pitangueiras",
  "Dobrada",
  "Cordeirópolis",
  "Valinhos",
  "Itapuí",
  "Borborema",
  "Mairiporã",
  "Tatuí",
  "São Bernardo do Campo",
  "Patrocínio Paulista",
  "Porto Ferreira",
  "Bauru",
  "Ibaté",
  "Campo Limpo Paulista",
  "Mogi Guaçu",
  "Matão",
  "Botucatu",
  "Lins",
  "Várzea Paulista",
  "Franca",
  "Igaraçu do Tietê",
  "Américo Brasiliense",
  "Biritiba Mirim",
  "Itupeva",
  "Lençóis Paulista",
  "Pedreira",
  "Descalvado",
  "Nazaré Paulista",
  "Guaíra",
  "Limeira",
  "Conchal",
  "Agudos",
  "Pirassununga",
  "Araras",
  "Guararema",
  "Jundiaí",
  "Rio Claro",
  "Borebi",
  "Barra Bonita",
  "Cabreúva",
  "Bom Jesus dos Perdões",
  "Santa Rita do Passa Quatro",
  "Mogi Mirim",
  "Jacareí",
  "Votorantim",
  "Pratânia",
  "Salto",
  "Iperó",
  "Leme",
  "Santa Gertrudes",
  "Taquaritinga",
  "Dois Córregos",
  "Boa Esperança do Sul",
  "São Paulo",
  "Gavião Peixoto",
  "Santo Antônio de Posse",
  "Jumirim",
  "Pardinho",
  "Colina",
  "Guapiaçu",
  "Jarinu",
  "São Manuel",
  "Santos",
  "Mirassol",
  "Rio das Pedras",
  "Tabatinga",
  "Nova Europa",
  "Capivari",
  "Itaí",
  "Saltinho",
  "Rafard",
  "Arandu",
  "Cosmópolis",
  "Cristais Paulista",
  "Macatuba",
  "Engenheiro Coelho",
  "Piratininga",
  "Estiva Gerbi",
  "Manduri",
  "Igaratá",
  "Iracemápolis",
  "Itatinga",
  "Araçariguama",
  "Santa Branca",
  "Olímpia",
  "Bragança Paulista",
  "Louveira",
  "Salesópolis",
  "Serra Negra",
  "Bady Bassitt",
  "Bocaina",
  "Monte Alto",
  "Tambaú",
  "Uchoa",
  "Santa Cruz das Palmeiras",
  "Dourado",
  "Iaras",
  "Elias Fausto",
  "Monte Alegre do Sul",
  "Santa Lúcia",
  "Guarantã",
  "Holambra",
  "Itápolis",
  "Itirapuã",
  "Araçoiaba da Serra",
  "Casa Branca",
  "Guatapará",
  "Itaju",
  "Artur Nogueira",
  "Mineiros do Tietê",
  "Cafelândia",
  "Cerqueira César",
  "Paranapanema",
  "Motuca",
  "Jaborandi",
  "Rincão",
  "Santo André",
  "Alumínio",
  "Ribeirão Corrente",
  "Águas de Santa Bárbara",
  "Serra Azul",
  "Laranjal Paulista",
  "Pindorama",
  "Trabiju",
  "Santa Adélia",
  "Cravinhos",
  "Santa Rosa de Viterbo",
  "Avaí",
  "Itajobi",
  "Presidente Alves",
  "Lindóia",
  "Pirajuí",
  "Itapetininga",
  "Porangaba",
  "Conchas",
  "Salto de Pirapora",
  "Cesário Lange",
  "Angatuba",
  "Pereiras",
  "Sarapuí",
  "Aguaí",
  "Óleo",
  "Cedral",
  "Santa Ernestina",
  "Diadema",
  "Pilar do Sul",
  "Bofete",
  "São Lourenço do Sul",
  "Campina do Monte Alegre",
  "Osasco",
  "São Simão",
  "Cândido Rodrigues",
  "Quadra",
  "Alambari",
  "Fernando Prestes",
  "São Joaquim da Barra",
  "São Caetano do Sul",
  "Taboão da Serra"
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
              <select name="regional_id" value={formData.regional_id} onChange={handleChange} required>
                <option value="">Selecione a Regional</option>
                {regionais.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
              </select>

              <select name="empresa_id" value={formData.empresa_id} onChange={handleChange} required>
                <option value="">Selecione a Empresa</option>
                {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </select>

              <select name="cidade" value={formData.cidade} onChange={handleChange} required>
                <option value="">Selecione a Cidade</option>
                {cidades.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <Input name="nome_tecnico" value={formData.nome_tecnico} onChange={handleChange} placeholder="Nome do Técnico" required />
              <Input name="cpf_tecnico" value={formData.cpf_tecnico} onChange={handleChange} placeholder="CPF do Técnico" required />
              <Input name="placa" value={formData.placa} onChange={handleChange} placeholder="Placa" required />
              <Input name="nome_supervisor" value={formData.nome_supervisor} onChange={handleChange} placeholder="Nome do Supervisor" required />

              <select name="modo_despache" value={formData.modo_despache} onChange={handleChange} required>
                <option value="">Modo de Despache</option>
                <option value="Sistema">Sistema</option>
                <option value="Localizado em rota">Localizado em rota</option>
                <option value="Vistoria conjunta">Vistoria conjunta</option>
              </select>
            </FormGrid>

            <SectionTitle style={{ marginTop: '2rem' }}>Checklist de Segurança</SectionTitle>

            {checklistQuestions.map(({ label, name, allowNA }) => {
              const isTecnicoNoLocal = name === 'tecnico_no_local';
              const isAtividadeExterna = name === 'atividade_externa';

              const idx = checklistQuestions.findIndex(q => q.name === name);
              const idxAtiv = checklistQuestions.findIndex(q => q.name === 'atividade_externa');

              // trava:
              // - se técnico fora, trava tudo depois (mas só as que permitem NA a gente “força” NA)
              // - se atividade externa = Não, trava tudo depois
              const disabled =
                (travarRestoPorTecnicoFora && !isTecnicoNoLocal && allowNA) ||
                (!travarRestoPorTecnicoFora && travarDepoisAtividadeExterna && idx > idxAtiv && allowNA);

              return (
                <RadioGroup key={name} style={disabled ? { opacity: 0.7 } : undefined}>
                  <Label>
                    {label}
                    {disabled && <span style={{ marginLeft: 8, fontSize: 12 }}>(auto: Não se Aplica)</span>}
                  </Label>

                  <ChipGroup>
                    <ChipButton
                      type="button"
                      data-active={String(formData[name] === 'Sim')}
                      data-tone="yes"
                      onClick={() => handleChange({ target: { name, value: 'Sim' } })}
                    >
                      Sim
                    </ChipButton>

                    <ChipButton
                      type="button"
                      data-active={String(formData[name] === 'Não')}
                      data-tone="no"
                      onClick={() => handleChange({ target: { name, value: 'Não' } })}
                    >
                      Não
                    </ChipButton>

                    {allowNA && (
                      <ChipButton
                        type="button"
                        data-active={String(formData[name] === 'Não se Aplica')}
                        data-tone="na"
                        disabled={disabled}
                        onClick={() => !disabled && handleChange({ target: { name, value: 'Não se Aplica' } })}
                      >
                        Não se Aplica
                      </ChipButton>
                    )}

                    {disabled && <ChipNote>(auto: Não se Aplica)</ChipNote>}
                  </ChipGroup>

                  {/* Motivo só aparece se atividade_externa = "Não" */}
                  {isAtividadeExterna && formData.atividade_externa === 'Não' && (
                    <div style={{ marginTop: '12px' }}>
                      <Label>Por qual motivo o técnico não estava em atividade externa?</Label>
                      <Select
                        name="motivo_sem_atividade_externa"
                        value={formData.motivo_sem_atividade_externa}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecione o motivo</option>
                        {motivosSemExterna.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </Select>
                    </div>
                  )}
                </RadioGroup>
              );
            })}

            <SectionTitle style={{ marginTop: '2rem' }}>Evidências e Observações</SectionTitle>

            <FormGrid>
              <div>
                <Label>Upload de Arquivos *</Label>
                <FileUploadWrapper>
                  <span className="icon">📎</span>
                  <span className="label">
                    {files.length > 0 ? `${files.length} arquivo(s) selecionado(s)` : 'Selecionar arquivos'}
                  </span>
                  <span className="hint">Imagens ou PDF</span>
                  <input type="file" multiple onChange={handleFileChange} required accept="image/*,application/pdf" hidden />
                </FileUploadWrapper>
              </div>

              <TextArea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Observações (opcional)"
                className="full-width"
              />
            </FormGrid>

            <PrimaryButton type="submit" style={{ marginTop: '2rem', width: '100%' }} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Vistoria'}
            </PrimaryButton>
          </SectionCard>
        </form>
      </ContentArea>
    </LayoutContainer>
  );
};  

export default VistoriaSeguranca;
