"use client";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/actions/auth";
import ThemeToggler from "@/components/ThemeToggler";

export default function CustomHeader() {
  return (
    <header className="w-100 bg-gray-100 dark:bg-[#0b0b0e] flex p-5 justify-between items-center">
      <h1>Header</h1>
      <Button onClick={logoutUser}>Sair</Button>
      <ThemeToggler />
    </header>
  );
}
