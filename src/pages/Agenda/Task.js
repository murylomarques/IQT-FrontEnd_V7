import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TaskBar } from './styles';

export const Task = ({ task, start, duration, title }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <TaskBar
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            start={start}
            duration={duration}
            title={title}
            status={task.statusAgendamento}
        >
            {task.caso}
        </TaskBar>
    );
};
