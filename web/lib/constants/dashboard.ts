/**
 * Dashboard Layout Configuration
 * Constants for the main dashboard and floating icon
 */

export const DASHBOARD_CONFIG = {
  HEADER_HEIGHT: 'h-16',
  TOOLBAR_PADDING: 'px-6 py-0',
  
  // Floating icon config
  FLOATING_ICON: {
    SIZE: 'w-12 h-12',
    ICON_SIZE: 'w-6 h-6',
    OFFSET: 20, // px from edges
    Z_INDEX: 'z-50',
    BACKGROUND: 'bg-neutral-900',
    BORDER: 'border-neutral-700',
    ICON_COLOR: 'text-orange-500',
  },
  
  // Control buttons
  CONTROLS: {
    ICON_SIZE: 'w-4 h-4',
    MINIMIZE: {
      COLOR: 'text-orange-500',
      HOVER: 'hover:text-orange-400 hover:bg-orange-500/10',
    },
    CLOSE: {
      COLOR: 'text-red-500',
      HOVER: 'hover:text-red-400 hover:bg-red-500/10',
    },
  },
  
  // Language button
  LANGUAGE: {
    ICON_SIZE: 'w-4 h-4',
    COLOR: 'text-neutral-400',
    HOVER: 'hover:text-orange-500',
  },
} as const;

export const DASHBOARD_Z_INDEX = {
  BACKDROP: 50,
  MODAL: 50,
  FLOATING_ICON: 50,
  MENU_DROPDOWN: 60,
  TOOLTIP: 70,
} as const;
