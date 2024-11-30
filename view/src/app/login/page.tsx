"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";
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
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier);
      const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(data.identifier); // Exemplo de validação para username
      return isEmail || isUsername;
    },
    {
      message: "Insira um email ou username válido.",
      path: ["identifier"],
    },
  );
export default function InputForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  function onSubmit() {
    toast({
      title: "Login realizado",
    });
  }

  return (
    <div className="w-100 h-screen flex justify-center items-center">
      <h1>Criar conta</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-96 space-y-6"
        >
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email ou Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    autoComplete="loginSilvanoApp"
                    {...field}
                  />
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
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Confirmar</Button>
        </form>
      </Form>
    </div>
  );
}
