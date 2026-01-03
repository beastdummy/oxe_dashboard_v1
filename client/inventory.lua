-- Client-side Inventory Management
-- Handles inventory operations with fallback for dev mode (no ox_inventory)

local OxInventoryAvailable = GetResourceState('ox_inventory') == 'started'

-- Check if ox_inventory is available
function IsOxInventoryAvailable()
    return OxInventoryAvailable
end

-- Get player inventory
function GetPlayerInventory()
    if not OxInventoryAvailable then
        -- Fallback: Return mock data for dev mode
        TriggerServerEvent('inventory:getPlayerInventory')
        return nil
    end
    
    -- Use ox_inventory
    local inventory = exports.ox_inventory:GetInventory(cache.serverId)
    return inventory
end

-- Give item to player
function GiveItemToPlayer(itemName, quantity)
    if not OxInventoryAvailable then
        -- Fallback: Show notification in dev mode
        TriggerEvent('chat:addMessage', {
            args = { 'Inventory', 'Dev Mode: Give ' .. quantity .. 'x ' .. itemName }
        })
        return true
    end
    
    -- Use ox_inventory - trigger server event
    TriggerServerEvent('inventory:giveItem', itemName, quantity)
    return true
end

-- Drop item
function DropItem(itemName, quantity)
    if not OxInventoryAvailable then
        -- Fallback: Show notification in dev mode
        TriggerEvent('chat:addMessage', {
            args = { 'Inventory', 'Dev Mode: Drop ' .. quantity .. 'x ' .. itemName }
        })
        return true
    end
    
    -- Use ox_inventory - trigger server event
    TriggerServerEvent('inventory:dropItem', itemName, quantity)
    return true
end

-- Delete item
function DeleteItem(itemName, quantity)
    if not OxInventoryAvailable then
        -- Fallback: Show notification in dev mode
        TriggerEvent('chat:addMessage', {
            args = { 'Inventory', 'Dev Mode: Delete ' .. quantity .. 'x ' .. itemName }
        })
        return true
    end
    
    -- Use ox_inventory - trigger server event
    TriggerServerEvent('inventory:deleteItem', itemName, quantity)
    return true
end

-- Clear entire inventory
function ClearPlayerInventory()
    if not OxInventoryAvailable then
        -- Fallback: Show notification in dev mode
        TriggerEvent('chat:addMessage', {
            args = { 'Inventory', 'Dev Mode: Clear entire inventory' }
        })
        return true
    end
    
    -- Use ox_inventory - trigger server event
    TriggerServerEvent('inventory:clearInventory')
    return true
end

-- Open another player's inventory (Admin)
function OpenPlayerInventory(targetPlayerId)
    if not OxInventoryAvailable then
        -- Fallback: Show notification in dev mode
        TriggerEvent('chat:addMessage', {
            args = { 'Inventory', 'Dev Mode: Open inventory for player ' .. targetPlayerId }
        })
        return true
    end
    
    -- Use ox_inventory - open target player's inventory
    exports.ox_inventory:forceOpenInventory(targetPlayerId, 'player', targetPlayerId)
    return true
end

-- Listen for inventory update responses from server
RegisterNetEvent('inventory:giveItem:response', function(success, message)
    if success then
        TriggerEvent('chat:addMessage', {
            args = { 'Inventory', 'Item given successfully' }
        })
    else
        TriggerEvent('chat:addMessage', {
            args = { 'Inventory [Error]', message }
        })
    end
end)

RegisterNetEvent('inventory:dropItem:response', function(success, message)
    if success then
        TriggerEvent('chat:addMessage', {
            args = { 'Inventory', 'Item dropped successfully' }
        })
    else
        TriggerEvent('chat:addMessage', {
            args = { 'Inventory [Error]', message }
        })
    end
end)

RegisterNetEvent('inventory:deleteItem:response', function(success, message)
    if success then
        TriggerEvent('chat:addMessage', {
            args = { 'Inventory', 'Item deleted successfully' }
        })
    else
        TriggerEvent('chat:addMessage', {
            args = { 'Inventory [Error]', message }
        })
    end
end)

RegisterNetEvent('inventory:clearInventory:response', function(success, message)
    if success then
        TriggerEvent('chat:addMessage', {
            args = { 'Inventory', 'Inventory cleared successfully' }
        })
    else
        TriggerEvent('chat:addMessage', {
            args = { 'Inventory [Error]', message }
        })
    end
end)

-- =====================================================
-- RECEIVE PLAYER INVENTORY (Admin panel)
-- =====================================================
RegisterNetEvent('inventory:playerData')
AddEventHandler('inventory:playerData', function(targetPlayerId, inventoryData)
    -- Este event es recibido y procesado por el frontend
    -- Los datos se envían al dashboard mediante callback
    TriggerEvent('oxe_dashboard:inventoryUpdate', targetPlayerId, inventoryData)
    
    print('^3[Inventory] Received inventory data for player ' .. targetPlayerId .. ' with ' .. #inventoryData .. ' items^7')
end)

-- Export functions for use throughout the resource
exports('giveItem', GiveItemToPlayer)
exports('dropItem', DropItem)
exports('deleteItem', DeleteItem)
exports('clearInventory', ClearPlayerInventory)
exports('openPlayerInventory', OpenPlayerInventory)
exports('isOxInventoryAvailable', IsOxInventoryAvailable)
