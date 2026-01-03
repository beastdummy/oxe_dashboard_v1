export type InventoryItem = {
  name: string // item ID (ej: 'money', 'burger')
  label: string // nombre mostrado
  count: number // cantidad
  weight: number // peso unitario
  image?: string // nombre del archivo imagen (ej: 'burger_chicken.png')
  metadata?: Record<string, any>
}

export type InventorySlot = InventoryItem & {
  slot: number
  totalWeight: number // weight * count
}

// Items desde ox_inventory items.lua
export const INVENTORY_ITEMS: Record<string, { label: string; weight: number; image?: string }> = {
  testburger: { label: 'Test Burger', weight: 220, image: 'burger_chicken.png' },
  bandage: { label: 'Bandage', weight: 115, image: 'bandage.png' },
  black_money: { label: 'Dirty Money', weight: 0, image: 'black_money.png' },
  burger: { label: 'Burger', weight: 220, image: 'burger.png' },
  sprunk: { label: 'Sprunk', weight: 350, image: 'sprunk.png' },
  parachute: { label: 'Parachute', weight: 8000, image: 'parachute.png' },
  garbage: { label: 'Garbage', weight: 0, image: 'garbage.png' },
  paperbag: { label: 'Paper Bag', weight: 1, image: 'paperbag.png' },
  identification: { label: 'Identification', weight: 0, image: 'card_id.png' },
  panties: { label: 'Knickers', weight: 10 },
  lockpick: { label: 'Lockpick', weight: 160, image: 'lockpick.png' },
  phone: { label: 'Phone', weight: 190, image: 'phone.png' },
  money: { label: 'Money', weight: 0, image: 'money.png' },
  mustard: { label: 'Mustard', weight: 500, image: 'mustard.png' },
  water: { label: 'Water', weight: 500, image: 'water.png' },
  radio: { label: 'Radio', weight: 1000, image: 'radio.png' },
  armour: { label: 'Bulletproof Vest', weight: 3000, image: 'armour.png' },
  clothing: { label: 'Clothing', weight: 0 },
  mastercard: { label: 'Fleeca Card', weight: 10, image: 'card_bank.png' },
  scrapmetal: { label: 'Scrap Metal', weight: 80, image: 'scrapmetal.png' },
}
