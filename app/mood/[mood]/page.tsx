import { notFound } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"

interface MoodPageProps {
  params: {
    mood: string
  }
}

const moodInfo = {
  happy: {
    title: "Happy Mood Products",
    description: "Products to celebrate and enhance your joyful mood",
    icon: "😊",
  },
  relaxed: {
    title: "Relaxed Mood Products",
    description: "Calming products for when you're feeling at ease",
    icon: "😌",
  },
  energetic: {
    title: "Energetic Mood Products",
    description: "Products to match and boost your high energy",
    icon: "⚡",
  },
  stressed: {
    title: "Stressed Mood Products",
    description: "Products to help you unwind and reduce tension",
    icon: "😓",
  },
  creative: {
    title: "Creative Mood Products",
    description: "Products to inspire and fuel your imagination",
    icon: "🎨",
  },
}

export default function MoodPage({ params }: MoodPageProps) {
  const { mood } = params

  if (!Object.keys(moodInfo).includes(mood)) {
    notFound()
  }

  const { title, description, icon } = moodInfo[mood as keyof typeof moodInfo]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">{icon}</div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <ProductFilters />
        </div>
        <div className="md:col-span-3">
          <ProductGrid />
        </div>
      </div>
    </div>
  )
}

