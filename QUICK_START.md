# Quick Integration Guide

## Sistema de Inventario - Guía Rápida

### ¿Cómo funciona?

El sistema tiene dos modos:

1. **Con ox_inventory**: Integración completa con ox_inventory
2. **Sin ox_inventory (Dev Mode)**: Modal visual como fallback

### Flujo de datos

```
React UI (InventoryModal.tsx)
    ↓
window.invokeNative('triggerServerEvent', 'inventory:giveItem', ...)
    ↓
Client Lua (client/inventory.lua)
    ↓
TriggerServerEvent('inventory:giveItem', ...)
    ↓
Server Lua (server/inventory.lua)
    ↓
exports.ox_inventory:AddItem() (si disponible)
    ↓
Respuesta al cliente
    ↓
Notificación en chat/UI
```

### Archivos principales

#### 1. Client-side
- `client/inventory.lua` - Funciones exportadas y manejo de eventos

#### 2. Server-side  
- `server/inventory.lua` - Lógica de validación y ejecución

#### 3. Frontend
- `web/components/InventoryModal.tsx` - UI del inventario
- `web/lib/types/inventory.ts` - Tipos de datos

### Eventos disponibles

**Del cliente al servidor:**
```lua
TriggerServerEvent('inventory:giveItem', itemName, quantity)
TriggerServerEvent('inventory:dropItem', itemName, quantity)
TriggerServerEvent('inventory:deleteItem', itemName, quantity)
TriggerServerEvent('inventory:clearInventory')
TriggerServerEvent('inventory:getPlayerInventory')
```

**Del servidor al cliente:**
```lua
TriggerClientEvent('inventory:giveItem:response', playerId, success, message)
TriggerClientEvent('inventory:dropItem:response', playerId, success, message)
TriggerClientEvent('inventory:deleteItem:response', playerId, success, message)
TriggerClientEvent('inventory:clearInventory:response', playerId, success, message)
TriggerClientEvent('inventory:playerInventory', playerId, items)
```

### Cómo probar

#### En Dev Mode (sin ox_inventory)
1. Abre el dashboard (/dashboard)
2. Ve a Players/Jugadores
3. Haz click en "Ver Inventario"
4. Las acciones mostrarán alertas (modo dev)
5. Revisa la consola del navegador para logs

#### Con ox_inventory
1. Asegúrate de que ox_inventory esté activo
2. Las acciones irán directamente al servidor
3. Verás notificaciones en el chat de FiveM
4. Los cambios se reflejarán en tiempo real

### Validaciones

El servidor valida:
- ✓ Item existe en ox_inventory
- ✓ Cantidad > 0
- ✓ Hay espacio en inventario (peso + slots)
- ✓ El jugador tiene el item (para drop/delete)

### Debuggin

**Logs del cliente:**
```javascript
// En navegador (F12)
console.log('[Dev Mode] Give: 5x bread')
```

**Logs del servidor:**
```lua
-- En FiveM console
[Inventory] Player 1 received 5x bread
```

### Próximos pasos

- [ ] Conectar con sistema de permisos de admin
- [ ] Agregar historial de transacciones
- [ ] Sync en tiempo real con WebSocket
- [ ] Animaciones de transferencia
- [ ] Búsqueda de items

---

**Última actualización:** 3 de Enero de 2026
