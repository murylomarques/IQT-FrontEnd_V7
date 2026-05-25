import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { toast } from 'react-toastify';
// Import do componente Task (Verifique se o caminho está correto no seu projeto)
import { Task } from '../../components/Task'; 
import { TaskModal } from './TaskModal';
import { LayoutContainer, ContentArea, Header, HeaderTitle, UserProfile } from '../Dashboard/styles';
import BacklogSkeleton from '../../components/BacklogSkeleton';
import {
    ControlPanel, GanttContainer, GanttGrid, ResourceList, ResourceHeader,
    ResourceItem, TimelineWrapper, TimelineHeader, TimelineRow,
} from './styles';

// Componente auxiliar para as linhas da timeline
function DroppableTimelineRow({ techId, children }) {
    const { setNodeRef } = useDroppable({ id: `timeline-row-${techId}`, data: { techId } });
    return <TimelineRow ref={setNodeRef}>{children}</TimelineRow>;
}

const Agenda = () => {
    const { user, logout, apiFetch } = useAuth();
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [technicians, setTechnicians] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTask, setSelectedTask] = useState(null);

    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2,'0')}:00`);

    // --- CARREGAMENTO DOS DADOS ---
    // No arquivo Agenda.js

// --- CARREGAMENTO DOS DADOS ---
useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await apiFetch(`/api/agenda-gantt?date=${selectedDate}`);
            
            setTechnicians(response.resources);

            const formattedTasks = response.tasks.map(task => {
                const [hour, minute] = task.hora_agendamento.split(':');
                return { 
                    ...task, // Copia todos os campos da tarefa original (incluindo statusAgendamento)
                    start: parseInt(hour, 10) + parseInt(minute, 10) / 60, 
                    duration: 1 
                };
            });

            setScheduleData(formattedTasks);

        } catch (error) {
            toast.error("Erro ao carregar a agenda.");
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
}, [selectedDate, apiFetch]); // Dependências do useEffect

    // --- LÓGICA DE ARRASTAR E SOLTAR ---
    const handleDragEnd = async (event) => {
        const { active, over, delta } = event;
        const clickedTaskId = active.id;
        const taskData = scheduleData.find(t => t.id === clickedTaskId);

        // Se foi apenas um clique (não arrastou muito), abre o modal
        if (Math.abs(delta.x) < 5 && Math.abs(delta.y) < 5) {
            if (taskData) setSelectedTask(taskData);
            return;
        }

        if (!over || !taskData) return;

        const originalTask = taskData;
        const newTechId = over.data.current?.techId;
        
        // Cálculo da nova hora
        const newStartHourDecimal = originalTask.start + (delta.x / 60);
        const roundedStartHour = Math.max(0, Math.round(newStartHourDecimal * 4) / 4);
        const hour = Math.floor(roundedStartHour);
        const minute = (roundedStartHour % 1) * 60;
        const newTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

        // Se não mudou nada, retorna
        if (newTechId === originalTask.fiscal_id && newTime === originalTask.hora_agendamento) return;

        // Atualização Otimista (muda na tela antes de confirmar no banco)
        setScheduleData(prevData => prevData.map(t => 
            t.id === clickedTaskId ? { ...t, fiscal_id: newTechId, start: roundedStartHour, hora_agendamento: newTime } : t
        ));

        try {
            await apiFetch(`/api/agenda-gantt/${clickedTaskId}`, {
                method: 'PATCH',
                data: { fiscal_id: newTechId, hora_agendamento: newTime },
            });
            toast.success("Agenda atualizada!");
        } catch (error) {
            toast.error("Falha ao salvar. Desfazendo.");
            // Reverte se der erro
            setScheduleData(prevData => prevData.map(t => t.id === clickedTaskId ? originalTask : t));
        }
    };

    // --- HANDLERS DO MODAL ---
    const handleCloseModal = () => setSelectedTask(null);

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
            try {
                await apiFetch(`/api/agenda/${taskId}`, { method: 'DELETE' });
                toast.success("Agendamento excluído!");
                setScheduleData(prevData => prevData.filter(task => task.id !== taskId));
                handleCloseModal();
            } catch (error) {
                toast.error("Erro ao excluir o agendamento.");
            }
        }
    };

    const handleRescheduleTask = async (taskId, newDate) => {
        const taskToReschedule = scheduleData.find(task => task.id === taskId);
        if (!taskToReschedule) {
            toast.error("Erro: Tarefa não encontrada.");
            return;
        }

        const defaultTime = "08:00";

        try {
            await apiFetch(`/api/agenda-gantt/${taskId}`, {
                method: 'PATCH',
                data: {
                    data_agendamento: newDate,
                    fiscal_id: taskToReschedule.fiscal_id,
                    hora_agendamento: defaultTime,
                },
            });
            toast.success(`Agendamento movido para ${newDate.split('-').reverse().join('/')} às ${defaultTime}.`);
            setScheduleData(prevData => prevData.filter(task => task.id !== taskId));
            handleCloseModal();
        } catch (error) {
            toast.error("Erro ao reagendar a tarefa.");
        }
    };
    
    // --- RENDERIZAÇÃO ---
    return (
        <LayoutContainer>
            <Menu isExpanded={isMenuExpanded} setIsExpanded={setIsMenuExpanded} />
            <ContentArea isMenuExpanded={isMenuExpanded}>
                <Header>
                    <HeaderTitle>Agenda Interativa (Gantt)</HeaderTitle>
                    <UserProfile>
                        <span>{user?.nome}</span>
                        <button onClick={logout}>Sair</button>
                    </UserProfile>
                </Header>
                
                {isLoading ? (
                    <BacklogSkeleton kpis={3} filters={4} rows={6} cols={8} />
                ) : (
                    <DndContext onDragEnd={handleDragEnd}>
                        <ControlPanel>
                            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                        </ControlPanel>
                        <GanttContainer>
                            <GanttGrid>
                                <ResourceList>
                                    <ResourceHeader>Fiscais</ResourceHeader>
                                    {technicians.map(tech => (
                                        <ResourceItem key={tech.id}><strong>{tech.nome}</strong></ResourceItem>
                                    ))}
                                </ResourceList>
                                <TimelineWrapper>
                                    <TimelineHeader>
                                        {hours.map(hour => <div key={hour}>{hour}</div>)}
                                    </TimelineHeader>
                                    <div>
                                        {technicians.map(tech => (
                                            <DroppableTimelineRow key={tech.id} techId={tech.id}>
                                                {scheduleData
                                                    .filter(task => task.fiscal_id === tech.id)
                                                    .map(task => (
                                                        <Task
                                                            key={task.id}
                                                            task={task} // Passa o objeto COMPLETO (incluindo statusAgendamento)
                                                            start={task.start}
                                                            duration={task.duration}
                                                            // Dica: Adicione o status no título para ver ao passar o mouse
                                                            title={`SA: ${task.caso}\nStatus: ${task.statusAgendamento}`} 
                                                        />
                                                    ))
                                                }
                                            </DroppableTimelineRow>
                                        ))}
                                    </div>
                                </TimelineWrapper>
                            </GanttGrid>
                        </GanttContainer>
                    </DndContext>
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
