"use client";
import React from "react";
import { User } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (session.status === "loading") {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b h-14">
          <Skeleton className="w-full h-full" />
        </header>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex items-center px-4 border-b bg-white dark:bg-black lg:px-6 h-14  dark:border-gray-700">
      <Link
        href="/dashboard"
        className="flex items-center justify-center transition-opacity hover:opacity-80"
        aria-label="Go to dashboard"
      >
        <span className="text-2xl font-bold dark:text-white">QuizScribe</span>
      </Link>
      <nav
        className="flex items-center gap-4 ml-auto sm:gap-6"
        role="navigation"
        aria-label="User navigation"
      >
        {session.status === "authenticated" && session.data && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-blue-500"
                aria-label="Open user menu"
              >
                <Avatar>
                  <AvatarImage
                    src={session.data.user?.image || ""}
                    alt={session.data.user?.name || "User avatar"}
                  />
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                {session.data.user?.name || "My Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>
    </header>
  );
}
