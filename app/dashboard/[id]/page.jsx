'use client'

import { useState, useContext, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { themeContext } from "@/lib/Contexts"
import { Youtube, Book, ClipboardSignature, HelpCircle } from "lucide-react"
import LoadingComponent from "@/components/ui/Loading"
import { useParams } from "next/navigation"
import Image from "next/image"

const summary = "React Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 to allow developers to use state and other React features without writing a class. The most commonly used hooks are useState, useEffect, and useContext. Hooks simplify the code and make it easier to reuse stateful logic between components."

const flashcards =  [
  { question: "What are React Hooks?", answer: "Functions that let you use state and other React features in functional components." },
  { question: "When were React Hooks introduced?", answer: "In React 16.8" },
  { question: "Name three commonly used hooks.", answer: "useState, useEffect, and useContext" },
]

const quizzes = [
  {
    question: "What is the main purpose of React Hooks?",
    options: [
      "To replace class components entirely",
      "To use state and other React features in functional components",
      "To improve React's performance",
      "To add new lifecycle methods",
    ],
    correctAnswer: 1,
  },
  {
    question: "Which of the following is NOT a commonly used React Hook?",
    options: ["useState", "useEffect", "useContext", "useClass"],
    correctAnswer: 3,
  },
]

export default function VideoLearningPage() {
  const params = useParams()
  const { theme } = useContext(themeContext)
  const [currentFlashcard, setCurrentFlashcard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [videoDetails, setVideoDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : ""
  }, [theme])

  useEffect(() => {
    const getVideoInfo = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/video?videoId=${params.id}`, {
          method: "GET",
        })
        if (!response.ok) {
          throw new Error('Failed to fetch video details')
        }
        const result = await response.json()
        setVideoDetails(result)
      } catch (err) {
        setError('An error occurred while fetching video details. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    getVideoInfo()
  }, [params.id])

  const nextFlashcard = () => {
    setCurrentFlashcard((prev) => (prev + 1) % flashcards.length)
    setIsFlipped(false)
  }

  const prevFlashcard = () => {
    setCurrentFlashcard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    setIsFlipped(false)
  }

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: answerIndex }))
  }

  if (isLoading) return <LoadingComponent />
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Video Learning Page</h1>

        <Tabs defaultValue="video" className="w-full">
          <TabsList>
            <TabsTrigger value="video">
              <Youtube className="mr-2 h-4 w-4" />
              Video Info
            </TabsTrigger>
            <TabsTrigger value="summary">
              <Book className="mr-2 h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="flashcards">
              <ClipboardSignature className="mr-2 h-4 w-4" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <HelpCircle className="mr-2 h-4 w-4" />
              Quiz
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video">
            <Card>
              <CardHeader>
                <CardTitle>{videoDetails?.title}</CardTitle>
                <CardDescription>
                  {videoDetails?.channelTitle} • {videoDetails?.defaultLanguage}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col lg:flex-row gap-5">
                {videoDetails?.thumbnail && (
                  <Image
                    src={videoDetails.thumbnail}
                    alt={videoDetails.title}
                    width={320}
                    height={180}
                    className="rounded-lg"
                  />
                )}
                <div>
                  <p>{videoDetails?.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {videoDetails?.tags.map((tag, index) => (
                      <span key={index} className="text-sm text-muted-foreground">#{tag}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Video Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{summary}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flashcards">
            <Card>
              <CardHeader>
                <CardTitle>Flashcards</CardTitle>
                <CardDescription>Click the card to flip it</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div
                  className="w-full h-48 flex items-center justify-center bg-muted cursor-pointer"
                  onClick={() => setIsFlipped(!isFlipped)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsFlipped(!isFlipped)
                    }
                  }}
                >
                  <p className="text-center p-4">
                    {isFlipped ? flashcards[currentFlashcard].answer : flashcards[currentFlashcard].question}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Button onClick={prevFlashcard}>Previous</Button>
                  <Button onClick={nextFlashcard}>Next</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle>Quiz</CardTitle>
                <CardDescription>Test your knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                {quizzes.map((quiz, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="font-semibold mb-2">{quiz.question}</h3>
                    {quiz.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                        <input
                          type="radio"
                          id={`q${index}a${optionIndex}`}
                          name={`question${index}`}
                          checked={quizAnswers[index] === optionIndex}
                          onChange={() => handleQuizAnswer(index, optionIndex)}
                          className="form-radio"
                        />
                        <label htmlFor={`q${index}a${optionIndex}`}>{option}</label>
                      </div>
                    ))}
                    {quizAnswers[index] !== undefined && (
                      <p className={quizAnswers[index] === quiz.correctAnswer ? "text-green-600" : "text-red-600"}>
                        {quizAnswers[index] === quiz.correctAnswer ? "Correct!" : "Incorrect. Try again!"}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}