"use client";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function RootLayout({ children }) {
  const session = useSession();

  return (
    <div>
      <Header/>
      {children}
    </div>
  );
}
