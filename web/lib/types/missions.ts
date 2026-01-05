// Mission Types and Interfaces

export type MissionType = "heist" | "delivery" | "assassination" | "robbery" | "escort" | "rescue" | "sabotage"
export type MissionDifficulty = "easy" | "medium" | "hard" | "extreme"
export type MissionStatus = "draft" | "active" | "completed" | "archived"
export type NPCType = "boss" | "guard" | "civilian" | "criminal" | "police"
export type PropType = "furniture" | "weapon" | "tool" | "decoration" | "electronic"
export type InteractionType = "talk" | "take" | "use" | "hack" | "steal"
export type MiniGameType = "lockpick" | "hack" | "timerbomb" | "thermite" | "drilling" | "safecrack"

export interface MissionReward {
  xp: number
  money?: number
  itemId?: string
  itemQuantity?: number
}

export interface MissionObjective {
  id: string
  title: string
  description: string
  type: "location" | "kill" | "collect" | "escort" | "hack" | "destroy"
  target?: string
  coordinates?: { x: number; y: number; z: number }
  completed: boolean
}

export interface NPC {
  id: string
  name: string
  type: NPCType
  model: string
  coordinates: { x: number; y: number; z: number }
  heading: number
  dialogue: DialogueNode[]
  behavior?: "patrol" | "static" | "aggressive"
}

export interface DialogueNode {
  id: string
  npcName: string
  text: string
  options?: DialogueOption[]
  actions?: DialogueAction[]
}

export interface DialogueOption {
  id: string
  text: string
  nextNodeId?: string
  requiresQuest?: string
}

export interface DialogueAction {
  type: "give_item" | "take_item" | "start_objective" | "complete_objective" | "trigger_event"
  value: any
}

export interface Prop {
  id: string
  name: string
  model: string
  type: PropType
  coordinates: { x: number; y: number; z: number }
  heading: number
  scale?: number
  interactions?: PropInteraction[]
}

export interface PropInteraction {
  id: string
  type: InteractionType
  label: string
  icon?: string
  requiresItem?: string
  triggerEvent?: string
}

export interface VehicleSpawn {
  id: string
  model: string
  coordinates: { x: number; y: number; z: number }
  heading: number
  locked: boolean
  jobOwned?: boolean
  npcDriver?: string
  customColor?: { r: number; g: number; b: number }
}

export interface OxTargetPoint {
  id: string
  coordinates: { x: number; y: number; z: number }
  radius: number
  icon: string
  label: string
  onInteract: string
  requiresItem?: string
  canInteract?: string
}

export interface MiniGameConfig {
  type: MiniGameType
  difficulty: number
  reward: MissionReward
  timeLimit?: number
  targetCode?: string
}

export interface SecuritySystem {
  id: string
  type: "laser" | "camera" | "alarm" | "keypad"
  coordinates: { x: number; y: number; z: number }
  heading?: number
  config: {
    hasLasers?: boolean
    hasCamera?: boolean
    hasAlarm?: boolean
    disarmCode?: string
  }
}

export interface Mission {
  id: string
  name: string
  label: string
  description: string
  type: MissionType
  difficulty: MissionDifficulty
  status: MissionStatus
  startLocation: { x: number; y: number; z: number }
  objectives: MissionObjective[]
  npcs: NPC[]
  props: Prop[]
  vehicles: VehicleSpawn[]
  oxTargets: OxTargetPoint[]
  minigames: MiniGameConfig[]
  securitySystems: SecuritySystem[]
  rewards: MissionReward
  timeLimit?: number
  requiredItems?: string[]
  minLevel?: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface MissionListItem {
  id: string
  name: string
  label: string
  type: MissionType
  difficulty: MissionDifficulty
  status: MissionStatus
  completionRate: number
  rewards: MissionReward
}
