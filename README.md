# 🎮 OXE Dashboard v1

A **production-ready admin dashboard system** for FiveM servers, built with React, TypeScript, Next.js, and Lua. Features independent persistent modals, draggable floating controls, and seamless Lua integration.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/beastdummy/oxe_dashboard_v1)
[![Status](https://img.shields.io/badge/Status-Production--Ready-green)]()
[![Errors](https://img.shields.io/badge/Errors-0-brightgreen)]()

---

## ✨ Features

### 🎯 Admin Panel
- **8 Admin Actions** - Traer, Ir a Jugador, Sanar, Congelar, Golpear, Quemar, Electrocutar, Matar
- **Player Management** - View, filter, and manage players
- **Inventory System** - Give, drop, delete items with server validation
- **Independent Modals** - Modals persist when dashboard is minimized
- **Draggable Interface** - All modals and controls are movable

### 🎨 User Interface
- **Dark Theme** - Professional dark mode with orange accents
- **Responsive Design** - Works on desktop and mobile
- **Multi-language** - English/Spanish toggle
- **Smooth Animations** - Delta-based dragging with boundary constraints
- **Icon Integration** - 200+ weapon and item icons

### ⚙️ Technical Features
- **Global State Management** - React Context for all modals
- **Floating Icon System** - Restore dashboard from any screen corner
- **Lua Integration** - Auto-detection of ox_inventory with fallback
- **Type-Safe** - Full TypeScript support
- **Zero Config** - Works with and without ox_inventory
- **Production Ready** - Server-side validation, error handling, logging

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/pnpm
- **FiveM** server (ESX or standalone compatible)
- **ox_lib** and **ox_inventory** (optional)

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/beastdummy/oxe_dashboard_v1.git
cd oxe_dashboard_v1
```

#### 2. Install Dependencies
```bash
cd web
npm install
# or
pnpm install
```

#### 3. Development Server
```bash
npm run dev
```

Access at `http://localhost:3000`

#### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
oxe_dashboard_v1/
├── 📄 fxmanifest.lua              # Resource manifest
├── 📄 .luarc.json                 # Lua diagnostics config
│
├── 📁 client/                     # FiveM Client Scripts
│   ├── main.lua                   # Client entry point
│   ├── inventory.lua              # Inventory system (125 lines)
│   ├── actions.lua                # Admin action handlers
│   └── inventory_test.lua         # Debug commands
│
├── 📁 server/                     # FiveM Server Scripts
│   ├── main.lua                   # Server entry point
│   ├── inventory.lua              # Inventory operations (215 lines)
│   └── actions.lua                # Server-side action handlers
│
├── 📁 shared/                     # Shared Configuration
│   ├── config.lua                 # Configuration
│   ├── permissions.lua            # Permission system
│   └── framework/
│       └── ox_core.lua            # Core framework
│
└── 📁 web/                        # React/Next.js Frontend
    ├── 📁 app/                    # Application pages
    │   ├── page.tsx               # Main dashboard
    │   ├── layout.tsx             # Root layout
    │   ├── agent-network/         # Player management
    │   ├── command-center/        # Command center
    │   ├── operations/            # Operations
    │   ├── intelligence/          # Intelligence
    │   └── systems/               # Systems
    │
    ├── 📁 components/             # React Components
    │   ├── ModalsContext.tsx       # Global modal state
    │   ├── GlobalModals.tsx        # Modal renderer
    │   ├── DashboardLayout.tsx     # Layout wrapper
    │   ├── FloatingIcon.tsx        # Draggable icon
    │   ├── ActionsModal.tsx        # Actions grid (3-column)
    │   ├── InventoryModal.tsx      # Inventory popup
    │   └── ui/                     # UI components
    │
    ├── 📁 context/                # React Context
    │   ├── ModalsContext.tsx       # Modal state management
    │   └── LanguageContext.tsx     # Language switcher
    │
    ├── 📁 lib/                    # Utilities
    │   ├── types/                 # TypeScript types
    │   ├── translations/          # i18n (EN/ES)
    │   └── config/                # Configuration
    │
    └── 📁 public/                 # Static assets
        └── inventory-icons/       # 200+ icons
```

---

## 🎮 Usage

### Open Dashboard
```lua
-- In-game command
/dashboard
```

### View Player Inventory
1. Navigate to **Agent Network**
2. Click on a player
3. Click **Ver Inventario** button
4. Use action buttons:
   - 📦 **Dar Item** - Give item
   - 💨 **Soltar** - Drop item
   - 🗑️ **Eliminar** - Delete item
   - 🧹 **Borrar Todo** - Clear inventory

### Use Admin Actions
1. Navigate to **Agent Network**
2. Click on a player
3. Click **⚡ Acciones** button
4. Select action from modal:
   - 🚗 **Traer** - Bring to you
   - 📍 **Ir a Jugador** - Teleport to player
   - 💚 **Sanar** - Heal
   - ❄️ **Congelar** - Freeze
   - 👊 **Golpear** - Hit
   - 🔥 **Quemar** - Burn
   - ⚡ **Electrocutar** - Shock
   - 💀 **Matar** - Kill

### Minimize Dashboard
- Click **Minimize** button (📉) in top-right
- Dashboard collapses to draggable floating icon
- Icon can be moved anywhere on screen
- Click icon menu to restore or close

### Switch Language
- Click **EN/ES** button in top-right
- Dashboard switches between English and Spanish

---

## 🔧 Development

### Add New Admin Action

**1. Update Modal** (`web/components/ActionsModal.tsx`)
```tsx
{
  label: "Nueva Acción",
  emoji: "🆕",
  action: "newAction",
  color: "blue" // or "red" for destructive
}
```

**2. Add Handler** (`server/actions.lua`)
```lua
RegisterNetEvent('admin:newAction', function(targetId)
  -- Validate permissions
  -- Execute action
  -- Send response
end)
```

**3. Update Translations** (`web/lib/translations/`)
- Add label in `es.ts` and `en.ts`

### Add New Modal

**1. Create State** (`web/context/ModalsContext.tsx`)
```typescript
newModal: {
  isOpen: boolean
  // ... other state
}
openNewModal: () => void
closeNewModal: () => void
```

**2. Create Component** (`web/components/NewModal.tsx`)
```tsx
export function NewModal() {
  const { newModal, closeNewModal } = useModals()
  // Render modal
}
```

**3. Render** (`web/components/GlobalModals.tsx`)
```tsx
{newModal.isOpen && <NewModal />}
```

### Change Theme Colors

Edit `web/tailwind.config.ts` and update color variables, then update component classNames.

---

## 📊 Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18+ | UI Framework |
| Next.js | 15 | Full-stack framework |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 3+ | Styling |
| lucide-react | Latest | Icons |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Lua | 5.4 | Server scripts |
| FiveM | Latest | Game server |
| ox_lib | Latest | Libraries |
| ox_inventory | Optional | Inventory system |

---

## 🔐 Permissions System

The dashboard includes a permission-based system. Check `shared/permissions.lua` for role definitions.

**Admin Roles:**
- `admin` - Full access
- `moderator` - Limited actions
- `support` - View-only access

---

## 🐛 Troubleshooting

### Dashboard Won't Open
```lua
-- Check console for errors
-- Verify /dashboard command is registered
-- Ensure web folder is built: npm run build
```

### Actions Not Working
```lua
-- Check server console for event logs
-- Verify player permissions
-- Confirm ox_inventory is loaded (if using)
```

### Inventory Icons Missing
```
Ensure web/public/inventory-icons/ has all required icons
Or add custom icons for your items
```

### Drag Not Working
- Clear browser cache (F12 → Application → Clear Storage)
- Restart dev server: `npm run dev`
- Check console for errors

---

## 📚 Documentation

- **[SESSION_STATUS.md](./SESSION_STATUS.md)** - Detailed session status and continuation guide
- **[INVENTORY_SYSTEM.md](./INVENTORY_SYSTEM.md)** - Inventory architecture documentation
- **[QUICK_START.md](./QUICK_START.md)** - Quick setup guide
- **[CHANGELOG.md](./CHANGELOG.md)** - Complete change history
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System diagrams and data flows

---

## 🚢 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Server Deployment
1. Build the web folder: `npm run build`
2. Place resource in FiveM `resources` folder
3. Add to `server.cfg`:
   ```
   ensure oxe_dashboard_v1
   setr oxe_dashboard_port 3000
   ```

---

## 🎯 Roadmap

- [ ] WebSocket for real-time sync
- [ ] Admin transaction history
- [ ] Advanced search/filtering
- [ ] Keyboard shortcuts (Ctrl+C, Ctrl+X)
- [ ] Transfer animations
- [ ] Container/stash integration
- [ ] Message system modal
- [ ] Ban/suspension interface
- [ ] Performance optimizations
- [ ] Dark/Light theme toggle

---

## 🤝 Contributing

This is a production system. For enhancements:

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 📞 Support

- 📧 Report issues on GitHub
- 💬 Check existing documentation
- 🔍 Search [SESSION_STATUS.md](./SESSION_STATUS.md) for continuation guide

---

## 🙏 Credits

Built with ❤️ for FiveM communities.

**Technologies Used:**
- React & Next.js
- TypeScript
- Tailwind CSS
- FiveM Framework
- ox_lib/ox_inventory

---

**Last Updated:** January 3, 2026  
**Status:** ✅ Production-Ready  
**Errors:** 0 | **Warnings:** 0

