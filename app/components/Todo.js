import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Todo = ({ todo, provided, removeTodo, onEditTodo }) => {
    return (
        <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onDoubleClick={() => onEditTodo(todo)}
            className="bg-gray-100 p-4 my-2 rounded-lg shadow-md text-gray-800 relative hover:bg-gray-200 transition-colors duration-200 border border-gray-300"
        >
            <button
                onClick={() => removeTodo(todo.id, todo.status)}
                className="absolute right-1 top-1 bg-white p-1 rounded-xl text-gray-500 shadow-lg hover:text-gray-800 transition-colors duration-200"
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-2xl mb-1 font-bold text-gray-700">{todo.title}</h2>
            <hr className="border-gray-300 mb-2" />
            <p className="text-gray-800 text-base">{todo.description}</p>
        </div>
    );
};

export default Todo;