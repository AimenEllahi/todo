import {useState, useCallback, useEffect} from 'react';

const useTodoColumns = (initialState) => {
    const [columns, setColumns] = useState(initialState);

    const addTodoToColumn = useCallback((todoId, columnId) => {
        setColumns(prevColumns => ({
            ...prevColumns,
            [columnId]: [...prevColumns[columnId], todoId]
        }));
    }, []);

    const removeTodoFromColumn = useCallback((todoId, columnId) => {
        setColumns(prevColumns => ({
            ...prevColumns,
            [columnId]: prevColumns[columnId].filter(id => id !== todoId)
        }));
    }, []);

    const moveTodoWithinColumn = useCallback((todoId, columnId, newIndex) => {
        setColumns(prevColumns => {
            const column = [...prevColumns[columnId]];
            const oldIndex = column.indexOf(todoId);
            column.splice(oldIndex, 1);
            column.splice(newIndex, 0, todoId);

            return { ...prevColumns, [columnId]: column };
        });
    }, []);



    const moveTodoToAnotherColumn = useCallback((todoId, oldColumnId, newColumnId, newIndex) => {
        setColumns(prevColumns => {
            const oldColumn = [...prevColumns[oldColumnId]];
            const newColumn = [...prevColumns[newColumnId]];

            oldColumn.splice(oldColumn.indexOf(todoId), 1);
            newColumn.splice(newIndex, 0, todoId);

            return { ...prevColumns, [oldColumnId]: oldColumn, [newColumnId]: newColumn };
        });
    }, []);

    return {
        columns,
        addTodoToColumn,
        removeTodoFromColumn,
        moveTodoWithinColumn,
        moveTodoToAnotherColumn
    };
};

export default useTodoColumns;
