// Configuración de períodos para diferentes categorías
export const playerCategoryConfig = {
  // Período para considerar un jugador como "Nuevo"
  // Opciones: "7days" | "1day" | "1week" | "1month"
  newPlayerPeriod: "7days",
} as const

// Definiciones de períodos en días
export const periodDefinitions = {
  "1day": 1,
  "7days": 7,
  "1week": 7,
  "1month": 30,
} as const

export type PlayerPeriod = keyof typeof periodDefinitions
