"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background border-b border-border">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetTitle>Menu</SheetTitle>
            <nav className="flex flex-col gap-4 mt-8">
              <a href="#" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#initiatives" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                Initiatives
              </a>
              <a href="#" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                Foundations
              </a>
              <a href="#" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                About Us
              </a>
              <a href="#support" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                Support
              </a>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-foreground">Reintegration</span>
          <span className="text-sm font-bold text-foreground">Portal</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a href="#support" className="text-sm font-medium text-primary hover:underline">
          Support
        </a>
        <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-4">
          CONTACT
        </Button>
      </div>
    </header>
  )
}
