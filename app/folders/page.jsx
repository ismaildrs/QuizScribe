"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { themeContext } from "@/lib/Contexts";
import { Folder, Plus, Search, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function FoldersPage() {
  const router = useRouter();
  const { theme, setTheme } = useContext(themeContext);
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  useEffect(() => {
    async function fetchFolders() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/folders");
        if (!res.ok) {
          throw new Error("Failed to fetch folders");
        }
        const data = await res.json();
        setFolders(data);
      } catch (err) {
        setError("An error occurred while fetching folders.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchFolders();
  }, []);

  const handleFolderClick = (folderId) => {
    router.push(`/folders/${folderId}`);
  };

  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent message={error} />;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Folder className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                FolderApp
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a
                className="transition-colors hover:text-foreground/80 text-foreground"
                href="/folders"
              >
                Folders
              </a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search folders and videos..."
                  className="pl-8"
                  type="search"
                />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="@user"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? "Light" : "Dark"} mode
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Your Folders</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Folder
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Folders</CardTitle>
            <CardDescription>
              Select a folder to view its contents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {folders.map((folder) => (
                  <Button
                    key={folder.id}
                    onClick={() => handleFolderClick(folder.id)}
                    variant="outline"
                    className="h-auto flex flex-col items-start justify-between w-full p-4 space-y-2"
                  >
                    <div className="flex items-center w-full">
                      <Folder className="mr-2 h-4 w-4" />
                      <span className="font-medium truncate">
                        {folder.name}
                      </span>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      {folder.videos?.length || 0} videos
                    </Badge>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function LoadingComponent() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <Skeleton className="h-10 w-[250px]" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full" />
        ))}
      </div>
    </div>
  );
}

function ErrorComponent({ message }) {
  return (
    <div className="container mx-auto p-6 text-center">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{message}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
