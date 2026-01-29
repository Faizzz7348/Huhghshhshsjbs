"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { usePageLoading } from "@/contexts/page-loading-context"
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

export default function Page() {
  const { showPageLoading } = usePageLoading()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    showPageLoading("Opening Dashboard", 1000)
    setTimeout(() => setMounted(true), 1000)
  }, [showPageLoading])

  if (!mounted) return null

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
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ModeToggle />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-6 overflow-y-auto">
          <div className="flex flex-1 flex-col gap-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="relative overflow-hidden aspect-video rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Routes</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">↑ 12% from last month</div>
              </div>
            </div>
            <div className="relative overflow-hidden aspect-video rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Active Locations</p>
                    <p className="text-2xl font-bold">156</p>
                  </div>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">↑ 8% from last month</div>
              </div>
            </div>
            <div className="relative overflow-hidden aspect-video rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <svg className="h-6 w-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Revenue</p>
                    <p className="text-2xl font-bold">$48K</p>
                  </div>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">↑ 23% from last month</div>
              </div>
            </div>
          </div>
          <div className="bg-muted min-h-[50vh] flex-1 rounded-xl border shadow-sm" />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
