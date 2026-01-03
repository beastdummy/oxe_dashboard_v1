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
-- Receive message from admin
RegisterNetEvent('player:receiveMessage')
AddEventHandler('player:receiveMessage', function(adminId, adminName, messageType, title, messageText)
    exports['oxe_dashboard_v1']:NotifyAdminMessage(adminName, messageText, messageType)
end)
-- Spectate player
local isSpectating = false
local spectateTarget = nil

local function SpectatePlayer(targetPlayerId)
    TriggerServerEvent('spectate:player', targetPlayerId)
end

local function StopSpectate()
    if isSpectating then
        TriggerServerEvent('spectate:stop')
    end
end

RegisterNetEvent('spectate:start')
AddEventHandler('spectate:start', function(targetPlayerId)
    local targetPed = GetPlayerPed(GetPlayerFromServerId(targetPlayerId))
    
    if targetPed == 0 or not DoesEntityExist(targetPed) then
        lib.notify({ description = 'No se pudo encontrar al jugador', type = 'error' })
        return
    end
    
    isSpectating = true
    spectateTarget = targetPlayerId
    
    -- Hide admin player
    local adminPed = PlayerPedId()
    SetEntityVisible(adminPed, false, false)
    
    lib.notify({ description = 'Presiona [E] para dejar de espectate', type = 'info' })
    print('^3[Spectate] You are now spectating player ' .. targetPlayerId .. '^7')
end)

RegisterNetEvent('spectate:end')
AddEventHandler('spectate:end', function()
    if isSpectating then
        isSpectating = false
        
        -- Show admin player again
        local adminPed = PlayerPedId()
        SetEntityVisible(adminPed, true, true)
        
        -- Reset camera
        RenderScriptCams(false, false, 0, true, false)
        
        spectateTarget = nil
        lib.notify({ description = 'Espectate finalizado', type = 'success' })
    end
end)

-- Spectate thread
CreateThread(function()
    while true do
        Wait(0)
        
        if isSpectating and spectateTarget then
            local targetPed = GetPlayerPed(GetPlayerFromServerId(spectateTarget))
            
            if targetPed ~= 0 and DoesEntityExist(targetPed) then
                local targetCoords = GetEntityCoords(targetPed)
                local targetHeading = GetEntityHeading(targetPed)
                
                -- Position camera behind target
                local offsetX = math.cos(math.rad(targetHeading + 180)) * 3.0
                local offsetY = math.sin(math.rad(targetHeading + 180)) * 3.0
                
                local camX = targetCoords.x + offsetX
                local camY = targetCoords.y + offsetY
                local camZ = targetCoords.z + 1.5
                
                -- Create or update camera
                local cam = GetRenderingCam()
                if not DoesCamExist(cam) then
                    cam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true)
                    SetCamCoord(cam, camX, camY, camZ)
                    SetCamRot(cam, 0.0, 0.0, targetHeading, 2)
                    RenderScriptCams(true, false, 0, true, false)
                else
                    SetCamCoord(cam, camX, camY, camZ)
                    PointCamAtEntity(cam, targetPed, 0, 0, 0, true)
                end
                
                -- Press E to exit
                if IsControlJustReleased(0, 38) then -- E key
                    StopSpectate()
                end
            else
                -- Target doesn't exist anymore
                StopSpectate()
            end
        end
    end
end)

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

-- Receive broadcast from admin
RegisterNetEvent('broadcast:receive')
AddEventHandler('broadcast:receive', function(message, broadcastType, adminName)
    broadcastType = broadcastType or 'info'
    
    local notificationConfig = {
        success = { title = '✅ Anuncio', color = 'success' },
        info = { title = 'ℹ️ Anuncio', color = 'info' },
        warn = { title = '⚠️ Anuncio', color = 'warning' },
        error = { title = '❌ Anuncio', color = 'error' },
    }
    
    local config = notificationConfig[broadcastType] or notificationConfig['info']
    
    -- Notify using notification system
    exports['oxe_dashboard_v1']:NotifyCustom({
        title = config.title,
        description = message,
        type = config.color,
        duration = 5000
    })
    
    -- Also print in chat
    TriggerEvent('chat:addMessage', {
        args = { 'BROADCAST', message },
        color = { 255, 165, 0 }
    })
    
    print('^2[Broadcast] ' .. adminName .. ': ' .. message .. '^7')
end)

-- =====================================================
-- RECEIVE AVAILABLE ACTIONS LIST
-- =====================================================
RegisterNetEvent('actions:availableList')
AddEventHandler('actions:availableList', function(actionsList)
    -- Este evento es escuchado por el frontend para actualizar la lista de acciones
    TriggerEvent('oxe_dashboard:actionsUpdate', actionsList)
    print('^3[Actions] Received ' .. #actionsList .. ' available actions^7')
end)

-- Execute action request from dashboard
function ExecuteAction(actionId, targetPlayerId)
    TriggerServerEvent('action:execute', actionId, targetPlayerId)
end

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
exports('SpectatePlayer', SpectatePlayer)
exports('StopSpectate', StopSpectate)
exports('ExecuteAction', ExecuteAction)

print('^3[Actions] System loaded^7')
