"use client"

import { useModals } from "@/context/ModalsContext"
import { InventoryModal } from "@/components/InventoryModal"
import { ActionsModal } from "@/components/ActionsModal"
import { BroadcastModal } from "@/components/BroadcastModal"
import { FilterModal, FilterOptions } from "@/components/FilterModal"
import { SuspendModal } from "@/components/SuspendModal"
import { BanModal } from "@/components/BanModal"
import { MessageModal } from "@/components/MessageModal"

export function GlobalModals() {
  const { inventoryModal, actionsModal, closeInventoryModal, closeActionsModal, suspendModal, banModal, messageModal } = useModals()

  const handleApplyFilter = (filters: FilterOptions) => {
    // Los filtros se manejan en el componente PlayersPage
    console.log("Filtros aplicados:", filters)
  }

  return (
    <>
      {inventoryModal.isOpen && (
        <InventoryModal
          playerId={inventoryModal.playerId}
          playerName={inventoryModal.playerName}
          items={inventoryModal.items}
          onClose={closeInventoryModal}
        />
      )}

      {actionsModal.isOpen && (
        <ActionsModal
          playerId={actionsModal.playerId}
          playerName={actionsModal.playerName}
          onClose={closeActionsModal}
        />
      )}

      {suspendModal.isOpen && (
        <SuspendModal
          playerId={suspendModal.playerId}
          playerName={suspendModal.playerName}
        />
      )}

      {banModal.isOpen && (
        <BanModal
          playerId={banModal.playerId}
          playerName={banModal.playerName}
        />
      )}

      {messageModal.isOpen && (
        <MessageModal
          playerId={messageModal.playerId}
          playerName={messageModal.playerName}
        />
      )}

      <BroadcastModal />
      <FilterModal onApplyFilter={handleApplyFilter} />
    </>
  )
}
