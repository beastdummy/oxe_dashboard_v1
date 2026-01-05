// Mission Builder Constants

export const MISSION_TYPES = [
  { value: "heist", label: "Heist / Robo", icon: "💰" },
  { value: "delivery", label: "Delivery / Entrega", icon: "📦" },
  { value: "assassination", label: "Assassination / Asesinato", icon: "🎯" },
  { value: "robbery", label: "Robbery / Robo", icon: "🏦" },
  { value: "escort", label: "Escort / Escolta", icon: "👥" },
  { value: "rescue", label: "Rescue / Rescate", icon: "🚨" },
  { value: "sabotage", label: "Sabotage / Sabotaje", icon: "💣" },
]

export const MISSION_DIFFICULTIES = [
  { value: "easy", label: "Fácil", color: "bg-green-500/20 text-green-400" },
  { value: "medium", label: "Media", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "hard", label: "Difícil", color: "bg-red-500/20 text-red-400" },
  { value: "extreme", label: "Extrema", color: "bg-purple-500/20 text-purple-400" },
]

export const NPC_TYPES = [
  { value: "boss", label: "Boss / Jefe", icon: "👑" },
  { value: "guard", label: "Guard / Guardia", icon: "🛡️" },
  { value: "civilian", label: "Civilian / Civil", icon: "👤" },
  { value: "criminal", label: "Criminal / Criminal", icon: "🦹" },
  { value: "police", label: "Police / Policía", icon: "👮" },
]

export const NPC_BEHAVIORS = [
  { value: "patrol", label: "Patrulla", icon: "🚶" },
  { value: "static", label: "Estático", icon: "🧍" },
  { value: "aggressive", label: "Agresivo", icon: "⚔️" },
]

export const PROP_TYPES = [
  { value: "furniture", label: "Furniture / Muebles", icon: "🪑" },
  { value: "weapon", label: "Weapon / Arma", icon: "🔫" },
  { value: "tool", label: "Tool / Herramienta", icon: "🔧" },
  { value: "decoration", label: "Decoration / Decoración", icon: "🎨" },
  { value: "electronic", label: "Electronic / Electrónico", icon: "📱" },
]

export const INTERACTION_TYPES = [
  { value: "talk", label: "Talk / Hablar", icon: "💬" },
  { value: "take", label: "Take / Coger", icon: "✋" },
  { value: "use", label: "Use / Usar", icon: "🔌" },
  { value: "hack", label: "Hack / Hackear", icon: "💻" },
  { value: "steal", label: "Steal / Robar", icon: "🚨" },
]

export const MINIGAME_TYPES = [
  {
    value: "lockpick",
    label: "Lockpicking",
    icon: "🔓",
    description: "Abre cerraduras con una herramienta de hurto",
    requiresItem: "lockpick",
  },
  {
    value: "hack",
    label: "Hacking",
    icon: "💻",
    description: "Hackea dispositivos electrónicos y sistemas",
    requiresItem: "laptop",
  },
  {
    value: "timerbomb",
    label: "Timer Bomb",
    icon: "⏲️",
    description: "Coloca y desactiva bombas con temporizador",
    requiresItem: "bomb",
  },
  {
    value: "thermite",
    label: "Thermite",
    icon: "🔥",
    description: "Quema cerraduras y estructuras metálicas",
    requiresItem: "thermite",
  },
  {
    value: "drilling",
    label: "Drilling",
    icon: "🪛",
    description: "Perfora bóvedas y cajas de seguridad",
    requiresItem: "drill",
  },
  {
    value: "safecrack",
    label: "Safecracking",
    icon: "🔐",
    description: "Abre cajas de seguridad",
    requiresItem: "safekit",
  },
]

export const SECURITY_SYSTEMS = [
  {
    value: "laser",
    label: "Laser System",
    icon: "🔴",
    description: "Sistema de láseres de seguridad",
    doc: "https://docs.kuzquality.com/resources/premium-resources/security-systems/developer-docs",
  },
  {
    value: "camera",
    label: "Security Camera",
    icon: "📹",
    description: "Cámara de vigilancia",
  },
  {
    value: "alarm",
    label: "Alarm System",
    icon: "🚨",
    description: "Sistema de alarma",
  },
  {
    value: "keypad",
    label: "Keypad Lock",
    icon: "🔢",
    description: "Bloqueo con teclado numérico",
  },
]

export const VEHICLE_MODELS = [
  // Sports
  { value: "adder", label: "Adder", type: "sports" },
  { value: "banshee", label: "Banshee", type: "sports" },
  { value: "buffalo", label: "Buffalo", type: "sports" },
  // Sedan
  { value: "tailgater", label: "Tailgater", type: "sedan" },
  { value: "fugitive", label: "Fugitive", type: "sedan" },
  // Motorcycle
  { value: "bati801", label: "Bati 801", type: "motorcycle" },
  { value: "pcj600", label: "PCJ 600", type: "motorcycle" },
  // SUV
  { value: "granger", label: "Granger", type: "suv" },
  { value: "patriot", label: "Patriot", type: "suv" },
  // Van
  { value: "rumpo", label: "Rumpo", type: "van" },
  { value: "burrito", label: "Burrito", type: "van" },
]

export const OBJECTIVE_TYPES = [
  { value: "location", label: "Go to Location", icon: "📍" },
  { value: "kill", label: "Kill Target", icon: "💀" },
  { value: "collect", label: "Collect Item", icon: "📦" },
  { value: "escort", label: "Escort Person", icon: "👥" },
  { value: "hack", label: "Hack System", icon: "💻" },
  { value: "destroy", label: "Destroy Object", icon: "💣" },
]

export const REWARD_TYPES = [
  { value: "xp", label: "Experience Points", icon: "⭐" },
  { value: "money", label: "Money / Dinero", icon: "💵" },
  { value: "item", label: "Item Reward", icon: "🎁" },
  { value: "reputation", label: "Reputation", icon: "🏆" },
]
