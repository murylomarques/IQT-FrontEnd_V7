import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { 
  FiChevronLeft, FiHash, FiMap, FiBriefcase, FiUser, FiUsers, FiPhone, 
  FiFileText, FiCheckCircle, FiHome, FiGitCommit, FiPower 
} from 'react-icons/fi';

import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import { 
  DetailCard, DetailGrid, DetailItem, BackButton,
  SchedulingSection, FormCard, FormGroup, FormRow, SubmitButton, CalendarCard,
  AppointmentTag
} from './styles';

// --- ESTRUTURA DE DADOS UNIFICADA ---
// Em uma app real, isso viria de uma chamada de API
const fiscaisComAgenda = [
  { 
    id: 1, 
    name: "Carlos Silva", 
    agenda: [
      { id: 1, cliente: 'João Pereira', data: '25/09/2025', hora: '10:00', tipo: 'Instalação' },
      { id: 4, cliente: 'Fernanda Lima', data: '26/09/2025', hora: '14:30', tipo: 'Reparo Urgente' },
      { id: 5, cliente: 'Roberto Alves', data: '26/09/2025', hora: '16:00', tipo: 'Manutenção' },
    ]
  },
  { 
    id: 2, 
    name: "Mariana Costa",
    agenda: [
      { id: 2, cliente: 'Maria Oliveira', data: '25/09/2025', hora: '09:00', tipo: 'Instalação' },
      { id: 6, cliente: 'Lucas Martins', data: '27/09/2025', hora: '11:00', tipo: 'Manutenção' },
    ]
  },
  { 
    id: 3, 
    name: "Ricardo Souza",
    agenda: [
      { id: 3, cliente: 'Ana Beatriz', data: '26/09/2025', hora: '08:30', tipo: 'Reparo Urgente' },
    ]
  },
  { 
    id: 4, 
    name: "Beatriz Lima",
    agenda: [] // Beatriz não tem agendamentos
  },
];

// Função para associar um tipo de agendamento a uma cor da nossa paleta
const getColorForAppointmentType = (type) => {
  switch (type) {
    case 'Instalação': return '#f4ba44'; // Dourado
    case 'Manutenção': return '#a8372c'; // Terracota
    case 'Reparo Urgente': return '#ae2e2a'; // Vermelho
    default: return '#cfcbbb'; // Cinza-bege
  }
};

// Componente reutilizável para cada item de detalhe com ícone
const Detail = ({ icon, label, children }) => (
  <DetailItem>
    <div className="label-container">
      {icon}
      <label>{label}</label>
    </div>
    <p>{children}</p>
  </DetailItem>
);

const AgendamentoDetalhe = () => {
  const { user, logout } = useAuth();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [selectedFiscal, setSelectedFiscal] = useState('');

  useEffect(() => {
    setTimeout(() => {
      let foundAppointment = null;
      // Procura o agendamento dentro da agenda de cada fiscal
      for (const fiscal of fiscaisComAgenda) {
        const found = fiscal.agenda.find(app => app.id === parseInt(id));
        if (found) {
          // Adiciona o nome do técnico ao objeto para facilitar a exibição
          foundAppointment = { ...found, tecnico: fiscal.name };
          break;
        }
      }
      setAppointment(foundAppointment);
      setIsLoading(false);
    }, 500);
  }, [id]);

  // A lógica para obter a agenda ficou muito mais simples e eficiente
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
        return (
          <div className="appointments-container">
            {appointmentsForDay.slice(0, 2).map(app => (
              <AppointmentTag key={app.id} color={getColorForAppointmentType(app.tipo)} title={`${app.hora} - ${app.cliente}`}>
                {app.hora} - {app.cliente}
              </AppointmentTag>
            ))}
            {appointmentsForDay.length > 2 && (
              <AppointmentTag color="#35302d">+ {appointmentsForDay.length - 2} mais</AppointmentTag>
            )}
          </div>
        );
      }
    }
    return null;
  };

  const handleFiscalChange = (event) => setSelectedFiscal(event.target.value);

  if (isLoading) { return <div>Carregando detalhes...</div>; }
  if (!appointment) { return <div>Agendamento não encontrado.</div>; }

  return (
    <LayoutContainer>
      <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
      <ContentArea isMenuExpanded={isMenuExpanded}>
        <Header>
          <HeaderTitle>Detalhes do Agendamento #{appointment.id}</HeaderTitle>
          <UserProfile>
            <span>{user?.name}</span>
            <button onClick={logout}>Sair</button>
          </UserProfile>
        </Header>
        
        <BackButton to="/agendamentos">
          <FiChevronLeft />
          Voltar para Agendamentos
        </BackButton>

        <DetailCard>
          <DetailGrid>
            <Detail icon={<FiHash />} label="ID">{appointment.id}</Detail>
            <Detail icon={<FiMap />} label="Regional">{appointment.regional}</Detail>
            <Detail icon={<FiBriefcase />} label="Empresa">{appointment.empresa}</Detail>
            <Detail icon={<FiUsers />} label="Supervisor">{appointment.supervisor}</Detail>
            <Detail icon={<FiUser />} label="Técnico">{appointment.tecnico}</Detail>
            <Detail icon={<FiUser />} label="Cliente">{appointment.cliente}</Detail>
            <Detail icon={<FiPhone />} label="Telefone">{appointment.telefone}</Detail>
            <Detail icon={<FiFileText />} label="SA">{appointment.sa}</Detail>
            <Detail icon={<FiCheckCircle />} label="Conclusão">{appointment.conclusao}</Detail>
            <Detail icon={<FiHome />} label="Endereço">{appointment.endereco}</Detail>
            <Detail icon={<FiGitCommit />} label="CTO">{appointment.cto}</Detail>
            <Detail icon={<FiPower />} label="Porta">{appointment.porta}</Detail>
          </DetailGrid>
        </DetailCard>

        <SchedulingSection>
          <FormCard>
            <h3>Realizar Agendamento da Vistoria</h3>
            <form>
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
                </ FormGroup>
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
            <Calendar 
              onChange={setScheduleDate} 
              value={scheduleDate}
              tileContent={markAppointmentsOnCalendar}
            />
          </CalendarCard>
        </SchedulingSection>
      </ContentArea>
    </LayoutContainer>
  );
};

export default AgendamentoDetalhe;