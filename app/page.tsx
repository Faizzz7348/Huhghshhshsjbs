"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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

export default function Home() {
  const { showPageLoading } = usePageLoading()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    showPageLoading("Welcome to Homepage", 1000)
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
                <BreadcrumbLink href="#">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Welcome</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ModeToggle />
        </header>
        <div className="flex flex-1 flex-col p-4 pt-8 overflow-y-auto">
          <div className="flex flex-1 flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-1 bg-primary rounded-full" />
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">
                    Welcome to VM Manager
                  </h1>
                  <p className="text-muted-foreground mt-1 font-medium">
                    Professional Vending Machine Management System
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                Get started by exploring the sidebar navigation. Manage your vending machine routes, 
                monitor locations, and configure settings with ease.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className="relative h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="relative font-semibold text-lg mb-2">Getting Started</h3>
                  <p className="relative text-sm text-muted-foreground leading-relaxed">
                    Learn the basics and set up your vending machine routes
                  </p>
                </div>
                
                <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className="relative h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="relative font-semibold text-lg mb-2">Route Management</h3>
                  <p className="relative text-sm text-muted-foreground leading-relaxed">
                    Browse and manage your VM routes with comprehensive tools
                  </p>
                </div>
                
                <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className="relative h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-6 w-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="relative font-semibold text-lg mb-2">Analytics & Reports</h3>
                  <p className="relative text-sm text-muted-foreground leading-relaxed">
                    Monitor performance and view detailed analytics
                  </p>
                </div>
              </div>

              <div className="relative mt-8 rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="relative font-semibold text-lg mb-3">Quick Actions</h3>
                <div className="relative flex flex-wrap gap-2">
                  <Link href="/kl-7" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 font-medium">
                    View KL Routes
                  </Link>
                  <Link href="/sl-1" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 font-medium">
                    View SL Routes
                  </Link>
                  <button className="px-4 py-2 rounded-lg border bg-background hover:bg-accent transition-colors duration-200 font-medium">
                    Settings
                  </button>
                </div>
              </div>
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
