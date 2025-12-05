import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { TaskBar } from '../../pages/Agenda/styles'; // Importe seu estilo

// Função para obter a cor (igual à sua)
const getColorForType = (type) => { /* ... */ };

export function Task({ task, ...props }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
        data: { task }, // Passa os dados da tarefa para o evento de drop
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        backgroundColor: getColorForType(task.tipo),
        // ... outros estilos que você tinha
    };

    return (
        <TaskBar
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            {...props} // Passa start, duration, etc. para o styled-component
        >
            {task.caso} - {task.tipo}
        </TaskBar>
    );
}