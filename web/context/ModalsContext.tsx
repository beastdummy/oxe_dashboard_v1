"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { InventorySlot } from "@/lib/types/inventory"

interface InventoryModalState {
  isOpen: boolean
  playerId: string
  playerName: string
  items: InventorySlot[]
}

interface ActionsModalState {
  isOpen: boolean
  playerId: string
  playerName: string
}

interface ModalsContextType {
  inventoryModal: InventoryModalState
  actionsModal: ActionsModalState
  dashboardVisible: boolean
  openInventoryModal: (playerId: string, playerName: string, items: InventorySlot[]) => void
  closeInventoryModal: () => void
  openActionsModal: (playerId: string, playerName: string) => void
  closeActionsModal: () => void
  minimizeDashboard: () => void
  restoreDashboard: () => void
  closeDashboard: () => void
}

const ModalsContext = createContext<ModalsContextType | undefined>(undefined)

export function ModalsProvider({ children }: { children: ReactNode }) {
  const [inventoryModal, setInventoryModal] = useState<InventoryModalState>({
    isOpen: false,
    playerId: "",
    playerName: "",
    items: [],
  })

  const [actionsModal, setActionsModal] = useState<ActionsModalState>({
    isOpen: false,
    playerId: "",
    playerName: "",
  })

  const [dashboardVisible, setDashboardVisible] = useState(true)

  const openInventoryModal = (playerId: string, playerName: string, items: InventorySlot[]) => {
    setInventoryModal({
      isOpen: true,
      playerId,
      playerName,
      items,
    })
  }

  const closeInventoryModal = () => {
    setInventoryModal({
      isOpen: false,
      playerId: "",
      playerName: "",
      items: [],
    })
  }

  const openActionsModal = (playerId: string, playerName: string) => {
    setActionsModal({
      isOpen: true,
      playerId,
      playerName,
    })
  }

  const closeActionsModal = () => {
    setActionsModal({
      isOpen: false,
      playerId: "",
      playerName: "",
    })
  }

  const minimizeDashboard = () => {
    setDashboardVisible(false)
  }

  const restoreDashboard = () => {
    setDashboardVisible(true)
  }

  const closeDashboard = () => {
    setDashboardVisible(false)
  }

  return (
    <ModalsContext.Provider
      value={{
        inventoryModal,
        actionsModal,
        dashboardVisible,
        openInventoryModal,
        closeInventoryModal,
        openActionsModal,
        closeActionsModal,
        minimizeDashboard,
        restoreDashboard,
        closeDashboard,
      }}
    >
      {children}
    </ModalsContext.Provider>
  )
}

export function useModals() {
  const context = useContext(ModalsContext)
  if (!context) {
    throw new Error("useModals must be used within ModalsProvider")
  }
  return context
}
