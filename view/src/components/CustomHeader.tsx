"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { logoutUser } from "@/actions/auth";
import ThemeToggler from "@/components/ThemeToggler";
import { redirect } from "next/navigation";
import { CircleEllipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
} from "@/components/ui/dropdown-menu";

export default function CustomHeader({ username }: { username: string }) {
  return (
    <header className="w-100 bg-gray-100 dark:bg-[#0b0b0e] flex py-4 px-12 justify-between items-center">
      <Image
        src="/logo.svg"
        width={80}
        height={80}
        alt="Logo"
        onClick={() => redirect("/")}
      />
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <CircleEllipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Opções ({username})</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <ThemeToggler />
            </DropdownMenuSub>
            <DropdownMenuItem>
              <Button className="w-full" onClick={logoutUser}>
                Sair
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
