"use client";

import { getProviders, signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
        <header className="flex items-center px-4 lg:px-6 h-14">
          <Link href="/" className="flex items-center justify-center">
            <span className="text-2xl font-bold">quizscribe</span>
          </Link>
        </header>
        <main className="flex items-center justify-center flex-1 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold">
                Welcome, {session.user.name}!
              </CardTitle>
              <CardDescription>
                You're logged in to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              )}
              <div className="w-full space-y-2">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <footer className="flex flex-col items-center w-full gap-2 px-4 py-6 border-t sm:flex-row shrink-0 md:px-6">
          <p className="text-xs text-muted-foreground">
            © 2024 quizscribe. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:ml-auto sm:gap-6">
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
            >
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="flex items-center px-4 lg:px-6 h-14">
        <Link href="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold">quizscribe</span>
        </Link>
      </header>
      <main className="flex items-center justify-center flex-1 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue learning
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Button
              className="flex items-center justify-center w-full space-x-2"
              onClick={() => signIn("google")}
            >
              <span>
                <i className="mr-2 fa-brands fa-google"></i>Sign in with Google
              </span>
            </Button>
          </CardContent>
        </Card>
      </main>
      <footer className="flex flex-col items-center w-full gap-2 px-4 py-6 border-t sm:flex-row shrink-0 md:px-6">
        <p className="text-xs text-muted-foreground">
          © 2024 quizscribe. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
