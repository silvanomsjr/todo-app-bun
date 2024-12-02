import "server-only";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function decrypt(token: string) {
  if (process.env.SECRET_JWT) {
    const verifying = jwt.verify(token, process.env.SECRET_JWT);
    console.log("verifying: ", verifying);
  }
}

export async function createSession(token: string) {
  const serverCookies = await cookies();
  serverCookies.set("session", token, {
    maxAge: 60 * 60,
    httpOnly: true,
    secure: true,
    path: "/",
  });
}
