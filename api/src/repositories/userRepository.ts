import getDb from "../utils/db";
import type { LoginType } from "../types/Login";

const db = await getDb();

export default {
  async getUser({ email, username }: Record<string, string>) {
    const realObj: Record<string, string> = {};
    if (email && email?.length > 0) {
      realObj.email = email;
    }
    if (username && username.length > 0) {
      realObj.username = username;
    }
    const user = await db.collection("usuarios").findOne(realObj);
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
    const users = await db.collection("usuarios").find().toArray();
    return users;
  },
  async updatePassword(email: string, newPassword: string) {},
};
