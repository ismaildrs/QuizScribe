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
import { Input } from "@/components/ui/input";
import { themeContext } from "@/lib/Contexts";
import { Folder, Plus, Search, Settings } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorDialog from "@/components/ui/errorDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function FoldersPage() {
  const router = useRouter();
  const { theme, setTheme } = useContext(themeContext);
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

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
        showError("An error occurred while fetching folders.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchFolders();
  }, []);

  const handleFolderClick = (folderId) => {
    router.push(`/dashboard/folders/${folderId}`);
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim() === "") {
      showError("Folder name cannot be empty.");
      return;
    }

    try {
      const res = await fetch("/api/folders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newFolderName }),
      });

      if (!res.ok) {
        throw new Error("Failed to create folder");
      }

      const resp = await res.json();
      setFolders([...folders, resp.folder]);
      setNewFolderName("");
      setIsDialogOpen(false);
    } catch (err) {
      showError("An error occurred while creating the folder.");
    }
  };

  if (isLoading) return <LoadingComponent />;

  return (
    <div className="min-h-screen bg-background">
      {errorMessage && <ErrorDialog message={errorMessage} />}
      <main className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Your Folders</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>
                  Enter a name for your new folder.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <DialogFooter>
                <Button variant="outline" onClick={async () => await handleCreateFolder()}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFolder}>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

