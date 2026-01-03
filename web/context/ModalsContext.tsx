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

interface BroadcastModalState {
  isOpen: boolean
}

interface FilterModalState {
  isOpen: boolean
}

interface SuspendModalState {
  isOpen: boolean
  playerId: string
  playerName: string
}

interface BanModalState {
  isOpen: boolean
  playerId: string
  playerName: string
}

interface MessageModalState {
  isOpen: boolean
  playerId: string
  playerName: string
}

interface ModalsContextType {
  inventoryModal: InventoryModalState
  actionsModal: ActionsModalState
  broadcastModal: BroadcastModalState
  filterModal: FilterModalState
  suspendModal: SuspendModalState
  banModal: BanModalState
  messageModal: MessageModalState
  dashboardVisible: boolean
  openInventoryModal: (playerId: string, playerName: string, items: InventorySlot[]) => void
  closeInventoryModal: () => void
  openActionsModal: (playerId: string, playerName: string) => void
  closeActionsModal: () => void
  openBroadcastModal: () => void
  closeBroadcastModal: () => void
  openFilterModal: () => void
  closeFilterModal: () => void
  openSuspendModal: (playerId: string, playerName: string) => void
  closeSuspendModal: () => void
  openBanModal: (playerId: string, playerName: string) => void
  closeBanModal: () => void
  openMessageModal: (playerId: string, playerName: string) => void
  closeMessageModal: () => void
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

  const [broadcastModal, setBroadcastModal] = useState<BroadcastModalState>({
    isOpen: false,
  })

  const [filterModal, setFilterModal] = useState<FilterModalState>({
    isOpen: false,
  })

  const [suspendModal, setSuspendModal] = useState<SuspendModalState>({
    isOpen: false,
    playerId: "",
    playerName: "",
  })

  const [banModal, setBanModal] = useState<BanModalState>({
    isOpen: false,
    playerId: "",
    playerName: "",
  })

  const [messageModal, setMessageModal] = useState<MessageModalState>({
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

  const openBroadcastModal = () => {
    setBroadcastModal({ isOpen: true })
  }

  const closeBroadcastModal = () => {
    setBroadcastModal({ isOpen: false })
  }

  const openFilterModal = () => {
    setFilterModal({ isOpen: true })
  }

  const closeFilterModal = () => {
    setFilterModal({ isOpen: false })
  }

  const openSuspendModal = (playerId: string, playerName: string) => {
    setSuspendModal({ isOpen: true, playerId, playerName })
  }

  const closeSuspendModal = () => {
    setSuspendModal({ isOpen: false, playerId: "", playerName: "" })
  }

  const openBanModal = (playerId: string, playerName: string) => {
    setBanModal({ isOpen: true, playerId, playerName })
  }

  const closeBanModal = () => {
    setBanModal({ isOpen: false, playerId: "", playerName: "" })
  }

  const openMessageModal = (playerId: string, playerName: string) => {
    setMessageModal({ isOpen: true, playerId, playerName })
  }

  const closeMessageModal = () => {
    setMessageModal({ isOpen: false, playerId: "", playerName: "" })
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
        broadcastModal,
        filterModal,
        suspendModal,
        banModal,
        messageModal,
        dashboardVisible,
        openInventoryModal,
        closeInventoryModal,
        openActionsModal,
        closeActionsModal,
        openBroadcastModal,
        closeBroadcastModal,
        openFilterModal,
        closeFilterModal,
        openSuspendModal,
        closeSuspendModal,
        openBanModal,
        closeBanModal,
        openMessageModal,
        closeMessageModal,
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
