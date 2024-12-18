import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ShimmerButton from "@/components/ui/shimmer-button";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/wrapper/wrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "QuizScribe",
  description: "Youtube video to course",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Wrapper>{children}</Wrapper>
        </body>
      </SessionProvider>
    </html>
  );
}
