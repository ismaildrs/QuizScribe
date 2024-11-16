"use client";
import ShimmerButton from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import WordPullUp from "@/components/ui/word-pull-up";
import FlickeringGrid from "@/components/ui/flickering-grid";
import OrbitingCircles from "@/components/ui/orbiting-circles";
import { useSession } from "next-auth/react";

export default function Component() {
  const [videoUrl, setVideoUrl] = useState("");
  const [toggle, setToggle] = useState(true);
  const session = useSession();

  return (
    <div className="flex flex-col  ">
      <header className="px-4 lg:px-6 h-14 flex items-center z-50 ">
        <Link href="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold">Similan</span>
        </Link>
        {toggle ? (
          <>
            <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
              <Link
                href="#features"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Pricing
              </Link>
              {!session ? (
                <Button variant="outline" className="flex items-center gap-2">
                  <Link href="/login">Sign in with Google</Link>
                </Button>
              ) : (
                <Button variant="outline" className="flex  items-center gap-2 ">
                  <Link href="/profile" className="flex items-center gap-2">
                    <img
                      src={session.data.user.image}
                      className="w-8 rounded-full"
                    />
                    <span>Dashboard</span>
                  </Link>
                </Button>
              )}
            </nav>
          </>
        ) : (
          <></>
        )}
      </header>
      <main className="flex-1 flex flex-col justify-center ">
        <section className="h-screen py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col gap-10 items-center">
          <FlickeringGrid
            className="-z-50 absolute inset-0 h-full"
            squareSize={4}
            gridGap={6}
            color="#ECECEC"
            maxOpacity={0.5}
            flickerChance={0.1}
          />
          <div className="container px-4 md:px-6 flex flex-col gap-10  ">
            <div className="flex flex-col gap-4 items-center space-y-4 text-center">
              <div className="space-y-2 flex flex-col gap-3">
                <WordPullUp
                  words="Transform Video Content into Interactive Learning"
                  className={
                    "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                  }
                />
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Convert YouTube videos into flashcards, summaries, and quizzes
                  instantly with AI-powered learning tools.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Paste your YouTube video URL"
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1 bg-white"
                  />
                  <Button type="submit">Transform</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Start learning smarter with Similan's AI-powered video
                  transformation
                </p>
              </div>
            </div>
            <div className="mt-16 flex justify-center">
              <div className="relative w-full max-w-2xl">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 0, 1], scale: [1, 0.8, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
                    className="h-24 w-24 text-red-600"
                  />
                </motion.div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [1.2, 1, 1.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 w-32 rounded-lg bg-primary/20 p-4">
                      <div className="h-2 w-20 rounded bg-primary/40" />
                      <div className="mt-2 h-2 w-16 rounded bg-primary/40" />
                    </div>
                    <div className="h-20 w-32 rounded-lg bg-primary/20 p-4">
                      <div className="h-2 w-20 rounded bg-primary/40" />
                      <div className="mt-2 h-2 w-16 rounded bg-primary/40" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted flex flex-col items-center z-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Flashcards
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Interactive Learning Cards
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Our AI transforms video content into bite-sized flashcards,
                  making learning more engaging and effective.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Summaries
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Comprehensive Summaries
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Get concise summaries of video content, perfect for quick
                  review and reference.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Transcript
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"></h2>
                <p className="text-muted-foreground md:text-xl">
                  Get concise summaries of video content, perfect for quick
                  review and reference.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 Similan. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
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
