import React, { useState } from 'react';
import { toast } from 'react-toastify'; // <-- CORREÇÃO: ADICIONE ESTA LINHA
import {
    ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    InfoItem, RescheduleSection, DeleteButton, PrimaryButton
} from './styles'; 

const Detail = ({ label, value }) => (
    <InfoItem>
        <strong>{label}</strong>
        <span>{value || 'N/A'}</span>
    </InfoItem>
);

export const TaskModal = ({ task, isOpen, onClose, onDelete, onReschedule }) => {
    const [newDate, setNewDate] = useState('');

    if (!isOpen || !task) {
        return null;
    }

    const handleRescheduleClick = () => {
        if (!newDate) {
            // Agora a função 'toast' existe e pode ser chamada
            toast.warn("Por favor, selecione uma nova data para reagendar.");
            return;
        }
        onReschedule(task.id, newDate);
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h2>Detalhes da SA: {task.caso}</h2>
                    <button onClick={onClose}>&times;</button>
                </ModalHeader>

                <ModalBody>
                    <Detail label="Cliente" value={task.nome_conta} />
                    <Detail label="Status do Laudo" value={task.statusLaudo} />
                    <Detail label="Endereço" value={task.endereco} />
                    <Detail label="Cidade" value={task.city} />
                    <Detail label="Técnico Original" value={task.nome_tecnico} />
                    <Detail label="Empresa" value={task.empresa_tecnico} />
                    <Detail label="Telefone" value={task.telefone} />
                    <Detail label="Observações" value={task.observacoes} />
                </ModalBody>

                <ModalFooter>
                    <RescheduleSection>
                        <input 
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                        />
                        <PrimaryButton onClick={handleRescheduleClick}>Reagendar</PrimaryButton>
                    </RescheduleSection>

                    <DeleteButton onClick={() => onDelete(task.id)}>
                        Excluir Agendamento
                    </DeleteButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};