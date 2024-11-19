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
import {
  Folder,
  ChevronRight,
  User,
  Plus,
  Loader2,
  FolderRoot,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoadingComponent from "@/components/ui/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { themeContext } from "@/lib/Contexts";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
  const { theme } = useContext(themeContext);
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
  const [errorMessage, setErrorMessage] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState({});
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const session = useSession();
  const router = useRouter();

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
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
      } else {
        const errorData = await response.json();
        showError(errorData.message || "Failed to fetch video information");
        setIsLoading(false);
      }
    } catch (e) {
      showError("An error occurred while fetching video information");
      setIsLoading(false);
    }
  };

  const handlePrompt = async () => {
    if (!selectedFolderId) {
      showError("Please select a folder to save the video");
      return;
    }

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
          folderId: selectedFolderId,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setResult(result);
        setIsProcessing(false);
        setIsComplete(true);
      } else {
        const errorData = await response.json();
        showError(errorData.message || "Failed to process video");
        setIsProcessing(false);
      }
    } catch (e) {
      showError("An error occurred while processing the video");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch("/api/folders", { method: "GET" });
        if (response.ok) {
          const result = await response.json();
          setFolders(result);
        } else {
          const errorData = await response.json();
          showError(errorData.message || "Failed to fetch folders");
        }
      } catch (e) {
        showError("An error occurred while fetching folders");
      }
    };

    const analyzeUrl = async () => {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      const videoId = params.get("v");
      if (videoId) {
        setVideoUrl("https://www.youtube.com/watch?v=" + videoId);
        setVideoId(videoId);
        setTransformDialog(true);
        await handleTransform(videoId);
      }
    };

    fetchFolders();
    analyzeUrl();
  }, []);

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  if (!session || !session.data) return <LoadingComponent />;

  const addFolder = async () => {
    if (newFolderName.trim() !== "") {
      try {
        const response = await fetch("/api/folders/create", {
          method: "POST",
          body: JSON.stringify({
            name: newFolderName,
          }),
        });

        if (response.ok) {
          const newFolder = await response.json();
          setFolders([...folders, newFolder]);
          setNewFolderName("");
        } else {
          const errorData = await response.json();
          showError(errorData.message || "Failed to create folder");
        }
      } catch (e) {
        showError("An error occurred while creating the folder");
      }
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen ${theme === "dark" ? "dark" : ""}`}
    >
      {/* Error Alert */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 w-full max-w-md">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </div>
      )}

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
                <div className="space-y-3 w-full">
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
                    <>
                      <div className="space-y-2">
                        <Select
                          onValueChange={(value) => setSelectedFolderId(value)}
                          value={selectedFolderId || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a folder" />
                          </SelectTrigger>
                          <SelectContent>
                            {folders.map((folder) => (
                              <SelectItem key={folder.id} value={folder.id}>
                                {folder.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex my-2 space-x-2 items-center">
                        <Input
                          placeholder="What do you want to focus on?"
                          value={videoPrompt}
                          onChange={(e) => setVideoPrompt(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={handlePrompt}
                          disabled={!selectedFolderId}
                        >
                          Prompt
                        </Button>
                      </div>
                    </>
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
                      <p>{result.savedVideo.flashcards?.length} Flashcards</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quizzes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{result.savedVideo.quizzes?.length} Quiz questions</p>
                    </CardContent>
                  </Card>
                </div>
                <Button asChild>
                  <Link href={`/dashboard/${videoId}`}>
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
                {folders.map((folder, key) => (
                  <Button
                    key={key}
                    variant="outline"
                    className={`w-full justify-start text-left ${
                      selectedFolder === folder.id ? "bg-muted" : ""
                    } dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600`}
                    onClick={() => router.push(`/folders/${folder.id}`)}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    {folder.name}
                    <span className="ml-auto"></span>
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
