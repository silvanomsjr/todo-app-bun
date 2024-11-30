import { MongoClient } from "mongodb";

const MongoURI = "mongodb://root:1234@localhost:27017";

const client = new MongoClient(MongoURI);

let db: null | MongoClient = null;

async function getDb() {
  if (!db) {
    try {
      await client.connect();
      db = client;
      return client.db("todo-app-db");
    } catch (error) {
      console.error("Erro ao conectar ao MongoDB:", error);
      throw error;
    }
  } else {
    return db.db("todo-app-db");
  }
}

export default getDb;
