-- Server-side Inventory Management
-- Handles inventory operations with ox_inventory

local OxInventoryAvailable = GetResourceState('ox_inventory') == 'started'

-- Give item to a player (Admin function)
RegisterServerEvent('inventory:giveItem')
AddEventHandler('inventory:giveItem', function(itemName, quantity)
    local src = source
    
    if not OxInventoryAvailable then
        -- Fallback: Dev mode
        lib.notify(src, { description = 'Dev Mode: Item given', type = 'info' })
        return
    end
    
    -- Validate item exists
    if not exports.ox_inventory:Items(itemName) then
        lib.notify(src, { description = 'Item does not exist', type = 'error' })
        return
    end
    
    -- Validate quantity
    if quantity <= 0 then
        lib.notify(src, { description = 'Invalid quantity', type = 'error' })
        return
    end
    
    -- Check if player can carry the item
    if not exports.ox_inventory:CanCarryItem(src, itemName, quantity) then
        lib.notify(src, { description = 'Inventory is full', type = 'error' })
        return
    end
    
    -- Add item to inventory
    local success = exports.ox_inventory:AddItem(src, itemName, quantity)
    
    if success then
        lib.notify(src, { description = 'Item added successfully', type = 'success' })
        print('^2[Inventory] Player ' .. src .. ' received ' .. quantity .. 'x ' .. itemName .. '^7')
    else
        lib.notify(src, { description = 'Failed to add item', type = 'error' })
    end
end)

-- Drop item from inventory
RegisterServerEvent('inventory:dropItem')
AddEventHandler('inventory:dropItem', function(itemName, quantity)
    local src = source
    
    if not OxInventoryAvailable then
        -- Fallback: Dev mode
        lib.notify(src, { description = 'Dev Mode: Item dropped', type = 'info' })
        return
    end
    
    -- Validate item exists
    if not exports.ox_inventory:Items(itemName) then
        lib.notify(src, { description = 'Item does not exist', type = 'error' })
        return
    end
    
    -- Remove item and create drop
    local success = exports.ox_inventory:RemoveItem(src, itemName, quantity)
    
    if success then
        -- Get player position to drop items
        local ped = GetPlayerPed(src)
        if ped and ped ~= 0 then
            local coords = GetEntityCoords(ped)
            -- Create a custom drop with the items
            exports.ox_inventory:CustomDrop(itemName, {
                { itemName, quantity }
            }, coords)
            
            lib.notify(src, { description = 'Item dropped successfully', type = 'success' })
            print('^2[Inventory] Player ' .. src .. ' dropped ' .. quantity .. 'x ' .. itemName .. '^7')
        else
            lib.notify(src, { description = 'Could not determine player position', type = 'error' })
        end
    else
        lib.notify(src, { description = 'Failed to drop item (you might not have it)', type = 'error' })
    end
end)

-- Delete item from inventory
RegisterServerEvent('inventory:deleteItem')
AddEventHandler('inventory:deleteItem', function(itemName, quantity)
    local src = source
    
    if not OxInventoryAvailable then
        -- Fallback: Dev mode
        lib.notify(src, { description = 'Dev Mode: Item deleted', type = 'info' })
        return
    end
    
    -- Validate item exists
    if not exports.ox_inventory:Items(itemName) then
        lib.notify(src, { description = 'Item does not exist', type = 'error' })
        return
    end
    
    -- Remove item from inventory (deleted, not dropped)
    local success = exports.ox_inventory:RemoveItem(src, itemName, quantity)
    
    if success then
        lib.notify(src, { description = 'Item deleted successfully', type = 'success' })
        print('^2[Inventory] Player ' .. src .. ' deleted ' .. quantity .. 'x ' .. itemName .. '^7')
    else
        lib.notify(src, { description = 'Failed to delete item (you might not have it)', type = 'error' })
    end
end)

-- Clear entire inventory
RegisterServerEvent('inventory:clearInventory')
AddEventHandler('inventory:clearInventory', function()
    local src = source
    
    if not OxInventoryAvailable then
        -- Fallback: Dev mode
        lib.notify(src, { description = 'Dev Mode: Inventory cleared', type = 'info' })
        return
    end
    
    -- Clear inventory using ox_inventory
    local success = exports.ox_inventory:ClearInventory(src)
    
    if success then
        lib.notify(src, { description = 'Inventory cleared successfully', type = 'success' })
        print('^2[Inventory] Player ' .. src .. ' inventory cleared^7')
    else
        lib.notify(src, { description = 'Failed to clear inventory', type = 'error' })
    end
end)

-- Get player inventory (for dev/sync)
RegisterServerEvent('inventory:getPlayerInventory')
AddEventHandler('inventory:getPlayerInventory', function()
    local src = source
    
    if not OxInventoryAvailable then
        -- Return mock data for dev mode
        TriggerClientEvent('inventory:playerInventory', src, {})
        return
    end
    
    -- Get inventory items from ox_inventory
    local items = exports.ox_inventory:GetInventoryItems(src)
    TriggerClientEvent('inventory:playerInventory', src, items or {})
end)

-- Export functions for use throughout the resource
exports('giveItemToPlayer', function(playerId, itemName, quantity)
    if OxInventoryAvailable then
        if exports.ox_inventory:CanCarryItem(playerId, itemName, quantity) then
            return exports.ox_inventory:AddItem(playerId, itemName, quantity)
        end
    end
    return false
end)

exports('dropItemFromPlayer', function(playerId, itemName, quantity)
    if OxInventoryAvailable then
        return exports.ox_inventory:RemoveItem(playerId, itemName, quantity)
    end
    return false
end)

exports('deleteItemFromPlayer', function(playerId, itemName, quantity)
    if OxInventoryAvailable then
        return exports.ox_inventory:RemoveItem(playerId, itemName, quantity)
    end
    return false
end)

exports('clearPlayerInventory', function(playerId)
    if OxInventoryAvailable then
        return exports.ox_inventory:ClearInventory(playerId)
    end
    return false
end)

-- Move item between slots (Admin reorganization)
RegisterServerEvent('inventory:moveItem')
AddEventHandler('inventory:moveItem', function(targetPlayerId, fromSlot, toSlot)
    local src = source
    
    if not OxInventoryAvailable then
        -- Fallback: Dev mode
        lib.notify(src, { description = 'Dev Mode: Item moved', type = 'info' })
        return
    end
    
    -- Validate slots
    if fromSlot <= 0 or toSlot <= 0 then
        lib.notify(src, { description = 'Invalid slot numbers', type = 'error' })
        return
    end
    
    -- Get the item from the source slot
    local sourceItem = exports.ox_inventory:GetSlot(targetPlayerId, fromSlot)
    
    if not sourceItem then
        lib.notify(src, { description = 'No item in source slot', type = 'error' })
        return
    end
    
    -- Check if target slot is empty or has same item
    local targetItem = exports.ox_inventory:GetSlot(targetPlayerId, toSlot)
    
    -- Remove item from source slot
    local removeSuccess = exports.ox_inventory:RemoveItem(targetPlayerId, sourceItem.name, sourceItem.count, sourceItem.metadata, fromSlot)
    
    if not removeSuccess then
        lib.notify(src, { description = 'Failed to remove item from source slot', type = 'error' })
        return
    end
    
    -- Add item to target slot
    local addSuccess = exports.ox_inventory:AddItem(targetPlayerId, sourceItem.name, sourceItem.count, sourceItem.metadata, toSlot)
    
    if addSuccess then
        lib.notify(src, { description = 'Item moved successfully', type = 'success' })
        print('^2[Inventory] Admin ' .. src .. ' moved ' .. sourceItem.name .. ' from slot ' .. fromSlot .. ' to slot ' .. toSlot .. ' for player ' .. targetPlayerId .. '^7')
    else
        -- If adding to target fails, try to restore the item to original slot
        exports.ox_inventory:AddItem(targetPlayerId, sourceItem.name, sourceItem.count, sourceItem.metadata, fromSlot)
        lib.notify(src, { description = 'Failed to move item to target slot', type = 'error' })
    end
end)

print('^3[Inventory] System loaded | ox_inventory: ' .. (OxInventoryAvailable and '^2Enabled' or '^1Disabled (Dev Mode)') .. '^7')
