// No seu arquivo Task.js

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TaskBar } from './styles'; // Verifique se o caminho está correto

export const Task = ({ task, start, duration, title }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <TaskBar
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            
            // Props de posicionamento
            start={start}
            duration={duration}
            title={title}

            // --- CORREÇÃO APLICADA AQUI ---
            // Agora estamos passando apenas o valor do campo 'statusAgendamento'
            // para a prop 'status'. É exatamente isso que o TaskBar precisa.
            status={task.statusAgendamento}
            // ------------------------------
        >
            {/* Texto que aparece dentro da tarefa */}
            {task.caso}
        </TaskBar>
    );
};