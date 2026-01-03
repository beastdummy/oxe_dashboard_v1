-- Server-side Player Actions (Admin Panel)
-- Handles player manipulation with validations

local Framework = require '@ox_core/lib/init' or {}
local frozenPlayers = {}

-- Check if player is admin or moderator
local function IsAdmin(playerId)
    if Framework and Framework.GetPlayer then
        local player = Framework.GetPlayer(playerId)
        if player and (player.hasPermission('admin') or player.hasPermission('mod')) then
            return true
        end
    end
    -- Fallback: Allow in dev mode or no framework
    return true
end

-- Bring player to admin location
RegisterServerEvent('player:bring')
AddEventHandler('player:bring', function(targetPlayerId)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    -- Get admin's current location
    local adminPed = GetPlayerPed(adminId)
    local coords = GetEntityCoords(adminPed)
    
    -- Teleport target to admin
    local targetPed = GetPlayerPed(targetPlayerId)
    if targetPed and targetPed ~= 0 then
        SetEntityCoords(targetPed, coords.x, coords.y, coords.z, false, false, false, false)
        lib.notify(adminId, { description = 'Jugador traído exitosamente', type = 'success' })
        lib.notify(targetPlayerId, { description = 'Fuiste traído por un administrador', type = 'info' })
        print('^3[Actions] Admin ' .. adminId .. ' brought player ' .. targetPlayerId .. '^7')
    else
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
    end
end)

-- Go to player location
RegisterServerEvent('player:goTo')
AddEventHandler('player:goTo', function(targetPlayerId)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    -- Get target's current location
    local targetPed = GetPlayerPed(targetPlayerId)
    if targetPed and targetPed ~= 0 then
        local coords = GetEntityCoords(targetPed)
        
        -- Teleport admin to target
        local adminPed = GetPlayerPed(adminId)
        SetEntityCoords(adminPed, coords.x, coords.y, coords.z, false, false, false, false)
        lib.notify(adminId, { description = 'Teleportado al jugador', type = 'success' })
        print('^3[Actions] Admin ' .. adminId .. ' went to player ' .. targetPlayerId .. '^7')
    else
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
    end
end)

-- Heal player
RegisterServerEvent('player:heal')
AddEventHandler('player:heal', function(targetPlayerId)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    local targetPed = GetPlayerPed(targetPlayerId)
    if targetPed and targetPed ~= 0 then
        SetEntityHealth(targetPed, 200)
        AddArmourToEntity(targetPed, 100)
        lib.notify(adminId, { description = 'Jugador sanado', type = 'success' })
        lib.notify(targetPlayerId, { description = 'Fuiste sanado por un administrador', type = 'info' })
        print('^2[Actions] Admin ' .. adminId .. ' healed player ' .. targetPlayerId .. '^7')
    else
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
    end
end)

-- Kill player
RegisterServerEvent('player:kill')
AddEventHandler('player:kill', function(targetPlayerId)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    local targetPed = GetPlayerPed(targetPlayerId)
    if targetPed and targetPed ~= 0 then
        ApplyDamageToPed(targetPed, 1000, 0)
        lib.notify(adminId, { description = 'Jugador eliminado', type = 'success' })
        lib.notify(targetPlayerId, { description = 'Fuiste eliminado por un administrador', type = 'error' })
        print('^1[Actions] Admin ' .. adminId .. ' killed player ' .. targetPlayerId .. '^7')
    else
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
    end
end)

-- Freeze/Unfreeze player
RegisterServerEvent('player:freeze')
AddEventHandler('player:freeze', function(targetPlayerId)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    local targetPed = GetPlayerPed(targetPlayerId)
    if targetPed and targetPed ~= 0 then
        -- Toggle freeze state
        local isFrozen = frozenPlayers[targetPlayerId] or false
        local newState = not isFrozen
        
        FreezeEntityPosition(targetPed, newState)
        frozenPlayers[targetPlayerId] = newState
        
        local msg = newState and 'congelado' or 'descongelado'
        lib.notify(adminId, { description = 'Jugador ' .. msg, type = 'success' })
        lib.notify(targetPlayerId, { description = 'Fuiste ' .. msg .. ' por un administrador', type = 'info' })
        print('^3[Actions] Admin ' .. adminId .. ' ' .. msg .. ' player ' .. targetPlayerId .. '^7')
    else
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
    end
end)

-- Slap player (100 damage)
RegisterServerEvent('player:slap')
AddEventHandler('player:slap', function(targetPlayerId)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    local targetPed = GetPlayerPed(targetPlayerId)
    if targetPed and targetPed ~= 0 then
        ApplyDamageToPed(targetPed, 100, 0)
        lib.notify(adminId, { description = 'Jugador golpeado', type = 'success' })
        lib.notify(targetPlayerId, { description = '¡Fuiste golpeado!', type = 'error' })
        print('^3[Actions] Admin ' .. adminId .. ' slapped player ' .. targetPlayerId .. '^7')
    else
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
    end
end)

-- Burn player
RegisterServerEvent('player:burn')
AddEventHandler('player:burn', function(targetPlayerId)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    local targetPed = GetPlayerPed(targetPlayerId)
    if targetPed and targetPed ~= 0 then
        StartEntityFire(targetPed)
        lib.notify(adminId, { description = 'Jugador incendiado', type = 'success' })
        lib.notify(targetPlayerId, { description = '¡Estás en fuego!', type = 'error' })
        print('^1[Actions] Admin ' .. adminId .. ' burned player ' .. targetPlayerId .. '^7')
    else
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
    end
end)

-- Electrocute player (300 damage + effect)
RegisterServerEvent('player:electrocute')
AddEventHandler('player:electrocute', function(targetPlayerId)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    local targetPed = GetPlayerPed(targetPlayerId)
    if targetPed and targetPed ~= 0 then
        ApplyDamageToPed(targetPed, 300, 0)
        lib.notify(adminId, { description = 'Jugador electrocutado', type = 'success' })
        lib.notify(targetPlayerId, { description = '¡Fuiste electrocutado!', type = 'error' })
        print('^3[Actions] Admin ' .. adminId .. ' electrocuted player ' .. targetPlayerId .. '^7')
    else
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
    end
end)

-- Teleport player to specific coordinates
RegisterServerEvent('player:teleportToCoords')
AddEventHandler('player:teleportToCoords', function(targetPlayerId, x, y, z)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    local targetPed = GetPlayerPed(targetPlayerId)
    if targetPed and targetPed ~= 0 then
        SetEntityCoords(targetPed, x, y, z, false, false, false, false)
        lib.notify(adminId, { description = 'Jugador teleportado', type = 'success' })
        print('^3[Actions] Admin ' .. adminId .. ' teleported player ' .. targetPlayerId .. ' to (' .. x .. ', ' .. y .. ', ' .. z .. ')^7')
    else
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
    end
end)

-- Helper function to check admin/moderation permission
function IsAdminOrModeration(source)
    return IsAdmin(source)
end

print('^3[Actions] System loaded | Framework: ' .. (Framework and 'ox_core' or 'None') .. '^7')
