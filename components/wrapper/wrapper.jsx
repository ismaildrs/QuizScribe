"use client";

import { themeContext } from "@/lib/Contexts";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

export default function Wrapper({ children }) {
  const [theme, setTheme] = useState();
  return (
    <themeContext.Provider value={{ theme, setTheme }}>
      {children}
      <div className="sticky z-50 bottom-5 right-5 w-fit">
        <Button
          className={"rounded-full p-4"}
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </Button>
      </div>
    </themeContext.Provider>
  );
}
