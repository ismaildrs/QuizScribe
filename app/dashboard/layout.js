"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function RootLayout({ children }) {
  const session = useSession();

  return (
    <div>
      {/* <header className="px-4 lg:px-6 h-14 flex items-center border-b dark:border-gray-700">
        <Link href="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold dark:text-white">Similan</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Button
            variant="ghost"
            className="text-sm font-medium dark:text-gray-300"
          >
            Analytics
          </Button>
          {session.data && (
            <Avatar>
              <AvatarImage src={session.data.user.image} alt="User" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          )}
        </nav>
      </header> */}
      {children}
    </div>
  );
}
