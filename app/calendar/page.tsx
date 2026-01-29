"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Navigate months
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1))
  }

  const today = new Date()
  const isToday = (day: number) => {
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear()
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return day === selectedDate.getDate() && 
           month === selectedDate.getMonth() && 
           year === selectedDate.getFullYear()
  }

  // Generate calendar days
  const calendarDays = []
  
  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrevMonth: true
    })
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      isPrevMonth: false
    })
  }
  
  // Next month days
  const remainingDays = 42 - calendarDays.length // 6 rows × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      isPrevMonth: false
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background shadow-sm px-4 pt-[env(safe-area-inset-top)] before:absolute before:inset-x-0 before:top-0 before:-translate-y-full before:h-[200px] before:bg-background before:-z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb className="flex-1">
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Calendar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ModeToggle />
        </header>
        
        <div className="flex flex-1 flex-col p-6 pt-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {months[month]} {year}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your schedule and events
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevMonth}
                  className="transition-all hover:scale-105"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentDate(new Date())}
                  className="transition-all hover:scale-105"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                  className="transition-all hover:scale-105"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-8 mx-2" />
                <Button className="transition-all hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              {/* Days of week header */}
              <div className="grid grid-cols-7 border-b bg-muted/50">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="p-4 text-center text-sm font-semibold text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((dayInfo, index) => {
                  const { day, isCurrentMonth } = dayInfo
                  const isTodayDate = isCurrentMonth && isToday(day)
                  const isSelectedDate = isCurrentMonth && isSelected(day)

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (isCurrentMonth) {
                          setSelectedDate(new Date(year, month, day))
                        }
                      }}
                      className={`
                        relative min-h-[100px] p-3 border-r border-b text-left transition-all duration-200
                        ${!isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : 'hover:bg-accent'}
                        ${isTodayDate ? 'bg-primary/5' : ''}
                        ${isSelectedDate ? 'bg-primary/10 ring-2 ring-primary ring-inset' : ''}
                        ${(index % 7 === 6) ? 'border-r-0' : ''}
                        ${index >= 35 ? 'border-b-0' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`
                            inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium
                            ${isTodayDate ? 'bg-primary text-primary-foreground' : ''}
                            ${isSelectedDate && !isTodayDate ? 'bg-primary/20' : ''}
                          `}
                        >
                          {day}
                        </span>
                      </div>
                      
                      {/* Event indicators placeholder */}
                      {isCurrentMonth && day % 5 === 0 && (
                        <div className="space-y-1">
                          <div className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 truncate">
                            Route Visit
                          </div>
                        </div>
                      )}
                      {isCurrentMonth && day % 7 === 0 && (
                        <div className="space-y-1">
                          <div className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-700 dark:text-green-400 truncate">
                            Maintenance
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected Date Info */}
            {selectedDate && (
              <div className="mt-6 p-6 rounded-xl border bg-card shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Events for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                    <div>
                      <p className="font-medium text-blue-700 dark:text-blue-400">No events scheduled</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Click &quot;Add Event&quot; to create a new event for this day
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
