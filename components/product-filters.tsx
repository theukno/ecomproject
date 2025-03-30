"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const moodCategories = [
  { id: "happy", name: "Happy" },
  { id: "relaxed", name: "Relaxed" },
  { id: "energetic", name: "Energetic" },
  { id: "stressed", name: "Stressed" },
  { id: "creative", name: "Creative" },
]

export function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])

  const handleMoodChange = (mood: string) => {
    setSelectedMoods((prev) => (prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]))
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
  }

  const handleReset = () => {
    setPriceRange([0, 100])
    setSelectedMoods([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset All
        </Button>
      </div>

      <Separator />

      <Accordion type="multiple" defaultValue={["mood", "price"]}>
        <AccordionItem value="mood">
          <AccordionTrigger>Mood</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {moodCategories.map((mood) => (
                <div key={mood.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mood-${mood.id}`}
                    checked={selectedMoods.includes(mood.id)}
                    onCheckedChange={() => handleMoodChange(mood.id)}
                  />
                  <Label htmlFor={`mood-${mood.id}`} className="text-sm font-normal cursor-pointer">
                    {mood.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider defaultValue={[0, 100]} max={100} step={1} value={priceRange} onValueChange={handlePriceChange} />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`} className="text-sm font-normal cursor-pointer">
                    {rating} Stars & Up
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      <Button className="w-full">Apply Filters</Button>
    </div>
  )
}

