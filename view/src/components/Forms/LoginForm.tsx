"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { isEmail, isUsername } from "@/app/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { authenticateUser } from "@/app/actions/auth";

const FormSchema = z
  .object({
    identifier: z
      .string()
      .min(4, {
        message: "Deve ter no mínimo 4 caracteres.",
      })
      .trim(),
    password: z.string().trim().min(5, {
      message: "A senha deve conter no mínimo 5 caracteres.",
    }),
  })
  .refine(
    (data) => {
      const email = isEmail(data.identifier);
      const username = isUsername(data.identifier);
      return email || username;
    },
    {
      message: "Insira um email ou username válido.",
      path: ["identifier"],
    },
  );

export default function CustomForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(authenticateUser)}
        className="w-full max-w-96 space-y-6"
      >
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email ou Username</FormLabel>
              <FormControl>
                <Input type="text" autoComplete="loginSilvanoApp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>"Senha"</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Entrar</Button>
      </form>
    </Form>
  );
}
