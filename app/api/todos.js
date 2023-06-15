import connectToDatabase from '../../lib/db';

async function updateTodoOrder(todoOrderCollection, status, order) {
    await todoOrderCollection.updateOne({ status }, { $set: { order } });
}

export default async function handler(req, res) {
    const { method } = req;
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const todosCollection = db.collection('todos');
    const todoOrderCollection = db.collection('todo_order');
    async function createInitialTodoOrder(todoOrderCollection) {
        const initialStatusOrder = [
            { status: 'Todo', order: [] },
            { status: 'In Progress', order: [] },
            { status: 'Done', order: [] },
        ];

        for (const statusOrder of initialStatusOrder) {
            const existingOrder = await todoOrderCollection.findOne({ status: statusOrder.status });
            if (!existingOrder) {
                await todoOrderCollection.insertOne(statusOrder);
            }
        }
    }
    switch (method) {
        case 'GET':
            const todos = await todosCollection.find({}).toArray();
            const todoOrder = await todoOrderCollection.find({}).toArray();
            const sortedTodos = [];

            for (const orderItem of todoOrder) {
                const orderedTodos = orderItem.order.map(id => todos.find(todo => todo.id === id));
                sortedTodos.push(...orderedTodos);
            }

            res.status(200).json(sortedTodos);
            break;

        case 'POST':
            const todosCount = await todosCollection.countDocuments();
            if (todosCount === 0) {
                await createInitialTodoOrder(todoOrderCollection);
            }
            const newTodo = req.body;
            const result = await todosCollection.insertOne(newTodo);
            const { insertedId } = result;
            await updateTodoOrder(todoOrderCollection, newTodo.status, [insertedId]);
            res.status(201).json(newTodo);
            break;

        case 'PUT':
            const { id, _id, ...updatedTodo } = req.body;
            await todosCollection.updateOne({ id }, { $set: updatedTodo });
            res.status(200).json(updatedTodo);
            break;

        case 'DELETE':
            const { todoId } = req.query;
            await todosCollection.deleteOne({ id: todoId });
            res.status(204).end();
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}