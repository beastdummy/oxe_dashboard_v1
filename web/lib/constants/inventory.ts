/**
 * Inventory System Configuration
 * Centralized constants for inventory modal and operations
 */

export const INVENTORY_CONFIG = {
  // Grid layout
  GRID_COLUMNS: 6,
  EMPTY_SLOTS_COUNT: 50,
  
  // Weight management
  MAX_WEIGHT: 100000, // kg
  WEIGHT_WARNING_THRESHOLD: 0.6, // 60%
  WEIGHT_CRITICAL_THRESHOLD: 0.8, // 80%
  
  // Weight thresholds for UI feedback
  WEIGHT_THRESHOLDS: {
    SAFE: 0.6,
    WARNING: 0.8,
  },
  
  // Modal dimensions
  MODAL_WIDTH: 660,
  MODAL_HEIGHT: 630,
  MODAL_MIN_Y: 50,
  
  // Dialog defaults
  DIALOG_WIDTH: 96, // w-96 in Tailwind
} as const;

export const INVENTORY_COLORS = {
  BACKGROUND: 'neutral-900',
  BORDER: 'neutral-700',
  ACCENT: 'orange-500',
  TEXT_PRIMARY: 'white',
  TEXT_SECONDARY: 'neutral-400',
  SLOT_HOVER: 'orange-500/50',
  WEIGHT_SAFE: 'green-500',
  WEIGHT_WARNING: 'yellow-500',
  WEIGHT_CRITICAL: 'red-500',
} as const;

export const INVENTORY_ACTIONS = {
  GIVE: 'inventory:giveItem',
  DROP: 'inventory:dropItem',
  DELETE: 'inventory:deleteItem',
  CLEAR: 'inventory:clearInventory',
  MOVE: 'inventory:moveItem',
} as const;

export const INVENTORY_MESSAGES = {
  INVENTORY_EMPTY: 'Inventario vacío',
  INVALID_ITEM: 'Por favor completa los datos',
  CLEAR_CONFIRMATION: '¿Estás seguro de que deseas borrar TODO el inventario?',
  INVALID_JSON: 'JSON inválido',
  JSON_NOT_ARRAY: 'El JSON debe ser un array',
} as const;
