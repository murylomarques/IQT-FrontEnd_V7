import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';

import {
  FiChevronLeft, FiHash, FiMap, FiBriefcase, FiUser, FiUsers, FiPhone,
  FiFileText, FiCheckCircle, FiHome, FiGitCommit, FiPower
} from 'react-icons/fi';

// Supondo que seus styled-components estejam importados corretamente
import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import {
  DetailCard, DetailGrid, DetailItem, BackButton,
  SchedulingSection, FormCard, FormGroup, FormRow, SubmitButton, CalendarCard,
  SkeletonBar,
  ToggleFormGroup, SwitchLabel, SwitchInput, SwitchSlider
} from './styles';


// ==================== Componentes Auxiliares (Sem Alterações) ====================
const Detail = ({ icon, label, children }) => {
  if (!children) return null;
  return (
    <DetailItem>
      {icon}
      <strong>{label}:</strong>
      <span>{children}</span>
    </DetailItem>
  );
};

const SkeletonPage = () => (
  <>
    <BackButton to="/agendamentos" style={{ pointerEvents: 'none', opacity: 0.5 }}>
      <FiChevronLeft /> Voltar para Agendamentos
    </BackButton>
    <DetailCard>
      <DetailGrid>
        {[...Array(12)].map((_, index) => (
           <SkeletonBar key={index} width="80%" height="20px" />
        ))}
      </DetailGrid>
    </DetailCard>
  </>
);

// ==================== Componente Principal (Com a Lógica Corrigida) ====================
const AgendamentoDetalhe = () => {
  // Seus hooks e estados (sem alterações)
  const { user, logout, apiFetch, token } = useAuth(); // Pegando o token do useAuth
  const { id } = useParams();
  const navigate = useNavigate();

  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());

  const [fiscaisList, setFiscaisList] = useState([]);
  const [isFiscaisLoading, setIsFiscaisLoading] = useState(false);
  const [isAgendado, setIsAgendado] = useState(false);

  const [formData, setFormData] = useState({
    data: '', hora: '', periodo: '', fiscalId: '', observacoes: ''
  });

  const todayString = useMemo(() => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  }, []);

  // Seus useEffects (sem alterações)
  useEffect(() => {
    const fetchFiscais = async () => {
      setIsFiscaisLoading(true);
      try {
        const data = await apiFetch('/api/fiscais');
        setFiscaisList(data || []);
      } catch (error) {
        console.error("Erro ao buscar a lista de fiscais:", error);
        toast.error("Não foi possível carregar a lista de fiscais.");
      } finally {
        setIsFiscaisLoading(false);
      }
    };
    fetchFiscais();
  }, [apiFetch]);

  useEffect(() => {
    const fetchAgendamento = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await apiFetch(`/api/atendimentos/${id}`);
        setAppointment(response);
      } catch (error) {
        console.error("Erro ao buscar agendamento:", error);
        toast.error('Agendamento não encontrado ou falha ao carregar os dados.');
        navigate('/agendamentos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgendamento();
  }, [id, apiFetch, navigate]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validações no frontend (sem alterações)
    if (!formData.data || !formData.periodo || !formData.fiscalId) {
      toast.warn("Os campos Data, Período e Fiscal são obrigatórios para salvar.");
      return;
    }
    const now = new Date();
    const scheduledDateTime = new Date(`${formData.data}T${formData.hora || '00:00:00'}`);
    now.setSeconds(0, 0);
    if (scheduledDateTime < now) {
        toast.error("Não é possível agendar em uma data ou hora passada.");
        return;
    }

    setIsSubmitting(true);

    const dataToSend = {
      atendimentoId: id,
      fiscalId: formData.fiscalId,
      data: formData.data,
      hora: formData.hora || null,
      periodo: formData.periodo,
      observacoes: formData.observacoes || null,
      agendado: isAgendado,
    };

    // ======================= AQUI ESTÁ A MUDANÇA PRINCIPAL =======================
    // Substituindo 'apiFetch' pela função 'fetch' padrão para diagnóstico.

    // Adicionando um console.log para ter certeza do que estamos enviando
    console.log("Enviando para a API:", JSON.stringify(dataToSend, null, 2));
    console.log("Enviando para a API:", token);

    try {
      // A URL completa da sua API (ajuste se necessário)
      const apiUrl = 'https://iqt.desktop.com.br/api/api/agenda';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Adicione o header de autorização, se sua API precisar
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      // Se a resposta NÃO for OK (ex: 422, 500, etc.), trata como erro
      if (!response.ok) {
          // Tenta extrair o JSON de erro do corpo da resposta
          const errorData = await response.json();
          // Lança um erro com os dados para ser pego pelo bloco 'catch'
          throw errorData;
      }
      
      // Se a resposta for OK (200, 201), continua para o sucesso
      toast.success("Vistoria agendada com sucesso!");
      navigate('/agendamentos');

    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      
      // Agora o 'error' pode conter o objeto de erros do Laravel
      if (error && error.errors) {
        const errorMessages = Object.values(error.errors).flat().join('\n');
        toast.error(errorMessages);
      } else {
        toast.error("Falha ao salvar. Verifique a conexão e tente novamente.");
      }

    } finally {
      setIsSubmitting(false);
    }
    // ===========================================================================
  };

  const selectedFiscalName = useMemo(() => {
    if (!formData.fiscalId || fiscaisList.length === 0) return '';
    const fiscal = fiscaisList.find(f => f.id.toString() === formData.fiscalId);
    return fiscal ? fiscal.name : '';
  }, [formData.fiscalId, fiscaisList]);


  return (
    // Seu JSX (sem alterações)
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>
            {isLoading ? <SkeletonBar width="350px" height="28px" /> : `Detalhes do Atendimento #${appointment?.ID || id}`}
          </HeaderTitle>
          <UserProfile>
            <span>{user?.nome}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>
        {isLoading ? (<SkeletonPage />) : !appointment ? (<p>Agendamento não encontrado.</p>) : (
          <>
            <BackButton to="/agendamentos"><FiChevronLeft /> Voltar para Agendamentos</BackButton>
            <DetailCard>
                 <DetailGrid>
                    <Detail icon={<FiHash />} label="ID">{appointment.ID}</Detail>
                    <Detail icon={<FiMap />} label="Regional">{appointment.Regional}</Detail>
                    <Detail icon={<FiBriefcase />} label="Empresa">{appointment.Empresa}</Detail>
                    <Detail icon={<FiUsers />} label="Supervisor">{appointment.Supervisor}</Detail>
                    <Detail icon={<FiUser />} label="Técnico">{appointment.Tecnico}</Detail>
                    <Detail icon={<FiUser />} label="Cliente">{appointment.Cliente}</Detail>
                    <Detail icon={<FiPhone />} label="Telefone">{appointment.Telefone}</Detail>
                    <Detail icon={<FiFileText />} label="SA">{appointment.SA}</Detail>
                    <Detail icon={<FiCheckCircle />} label="Conclusão">{appointment.Conclusao}</Detail>
                    <Detail icon={<FiHome />} label="Endereço">{appointment.Endereco}</Detail>
                    <Detail icon={<FiGitCommit />} label="CTO">{appointment.CTO}</Detail>
                    <Detail icon={<FiPower />} label="Porta">{appointment.Porta}</Detail>
                </DetailGrid>
            </DetailCard>
            <SchedulingSection>
              <FormCard>
                <h3>Realizar Agendamento da Vistoria</h3>
                <form onSubmit={handleSubmit}>
                    <ToggleFormGroup>
                        <span>{isAgendado ? 'Status: Serviço Agendado' : 'Status: Serviço Não Agendado'}</span>
                        <SwitchLabel>
                          <SwitchInput type="checkbox" checked={isAgendado} onChange={() => setIsAgendado(!isAgendado)} />
                          <SwitchSlider />
                        </SwitchLabel>
                    </ToggleFormGroup>
                    <FormRow>
                        <FormGroup>
                          <label htmlFor="data">Data *</label>
                          <input id="data" name="data" type="date" value={formData.data} onChange={handleFormChange} min={todayString} />
                        </FormGroup>
                        <FormGroup>
                          <label htmlFor="hora">Hora</label>
                          <input id="hora" name="hora" type="time" value={formData.hora} onChange={handleFormChange} />
                        </FormGroup>
                    </FormRow>
                    <FormRow>
                        <FormGroup>
                            <label htmlFor="periodo">Período *</label>
                            <select id="periodo" name="periodo" value={formData.periodo} onChange={handleFormChange}>
                                <option value="">Selecione</option>
                                <option value="Manhã">Manhã</option>
                                <option value="Tarde">Tarde</option>
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor="fiscalId">Fiscal *</label>
                            <select id="fiscalId" name="fiscalId" value={formData.fiscalId} onChange={handleFormChange} disabled={isFiscaisLoading}>
                                <option value="">{isFiscaisLoading ? 'Carregando...' : 'Selecione um Fiscal'}</option>
                                {fiscaisList.map(fiscal => (
                                    <option key={fiscal.id} value={fiscal.id}>{fiscal.nome}</option>
                                ))}
                            </select>
                        </FormGroup>
                    </FormRow>
                    <FormGroup>
                        <label htmlFor="observacoes">Observações</label>
                        <textarea id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleFormChange} placeholder="Adicione observações relevantes..."></textarea>
                    </FormGroup>
                    <SubmitButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar Vistoria'}
                    </SubmitButton>
                </form>
              </FormCard>
              <CalendarCard>
                <h4>{selectedFiscalName ? `Agenda de ${selectedFiscalName}` : 'Selecione um fiscal para ver a agenda'}</h4>
                <Calendar onChange={setScheduleDate} value={scheduleDate} />
              </CalendarCard>
            </SchedulingSection>
          </>
        )}
      </ContentArea>
    </LayoutContainer>
  );
};

export default AgendamentoDetalhe;