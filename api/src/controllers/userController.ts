import userRepo from "../repositories/userRepository";
import bcrypt from "bcrypt";
import { validateFields, sendMail } from "../utils";
import jwt from "jsonwebtoken";

export default {
  async authenticateUser(req: Request) {
    const userParams = await req.json();

    if (!userParams?.username && !userParams?.email) {
      return new Response(
        JSON.stringify({
          error: "É necessário email ou username para a autenticação",
        }),
        {
          headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Content-Type": "application/json",
          },
          status: 400,
        },
      );
    }

    if (!userParams?.password) {
      return new Response(
        JSON.stringify({ error: "É necessário inserir a senha" }),
        {
          headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Content-Type": "application/json",
          },
          status: 400,
        },
      );
    }

    const getUserBy: Record<string, string> = {};
    if (userParams?.username) {
      getUserBy.username = userParams?.username;
    }

    if (userParams?.email) {
      getUserBy.email = userParams?.email;
    }

    const user = await userRepo.getUser(getUserBy);
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Usuário não existe no sistema!" }),
        {
          headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Content-Type": "application/json",
          },
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
          headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Content-Type": "application/json",
          },
          status: 202,
        });
      }
      return new Response(
        JSON.stringify({
          error: "SECRET_JWT não foi encontrado",
        }),
        {
          headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Content-Type": "application/json",
          },
          status: 404,
        },
      );
    }

    return new Response(JSON.stringify({ error: "Senha incorreta" }), {
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      status: 400,
    });
  },
  async register(req: Request) {
    const { email, username, password } = await req.json();

    const fieldsValidation = validateFields(["email", "username", "password"], {
      email,
      username,
      password,
    });

    if (fieldsValidation.length > 0) {
      return new Response(JSON.stringify(fieldsValidation), {
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Content-Type": "application/json",
        },
        status: 400,
      });
    }

    const passWithSecret = process.env.SECRET_BCRYPT_HASH + password;

    const hashed = await bcrypt.hash(passWithSecret, 10);

    const result: any = await userRepo.createUser({
      email,
      username,
      password: hashed,
    });

    if (result?.errorResponse) {
      return new Response(JSON.stringify(result), {
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Content-Type": "application/json",
        },
        status: 400,
      });
    }
    return new Response(JSON.stringify({ data: "Criado com sucesso" }), {
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      status: 200,
    });
  },
  async getUsers() {
    const users = await userRepo.listUsers();
    return new Response(JSON.stringify(users), {
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      status: 200,
    });
  },
  async sendPasswordRecovery(req: Request) {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({
          error: "Email é necessário para recuperação de senha",
        }),
        {
          headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Content-Type": "application/json",
          },
          status: 400,
        },
      );
    }

    const user = await userRepo.getUser({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Esse email não possui conta" }),
        {
          headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Content-Type": "application/json",
          },
          status: 400,
        },
      );
    }
    if (!process.env.SECRET_JWT) {
      return new Response(
        JSON.stringify({ error: "SECRET_JWT não está definido" }),
        {
          headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Content-Type": "application/json",
          },
          status: 403,
        },
      );
    }

    const token = jwt.sign({ user }, process.env.SECRET_JWT, {
      expiresIn: "1h",
    });

    const mailMessage = `Aqui está o link para recuperar a sua senha: ${process.env.API_URI}/reset-password?token=${token}`;

    const result = await sendMail(
      user?.email,
      "Recuperação de senha",
      mailMessage,
    );

    return new Response(JSON.stringify(result), {
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Content-Type": "application/json",
      },
      status: result?.error ? 500 : 200,
    });
  },
  async resetPassword(req: Request) {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) {
      return new Response(
        JSON.stringify({
          error: "Token ou password não estão presentes no body",
        }),
      );
    }

    try {
      if (!process.env.SECRET_JWT) {
        return new Response(
          JSON.stringify({ error: "SECRET_JWT não está definido" }),
          {
            headers: {
              "Access-Control-Allow-Headers": "*",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Content-Type": "application/json",
            },
            status: 403,
          },
        );
      }

      jwt.verify(token, process.env?.SECRET_JWT);
    } catch (error) {
      console.log("erro: ", error);
    }
  },
};
