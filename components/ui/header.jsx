"use client";
import React from "react";

import { User } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "./skeleton";

export default function Header() {
  const session = useSession();

  if (!session)
    return (
      <div className="flex flex-col min-h-screen">
        <header className="h-14 border-b">
          <Skeleton className="h-full w-full" />
        </header>
      </div>
    );
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b dark:border-gray-700">
      <Link href="/dashboard" className="flex items-center justify-center">
        <span className="text-2xl font-bold dark:text-white">QuizScribe</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        {session.data && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src={session.data.user.image} alt="User" />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>
    </header>
  );
}
