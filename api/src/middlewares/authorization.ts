import jwt from "jsonwebtoken";

export default function (req: Request) {
  const response = {
    message: "",
    status: 200,
  };
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    response.status = 401;
    response.message = "Token de autenticação necessário";
    return response;
  }

  try {
    if (!process.env.SECRET_JWT) {
      response.status = 403;
      response.message = "SECRET_JWT não está definido";
      return response;
    }
    jwt.verify(token, process.env.SECRET_JWT);
    return response;
  } catch (error) {
    response.status = 403;
    response.message = "Token inválido ou expirado";
    return response;
  }
}
