import { useLanguage } from "@/context/LanguageContext"
import { getTranslations } from "@/lib/translations"

export function useTranslation() {
  const { language } = useLanguage()
  return getTranslations(language)
}
