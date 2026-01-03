import { en } from "./en"
import { es } from "./es"
import { LanguageCode } from "./types"

export const translations: Record<LanguageCode, typeof en> = {
  en,
  es,
}

export const getTranslations = (language: LanguageCode) => translations[language]
