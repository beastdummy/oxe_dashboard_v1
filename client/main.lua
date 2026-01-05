-- oxe_dashboard_v1 | Client
-- NUI Bridge mejorado: comunicación bidireccional Lua ↔ React

local Framework = require '@ox_core/lib/init' or {}
local dashboard_open = false
local player_data = {}
local nui_callbacks = {}

-- Load inventory module
local inventory_loaded = pcall(function()
  load(LoadResourceFile(GetCurrentResourceName(), 'client/inventory.lua'))()
end)

if inventory_loaded then
  print('^2[Dashboard] Inventory module loaded successfully^7')
else
  print('^1[Dashboard] Warning: Inventory module failed to load^7')
end

-- Envía un mensaje a la UI React
function SendReactMessage(action, data)
  SendNUIMessage({
    action = action,
    data = data or {},
  })
end

-- Abre el dashboard
local function open_dashboard()
  if dashboard_open then return end
  
  dashboard_open = true
  SetNuiFocus(true, true)
  
  -- Obtener datos del jugador
  local player = Framework.GetPlayer(PlayerPedId())
  if player then
    player_data = {
      id = GetPlayerServerId(PlayerId()),
      name = GetPlayerName(PlayerId()),
      license = player:get('license'),
      job = player:get('job'),
      gang = player:get('gang'),
    }
  end
  
  SendReactMessage('DASHBOARD:OPEN', {
    player_data = player_data,
  })
end

-- Cierra el dashboard
local function close_dashboard()
  if not dashboard_open then return end
  
  dashboard_open = false
  SetNuiFocus(false, false)
  SendReactMessage('DASHBOARD:CLOSE', {})
end

-- Abre/cierra el dashboard
local function toggle_dashboard()
  if dashboard_open then
    close_dashboard()
  else
    open_dashboard()
  end
end

-- Maneja callbacks de la UI React con sistema mejorado
RegisterNUICallback('dashboard_action', function(data, cb)
  local action = data.action
  local payload = data.payload or {}
  
  if action == 'CLOSE' then
    close_dashboard()
    cb(json.encode({ status = 'ok' }))
  elseif action == 'SERVER_ACTION' then
    -- Envía la acción al servidor
    TriggerServerEvent('oxe_dashboard:serverAction', payload)
    cb(json.encode({ status = 'ok' }))
  elseif action == 'FETCH_DATA' then
    -- Envía datos específicos a la UI
    cb(json.encode({
      status = 'ok',
      data = {
        player = player_data,
        dashboard_open = dashboard_open,
      },
    }))
  elseif action == 'CREATE_JOB' then
    -- Envía el evento de creación de job al servidor
    TriggerServerEvent('job:create', payload)
    cb(json.encode({ status = 'ok' }))
  elseif action == 'CREATE_GANG' then
    -- Envía el evento de creación de gang al servidor
    TriggerServerEvent('gang:create', payload)
    cb(json.encode({ status = 'ok' }))
  else
    cb(json.encode({ status = 'error', message = 'Unknown action: ' .. action }))
  end
end)

-- Keybind para abrir el dashboard
RegisterCommand('dashboard', toggle_dashboard, false)
TriggerEvent('chat:addSuggestion', '/dashboard', 'Abre el dashboard de administración')

-- Exporta funciones públicas
exports('isOpen', function()
  return dashboard_open
end)

exports('toggleDashboard', function()
  toggle_dashboard()
end)

exports('sendToUI', function(action, data)
  SendReactMessage(action, data)
end)
