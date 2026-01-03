/**
 * Admin Actions Configuration
 * Centralized constants for admin actions modal
 */

export const ADMIN_ACTIONS_CONFIG = {
  MODAL_WIDTH: 500,
  MODAL_HEIGHT: 'auto',
  GRID_COLUMNS: 3,
  GAP: 2,
  
  // Action categories
  CATEGORIES: {
    MOVEMENT: 'movement',
    DAMAGE: 'damage',
    SYSTEM: 'system',
  },
  
  // Z-index layering
  Z_INDEX: {
    BACKDROP: 'z-50',
    MODAL: 'z-50',
    HEADER: 'z-10',
  },
} as const;

export const ADMIN_ACTION_COLORS = {
  NORMAL: 'bg-blue-600 hover:bg-blue-700',
  DANGER: 'bg-red-600 hover:bg-red-700',
  WARNING: 'bg-yellow-600 hover:bg-yellow-700',
  SUCCESS: 'bg-green-600 hover:bg-green-700',
  NEUTRAL: 'bg-neutral-600 hover:bg-neutral-700',
} as const;

export const ADMIN_BUTTON_SIZES = {
  SM: 'text-xs px-2 py-1',
  MD: 'text-sm px-3 py-2',
  LG: 'text-base px-4 py-3',
} as const;
