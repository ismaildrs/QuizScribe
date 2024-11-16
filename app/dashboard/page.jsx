"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Folder, ChevronRight, User, Plus } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const initialFolders = [];

export default function Dashboard() {
  const [folders, setFolders] = useState(initialFolders);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const session = useSession();

  const addFolder = () => {
    if (newFolderName.trim() !== "") {
      const newFolder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        items: 0,
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold">Similan</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Button variant="ghost" className="text-sm font-medium">
            Dashboard
          </Button>
          <Button variant="ghost" className="text-sm font-medium">
            Analytics
          </Button>
          <Avatar>
            <AvatarImage src={session.data.user.image}  alt="User" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Card>
          {session && session.data && (
            <>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Your learning progress and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session.data.user.image} alt="User" />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">
                    {session.data.user.name}
                  </h2>
                  <p className="text-muted-foreground">Learning enthusiast</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {session.data.user.email}
                  </p>
                </div>
              </CardContent>
            </>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Folders</CardTitle>
            <CardDescription>
              Click on a folder to view its contents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="New folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <Button onClick={addFolder}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Folder
                </Button>
              </div>
              <div className="grid gap-4">
                {folders.map((folder) => (
                  <Button
                    key={folder.id}
                    variant="outline"
                    className={`w-full justify-start text-left ${
                      selectedFolder === folder.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedFolder(folder.id)}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    {folder.name}
                    <span className="ml-auto">{folder.items} items</span>
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
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
