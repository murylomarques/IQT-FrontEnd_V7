import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 1. Importar useNavigate
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify'; // 2. Importar toast para erros

import {
  FiChevronLeft, FiHash, FiMap, FiBriefcase, FiUser, FiUsers, FiPhone,
  FiFileText, FiCheckCircle, FiHome, FiGitCommit, FiPower
} from 'react-icons/fi';

import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import {
  DetailCard, DetailGrid, DetailItem, BackButton,
  SchedulingSection, FormCard, FormGroup, FormRow, SubmitButton, CalendarCard,
  AppointmentTag, SkeletonBar,
  ToggleFormGroup, SwitchLabel, SwitchInput, SwitchSlider
} from './styles';

// MOCK: Estes dados continuarão sendo usados para popular o dropdown de Fiscais.
const fiscaisComAgenda = [
  { id: 1, name: "Carlos Silva", agenda: [/* ... */] },
  { id: 2, name: "Mariana Costa", agenda: [/* ... */] },
  { id: 3, name: "Ricardo Souza", agenda: [/* ... */] },
  { id: 4, name: "Beatriz Lima", agenda: [] },
];

const getColorForAppointmentType = (type) => { /* ... sem alterações ... */ };
const Detail = ({ icon, label, children }) => { /* ... sem alterações ... */ };
const SkeletonPage = () => { /* ... sem alterações ... */ };


// --- COMPONENTE PRINCIPAL ---
const AgendamentoDetalhe = () => {
  // ==========================================================
  // ==================== INÍCIO DA CORREÇÃO ==================
  // ==========================================================
  const { user, logout, apiFetch } = useAuth(); // 3. Adicionar apiFetch
  const { id } = useParams();
  const navigate = useNavigate(); // Para voltar caso o agendamento não exista

  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do formulário e calendário (sem alteração)
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [selectedFiscal, setSelectedFiscal] = useState('');
  const [isAgendado, setIsAgendado] = useState(false);

  // 4. LÓGICA DE BUSCA DE DADOS REAIS NA API
  useEffect(() => {
    const fetchAgendamento = async () => {
      // Evita buscar se não houver ID
      if (!id) return;

      setIsLoading(true);
      try {
        // A rota da API deve ser algo como '/api/atendimentos/123'
        const response = await apiFetch(`/api/atendimentos/${id}`);
        setAppointment(response); // O objeto 'appointment' agora tem os dados da API
      } catch (error) {
        toast.error('Agendamento não encontrado ou falha ao carregar os dados.');
        // Se der erro (ex: 404), volta para a lista
        navigate('/agendamentos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgendamento();
  }, [id, apiFetch, navigate]); // Adicionar dependências

  // ==========================================================
  // ===================== FIM DA CORREÇÃO ====================
  // ==========================================================

  const fiscalSchedule = useMemo(() => {
    if (!selectedFiscal) return [];
    const fiscal = fiscaisComAgenda.find(f => f.name === selectedFiscal);
    return fiscal ? fiscal.agenda : [];
  }, [selectedFiscal]);

  const markAppointmentsOnCalendar = ({ date, view }) => {
      if (view === 'month' && fiscalSchedule.length > 0) {
        const appointmentsForDay = fiscalSchedule.filter(item => {
          const [day, month, year] = item.data.split('/');
          const appointmentDate = new Date(year, month - 1, day);
          return date.toDateString() === appointmentDate.toDateString();
        });
        if (appointmentsForDay.length > 0) {
          return ( <div className="appointments-container">{appointmentsForDay.slice(0, 2).map(app => (<AppointmentTag key={app.id} color={getColorForAppointmentType(app.tipo)} title={`${app.hora} - ${app.cliente}`}>{app.hora} - {app.cliente}</AppointmentTag>))} {appointmentsForDay.length > 2 && (<AppointmentTag color="#35302d">+ {appointmentsForDay.length - 2} mais</AppointmentTag>)}</div> );
        }
      }
      return null;
    };

  const handleFiscalChange = (event) => setSelectedFiscal(event.target.value);

  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>
            {isLoading ? <SkeletonBar width="350px" height="28px" /> : `Detalhes do Agendamento #${appointment?.ID || id}`}
          </HeaderTitle>
          <UserProfile>
            <span>{user?.nome}</span> {/* Corrigido de user.name para user.nome */}
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>

        {isLoading ? (
          <SkeletonPage />
        ) : !appointment ? (
          <p>Agendamento não encontrado.</p>
        ) : (
          <>
            <BackButton to="/agendamentos"><FiChevronLeft /> Voltar para Agendamentos</BackButton>
            <DetailCard>
              {/* 5. OS NOMES DAS PROPRIEDADES PRECISAM BATER COM OS DA API */}
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
                <form>
                  {/* ... O resto do formulário e calendário continua igual ... */}
                  <ToggleFormGroup>
                    <span>{isAgendado ? 'Serviço Agendado' : 'Serviço Não Agendado'}</span>
                    <SwitchLabel>
                      <SwitchInput
                        type="checkbox"
                        checked={isAgendado}
                        onChange={() => setIsAgendado(!isAgendado)}
                      />
                      <SwitchSlider />
                    </SwitchLabel>
                  </ToggleFormGroup>
                  <FormRow>
                    <FormGroup><label htmlFor="date">Data</label><input id="date" type="date" /></FormGroup>
                    <FormGroup><label htmlFor="time">Hora</label><input id="time" type="time" /></FormGroup>
                  </FormRow>
                  <FormRow>
                    <FormGroup>
                      <label htmlFor="periodo">Período</label>
                      <select id="periodo"><option>Selecione</option><option>Manhã</option><option>Tarde</option></select>
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="fiscal">Fiscal</label>
                      <select id="fiscal" value={selectedFiscal} onChange={handleFiscalChange}>
                        <option value="">Selecione um Fiscal</option>
                        {fiscaisComAgenda.map(fiscal => (<option key={fiscal.id} value={fiscal.name}>{fiscal.name}</option>))}
                      </select>
                    </FormGroup>
                  </FormRow>
                  <FormGroup>
                    <label htmlFor="obs">Observações</label>
                    <textarea id="obs" placeholder="Adicione observações relevantes..."></textarea>
                  </FormGroup>
                  <SubmitButton type="submit">Salvar Vistoria</SubmitButton>
                </form>
              </FormCard>

              <CalendarCard>
                <h4>{selectedFiscal ? `Agenda de ${selectedFiscal}` : 'Selecione um fiscal para ver a agenda'}</h4>
                <Calendar onChange={setScheduleDate} value={scheduleDate} tileContent={markAppointmentsOnCalendar} />
              </CalendarCard>
            </SchedulingSection>
          </>
        )}
      </ContentArea>
    </LayoutContainer>
  );
};

export default AgendamentoDetalhe;