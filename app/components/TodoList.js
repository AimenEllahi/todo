import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Todo from './Todo';

const TodoList = ({ todos, status, removeTodo, onEditTodo}) => {
    const droppableId = `droppable-${status}`;
    return (
        <div className="flex flex-col bg-white shadow-md rounded-lg p-4 mx-2 w-80 h-auto min-h-[50vh]">
            <div className="w-full">
                <h2 className="text-center text-white text-lg font-bold py-2 rounded mb-4 bg-gradient-to-r from-blue-500 to-indigo-500">
                    {status}
                </h2>
            </div>
            <Droppable droppableId={droppableId}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex-grow overflow-auto"
                    >
                        {todos.map((todo, index) => (
                            <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                {(provided) => (
                                    <Todo todo={todo} provided={provided} removeTodo={removeTodo} onEditTodo={onEditTodo} />
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default TodoList;
