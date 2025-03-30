import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const moodCategories = [
  {
    id: "happy",
    name: "Happy",
    description: "Products to celebrate and enhance your joyful mood",
    color: "bg-yellow-100 dark:bg-yellow-900",
    textColor: "text-yellow-800 dark:text-yellow-100",
    icon: "😊",
  },
  {
    id: "relaxed",
    name: "Relaxed",
    description: "Calming products for when you're feeling at ease",
    color: "bg-blue-100 dark:bg-blue-900",
    textColor: "text-blue-800 dark:text-blue-100",
    icon: "😌",
  },
  {
    id: "energetic",
    name: "Energetic",
    description: "Products to match and boost your high energy",
    color: "bg-red-100 dark:bg-red-900",
    textColor: "text-red-800 dark:text-red-100",
    icon: "⚡",
  },
  {
    id: "stressed",
    name: "Stressed",
    description: "Products to help you unwind and reduce tension",
    color: "bg-purple-100 dark:bg-purple-900",
    textColor: "text-purple-800 dark:text-purple-100",
    icon: "😓",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Products to inspire and fuel your imagination",
    color: "bg-green-100 dark:bg-green-900",
    textColor: "text-green-800 dark:text-green-100",
    icon: "🎨",
  },
]

export function MoodCategories() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {moodCategories.map((category) => (
        <Link key={category.id} href={`/mood/${category.id}`}>
          <Card className="h-full transition-transform hover:scale-105">
            <CardContent className={`p-6 ${category.color} h-full flex flex-col items-center text-center`}>
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className={`text-xl font-semibold mb-2 ${category.textColor}`}>{category.name}</h3>
              <p className={`text-sm ${category.textColor}`}>{category.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

