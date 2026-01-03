"use client"

import { useModals } from "@/context/ModalsContext"
import { InventoryModal } from "@/components/InventoryModal"
import { ActionsModal } from "@/components/ActionsModal"

export function GlobalModals() {
  const { inventoryModal, actionsModal, closeInventoryModal, closeActionsModal } = useModals()

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
    </>
  )
}
