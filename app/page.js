"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WordPullUp from "@/components/ui/word-pull-up";
import FlickeringGrid from "@/components/ui/flickering-grid";
import { themeContext } from "@/lib/Contexts";
import LoadingComponent from "@/components/ui/Loading";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Component() {
  const { theme, setTheme } = useContext(themeContext);
  const [videoUrl, setVideoUrl] = useState("");
  const session = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  if (!session) return <LoadingComponent />;

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const extractVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes("youtube.com")) {
        return urlObj.searchParams.get("v");
      } else if (urlObj.hostname.includes("youtu.be")) {
        return urlObj.pathname.substring(1);
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  const handleTransform = () => {
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
      router.push(`/dashboard?v=${videoId}`);
    } else {
      // You might want to add error handling here
      alert("Please enter a valid YouTube URL");
    }
  };

  const NavLinks = ({ className = "" }) => (
    <>
      <Button
        variant="ghost"
        onClick={() => scrollToSection("features")}
        className={className}
      >
        Features
      </Button>
      <Button
        variant="ghost"
        onClick={() => scrollToSection("how-it-works")}
        className={className}
      >
        How It Works
      </Button>
    </>
  );

  return (
    <div className={`flex flex-col`}>
      <div className={`fixed inset-0 -z-20 `}></div>
      <FlickeringGrid
        className="fixed inset-0 -z-10"
        squareSize={4}
        gridGap={6}
        color={theme == "dark" ? "#3D3D3D" : "#D2D2D2"}
        maxOpacity={0.3}
        flickerChance={0.1}
      />
      <header
        className={`sticky top-0 px-4 lg:px-6 h-14 flex items-center z-50 bg-opacity-60 backdrop-blur-sm`}
      >
        <Link href="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold">QuizScribe</span>
        </Link>
        <nav className="flex items-center gap-4 ml-auto sm:gap-6">
          <div className="items-center hidden gap-4 lg:flex sm:gap-6">
            <NavLinks />
          </div>
          {session.data ? (
            <Button variant="outline" className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-black"
              >
                <span className="dark:text-white">Dashboard</span>
              </Link>
            </Button>
          ) : (
            <Button variant="outline">
              <Link href="/login">Sign in with Google</Link>
            </Button>
          )}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-4">
                <NavLinks className="justify-start w-full" />
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center flex-1">
        <section className="flex flex-col items-center min-h-screen gap-10 py-12 lg:py-24 xl:py-32">
          <div className="container flex flex-col gap-10 px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <WordPullUp
                words="Transform Video Content into Interactive Learning"
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
              />
              <p className={`mx-auto max-w-[700px] md:text-xl`}>
                Convert YouTube videos into flashcards, summaries, and quizzes
                instantly with AI-powered learning tools.
              </p>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Paste your YouTube video URL"
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className={`flex-1 bg-white text-black`}
                  />
                  <Button type="submit" onClick={handleTransform}>
                    Transform
                  </Button>
                </div>
                <p className={`text-xs opacity-70`}>
                  Start learning smarter with quizscribe's AI-powered video
                  transformation
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-16">
              <div className="relative w-full max-w-2xl">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 0, 1], scale: [1, 0.8, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
                    className="w-24 h-24 text-red-600"
                    alt="YouTube Logo"
                  />
                </motion.div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [1.2, 1, 1.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="w-32 h-20 p-4 rounded-lg bg-primary/20">
                      <div className="w-20 h-2 rounded bg-primary/40" />
                      <div className="w-16 h-2 mt-2 rounded bg-primary/40" />
                    </div>
                    <div className="w-32 h-20 p-4 rounded-lg bg-primary/20">
                      <div className="w-20 h-2 rounded bg-primary/40" />
                      <div className="w-16 h-2 mt-2 rounded bg-primary/40" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className={`w-full py-12 md:py-24 lg:py-32 flex flex-col items-center border-t bg-white dark:bg-zinc-950`}
        >
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-3xl font-bold text-center">Features</h2>
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-3">
              {["Flashcards", "Summaries", "Quizzes"].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="inline-block px-3 py-1 text-sm rounded-lg bg-primary text-primary-foreground">
                    {feature}
                  </div>
                  <h3 className="text-2xl font-bold">{feature}</h3>
                  <p className={`opacity-70`}>
                    Our AI transforms video content into {feature.toLowerCase()}
                    , making learning more engaging and effective.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className={`w-full py-12 md:py-24 lg:py-32 flex flex-col items-center bg-white border-t dark:bg-zinc-950`}
        >
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-3xl font-bold text-center">
              How It Works
            </h2>
            <div className="flex flex-col items-center gap-8">
              {[
                "Paste YouTube URL",
                "AI Processes Video",
                "Get Learning Materials",
              ].map((step, index) => (
                <motion.div
                  key={step}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="flex items-center justify-center w-10 h-10 font-bold rounded-full bg-primary text-primary-foreground">
                    {index + 1}
                  </div>
                  <p className="text-xl">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className={`py-6 px-4 md:px-6 border-t`}>
        <div className="container flex flex-col items-center justify-between mx-auto sm:flex-row">
          <p className={`text-sm opacity-70`}>
            © 2024 quizscribe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
