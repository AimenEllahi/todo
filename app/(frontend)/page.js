"use client";
import React, {useEffect, useState} from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import useTodoColumns from '../../hooks/useTodoColumns';
import AddTodoForm from '../components/AddTodoForm';
import TodoList from '../components/TodoList';
import Header from '../components/Header';
import EditTodoForm from "@/app/components/EditTodoForm";

const initialColumns = {
    'Todo': [],
    'In Progress': [],
    'Done': []
};

const Home = ({initialTodos}) => {
    const [todos, setTodos] = useState(initialTodos);
    const [isAddTodoFormOpen, setIsAddTodoFormOpen] = useState(false);
    const [isEditTodoFormOpen, setIsEditTodoFormOpen] = useState(false);
    const [todoBeingEdited, setTodoBeingEdited] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const {
        columns,
        addTodoToColumn,
        removeTodoFromColumn,
        moveTodoWithinColumn,
        moveTodoToAnotherColumn
    } = useTodoColumns(initialColumns);

    useEffect(() => {
        updateTodoOrderInDatabase(columns);
    }, [columns]);

    useEffect(() => {
       if(initialTodos){
        initialTodos.forEach((todo) => {
            addTodoToColumn(todo.id, todo.status);
        });
       }
    }, [initialTodos]);

    const updateTodoOrderInDatabase = async (columns) => {
        const response = await fetch('/api/todo_order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ columns }),
        });
        if (!response.ok) {
            console.error('Failed to update todo_order in database');
        }
    };
    const handleBeginEditingTodo = (todo) => {
        setIsEditTodoFormOpen(true);
        setTodoBeingEdited(todo);
    };

    const handleEditTodo = async (updatedTodo) => {
        await fetch('/api/todos', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedTodo),
        });
        setTodos(prevTodos => prevTodos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
        setSnackbarMessage('Todo wurde erfolgreich aktualisiert.');

        setTimeout(() => {
            setSnackbarMessage('');
        }, 3000);
    };
    const updateTodoStatusAndOrder = async (todoId, newStatus) => {
        const updatedTodo = { ...todos.find(todo => todo.id === todoId), status: newStatus };
        await fetch('/api/todos', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedTodo),
        });
        setTodos(prevTodos => prevTodos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
    };

    const handleOnDragEnd = async (result) => {
        if (!result.destination) return;

        const sourceColumnId = result.source.droppableId.replace('droppable-', '');
        const destinationColumnId = result.destination.droppableId.replace('droppable-', '');

        if (sourceColumnId === destinationColumnId) {
            moveTodoWithinColumn(result.draggableId, sourceColumnId, result.destination.index);
            await updateTodoStatusAndOrder(result.draggableId, sourceColumnId, result.destination.index);
        } else {
            moveTodoToAnotherColumn(result.draggableId, sourceColumnId, destinationColumnId, result.destination.index);
            setTodos(prevTodos => {
                const updatedTodos = [...prevTodos];
                const todoIndex = updatedTodos.findIndex(todo => todo.id === result.draggableId);
                if (todoIndex > -1) {
                    updatedTodos[todoIndex].status = destinationColumnId;
                }
                return updatedTodos;
            });
            await updateTodoStatusAndOrder(result.draggableId, destinationColumnId, result.destination.index);
        }
    };

    const handleRemoveTodo = async (todoId, columnId) => {
        await fetch(`/api/todos?todoId=${todoId}`, {
            method: 'DELETE',
        });
        removeTodoFromColumn(todoId, columnId);
        setSnackbarMessage('Todo wurde erfolgreich entfernt.');

        setTimeout(() => {
            setSnackbarMessage('');
        }, 3000);
    };

    const handleAddTodo = async (newTodo) => {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newTodo),
        });
        const createdTodo = await response.json();
        setTodos([...todos, createdTodo]);
        addTodoToColumn(createdTodo.id, 'Todo');
        setSnackbarMessage('Todo wurde erfolgreich hinzugefügt.');

        setTimeout(() => {
            setSnackbarMessage('');
        }, 3000);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <button
                onClick={() => setIsAddTodoFormOpen(true)}
                className="hover:bg-blue-700 fixed right-8 bottom-8 bg-blue-500 text-white p-5 rounded-full shadow-lg"
            >
                +
            </button>
            {isAddTodoFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    <div className="relative bg-white rounded p-4 shadow-xl">
                        <AddTodoForm onAddTodo={handleAddTodo} onClose={() => setIsAddTodoFormOpen(false)} />
                    </div>
                </div>
            )}
            {isEditTodoFormOpen && todoBeingEdited && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    <div className="relative bg-white rounded p-4 shadow-xl">
                        <EditTodoForm todo={todoBeingEdited} onEditTodo={handleEditTodo} onClose={() => setIsEditTodoFormOpen(false)} />
                    </div>

                </div>
            )}
            {snackbarMessage && (
                <div
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 bg-green-500 text-white py-2 px-4 rounded shadow-md transition-opacity duration-300"
                    style={{ opacity: snackbarMessage ? "1" : "0" }}
                >
                    {snackbarMessage}
                </div>
            )}
            <div className="container mx-auto p-4 flex justify-center">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <div className="flex space-x-4">
                        {Object.keys(columns).map(columnId => (
                            <TodoList
                                key={columnId}
                                todos={columns[columnId].map(todoId => todos.find(todo => todo.id === todoId))}
                                status={columnId}
                                removeTodo={handleRemoveTodo}
                                onEditTodo={handleBeginEditingTodo}
                            />
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default Home;

export async function getServerSideProps() {
    const response = await fetch('http://localhost:3000/api/todos', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    const todos = await response.json();

    return {
        props: {
            initialTodos: todos,
        },
    };
}