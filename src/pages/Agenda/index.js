import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { toast } from 'react-toastify';
import { Task } from './Task';
import { TaskModal } from './TaskModal';
import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import BacklogSkeleton from '../../components/BacklogSkeleton';
import {
    ControlPanel, GanttContainer, GanttGrid,
    ResourceList, ResourceHeader, ResourceItem, ResourceAvatar, ResourceInfo, ResourceName, ResourceMeta,
    TimelineWrapper, TimelineHeader, TimelineRowsContainer, TimelineRow, CurrentTimeIndicator,
    DateNavGroup, NavButton, TodayButton, DateDisplay, DateInput, ControlRight, LegendGroup, LegendItem, LegendDot,
    StatsRow, StatCard, StatValue, StatLabel,
    STATUS_BADGE_CONFIG,
} from './styles';

const LEGEND = [
    { label: 'Concluído', color: '#16a34a' },
    { label: 'Pendente',  color: '#3b82f6' },
    { label: 'Realizando', color: '#8b5cf6' },
    { label: 'Caminho',   color: '#f59e0b' },
    { label: 'Reparo',    color: '#ef4444' },
];

const getInitials = (name = '') =>
    name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';

const formatDatePT = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const TODAY = () => new Date().toISOString().split('T')[0];

function DroppableTimelineRow({ techId, isEven, children }) {
    const { setNodeRef } = useDroppable({ id: `timeline-row-${techId}`, data: { techId } });
    return <TimelineRow ref={setNodeRef} isEven={isEven}>{children}</TimelineRow>;
}

const hours = Array.from({ length: 24 }, (_, i) => i);

const Agenda = () => {
    const { user, logout, apiFetch } = useAuth();
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [technicians, setTechnicians] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(TODAY());
    const [selectedTask, setSelectedTask] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Live current-time indicator
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // --- CARREGAMENTO ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await apiFetch(`/api/agenda-gantt?date=${selectedDate}`);
                setTechnicians(response?.resources || []);
                const formatted = (response?.tasks || []).map(task => {
                    const [hour, minute] = task.hora_agendamento.split(':');
                    return { ...task, start: parseInt(hour, 10) + parseInt(minute, 10) / 60, duration: 1 };
                });
                setScheduleData(formatted);
            } catch {
                toast.error("Erro ao carregar a agenda.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [selectedDate, apiFetch]);

    // Stats
    const stats = useMemo(() => ({
        total:       scheduleData.length,
        concluido:   scheduleData.filter(t => t.statusAgendamento === 'Concluído').length,
        emAndamento: scheduleData.filter(t => ['Realizando', 'Caminho'].includes(t.statusAgendamento)).length,
        pendente:    scheduleData.filter(t => t.statusAgendamento === 'Pendente').length,
    }), [scheduleData]);

    const taskCountByTech = useMemo(() => {
        const counts = {};
        scheduleData.forEach(t => { counts[t.fiscal_id] = (counts[t.fiscal_id] || 0) + 1; });
        return counts;
    }, [scheduleData]);

    // Current time position (only shown when viewing today)
    const isToday = selectedDate === TODAY();
    const currentTimePosition = isToday
        ? (currentTime.getHours() + currentTime.getMinutes() / 60) * 60
        : null;

    // --- NAVEGAÇÃO DE DATA ---
    const navigateDate = (direction) => {
        const date = new Date(selectedDate + 'T00:00:00');
        date.setDate(date.getDate() + direction);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    // --- DRAG AND DROP ---
    const handleDragEnd = async (event) => {
        const { active, over, delta } = event;
        const clickedTaskId = active.id;
        const taskData = scheduleData.find(t => t.id === clickedTaskId);

        if (Math.abs(delta.x) < 5 && Math.abs(delta.y) < 5) {
            if (taskData) setSelectedTask(taskData);
            return;
        }
        if (!over || !taskData) return;

        const originalTask = taskData;
        const newTechId = over.data.current?.techId;
        const newStartHourDecimal = originalTask.start + (delta.x / 60);
        const roundedStart = Math.max(0, Math.round(newStartHourDecimal * 4) / 4);
        const hour = Math.floor(roundedStart);
        const minute = (roundedStart % 1) * 60;
        const newTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

        if (newTechId === originalTask.fiscal_id && newTime === originalTask.hora_agendamento) return;

        setScheduleData(prev => prev.map(t =>
            t.id === clickedTaskId ? { ...t, fiscal_id: newTechId, start: roundedStart, hora_agendamento: newTime } : t
        ));

        try {
            await apiFetch(`/api/agenda-gantt/${clickedTaskId}`, {
                method: 'PATCH',
                data: { fiscal_id: newTechId, hora_agendamento: newTime },
            });
            toast.success("Agenda atualizada!");
        } catch {
            toast.error("Falha ao salvar. Desfazendo.");
            setScheduleData(prev => prev.map(t => t.id === clickedTaskId ? originalTask : t));
        }
    };

    // --- MODAL ---
    const handleCloseModal = () => setSelectedTask(null);

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
            try {
                await apiFetch(`/api/agenda/${taskId}`, { method: 'DELETE' });
                toast.success("Agendamento excluído!");
                setScheduleData(prev => prev.filter(t => t.id !== taskId));
                handleCloseModal();
            } catch {
                toast.error("Erro ao excluir o agendamento.");
            }
        }
    };

    const handleRescheduleTask = async (taskId, newDate) => {
        const task = scheduleData.find(t => t.id === taskId);
        if (!task) { toast.error("Tarefa não encontrada."); return; }
        const defaultTime = "08:00";
        try {
            await apiFetch(`/api/agenda-gantt/${taskId}`, {
                method: 'PATCH',
                data: { data_agendamento: newDate, fiscal_id: task.fiscal_id, hora_agendamento: defaultTime },
            });
            toast.success(`Reagendado para ${newDate.split('-').reverse().join('/')} às ${defaultTime}.`);
            setScheduleData(prev => prev.filter(t => t.id !== taskId));
            handleCloseModal();
        } catch {
            toast.error("Erro ao reagendar a tarefa.");
        }
    };

    // --- RENDER ---
    return (
        <LayoutContainer>
            <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
            <ContentArea isMenuExpanded={isMenuExpanded}>
                <Header>
                    <HeaderTitle>Agenda Interativa</HeaderTitle>
                    <UserProfile>
                        <span>{user?.nome}</span>
                        <button onClick={logout}>Sair</button>
                    </UserProfile>
                </Header>

                {isLoading ? (
                    <BacklogSkeleton kpis={3} filters={4} rows={6} cols={8} />
                ) : (
                    <>
                        {/* Stats */}
                        <StatsRow>
                            <StatCard accent="#64748b">
                                <div>
                                    <StatValue>{stats.total}</StatValue>
                                    <StatLabel>Total do Dia</StatLabel>
                                </div>
                            </StatCard>
                            <StatCard accent="#16a34a">
                                <div>
                                    <StatValue color="#16a34a">{stats.concluido}</StatValue>
                                    <StatLabel>Concluídos</StatLabel>
                                </div>
                            </StatCard>
                            <StatCard accent="#8b5cf6">
                                <div>
                                    <StatValue color="#8b5cf6">{stats.emAndamento}</StatValue>
                                    <StatLabel>Em Andamento</StatLabel>
                                </div>
                            </StatCard>
                            <StatCard accent="#3b82f6">
                                <div>
                                    <StatValue color="#3b82f6">{stats.pendente}</StatValue>
                                    <StatLabel>Pendentes</StatLabel>
                                </div>
                            </StatCard>
                        </StatsRow>

                        <DndContext onDragEnd={handleDragEnd}>
                            {/* Control Panel */}
                            <ControlPanel>
                                <DateNavGroup>
                                    <NavButton onClick={() => navigateDate(-1)} title="Dia anterior">&#8249;</NavButton>
                                    <TodayButton onClick={() => setSelectedDate(TODAY())}>Hoje</TodayButton>
                                    <NavButton onClick={() => navigateDate(1)} title="Próximo dia">&#8250;</NavButton>
                                    <DateDisplay>{formatDatePT(selectedDate)}</DateDisplay>
                                </DateNavGroup>

                                <ControlRight>
                                    <LegendGroup>
                                        {LEGEND.map(l => (
                                            <LegendItem key={l.label}>
                                                <LegendDot color={l.color} />
                                                {l.label}
                                            </LegendItem>
                                        ))}
                                    </LegendGroup>
                                    <DateInput
                                        type="date"
                                        value={selectedDate}
                                        onChange={e => setSelectedDate(e.target.value)}
                                    />
                                </ControlRight>
                            </ControlPanel>

                            {/* Gantt */}
                            <GanttContainer>
                                <GanttGrid>
                                    {/* Coluna de recursos */}
                                    <ResourceList>
                                        <ResourceHeader>Fiscais &mdash; {technicians.length}</ResourceHeader>
                                        {technicians.map(tech => (
                                            <ResourceItem key={tech.id}>
                                                <ResourceAvatar>{getInitials(tech.nome)}</ResourceAvatar>
                                                <ResourceInfo>
                                                    <ResourceName>{tech.nome}</ResourceName>
                                                    <ResourceMeta>
                                                        {taskCountByTech[tech.id] || 0} agendamento{taskCountByTech[tech.id] !== 1 ? 's' : ''}
                                                    </ResourceMeta>
                                                </ResourceInfo>
                                            </ResourceItem>
                                        ))}
                                    </ResourceList>

                                    {/* Timeline */}
                                    <TimelineWrapper>
                                        <TimelineHeader>
                                            {hours.map(h => (
                                                <div key={h}>
                                                    {String(h).padStart(2, '0')}:00
                                                    <span className="period">{h < 12 ? 'AM' : 'PM'}</span>
                                                </div>
                                            ))}
                                        </TimelineHeader>

                                        <TimelineRowsContainer>
                                            {currentTimePosition !== null && (
                                                <CurrentTimeIndicator position={currentTimePosition} />
                                            )}
                                            {technicians.map((tech, idx) => (
                                                <DroppableTimelineRow key={tech.id} techId={tech.id} isEven={idx % 2 === 1}>
                                                    {scheduleData
                                                        .filter(task => task.fiscal_id === tech.id)
                                                        .map(task => (
                                                            <Task
                                                                key={task.id}
                                                                task={task}
                                                                start={task.start}
                                                                duration={task.duration}
                                                                title={`SA: ${task.caso} | Status: ${task.statusAgendamento}`}
                                                            />
                                                        ))
                                                    }
                                                </DroppableTimelineRow>
                                            ))}
                                        </TimelineRowsContainer>
                                    </TimelineWrapper>
                                </GanttGrid>
                            </GanttContainer>
                        </DndContext>
                    </>
                )}
            </ContentArea>

            <TaskModal
                isOpen={!!selectedTask}
                task={selectedTask}
                onClose={handleCloseModal}
                onDelete={handleDeleteTask}
                onReschedule={handleRescheduleTask}
            />
        </LayoutContainer>
    );
};

export default Agenda;
