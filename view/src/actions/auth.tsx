"use server";
import { z, ZodTypeAny } from "zod";
import { isEmail } from "@/lib/utils";
import { checkSession, createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function authenticateUser(form: z.infer<ZodTypeAny>) {
  const realObj = isEmail(form?.identifier)
    ? {
        email: form?.identifier,
        password: form?.password,
      }
    : {
        username: form?.identifier,
        password: form?.password,
      };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    body: JSON.stringify(realObj),
  });
  const actualResponse = await response.json();
  const { data, error } = actualResponse;
  if (data) {
    await createSession(data);
    redirect("/");
  }
  return { success: false, error };
}

export async function logoutUser() {
  const session = await checkSession();
  if (session) {
    const deleting = await deleteSession();
    if (deleting == null) {
      redirect("/login");
    }
  }
  return;
}
