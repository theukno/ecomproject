"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { ChatbotDialog } from "./chatbot-dialog"

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg" onClick={() => setIsOpen(true)}>
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open chat</span>
      </Button>

      <ChatbotDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}

