"use client";

import { useState, useEffect, useContext, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Folder,
  Plus,
  Search,
  Settings,
  Play,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { themeContext } from "@/lib/Contexts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

const Header = ({ theme, setTheme }) => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center space-x-2">
          <Folder className="h-6 w-6" />
          <span className="font-bold">Video Library</span>
        </Link>
        <div className="hidden md:flex md:w-[200px] lg:w-[300px]">
          <Input
            placeholder="Search videos..."
            className="w-full"
            type="search"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <UserMenu />
      </div>
    </div>
  </header>
);

const UserMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <User className="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Settings className="mr-2 h-4 w-4" /> Settings
      </DropdownMenuItem>
      <DropdownMenuItem>Sign Out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Update in the previous file (FolderDetailsPage)
const VideoCard = ({ video }) => {
  const router = useRouter();

  return (
    <Card key={video.id} className="overflow-hidden">
      <div
        className="relative aspect-video w-full cursor-pointer"
        onClick={() => router.push(`/videos/${video.id}`)}
      >
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover hover:opacity-90 transition-opacity"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-secondary flex items-center justify-center">
            <Play className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute bottom-2 right-2">
          <Badge
            variant="secondary"
            className="bg-background/80 backdrop-blur-sm"
          >
            {video.duration || "00:00"}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{video.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {video.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {new Date(video.createdAt).toLocaleDateString()}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/videos/${video.id}`)}
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const VideoList = ({ videos }) => (
  <ScrollArea className="h-[calc(100vh-300px)] pr-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos?.length === 0 ? (
        <div className="col-span-full">
          <p className="text-center text-muted-foreground py-8">
            No videos in this folder yet.
          </p>
        </div>
      ) : (
        videos?.map((video) => <VideoCard key={video.id} video={video} />)
      )}
    </div>
  </ScrollArea>
);

const LoadingComponent = () => (
  <div className="container mx-auto p-6 space-y-8">
    <Skeleton className="h-10 w-[250px]" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

const ErrorComponent = ({ message }) => (
  <div className="container mx-auto p-6 text-center">
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button onClick={() => window.location.reload()}>Try Again</Button>
    </div>
  </div>
);

export default function FolderDetailsPage({ params }) {
  const router = useRouter();
  const { theme, setTheme } = useContext(themeContext);
  const [folder, setFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolvedParams = use(params);
  const folderId = resolvedParams.id;

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  useEffect(() => {
    const fetchFolderDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/folders/${folderId}`);
        if (!res.ok) throw new Error("Failed to fetch folder details");
        const data = await res.json();
        setFolder(data);
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFolderDetails();
  }, [folderId]);

  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent message={error} />;

  return (
    <div className="min-h-screen bg-background">
      <Header theme={theme} setTheme={setTheme} />
      <main className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/folders")}
              className="p-0 h-auto"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {folder?.name || "Folder Details"}
            </h1>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Video
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Videos</CardTitle>
            <CardDescription>
              Videos in {folder?.name || "this folder"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VideoList videos={folder?.videos} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
