"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      redirect("/dashboard");
    }
  }, [session]);

  // Show loading state while checking session
  if (status === "loading") {
    return null;
  }

  const PageWrapper = ({ children }) => (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="flex items-center px-4 lg:px-6 h-14">
        <Link href="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold">QuizScribe</span>
        </Link>
      </header>
      <main className="flex items-center justify-center flex-1 p-4">
        <Card className="w-full max-w-md">{children}</Card>
      </main>
    </div>
  );

  if (session) {
    return (
      <PageWrapper>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">
            Welcome, {session.user.name}!
          </CardTitle>
          <CardDescription>You're logged in to your account</CardDescription>
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
            <Link href="/dashboard" passHref>
              <Button className="w-full" variant="outline">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
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
    </PageWrapper>
  );
}
