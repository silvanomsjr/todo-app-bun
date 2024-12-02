"use server";
import { z, ZodTypeAny } from "zod";
import { isEmail } from "@/app/lib/utils";
import { decrypt, createSession } from "@/app/lib/session";
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
  const { data } = await response.json();
  if (data) {
    decrypt(data);
    await createSession(data);
    redirect("/");
  }
  console.log("faio")
  return { success: false };
}
