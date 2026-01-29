"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeColor() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    
    if (metaThemeColor) {
      // Update color based on theme - dark mode uses darker color, light mode uses lighter color
      const color = resolvedTheme === "dark" ? "#020817" : "#ffffff"
      metaThemeColor.setAttribute("content", color)
    }
  }, [resolvedTheme])

  return null
}
