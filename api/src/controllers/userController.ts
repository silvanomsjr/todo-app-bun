import userRepo from "../repositories/userRepository";
import bcrypt from "bcrypt";
import validateFields from "../utils/validateFields";
import jwt from "jsonwebtoken";

export default {
  async authenticateUser(req: Request) {
    const userParams = await req.json();

    const fieldsValidation = validateFields(["username", "password"], {
      username: userParams?.username,
      password: userParams?.password,
    });

    if (fieldsValidation.length > 0) {
      return new Response(JSON.stringify(fieldsValidation), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const user = await userRepo.getUser(userParams);
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Usuário não existe no sistema!" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 404,
        },
      );
    }

    const saltedPassword =
      process.env.SECRET_BCRYPT_HASH + userParams?.password;

    const match = await bcrypt.compare(saltedPassword, user?.password);

    if (match) {
      if (process.env.SECRET_JWT) {
        const token = jwt.sign({ user }, process.env.SECRET_JWT, {
          expiresIn: "1h",
        });
        return new Response(JSON.stringify({ data: token }), {
          headers: { "Content-Type": "application/json" },
          status: 202,
        });
      }
      return new Response(
        JSON.stringify({
          error: "SECRET_JWT não foi encontrado",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 404,
        },
      );
    }

    return new Response(JSON.stringify({ error: "Senha incorreta" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  },
  async register(req: Request) {
    const { username, password } = await req.json();

    const fieldsValidation = validateFields(["username", "password"], {
      username,
      password,
    });

    if (fieldsValidation.length > 0) {
      return new Response(JSON.stringify(fieldsValidation), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const passWithSecret = process.env.SECRET_BCRYPT_HASH + password;

    const hashed = await bcrypt.hash(passWithSecret, 10);

    const result: any = await userRepo.createUser({
      username,
      password: hashed,
    });

    if (result?.errorResponse) {
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }
    return new Response(JSON.stringify({ data: "Criado com sucesso" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  },
  async getUsers() {
    const usuarios = await userRepo.listUsers();
    return new Response(JSON.stringify(usuarios), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  },
};
