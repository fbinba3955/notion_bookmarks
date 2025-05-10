"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // 确保组件只在客户端渲染，避免水合不匹配
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDarkMode = theme === "simple-dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDarkMode ? "simple-light" : "simple-dark")}
      className="rounded-full"
      aria-label={isDarkMode ? "切换到浅色模式" : "切换到深色模式"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
}
