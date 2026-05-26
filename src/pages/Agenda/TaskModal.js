import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
    ModalOverlay, ModalContent, ModalHeader, ModalTitleGroup, ModalCaso, ModalSubtitle,
    ModalBody, ModalFooter, InfoItem, RescheduleSection, DeleteButton, PrimaryButton,
    StatusBadge, CloseButton, STATUS_BADGE_CONFIG,
} from './styles';

const Detail = ({ label, value }) => (
    <InfoItem>
        <strong>{label}</strong>
        <span>{value || 'N/A'}</span>
    </InfoItem>
);

const formatHorario = (hora) => {
    if (!hora) return null;
    return hora.substring(0, 5);
};

export const TaskModal = ({ task, isOpen, onClose, onDelete, onReschedule }) => {
    const [newDate, setNewDate] = useState('');

    if (!isOpen || !task) return null;

    const handleRescheduleClick = () => {
        if (!newDate) {
            toast.warn("Selecione uma nova data para reagendar.");
            return;
        }
        onReschedule(task.id, newDate);
    };

    const badgeConfig = STATUS_BADGE_CONFIG[task.statusAgendamento] || STATUS_BADGE_CONFIG['Pendente'];

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>

                <ModalHeader>
                    <ModalTitleGroup>
                        <ModalCaso>SA: {task.caso}</ModalCaso>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <StatusBadge bg={badgeConfig.bg} color={badgeConfig.color}>
                                {task.statusAgendamento}
                            </StatusBadge>
                            {task.hora_agendamento && (
                                <ModalSubtitle>&#128336; {formatHorario(task.hora_agendamento)}</ModalSubtitle>
                            )}
                            {task.statusLaudo && (
                                <ModalSubtitle>Laudo: {task.statusLaudo}</ModalSubtitle>
                            )}
                        </div>
                    </ModalTitleGroup>
                    <CloseButton onClick={onClose}>&#10005;</CloseButton>
                </ModalHeader>

                <ModalBody>
                    <Detail label="Cliente" value={task.nome_conta} />
                    <Detail label="Cidade" value={task.city} />
                    <Detail label="Endereço" value={task.endereco} />
                    <Detail label="Telefone" value={task.telefone} />
                    <Detail label="Técnico Original" value={task.nome_tecnico} />
                    <Detail label="Empresa" value={task.empresa_tecnico} />
                    <Detail label="Status do Laudo" value={task.statusLaudo} />
                    <Detail label="Observações" value={task.observacoes} />
                </ModalBody>

                <ModalFooter>
                    <RescheduleSection>
                        <input
                            type="date"
                            value={newDate}
                            onChange={e => setNewDate(e.target.value)}
                        />
                        <PrimaryButton onClick={handleRescheduleClick} disabled={!newDate}>
                            Reagendar
                        </PrimaryButton>
                    </RescheduleSection>

                    <DeleteButton onClick={() => onDelete(task.id)}>
                        Excluir
                    </DeleteButton>
                </ModalFooter>

            </ModalContent>
        </ModalOverlay>
    );
};
