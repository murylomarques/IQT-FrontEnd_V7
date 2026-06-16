import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';

import {
  FiChevronLeft, FiHash, FiMap, FiBriefcase, FiUser, FiUsers, FiPhone,
  FiFileText, FiCheckCircle, FiHome, FiGitCommit, FiPower, FiTool
} from 'react-icons/fi';

import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import {
  DetailCard, DetailGrid, DetailItem, BackButton,
  SchedulingSection, FormCard, FormGroup, FormRow, SubmitButton, CalendarCard,
  SkeletonBar,
  ToggleFormGroup, SwitchLabel, SwitchInput, SwitchSlider, AppointmentTag
} from '../AgendamentoDetalhe/styles';

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
    <BackButton to="/manutencao/agendamentos" style={{ pointerEvents: 'none', opacity: 0.5 }}>
      <FiChevronLeft /> Voltar para Manutenção
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

const AgendamentoManutencaoDetalhe = () => {
  const { user, logout, apiFetch } = useAuth();
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
  const [fiscalAgenda, setFiscalAgenda] = useState([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  const [formData, setFormData] = useState({
    data: '', hora: '', periodo: '', fiscalId: '', observacoes: ''
  });

  const todayString = useMemo(() => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    const fetchFiscais = async () => {
      setIsFiscaisLoading(true);
      try {
        const data = await apiFetch('/api/fiscais');
        setFiscaisList(data || []);
      } catch {
        toast.error('Não foi possível carregar a lista de fiscais.');
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
        const response = await apiFetch(`/api/manutencao/atendimentos/${id}`);
        setAppointment(response);
      } catch {
        toast.error('Atendimento de manutenção não encontrado.');
        navigate('/manutencao/agendamentos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgendamento();
  }, [id, apiFetch, navigate]);

  useEffect(() => {
    if (!formData.fiscalId) {
      setFiscalAgenda([]);
      return;
    }

    let isMounted = true;

    const fetchFiscalAgenda = async () => {
      setIsCalendarLoading(true);
      try {
        const [ativacaoResult, manutencaoResult] = await Promise.allSettled([
          apiFetch(`/api/fiscais/${formData.fiscalId}/agenda`),
          apiFetch(`/api/manutencao/fiscais/${formData.fiscalId}/agenda`),
        ]);

        if (!isMounted) return;

        const ativacao = ativacaoResult.status === 'fulfilled' && Array.isArray(ativacaoResult.value)
          ? ativacaoResult.value.map(item => ({ ...item, fluxo: 'Ativação' }))
          : [];
        const manutencao = manutencaoResult.status === 'fulfilled' && Array.isArray(manutencaoResult.value)
          ? manutencaoResult.value.map(item => ({ ...item, fluxo: 'Manutenção' }))
          : [];

        setFiscalAgenda([...ativacao, ...manutencao]);
      } catch {
        toast.error('Não foi possível carregar a agenda do fiscal.');
      } finally {
        if (isMounted) setIsCalendarLoading(false);
      }
    };

    fetchFiscalAgenda();

    return () => {
      isMounted = false;
    };
  }, [formData.fiscalId, apiFetch]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.data || !formData.periodo || !formData.fiscalId) {
      toast.warn('Os campos Data, Período e Fiscal são obrigatórios.');
      return;
    }

    const now = new Date();
    const scheduledDateTime = new Date(`${formData.data}T${formData.hora || '00:00:00'}`);
    now.setSeconds(0, 0);
    if (scheduledDateTime < now) {
      toast.error('Não é possível agendar em uma data ou hora passada.');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiFetch('/api/manutencao/agenda', {
        method: 'POST',
        data: {
          atendimentoId: id,
          fiscalId: formData.fiscalId,
          data: formData.data,
          hora: formData.hora || null,
          periodo: formData.periodo,
          observacoes: formData.observacoes || null,
          agendado: isAgendado,
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      toast.success('Vistoria de manutenção agendada com sucesso.');
      navigate('/manutencao/agendamentos');
    } catch (error) {
      const apiErrors = error?.response?.data?.errors || error?.errors;
      if (apiErrors) {
        toast.error(Object.values(apiErrors).flat().join('\n'));
      } else {
        toast.error('Falha ao salvar o agendamento de manutenção.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFiscalName = useMemo(() => {
    if (!formData.fiscalId || fiscaisList.length === 0) return '';
    const fiscal = fiscaisList.find(f => f.id.toString() === formData.fiscalId);
    return fiscal ? (fiscal.nome || fiscal.name || '') : '';
  }, [formData.fiscalId, fiscaisList]);

  const fiscalAgendaByDate = useMemo(() => {
    return fiscalAgenda.reduce((acc, item) => {
      const dateKey = (item?.data_agendamento || '').toString().split('T')[0];
      if (!dateKey) return acc;
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});
  }, [fiscalAgenda]);

  const getStatusColor = (status) => {
    if (!status) return '#f4ba44';
    const normalized = status.toString().toLowerCase();
    if (normalized.includes('conclu')) return '#22c55e';
    if (normalized.includes('pend')) return '#f59e0b';
    if (normalized.includes('cancel')) return '#ef4444';
    return '#f4ba44';
  };

  const renderCalendarAppointments = ({ date, view }) => {
    if (view !== 'month') return null;

    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;
    const appointments = fiscalAgendaByDate[dateKey] || [];

    if (appointments.length === 0) return null;

    return (
      <div className="appointments-container">
        {appointments.slice(0, 2).map((agendamento) => (
          <AppointmentTag
            key={`${agendamento.fluxo}-${agendamento.id}`}
            color={getStatusColor(agendamento.status)}
            title={`${agendamento.fluxo || 'Agenda'} - ${agendamento.periodo || 'Sem período'}`}
          >
            {agendamento.fluxo || agendamento.periodo || 'Agendado'}
          </AppointmentTag>
        ))}
        {appointments.length > 2 && (
          <AppointmentTag color="#6b7280" title={`${appointments.length} agendamento(s)`}>
            +{appointments.length - 2}
          </AppointmentTag>
        )}
      </div>
    );
  };

  const selectedDateKey = useMemo(() => {
    if (!(scheduleDate instanceof Date)) return '';
    return `${scheduleDate.getFullYear()}-${String(scheduleDate.getMonth() + 1).padStart(2, '0')}-${String(
      scheduleDate.getDate()
    ).padStart(2, '0')}`;
  }, [scheduleDate]);

  const selectedDateLabel = useMemo(() => {
    if (!(scheduleDate instanceof Date)) return '';
    return scheduleDate.toLocaleDateString('pt-BR');
  }, [scheduleDate]);

  const selectedDayAppointments = useMemo(() => {
    const list = fiscalAgendaByDate[selectedDateKey] || [];
    return [...list].sort((a, b) => {
      const horaA = (a.hora_agendamento || '').toString();
      const horaB = (b.hora_agendamento || '').toString();
      return horaA.localeCompare(horaB);
    });
  }, [fiscalAgendaByDate, selectedDateKey]);

  const handleCalendarChange = (value) => {
    if (!(value instanceof Date)) return;
    setScheduleDate(value);
    const dateForInput = `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(
      value.getDate()
    ).padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, data: dateForInput }));
  };

  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>
            {isLoading ? <SkeletonBar width="350px" height="28px" /> : `Agendar Manutenção #${appointment?.ID || id}`}
          </HeaderTitle>
          <UserProfile>
            <span>{user?.nome}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>
        {isLoading ? (<SkeletonPage />) : !appointment ? (<p>Atendimento não encontrado.</p>) : (
          <>
            <BackButton to="/manutencao/agendamentos"><FiChevronLeft /> Voltar para Manutenção</BackButton>
            <DetailCard>
              <DetailGrid>
                <Detail icon={<FiHash />} label="ID">{appointment.ID}</Detail>
                <Detail icon={<FiMap />} label="Regional">{appointment.Regional}</Detail>
                <Detail icon={<FiMap />} label="Cidade">{appointment.Cidade}</Detail>
                <Detail icon={<FiBriefcase />} label="Empresa">{appointment.Empresa}</Detail>
                <Detail icon={<FiUsers />} label="Supervisor">{appointment.Supervisor}</Detail>
                <Detail icon={<FiUser />} label="Técnico">{appointment.Tecnico}</Detail>
                <Detail icon={<FiUser />} label="Cliente">{appointment.Cliente}</Detail>
                <Detail icon={<FiPhone />} label="Telefone">{appointment.Telefone}</Detail>
                <Detail icon={<FiFileText />} label="SA">{appointment.NumeroCompromisso || appointment.SA}</Detail>
                <Detail icon={<FiTool />} label="Motivo">{appointment.Motivo}</Detail>
                <Detail icon={<FiCheckCircle />} label="Conclusão">{appointment.Conclusao}</Detail>
                <Detail icon={<FiHome />} label="Endereço">{appointment.Endereco}</Detail>
                <Detail icon={<FiGitCommit />} label="CTO">{appointment.CTO}</Detail>
                <Detail icon={<FiPower />} label="Porta">{appointment.Porta}</Detail>
              </DetailGrid>
            </DetailCard>
            <SchedulingSection>
              <FormCard>
                <h3>Realizar Agendamento da Vistoria de Manutenção</h3>
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
                    {isSubmitting ? 'Salvando...' : 'Salvar Vistoria de Manutenção'}
                  </SubmitButton>
                </form>
              </FormCard>
              <CalendarCard>
                <h4>{selectedFiscalName ? `Agenda de ${selectedFiscalName}` : 'Selecione um fiscal para ver a agenda'}</h4>
                {selectedFiscalName && isCalendarLoading && (
                  <p style={{ textAlign: 'center', margin: '0 0 12px 0', color: '#6b7280' }}>Carregando agenda...</p>
                )}
                <Calendar
                  onChange={handleCalendarChange}
                  value={scheduleDate}
                  tileContent={renderCalendarAppointments}
                />
                {selectedFiscalName && !isCalendarLoading && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ marginBottom: '8px' }}>Detalhes de {selectedDateLabel}</h4>
                    {selectedDayAppointments.length === 0 ? (
                      <p style={{ margin: 0, color: '#6b7280', textAlign: 'center' }}>
                        Nenhum agendamento neste dia.
                      </p>
                    ) : (
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {selectedDayAppointments.map((agendamento) => (
                          <div
                            key={`${agendamento.fluxo}-${agendamento.id}`}
                            style={{
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              padding: '10px',
                              background: '#fafafa',
                            }}
                          >
                            <div style={{ fontWeight: 700, color: '#531110', marginBottom: '4px' }}>
                              {agendamento.hora_agendamento || 'Sem hora'} | {agendamento.periodo || 'Sem período'} | {agendamento.fluxo || 'Agenda'}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#374151' }}>
                              Status: {agendamento.status || 'Sem status'}
                            </div>
                            {agendamento.numero_compromisso && (
                              <div style={{ fontSize: '0.9rem', color: '#374151' }}>
                                SA: {agendamento.numero_compromisso}
                              </div>
                            )}
                            {agendamento.nome_conta && (
                              <div style={{ fontSize: '0.9rem', color: '#374151' }}>
                                Cliente: {agendamento.nome_conta}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CalendarCard>
            </SchedulingSection>
          </>
        )}
      </ContentArea>
    </LayoutContainer>
  );
};

export default AgendamentoManutencaoDetalhe;
