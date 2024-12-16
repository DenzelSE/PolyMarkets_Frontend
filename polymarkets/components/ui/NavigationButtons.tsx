'use client'

import { useRouter } from 'next/navigation'
import { Button } from "./button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavigationButtonsProps {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
}

export function NavigationButtons({isSidebarOpen }: NavigationButtonsProps) {
  const router = useRouter()

  return (
    <div className={`flex ${isSidebarOpen ? 'justify-between' : 'flex-col items-center'} w-full gap-2`}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.back()}
        aria-label="Go back"
        className={`${'bg-purple-900/50 hover:bg-purple-900/70 bg-indigo-50 hover:bg-indigo-100'}`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.forward()}
        aria-label="Go forward"
        className={`${'bg-purple-900/50 hover:bg-purple-900/70 bg-indigo-50 hover:bg-indigo-100'}`}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

