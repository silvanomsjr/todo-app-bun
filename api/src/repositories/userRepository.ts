import getDb from "../utils/db";
import type { LoginType } from "../types/Login";

const db = await getDb();

export default {
  async getUser(body: LoginType) {
    const { username } = body;
    const user = await db.collection("usuarios").findOne({ username });
    return user;
  },
  async createUser(body: LoginType) {
    try {
      const created = await db.collection("usuarios").insertOne(body);
      return created;
    } catch (error) {
      return error;
    }
  },
  async listUsers() {
    const usuarios = await db.collection("usuarios").find().toArray();
    return usuarios;
  },
};
