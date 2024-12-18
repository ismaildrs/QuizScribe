"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ErrorDialog from "@/components/ui/errorDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { themeContext } from "@/lib/Contexts";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Calendar,
  Clock,
  Download,
  List,
  Paperclip,
  Play,
  Share2,
  User,
} from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import mermaid from "mermaid";

const VideoDetails = ({ video , videoId}) => {
  const formattedDate = moment(video?.createdAt).format("MMMM D, YYYY");

  return (
    <Card className="group w-full max-w-md mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative w-full aspect-video">
        {video?.thumbnail ? (
          <div className="relative w-full h-full">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 300px"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <Play className="w-16 h-16 text-white/80 transition-transform duration-300 group-hover:scale-110" />
          </div>
        )}
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {video?.title || "Untitled Video"}
          </CardTitle>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
        <CardDescription className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          {formattedDate}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground line-clamp-2">
        {video?.description || "No description available"}
      </CardContent>

      <CardFooter className="flex justify-between pt-4 border-t">
        <div className="flex space-x-2">
          <Badge variant="secondary" className="hover:bg-secondary/80">
            {video?.category || "Uncategorized"}
          </Badge>
          {video?.isNew && (
            <Badge variant="default" className="bg-primary hover:bg-primary/90">
              New
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/90"
          onClick={()=>{window.open(video.url)}}
        >
          Watch Now
        </Button>
      </CardFooter>
    </Card>
  );
};

const FlashCards = ({ cards = [] }) => {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleCard = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        return score + (answer === questions[questionIndex].correct ? 1 : 0);
      },
      0
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {questions.map((question, questionIndex) => (
        <Card key={questionIndex}>
          <CardHeader>
            <CardTitle className="text-lg">
              Question {questionIndex + 1}: {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {question.answer.map((option, optionIndex) => (
              <Button
                key={optionIndex}
                variant={
                  selectedAnswers[questionIndex] === optionIndex
                    ? "default"
                    : "outline"
                }
                className={`w-full justify-start text-left ${
                  showResults
                    ? optionIndex === question.correct
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
    <CardContent className="pt-6 prose dark:prose-invert max-w-none">
      {summary ? (
        <div dangerouslySetInnerHTML={{ __html: summary }} />
      ) : (
        <p className="text-muted-foreground">No summary available.</p>
      )}
    </CardContent>
  </Card>
);

const LoadingComponent = () => (
  <div className="container p-6 mx-auto space-y-8">
    <Skeleton className="h-[400px] w-full rounded-lg" />
    <Skeleton className="w-3/4 h-8" />
    <Skeleton className="w-1/2 h-4" />
    <div className="space-y-4">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
    </div>
  </div>
);

const Diagram = ({ markdown }) => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
    });

    mermaid.contentLoaded();
  }, [markdown]);

  return (
    <Card>
      <CardContent className="pt-6 prose dark:prose-invert max-w-none">
        <div className="mermaid">{markdown}</div>
      </CardContent>
    </Card>
  );
};

export default function VideoPage({ params }) {
  const router = useRouter();
  const { theme, setTheme } = useContext(themeContext);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { id: videoId } = useParams();

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

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
              : "Failed to fetch video details"
          );
        }
        const data = await res.json();
        console.log(data);
        setVideo(data);
      } catch (err) {
        showError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId]);

  if (isLoading) return <LoadingComponent />;

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/createApkg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folder: video.folderId,
          flashcards: video.flashcards,
        }),
      });

      if (!response.ok) {
        setError("Error occurred while exporting flashcards.");
      }
      const { apkg } = await response.json();
      const blob = new Blob([Buffer.from(apkg, "binary")], {
        type: "application/apkg",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = video.title.replaceAll(" ", "_") + ".apkg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(link.href);
    } catch (e) {
      showError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {errorMessage && <ErrorDialog message={errorMessage} />}
      <main className="container p-6 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="space-x-2">
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Flashcards to Anki 
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <VideoDetails video={video}  />
          </div>

          <div className="w-full lg:w-2/3">
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList className="justify-start w-full">
                <TabsTrigger value="summary">
                  <List className="w-4 h-4 mr-2" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="flashcards">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Flash Cards
                </TabsTrigger>
                <TabsTrigger value="quiz">
                  <Brain className="w-4 h-4 mr-2" />
                  Quiz
                </TabsTrigger>
                <TabsTrigger value="diagram">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Diagram
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

              {video.diagram && (
                <TabsContent value="diagram">
                  <Diagram markdown={video.diagram} />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
