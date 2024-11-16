import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Brain, PlayCircle, Youtube } from "lucide-react";

export default function VideoQuizLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Youtube className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-600">
              VideoQuiz
            </span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">How It Works</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="outline">Log In</Button>
            <Button>Sign Up</Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform YouTube Videos into
            <span className="text-purple-600"> Interactive Learning</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Turn any YouTube video into flashcards and quizzes. Boost your
            learning efficiency and retention.
          </p>
          <div className="max-w-lg mx-auto flex space-x-4">
            <Input placeholder="Paste YouTube URL here" className="flex-grow" />
            <Button size="lg">
              <PlayCircle className="mr-2 h-4 w-4" /> Create Quiz
            </Button>
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Youtube className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                1. Paste YouTube URL
              </h3>
              <p className="text-gray-600">
                Simply copy and paste the URL of any YouTube video you want to
                learn from.
              </p>
            </div>
            <div className="text-center">
              <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes the video content and generates flashcards and
                quiz questions.
              </p>
            </div>
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">3. Learn & Quiz</h3>
              <p className="text-gray-600">
                Review flashcards and take quizzes to reinforce your learning
                and track progress.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Supercharge Your Learning?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students and lifelong learners who are
            transforming their study experience.
          </p>
          <Button size="lg">Get Started for Free</Button>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2023 VideoQuiz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
