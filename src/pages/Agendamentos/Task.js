// src/components/Task.js

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TaskBar } from '../pages/Agendamentos/styles'; // Verifique se este caminho está correto para o seu projeto

// --- CORREÇÃO: Removido o 'onClick' das props ---
export const Task = ({ task, start, duration, title }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
    } : undefined;

    return (
        <TaskBar
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            start={start}
            duration={duration}
            title={title}
            // --- CORREÇÃO: Removida a propriedade onClick daqui ---
        >
            {task.caso}
        </TaskBar>
    );
};