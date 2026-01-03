# Inventory Management System

## Overview

Sistema de gestión de inventario integrado con **ox_inventory** (si está disponible) con fallback para modo desarrollo.

## Architecture

### Client-Side (`client/inventory.lua`)

Exporta funciones que el dashboard puede llamar:

- `GiveItemToPlayer(itemName, quantity)` - Dar item al jugador
- `DropItem(itemName, quantity)` - Soltar item en el suelo
- `DeleteItem(itemName, quantity)` - Eliminar item permanentemente
- `ClearPlayerInventory()` - Vaciar inventario completo
- `OpenPlayerInventory(targetPlayerId)` - Abrir inventario de otro jugador (Admin)
- `IsOxInventoryAvailable()` - Verificar si ox_inventory está disponible

### Server-Side (`server/inventory.lua`)

Maneja todos los eventos de inventario:

#### Events

- `inventory:giveItem` - Recibe: itemName, quantity
- `inventory:dropItem` - Recibe: itemName, quantity
- `inventory:deleteItem` - Recibe: itemName, quantity
- `inventory:clearInventory` - Sin parámetros
- `inventory:getPlayerInventory` - Sin parámetros

#### Response Events (Client)

- `inventory:giveItem:response` - success: bool, message: string
- `inventory:dropItem:response` - success: bool, message: string
- `inventory:deleteItem:response` - success: bool, message: string
- `inventory:clearInventory:response` - success: bool, message: string
- `inventory:playerInventory` - items: table

### Frontend Integration

#### InventoryModal.tsx

El modal se conecta con el servidor mediante `window.invokeNative()`:

```typescript
// Llamar evento del servidor
window.invokeNative('triggerServerEvent', 'inventory:giveItem', itemName, quantity)
```

**Fallback Dev Mode**: Si `invokeNative` no está disponible, muestra alertas y logs en consola.

## Usage

### From Dashboard UI

El modal de inventario en `app/agent-network/page.tsx` (Players) usa:

```typescript
<InventoryModal
  playerId={player.id}
  playerName={player.name}
  items={playerInventories[player.id] || []}
  onClose={() => setShowInventory(false)}
/>
```

### From Lua Scripts

```lua
-- Dar item
TriggerEvent('inventory:giveItem', 'bread', 5)

-- Soltar item
TriggerEvent('inventory:dropItem', 'water', 2)

-- Eliminar item
TriggerEvent('inventory:deleteItem', 'phone', 1)

-- Limpiar inventario
TriggerEvent('inventory:clearInventory')
```

### From Other Resources

```lua
-- Exportar y usar directamente
local giveItem = exports['oxe_dashboard']:giveItem
giveItem('burger', 10)
```

## Features

### With ox_inventory

✅ Soporte completo de ox_inventory
✅ Validación de peso y capacidad
✅ Verificación de items válidos
✅ Manejo de errores del servidor
✅ Notificaciones en chat

### Without ox_inventory (Dev Mode)

✅ Fallback automático a modal visual
✅ Logs en consola para debugging
✅ Alertas para confirmación de acciones
✅ Sin dependencias externas

## Error Handling

El sistema valida en servidor:

- ✓ Existencia del item
- ✓ Cantidad válida (> 0)
- ✓ Capacidad del inventario (peso + slots)
- ✓ Permisos de admin (si aplica)

Los errores se devuelven al cliente con mensajes descriptivos.

## File Structure

```
oxe_dashboard_v1/
├── client/
│   ├── main.lua              # Carga inventory.lua
│   └── inventory.lua         # Funciones de inventario (cliente)
├── server/
│   ├── main.lua              # Carga inventory.lua
│   └── inventory.lua         # Lógica de inventario (servidor)
├── web/components/
│   └── InventoryModal.tsx    # UI del inventario
├── fxmanifest.lua            # Manifest con nuevos scripts
└── README.md                 # Este archivo
```

## Configuration

El sistema detecta automáticamente si `ox_inventory` está disponible:

```lua
local OxInventoryAvailable = GetResourceState('ox_inventory') == 'started'
```

No hay archivos de configuración adicionales requeridos.

## Development Workflow

1. **Sin ox_inventory**: Usa el modal como fallback
   - Las acciones se logean en consola
   - Las validaciones son básicas
   - Perfecto para testing

2. **Con ox_inventory**: Funcionalidad completa
   - Integración con ox_inventory real
   - Validaciones completas
   - Notificaciones en chat

## Future Enhancements

- [ ] WebSocket para sync en tiempo real
- [ ] Historial de transacciones
- [ ] Búsqueda/filtrado de items
- [ ] Atajos de teclado
- [ ] Animaciones de transferencia
- [ ] Soporte para containers y stashes
