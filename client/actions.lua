-- Client-side Player Actions (Admin Panel)
-- Handles player manipulation like teleport, damage, etc.

local PlayerPed = PlayerPedId()

-- Bring player to admin location
local function BringPlayer(targetPlayerId)
    TriggerServerEvent('player:bring', targetPlayerId)
end

-- Go to player location
local function GoToPlayer(targetPlayerId)
    TriggerServerEvent('player:goTo', targetPlayerId)
end

-- Heal player
local function HealPlayer(targetPlayerId)
    TriggerServerEvent('player:heal', targetPlayerId)
end

-- Kill player
local function KillPlayer(targetPlayerId)
    TriggerServerEvent('player:kill', targetPlayerId)
end

-- Freeze/Unfreeze player
local function FreezePlayer(targetPlayerId, freeze)
    TriggerServerEvent('player:freeze', targetPlayerId, freeze)
end

-- Slap player (small damage)
local function SlapPlayer(targetPlayerId)
    TriggerServerEvent('player:slap', targetPlayerId)
end

-- Burn player
local function BurnPlayer(targetPlayerId)
    TriggerServerEvent('player:burn', targetPlayerId)
end

-- Electrocute player (damage + effect)
local function ElectrocutePlayer(targetPlayerId)
    TriggerServerEvent('player:electrocute', targetPlayerId)
end

-- Teleport player to coordinates
local function TeleportToCoords(targetPlayerId, x, y, z)
    TriggerServerEvent('player:teleportToCoords', targetPlayerId, x, y, z)
end

-- Get admin coordinates for bringing player
local function GetAdminCoords()
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    return coords
end

-- Listen for server responses
RegisterNetEvent('player:action:response')
AddEventHandler('player:action:response', function(success, message)
    if success then
        lib.notify({ description = message, type = 'success' })
    else
        lib.notify({ description = message, type = 'error' })
    end
end)

-- Exports for use from other resources
exports('BringPlayer', BringPlayer)
exports('GoToPlayer', GoToPlayer)
exports('HealPlayer', HealPlayer)
exports('KillPlayer', KillPlayer)
exports('FreezePlayer', FreezePlayer)
exports('SlapPlayer', SlapPlayer)
exports('BurnPlayer', BurnPlayer)
exports('ElectrocutePlayer', ElectrocutePlayer)
exports('TeleportToCoords', TeleportToCoords)
exports('GetAdminCoords', GetAdminCoords)

print('^3[Actions] System loaded^7')
