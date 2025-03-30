import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { MoodCategories } from "@/components/mood-categories"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Shop Based on Your <span className="text-primary">Mood</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover products that match your emotional state. Take our quick mood quiz and get personalized
              recommendations tailored just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="font-semibold">
                <Link href="/quiz">Take Mood Quiz</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/products">Browse All Products</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=800&width=600"
              alt="Happy shopper with personalized products"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Mood Categories */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop By Mood</h2>
        <MoodCategories />
      </section>

      {/* How It Works */}
      <section className="py-12 bg-muted rounded-lg px-6 my-12">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold">Take the Mood Quiz</h3>
            <p className="text-muted-foreground">
              Answer a few simple questions to help us understand your current emotional state.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold">Get Personalized Recommendations</h3>
            <p className="text-muted-foreground">We'll suggest products that match your mood and preferences.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold">Shop with Confidence</h3>
            <p className="text-muted-foreground">Enjoy a shopping experience tailored specifically to how you feel.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

