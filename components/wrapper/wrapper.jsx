"use client";

import { themeContext } from "@/lib/Contexts";
import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

export default function Wrapper({ children }) {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const themeVar = localStorage.getItem("theme");
    const accTheme = !themeVar ? "light" : themeVar;
    setTheme(accTheme);
    localStorage.setItem("theme", accTheme);
  }, []);

  const toggleTheme = () => {
    const accTheme = theme === "dark" ? "light" : "dark";
    setTheme(accTheme);
    localStorage.setItem("theme", accTheme);
  };

  return (
    <themeContext.Provider value={{ theme, setTheme }}>
      {children}
      <div className="fixed z-50 bottom-0 right-0 p-5 w-fit">
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full h-10 w-10 shadow-lg ${
            theme === "dark"
              ? "bg-white hover:bg-gray-200"
              : "bg-gray-900 hover:bg-gray-800"
          }`}
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Moon className="h-8 w-8 text-white" />
          ) : (
            <Sun className="h-8 w-8 text-black" />
          )}
        </Button>
      </div>
    </themeContext.Provider>
  );
}
