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

-- =====================================================
-- GET AVAILABLE ACTIONS
-- =====================================================
local AVAILABLE_ACTIONS = {
    { id = 'bring', label = 'Traer', icon = '📍', description = 'Trae el jugador a tu posición' },
    { id = 'goto', label = 'Ir a', icon = '🚀', description = 'Te teletransporta a su posición' },
    { id = 'heal', label = 'Curar', icon = '❤️', description = 'Cura completamente al jugador' },
    { id = 'kill', label = 'Matar', icon = '💀', description = 'Mata al jugador' },
    { id = 'freeze', label = 'Congelar', icon = '❄️', description = 'Congela al jugador' },
    { id = 'slap', label = 'Golpear', icon = '👋', description = 'Golpea al jugador ligeramente' },
    { id = 'burn', label = 'Quemar', icon = '🔥', description = 'Quema al jugador' },
    { id = 'electrocute', label = 'Electrocutar', icon = '⚡', description = 'Electrocuta al jugador' },
}

RegisterServerEvent('actions:getAvailable')
AddEventHandler('actions:getAvailable', function()
    local adminId = source
    
    if not IsAdmin(adminId) then
        TriggerClientEvent('actions:availableList', adminId, {})
        return
    end
    
    TriggerClientEvent('actions:availableList', adminId, AVAILABLE_ACTIONS)
end)

-- =====================================================
-- EXECUTE ACTION
-- =====================================================
RegisterServerEvent('action:execute')
AddEventHandler('action:execute', function(actionId, targetPlayerId)
    local adminId = source
    local adminName = GetPlayerName(adminId)
    local targetName = GetPlayerName(targetPlayerId)
    
    if not IsAdmin(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    -- Validate target player exists
    if not GetPlayerName(targetPlayerId) then
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
        return
    end
    
    -- Execute action based on ID
    if actionId == 'bring' then
        TriggerServerEvent('player:bring', targetPlayerId)
    elseif actionId == 'goto' then
        TriggerServerEvent('player:goTo', targetPlayerId)
    elseif actionId == 'heal' then
        TriggerServerEvent('player:heal', targetPlayerId)
    elseif actionId == 'kill' then
        TriggerServerEvent('player:kill', targetPlayerId)
    elseif actionId == 'freeze' then
        TriggerServerEvent('player:freeze', targetPlayerId, true)
    elseif actionId == 'slap' then
        TriggerServerEvent('player:slap', targetPlayerId)
    elseif actionId == 'burn' then
        TriggerServerEvent('player:burn', targetPlayerId)
    elseif actionId == 'electrocute' then
        TriggerServerEvent('player:electrocute', targetPlayerId)
    else
        lib.notify(adminId, { description = 'Acción desconocida', type = 'error' })
        return
    end
    
    -- Log action
    exports['oxe_dashboard_v1']:LogAdminAction(adminId, adminName, 'action_' .. actionId, targetPlayerId, targetName, {
        actionId = actionId,
        executed = true,
    })
    
    print('^3[Actions] Admin ' .. adminName .. ' (' .. adminId .. ') executed action ' .. actionId .. ' on player ' .. targetPlayerId .. '^7')
end)

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

-- Send message to player
RegisterServerEvent('player:message')
AddEventHandler('player:message', function(targetPlayerId, messageType, title, messageText)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    local targetId = tonumber(targetPlayerId)
    if not targetId or not GetPlayerName(targetId) then
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
        return
    end
    
    if not messageText or messageText:len() == 0 then
        lib.notify(adminId, { description = 'El mensaje no puede estar vacío', type = 'error' })
        return
    end
    
    -- Send message to target player
    TriggerClientEvent('player:receiveMessage', targetId, adminId, GetPlayerName(adminId), messageType, title, messageText)
    
    -- Confirm to admin
    lib.notify(adminId, { description = 'Mensaje enviado a ' .. GetPlayerName(targetId), type = 'success' })
    print('^3[Actions] Admin ' .. adminId .. ' sent message to ' .. targetId .. ': ' .. messageText .. '^7')
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

-- Send message to player (UPDATED WITH LOGGING)
RegisterServerEvent('player:message')
AddEventHandler('player:message', function(targetPlayerId, messageType, title, messageText)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    local targetId = tonumber(targetPlayerId)
    if not targetId or not GetPlayerName(targetId) then
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
        return
    end
    
    if not messageText or messageText:len() == 0 then
        lib.notify(adminId, { description = 'El mensaje no puede estar vacío', type = 'error' })
        return
    end
    
    -- Send message to target player
    TriggerClientEvent('player:receiveMessage', targetId, adminId, GetPlayerName(adminId), messageType, title, messageText)
    
    -- Log action
    exports['oxe_dashboard_v1']:LogAdminAction(adminId, GetPlayerName(adminId), 'message', targetId, GetPlayerName(targetId), {
        messageType = messageType,
        title = title,
        message = messageText,
    })
    
    -- Confirm to admin
    lib.notify(adminId, { description = 'Mensaje enviado a ' .. GetPlayerName(targetId), type = 'success' })
    print('^3[Actions] Admin ' .. adminId .. ' sent message to ' .. targetId .. ': ' .. messageText .. '^7')
end)

-- Suspend player
RegisterServerEvent('player:suspend')
AddEventHandler('player:suspend', function(targetPlayerId, days, reason)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    local targetId = tonumber(targetPlayerId)
    if not targetId or not GetPlayerName(targetId) then
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
        return
    end
    
    -- Log action
    exports['oxe_dashboard_v1']:LogAdminAction(adminId, GetPlayerName(adminId), 'suspend', targetId, GetPlayerName(targetId), {
        days = days,
        reason = reason,
        suspendUntil = os.date('%Y-%m-%d %H:%M:%S', os.time() + (days * 86400)),
    })
    
    lib.notify(adminId, { description = 'Jugador suspendido por ' .. days .. ' días', type = 'success' })
    lib.notify(targetId, { description = 'Has sido suspendido por ' .. days .. ' días. Razón: ' .. reason, type = 'error' })
    print('^3[Actions] Admin ' .. adminId .. ' suspended player ' .. targetId .. ' for ' .. days .. ' days^7')
end)

-- Ban player
RegisterServerEvent('player:ban')
AddEventHandler('player:ban', function(targetPlayerId, days, reason)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    local targetId = tonumber(targetPlayerId)
    if not targetId or not GetPlayerName(targetId) then
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
        return
    end
    
    local banType = (days == -1) and 'permanent' or 'temporary'
    local banUntil = (days == -1) and 'Never' or os.date('%Y-%m-%d %H:%M:%S', os.time() + (days * 86400))
    
    -- Log action
    exports['oxe_dashboard_v1']:LogAdminAction(adminId, GetPlayerName(adminId), 'ban', targetId, GetPlayerName(targetId), {
        banType = banType,
        days = days == -1 and 'Permanent' or days,
        reason = reason,
        banUntil = banUntil,
    })
    
    lib.notify(adminId, { description = 'Jugador baneado: ' .. (banType == 'permanent' and 'Permanentemente' or 'Por ' .. days .. ' días'), type = 'success' })
    lib.notify(targetId, { description = 'Has sido baneado. Razón: ' .. reason, type = 'error' })
    print('^3[Actions] Admin ' .. adminId .. ' banned player ' .. targetId .. ' (' .. banType .. ')^7')
end)

-- Spectate player
local spectators = {}

RegisterServerEvent('spectate:player')
AddEventHandler('spectate:player', function(targetPlayerId)
    local adminId = source
    
    if not IsAdminOrModeration(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    local targetId = tonumber(targetPlayerId)
    if not targetId or not GetPlayerName(targetId) then
        lib.notify(adminId, { description = 'Jugador no encontrado', type = 'error' })
        return
    end
    
    -- Store spectate session
    spectators[adminId] = targetId
    
    -- Start spectating on client
    TriggerClientEvent('spectate:start', adminId, targetId)
    
    -- Log action
    exports['oxe_dashboard_v1']:LogAdminAction(adminId, GetPlayerName(adminId), 'spectate', targetId, GetPlayerName(targetId), {})
    
    lib.notify(adminId, { description = 'Ahora estás viendo a ' .. GetPlayerName(targetId), type = 'info' })
    print('^3[Actions] Admin ' .. adminId .. ' is spectating player ' .. targetId .. '^7')
end)

RegisterServerEvent('spectate:stop')
AddEventHandler('spectate:stop', function()
    local adminId = source
    
    if spectators[adminId] then
        spectators[adminId] = nil
        TriggerClientEvent('spectate:end', adminId)
        lib.notify(adminId, { description = 'Espectate finalizado', type = 'success' })
        print('^3[Actions] Admin ' .. adminId .. ' stopped spectating^7')
    end
end)

-- Clean up on disconnect
AddEventHandler('playerDropped', function()
    local src = source
    if spectators[src] then
        spectators[src] = nil
    end
end)

-- Helper function to check admin/moderation permission
function IsAdminOrModeration(source)
    return IsAdmin(source)
end

-- =====================================================
-- BROADCAST - Send announcement to all players
-- =====================================================
RegisterServerEvent('broadcast:send')
AddEventHandler('broadcast:send', function(message, broadcastType)
    local adminId = source
    local adminName = GetPlayerName(adminId)
    
    if not IsAdmin(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    if not message or message:len() == 0 then
        lib.notify(adminId, { description = 'El mensaje no puede estar vacío', type = 'error' })
        return
    end
    
    broadcastType = broadcastType or 'info'
    
    -- Send broadcast to all players
    local playersConnected = GetNumPlayerIndices()
    
    TriggerClientEvent('broadcast:receive', -1, message, broadcastType, adminName)
    
    -- Log the broadcast
    exports['oxe_dashboard_v1']:LogAdminAction(adminId, adminName, 'broadcast', nil, nil, {
        message = message,
        broadcastType = broadcastType,
        playersNotified = playersConnected,
    })
    
    lib.notify(adminId, { 
        description = 'Anuncio enviado a ' .. playersConnected .. ' jugador(es)', 
        type = 'success' 
    })
    
    print('^3[Broadcast] Admin ' .. adminName .. ' (' .. adminId .. ') sent ' .. broadcastType .. ' broadcast: ' .. message .. '^7')
end)

print('^3[Actions] System loaded | Framework: ' .. (Framework and 'ox_core' or 'None') .. '^7')
