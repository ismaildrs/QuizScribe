"use client";

import { useState, useEffect, useContext, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Play,
  BookOpen,
  Brain,
  List,
  MessageSquare,
  Folder,
  Plus,
  Search,
  Settings,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const VideoDetails = ({ video }) => (
  <Card className="mb-6">
    <div className="relative aspect-video w-full max-w-md mx-auto">
      {" "}
      {/* Reduced max width */}
      {video?.thumbnail ? (
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      ) : (
        <div className="absolute inset-0 bg-secondary flex items-center justify-center rounded-t-lg">
          <Play className="h-12 w-12 text-muted-foreground" />{" "}
          {/* Adjusted Play icon size */}
        </div>
      )}
    </div>
    <CardHeader>
      <CardTitle className="text-xl">{video?.title}</CardTitle>{" "}
      {/* Slightly reduced title size */}
      <CardDescription className="text-muted-foreground">
        {new Date(video?.createdAt).toLocaleDateString()}
      </CardDescription>
    </CardHeader>
  </Card>
);

const FlashCards = ({ cards = [] }) => {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleCard = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={`cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
            flippedCards[index] ? "bg-accent" : ""
          }`}
          onClick={() => toggleCard(index)}
        >
          <CardHeader>
            <CardTitle className="text-lg">
              {flippedCards[index] ? "Answer" : "Question"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {flippedCards[index] ? card.answer : card.question}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const Quiz = ({ questions = [] }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const getScore = () => {
    return Object.entries(selectedAnswers).reduce(
      (score, [questionIndex, answer]) => {
        return (
          score + (answer === questions[questionIndex].correctAnswer ? 1 : 0)
        );
      },
      0,
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {questions.map((question, questionIndex) => (
        <Card key={questionIndex}>
          <CardHeader>
            <CardTitle className="text-lg">
              Question {questionIndex + 1}: {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <Button
                key={optionIndex}
                variant={
                  selectedAnswers[questionIndex] === optionIndex
                    ? "default"
                    : "outline"
                }
                className={`w-full justify-start text-left ${
                  showResults
                    ? optionIndex === question.correctAnswer
                      ? "bg-green-500 hover:bg-green-600"
                      : selectedAnswers[questionIndex] === optionIndex
                        ? "bg-red-500 hover:bg-red-600"
                        : ""
                    : ""
                }`}
                onClick={() =>
                  !showResults && handleAnswerSelect(questionIndex, optionIndex)
                }
              >
                {option}
              </Button>
            ))}
          </CardContent>
        </Card>
      ))}
      {!showResults && (
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length !== questions.length}
        >
          Submit Quiz
        </Button>
      )}
      {showResults && (
        <Card className="bg-accent">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Your score: {getScore()} out of {questions.length}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Summary = ({ summary }) => (
  <Card>
    <CardContent className="prose dark:prose-invert pt-6 max-w-none">
      {summary ? (
        <div dangerouslySetInnerHTML={{ __html: summary }} />
      ) : (
        <p className="text-muted-foreground">No summary available.</p>
      )}
    </CardContent>
  </Card>
);

const LoadingComponent = () => (
  <div className="container mx-auto p-6 space-y-8">
    <Skeleton className="h-[400px] w-full rounded-lg" />
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

const ErrorComponent = ({ message }) => (
  <div className="container mx-auto p-6 text-center">
    <Card className="p-6">
      <CardTitle className="text-red-500 mb-4">Error</CardTitle>
      <CardDescription>{message}</CardDescription>
      <Button className="mt-4" onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </Card>
  </div>
);

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

export default function VideoPage({ params }) {
  const router = useRouter();
  const { theme, setTheme } = useContext(themeContext);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unwrap params using React.use()
  const videoId = use(params).id;

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/videos/${videoId}`);
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "Video not found"
              : "Failed to fetch video details",
          );
        }
        const data = await res.json();
        setVideo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId]);

  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent message={error} />;
  if (!video) return <ErrorComponent message="Video not found" />;

  return (
    <div className="min-h-screen bg-background">
      <Header theme={theme} setTheme={setTheme} />
      <main className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <VideoDetails video={video} />

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="summary">
              <List className="h-4 w-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="flashcards">
              <BookOpen className="h-4 w-4 mr-2" />
              Flash Cards
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <Brain className="h-4 w-4 mr-2" />
              Quiz
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Summary summary={video.summary} />
          </TabsContent>

          <TabsContent value="flashcards">
            <FlashCards cards={video.flashcards} />
          </TabsContent>

          <TabsContent value="quiz">
            <Quiz questions={video.quizzes} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
