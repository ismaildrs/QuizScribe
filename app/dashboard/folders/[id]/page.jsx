"use client";

import { useState, useEffect, useContext, use } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Plus, Play } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorDialog from "@/components/ui/errorDialog";

// Update in the previous file (FolderDetailsPage)
const VideoCard = ({ video }) => {
  const router = useRouter();

  return (
    <Card key={video.id} className="overflow-hidden">
      <div
        className="relative aspect-video w-full cursor-pointer"
        onClick={() => router.push(`/dashboard/videos/${video.id}`)}
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
            onClick={() => router.push(`/dashboard/videos/${video.id}`)}
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


export default function FolderDetailsPage({ params }) {
  const router = useRouter();
  const { theme, setTheme } = useContext(themeContext);
  const [folder, setFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const resolvedParams = useParams();
  const folderId = resolvedParams.id;

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

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
        console.log(data);
        setFolder(data);
      } catch (err) {
        showError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFolderDetails();
  }, [folderId]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className="min-h-screen bg-background">
      {errorMessage && <ErrorDialog message={errorMessage} />}
      <main className="container mx-auto p-6 space-y-8 ">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/dashboard/folders");
              }}
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

        <Card className={""}>
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
