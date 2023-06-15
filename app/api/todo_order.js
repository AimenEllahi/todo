import connectToDatabase from '../../lib/db';

export default async function handler(req, res) {
    const { method } = req;
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const todoOrderCollection = db.collection('todo_order');

    switch (method) {
        case 'POST':
            const { columns } = req.body;
            const columnPromises = Object.keys(columns).map(async (status) => {
                await todoOrderCollection.updateOne({ status }, { $set: { order: columns[status] } });
            });
            console.log('Updating todo_order in database');
            await Promise.all(columnPromises);
            res.status(200).end();
            break;

        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}