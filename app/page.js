"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Youtube } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShimmerButton from "@/components/ui/shimmer-button";
import WordPullUp from "@/components/ui/word-pull-up";
import FlickeringGrid from "@/components/ui/flickering-grid";
import OrbitingCircles from "@/components/ui/orbiting-circles";
import { themeContext } from "@/lib/Contexts";

export default function Component() {
  const { theme, setTheme } = useContext(themeContext);
  const [videoUrl, setVideoUrl] = useState("");
  const session = useSession();
  const [bgColor, setBgColor] = useState("");
  const [subBgColor, setSubBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [animationColor, setAnimationColor] = useState("");

  useEffect(() => {
    if (theme === "dark") {
      setBgColor("bg-slate-950");
      setSubBgColor("bg-slate-900");
      setTextColor("text-white");
      setAnimationColor("#717171");
    } else {
      setBgColor("bg-white");
      setSubBgColor("bg-zinc-50");
      setTextColor("text-black");
      setAnimationColor("#ECECEC");
    }
  }, [theme]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`flex flex-col ${textColor}`}>
      <div className={`fixed inset-0 -z-20 ${bgColor}`}></div>
      <FlickeringGrid
        className="-z-10 fixed inset-0"
        squareSize={4}
        gridGap={6}
        color={animationColor}
        maxOpacity={0.3}
        flickerChance={0.1}
      />
      <header
        className={`sticky top-0 px-4 lg:px-6 h-14 flex items-center z-50 bg-opacity-60 backdrop-blur-sm`}
      >
        <Link href="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold">Similan</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Button variant="ghost" onClick={() => scrollToSection("features")}>
            Features
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection("how-it-works")}
          >
            How It Works
          </Button>
          <Button variant="ghost" onClick={() => scrollToSection("pricing")}>
            Pricing
          </Button>
          {session && session.data ? (
            <Button variant="outline" className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2 text-black" >
                <img
                  src={session.data.user.image}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span>Dashboard</span>
              </Link>
            </Button>
          ) : (
            <Button variant="outline">
              <Link href="/login">Sign in with Google</Link>
            </Button>
          )}
        </nav>
      </header>
      <main className="flex-1 flex flex-col justify-center items-center">
        <section className="min-h-screen py-12 lg:py-24 xl:py-32 flex flex-col gap-10 items-center">
          <div className="container px-4 md:px-6 flex flex-col gap-10">
            <div className="flex flex-col gap-4 items-center text-center">
              <WordPullUp
                words="Transform Video Content into Interactive Learning"
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
              />
              <p className={`mx-auto max-w-[700px] md:text-xl ${textColor}`}>
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
                    className={`flex-1 bg-white text-black  `}
                  />
                  <Button type="submit">Transform</Button>
                </div>
                <p className={`text-xs ${textColor} opacity-70`}>
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
        <section
          id="features"
          className={`w-full py-12 md:py-24 lg:py-32 ${subBgColor} flex flex-col items-center`}
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-3">
              {["Flashcards", "Summaries", "Quizzes"].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                    {feature}
                  </div>
                  <h3 className="text-2xl font-bold">{feature}</h3>
                  <p className={`${textColor} opacity-70`}>
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
          className={`w-full py-12 md:py-24 lg:py-32 ${bgColor} flex flex-col items-center`}
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
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
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-xl">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="pricing"
          className={`w-full py-12 md:py-24 lg:py-32 ${subBgColor} flex flex-col items-center`}
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {["Basic", "Pro", "Enterprise"].map((plan, index) => (
                <motion.div
                  key={plan}
                  className={`p-6 rounded-lg ${bgColor} shadow-lg`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-2xl font-bold mb-4">{plan}</h3>
                  <ul className="space-y-2 mb-6">
                    <li>Feature 1</li>
                    <li>Feature 2</li>
                    <li>Feature 3</li>
                  </ul>
                  <ShimmerButton>Choose {plan}</ShimmerButton>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className={`py-6 px-4 md:px-6 border-t ${subBgColor}`}>
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className={`text-sm ${textColor} opacity-70`}>
            © 2024 Similan. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link
              href="#"
              className={`text-sm ${textColor} hover:underline underline-offset-4`}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className={`text-sm ${textColor} hover:underline underline-offset-4`}
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
