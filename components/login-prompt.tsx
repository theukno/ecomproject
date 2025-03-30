"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LoginPromptProps {
  onClose: () => void
  message?: string
  callbackUrl?: string
}

export function LoginPrompt({ onClose, message = "Please log in to continue", callbackUrl = "/" }: LoginPromptProps) {
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  const encodedCallbackUrl = encodeURIComponent(callbackUrl)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            You need to be logged in to access this feature. Would you like to log in or create an account?
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/signup?callbackUrl=${encodedCallbackUrl}`}>Sign Up</Link>
            </Button>
            <Button asChild>
              <Link href={`/login?callbackUrl=${encodedCallbackUrl}`}>Log In</Link>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

