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
import { registerNewUser } from "@/actions/registerUser";
import { redirect } from "next/navigation";

const FormSchema = z.object({
  username: z
    .string()
    .min(4, {
      message: "Deve ter no mínimo 4 caracteres.",
    })
    .trim(),
  email: z.string().email("Insira um email válido."),
  password: z.string().trim().min(5, {
    message: "A senha deve conter no mínimo 5 caracteres.",
  }),
});
export default function CreateAccountForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { success, error } = await registerNewUser(data);
    if (!success) {
      const messages: {
        username: string;
        email: string;
        form: string;
      } = {
        username: "Username já está em uso",
        email: "Já existe uma conta com esse email",
        form: "Preencha todos os campos",
      };
      const key = Object.keys(error)[0];
      toast({
        title: "Erro",
        description: messages[key as keyof typeof messages],
        variant: "destructive",
      });
    }

    toast({
      title: "Sucesso",
      description: "Conta criada com sucesso!",
    });
    return redirect("/");
  }

  return (
    <div className="w-100 h-screen flex flex-col justify-center items-center">
      <h1 className="font-bold text-xl mb-5">Criar conta</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-96 space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" autoComplete="e-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input type="text" autoComplete="off" {...field} />
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
