import { MongoClient } from 'mongodb';

const { MONGODB_URI, MONGODB_DB } = process.env;

if (!MONGODB_URI || !MONGODB_DB) {
    throw new Error('Passe die .env File richtig an!');
}


let cached = global.mongo;
if (!cached) {
    cached = global.mongo = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
            return { client, db: client.db(MONGODB_DB) };
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectToDatabase;