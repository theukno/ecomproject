"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

type Question = {
  id: number
  text: string
  options: {
    id: string
    text: string
    moodScore: {
      happy: number
      relaxed: number
      energetic: number
      stressed: number
      creative: number
    }
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "How would you describe your energy level right now?",
    options: [
      {
        id: "high",
        text: "High - I feel energetic and ready to take on challenges",
        moodScore: {
          happy: 2,
          relaxed: 0,
          energetic: 5,
          stressed: 1,
          creative: 2,
        },
      },
      {
        id: "moderate",
        text: "Moderate - I feel balanced and steady",
        moodScore: {
          happy: 2,
          relaxed: 3,
          energetic: 2,
          stressed: 0,
          creative: 2,
        },
      },
      {
        id: "low",
        text: "Low - I feel calm and would prefer relaxing activities",
        moodScore: {
          happy: 1,
          relaxed: 5,
          energetic: 0,
          stressed: 0,
          creative: 1,
        },
      },
      {
        id: "drained",
        text: "Drained - I feel tired and need to recharge",
        moodScore: {
          happy: 0,
          relaxed: 1,
          energetic: 0,
          stressed: 3,
          creative: 0,
        },
      },
    ],
  },
  {
    id: 2,
    text: "What best describes your current emotional state?",
    options: [
      {
        id: "joyful",
        text: "Joyful and optimistic",
        moodScore: {
          happy: 5,
          relaxed: 2,
          energetic: 3,
          stressed: 0,
          creative: 2,
        },
      },
      {
        id: "content",
        text: "Content and peaceful",
        moodScore: {
          happy: 3,
          relaxed: 5,
          energetic: 1,
          stressed: 0,
          creative: 2,
        },
      },
      {
        id: "anxious",
        text: "Anxious or worried",
        moodScore: {
          happy: 0,
          relaxed: 0,
          energetic: 1,
          stressed: 5,
          creative: 1,
        },
      },
      {
        id: "inspired",
        text: "Inspired and imaginative",
        moodScore: {
          happy: 3,
          relaxed: 1,
          energetic: 3,
          stressed: 0,
          creative: 5,
        },
      },
    ],
  },
  {
    id: 3,
    text: "What kind of activity would you prefer right now?",
    options: [
      {
        id: "social",
        text: "Something social and interactive",
        moodScore: {
          happy: 4,
          relaxed: 1,
          energetic: 4,
          stressed: 0,
          creative: 2,
        },
      },
      {
        id: "creative",
        text: "Something creative or artistic",
        moodScore: {
          happy: 2,
          relaxed: 2,
          energetic: 1,
          stressed: 0,
          creative: 5,
        },
      },
      {
        id: "relaxing",
        text: "Something calming and peaceful",
        moodScore: {
          happy: 1,
          relaxed: 5,
          energetic: 0,
          stressed: 0,
          creative: 1,
        },
      },
      {
        id: "productive",
        text: "Something productive and challenging",
        moodScore: {
          happy: 2,
          relaxed: 0,
          energetic: 4,
          stressed: 2,
          creative: 3,
        },
      },
    ],
  },
  {
    id: 4,
    text: "How would you describe your current thought patterns?",
    options: [
      {
        id: "focused",
        text: "Clear and focused",
        moodScore: {
          happy: 3,
          relaxed: 2,
          energetic: 4,
          stressed: 0,
          creative: 2,
        },
      },
      {
        id: "scattered",
        text: "Scattered or racing",
        moodScore: {
          happy: 0,
          relaxed: 0,
          energetic: 2,
          stressed: 4,
          creative: 1,
        },
      },
      {
        id: "creative",
        text: "Creative and flowing",
        moodScore: {
          happy: 3,
          relaxed: 2,
          energetic: 2,
          stressed: 0,
          creative: 5,
        },
      },
      {
        id: "reflective",
        text: "Reflective and contemplative",
        moodScore: {
          happy: 1,
          relaxed: 4,
          energetic: 0,
          stressed: 1,
          creative: 3,
        },
      },
    ],
  },
  {
    id: 5,
    text: "What's your ideal environment right now?",
    options: [
      {
        id: "busy",
        text: "Busy and stimulating",
        moodScore: {
          happy: 3,
          relaxed: 0,
          energetic: 5,
          stressed: 2,
          creative: 3,
        },
      },
      {
        id: "cozy",
        text: "Cozy and comfortable",
        moodScore: {
          happy: 2,
          relaxed: 5,
          energetic: 0,
          stressed: 0,
          creative: 2,
        },
      },
      {
        id: "organized",
        text: "Clean and organized",
        moodScore: {
          happy: 2,
          relaxed: 3,
          energetic: 2,
          stressed: 0,
          creative: 1,
        },
      },
      {
        id: "inspiring",
        text: "Inspiring and beautiful",
        moodScore: {
          happy: 4,
          relaxed: 2,
          energetic: 2,
          stressed: 0,
          creative: 5,
        },
      },
    ],
  },
]

export default function MoodQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<string[]>(Array(questions.length).fill(""))
  const [moodScores, setMoodScores] = useState({
    happy: 0,
    relaxed: 0,
    energetic: 0,
    stressed: 0,
    creative: 0,
  })
  const router = useRouter()

  const handleOptionSelect = (optionId: string) => {
    const newSelectedOptions = [...selectedOptions]
    newSelectedOptions[currentQuestion] = optionId
    setSelectedOptions(newSelectedOptions)
  }

  const handleNext = () => {
    // Update mood scores based on selected option
    const question = questions[currentQuestion]
    const selectedOption = question.options.find((option) => option.id === selectedOptions[currentQuestion])

    if (selectedOption) {
      setMoodScores({
        happy: moodScores.happy + selectedOption.moodScore.happy,
        relaxed: moodScores.relaxed + selectedOption.moodScore.relaxed,
        energetic: moodScores.energetic + selectedOption.moodScore.energetic,
        stressed: moodScores.stressed + selectedOption.moodScore.stressed,
        creative: moodScores.creative + selectedOption.moodScore.creative,
      })
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz completed, determine dominant mood
      const dominantMood = Object.entries(moodScores).reduce(
        (max, [mood, score]) => (score > max.score ? { mood, score } : max),
        { mood: "", score: -1 },
      )

      // Redirect to mood-based products page
      router.push(`/mood/${dominantMood.mood}`)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Mood Detection Quiz</h1>
        <p className="text-muted-foreground text-center mb-8">
          Answer these questions to help us understand your current mood and provide personalized product
          recommendations.
        </p>

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{questions[currentQuestion].text}</CardTitle>
            <CardDescription>Select the option that best describes how you feel</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedOptions[currentQuestion]}
              onValueChange={handleOptionSelect}
              className="space-y-4"
            >
              {questions[currentQuestion].options.map((option) => (
                <div key={option.id} className="flex items-start space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <Label htmlFor={option.id} className="font-normal cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={!selectedOptions[currentQuestion]}>
              {currentQuestion < questions.length - 1 ? "Next" : "See Results"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

