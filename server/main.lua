-- oxe_dashboard_v1 | Server
-- API del servidor: valida permisos y ejecuta operaciones

-- Load inventory module
local inventory_loaded = pcall(function()
  load(LoadResourceFile(GetCurrentResourceName(), 'server/inventory.lua'))()
end)

if inventory_loaded then
  print('^2[Dashboard] Inventory module loaded successfully^7')
else
  print('^1[Dashboard] Warning: Inventory module failed to load^7')
end

-- Verifica permisos de admin
local function check_admin_permission(player_id)
  local player = exports.ox_core:GetPlayer(player_id)
  if not player then return false end
  
  -- Verifica si el jugador es admin
  -- Esto dependerá de cómo ox_core maneja permisos
  return player:hasPermission('admin') or player:hasPermission('dashboard')
end

-- Acción genérica del servidor
RegisterNetEvent('oxe_dashboard:serverAction', function(payload)
  local player_id = source
  
  if not check_admin_permission(player_id) then
    TriggerClientEvent('ox:notify', player_id, {
      title = 'Error',
      description = 'No tienes permisos para usar el dashboard',
      type = 'error',
    })
    return
  end
  
  local action = payload.action
  
  if action == 'CREATE_JOB' then
    -- TODO: Implementar crear job
    print('Server: CREATE_JOB', json.encode(payload))
  elseif action == 'DELETE_JOB' then
    -- TODO: Implementar eliminar job
    print('Server: DELETE_JOB', json.encode(payload))
  elseif action == 'GET_PLAYERS' then
    -- TODO: Implementar obtener jugadores
    print('Server: GET_PLAYERS')
  else
    print('Unknown action:', action)
  end
end)

-- Log de inicio
print('^2oxe_dashboard_v1 server started^7')
