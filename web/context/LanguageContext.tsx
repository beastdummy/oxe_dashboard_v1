"use client"

import React, { createContext, useState, useEffect } from "react"
import { LanguageCode } from "@/lib/translations/types"

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Cargar idioma del localStorage al montar
    const savedLanguage = localStorage.getItem("language") as LanguageCode | null
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguageState(savedLanguage)
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage debe ser usado dentro de LanguageProvider")
  }
  return context
}
