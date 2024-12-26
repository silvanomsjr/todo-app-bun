import userRepo from "../repositories/userRepository";
import bcrypt from "bcrypt";
import { validateFields, sendMail, customResponse } from "../utils";
import jwt from "jsonwebtoken";

export default {
  async authenticateUser(req: Request) {
    const userParams = await req.json();

    if (!userParams?.username && !userParams?.email) {
      return customResponse(
        {
          error: "É necessário email ou username para a autenticação",
        },
        {
          status: 400,
        },
      );
    }

    if (!userParams?.password) {
      return customResponse(
        { error: "É necessário inserir a senha" },
        {
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
      return customResponse(
        { error: "Usuário não existe no sistema!" },
        {
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
        return customResponse(
          { data: token },
          {
            status: 202,
          },
        );
      }
      return customResponse(
        {
          error: "SECRET_JWT não foi encontrado",
        },
        {
          status: 404,
        },
      );
    }

    return customResponse(
      { error: "Senha incorreta" },
      {
        status: 400,
      },
    );
  },
  async register(req: Request) {
    const { email, username, password } = await req.json();

    const fieldsValidation = validateFields(["email", "username", "password"], {
      email,
      username,
      password,
    });

    if (fieldsValidation.length > 0) {
      return customResponse(fieldsValidation, {
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
      return customResponse(result, {
        status: 400,
      });
    }
    return customResponse(
      { data: "Criado com sucesso" },
      {
        status: 200,
      },
    );
  },
  async getUsers() {
    const users = await userRepo.listUsers();
    return customResponse(users, {
      status: 200,
    });
  },
  async sendPasswordRecovery(req: Request) {
    const { email } = await req.json();

    if (!email) {
      return customResponse(
        {
          error: "Email é necessário para recuperação de senha",
        },
        {
          status: 400,
        },
      );
    }

    const user = await userRepo.getUser({ email });
    if (!user) {
      return customResponse(
        { error: "Esse email não possui conta" },
        {
          status: 400,
        },
      );
    }
    if (!process.env.SECRET_JWT) {
      return customResponse(
        { error: "SECRET_JWT não está definido" },
        {
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

    return customResponse(result, {
      status: result?.error ? 500 : 200,
    });
  },
  async resetPassword(req: Request) {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) {
      return customResponse({
        error: "Token ou password não estão presentes no body",
      });
    }

    try {
      if (!process.env.SECRET_JWT) {
        return customResponse(
          { error: "SECRET_JWT não está definido" },
          {
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
