"use server";
import { z, ZodTypeAny } from "zod";

type RegisterFuncT = {
  success: boolean;
  error: {
    [key: string]: string;
  };
};

export async function registerNewUser(
  form: z.infer<ZodTypeAny>,
): Promise<RegisterFuncT> {
  if (form?.email && form?.password && form?.password) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      },
    );
    const { errorResponse } = await response.json();
    if (errorResponse) {
      return { success: false, error: errorResponse?.keyValue };
    }

    return { success: true, error: errorResponse };
  }
  return { success: false, error: { form: "Formulário inválido" } };
}
