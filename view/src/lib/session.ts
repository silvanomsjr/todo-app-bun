import "server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

type jwtPayload = {
  payload: {
    exp: number;
    iat: number;
    user: {
      email: string;
      password: string;
      username: string;
      id: string;
    };
  };
};

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

export async function checkSession(): Promise<RequestCookie | null> {
  const serverCookies = await cookies();
  const sessionCookies = serverCookies.get("session");

  if (sessionCookies) {
    const valid = await validateToken(sessionCookies?.value);
    if (!valid) {
      return null;
    }
    return sessionCookies;
  }

  return null;
}

export async function deleteSession() {
  try {
    (await cookies()).delete("session");
  } catch (err) {
    return err;
  }
  return null;
}

export async function getSessionUsername(): Promise<string | null> {
  const serverCookies = (await cookies()).get("session");
  const secretKey = new TextEncoder().encode(process.env.SECRET_JWT);
  if (serverCookies?.value) {
    const { payload }: jwtPayload = await jwtVerify(
      serverCookies.value,
      secretKey,
    );
    return payload?.user?.username;
  }
  return null;
}
