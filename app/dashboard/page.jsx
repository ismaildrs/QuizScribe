"use client";

import { useState, useContext, useEffect } from "react";
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
import { Folder, ChevronRight, User, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoadingComponent from "@/components/ui/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { themeContext } from "@/lib/Contexts";

const initialFolders = [];

export default function Dashboard() {
  const { theme } = useContext(themeContext);
  const [folders, setFolders] = useState(initialFolders);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoImgUrl, setVideoImgUrl] = useState("");
  const [transformDialog, setTransformDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isError, setIsError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState({});
  const session = useSession();

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  if (!session || !session.data) return <LoadingComponent />;

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

  const handleTransform = async (id) => {
    if (!isProcessing) setIsLoading(true);
    else {
      return;
    }
    try {
      const response = await fetch(`/api/video?videoId=${id}`, {
        method: "GET",
      });
      if (response.ok) {
        const result = await response.json();
        setIsLoading(false);
        setIsImproving(true);
        setVideoTitle(result.title);
        setVideoImgUrl(result.thumbnail);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handlePrompt = async () => {
    setIsImproving(false);
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/upload`, {
        method: "POST",
        body: JSON.stringify({
          videoId: videoId,
          prompt: videoPrompt,
          title: videoTitle,
          url: videoUrl,
          thumbnail: videoImgUrl,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setResult(result);
        setIsProcessing(false);
        setIsComplete(true);
      }
    } catch (e) {
      // Handle error
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen ${theme === "dark" ? "dark" : ""}`}
    >
      <Dialog open={transformDialog} onOpenChange={setTransformDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Video Transformation</DialogTitle>
            <DialogDescription>
              {isLoading && "Fetching video information..."}
              {isProcessing && "Processing video content..."}
              {isComplete && "Transformation complete!"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {isLoading && <Loader2 className="w-8 h-8 animate-spin" />}
            {(isProcessing || isComplete || isImproving) &&
              videoImgUrl &&
              videoTitle && (
                <div className="space-y-3">
                  <div className="relative flex flex-col gap-2">
                    <img
                      src={videoImgUrl}
                      alt={videoTitle}
                      className="rounded-lg"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  {videoTitle && <p className="font-semibold">{videoTitle}</p>}
                  {isImproving && (
                    <div className="flex my-2 space-x-2 items-center">
                      <Input
                        placeholder="What do you want to focus on?"
                        value={videoPrompt}
                        onChange={(e) => setVideoPrompt(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handlePrompt}>Prompt</Button>
                    </div>
                  )}
                </div>
              )}
            {isComplete && result && (
              <>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Card>
                    <CardHeader>
                      <CardTitle>Flashcards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{result.flashCards?.length} Flashcards</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quizzes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{result.quizzes?.length} Quiz questions</p>
                    </CardContent>
                  </Card>
                </div>
                <Button asChild>
                  <Link href={`/content/${videoId}`}>
                    View Learning Materials
                  </Link>
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <header className="px-4 lg:px-6 h-14 flex items-center border-b dark:border-gray-700">
        <Link href="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold dark:text-white">Similan</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Button
            variant="ghost"
            className="text-sm font-medium dark:text-gray-300"
          >
            Analytics
          </Button>
          {session.data && (
            <Avatar>
              <AvatarImage src={session.data.user.image} alt="User" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          )}
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-6 space-y-6 dark:bg-gray-900">
        <Card className="dark:bg-gray-800">
          {session.data && (
            <>
              <CardHeader>
                <CardTitle className="dark:text-white">Profile</CardTitle>
                <CardDescription className="dark:text-gray-400">
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
                  <h2 className="text-2xl font-bold dark:text-white">
                    {session.data.user.name}
                  </h2>
                  <p className="text-muted-foreground dark:text-gray-400">
                    Learning enthusiast
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">
                    {session.data.user.email}
                  </p>
                </div>
              </CardContent>
            </>
          )}
        </Card>
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">
              Transform YouTube Video
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Enter a YouTube video link to transform it into interactive
              learning content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Paste YouTube video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 dark:bg-gray-700 dark:text-white"
              />
              <Button
                onClick={() => {
                  if (!videoUrl) return;
                  const url = new URL(videoUrl);
                  const id = url.searchParams.get("v");
                  setVideoId(id);
                  setTransformDialog(true);
                  if (!isComplete) handleTransform(id);
                }}
              >
                Transform
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Your Folders</CardTitle>
            <CardDescription className="dark:text-gray-400">
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
                  className="dark:bg-gray-700 dark:text-white"
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
                    } dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600`}
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
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t dark:border-gray-700 dark:bg-gray-800">
        <p className="text-xs text-muted-foreground dark:text-gray-400">
          © 2024 Similan. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 dark:text-gray-300"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 dark:text-gray-300"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
