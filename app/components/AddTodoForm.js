import React, { useState } from 'react';

const AddTodoForm = ({ onAddTodo, onClose}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onClose();
        onAddTodo({
            id: Math.random().toString(36).substring(2),
            title,
            description,
            status: 'Todo',
            createdAt: new Date(),
        });
        setTitle('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded p-4 shadow-xl">
            <h2 className="text-gray-700 font-bold text-2xl mb-4">Add New Todo</h2>
            <button
                onClick={onClose}
                className="absolute right-2 top-2 bg-gray-300 p-2 rounded-full shadow-lg hover:bg-gray-400 transition duration-150"
            >
                X
            </button>
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Title
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                </label>
                <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
            </div>
            <div className="flex justify-center"> {/* Added justify-center here */}
                <div className="flex justify-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Add Todo
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddTodoForm;
