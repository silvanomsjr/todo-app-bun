import "server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function validateToken(token: string) {
  if (process.env.SECRET_JWT) {
    // return jwt.verify(token, process.env.SECRET_JWT);
    const secretKey = new TextEncoder().encode(process.env.SECRET_JWT);
    try {
      const jose = await jwtVerify(token, secretKey);
      return jose;
    } catch {
      return null;
    }
  }
  return null;
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

export async function checkSession(): Promise<RequestCookie | undefined> {
  const serverCookies = await cookies();
  const sessionCookies = serverCookies.get("session");

  if (sessionCookies) {
    const valid = await validateToken(sessionCookies?.value);
    if (!valid) {
      return undefined;
    }
    return sessionCookies;
  }

  return undefined;
}

export async function deleteSession() {
  try {
    (await cookies()).delete("session");
  } catch (err) {
    return err;
  }
  return null;
}
