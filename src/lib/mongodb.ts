import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI!;
  
  if (!uri) {
    throw new Error('Please add MONGODB_URI to .env');
  }

  const client = await MongoClient.connect(uri);
  const db = client.db('tare');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
