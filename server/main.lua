-- oxe_dashboard_v1 | Server
-- API del servidor: valida permisos y ejecuta operaciones

local Framework = require '@ox_core/lib/init' or {}

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
  local player = Framework.GetPlayer(player_id)
  if not player then return false end
  
  -- Verifica si el jugador es admin o tiene permisos de dashboard
  return player:hasPermission('admin') or player:hasPermission('mod') or player:hasPermission('dashboard')
end

-- =====================================================
-- CREATE JOB EVENT
-- =====================================================
RegisterNetEvent('job:create', function(jobData)
  local adminId = source
  
  if not check_admin_permission(adminId) then
    TriggerClientEvent('ox:notify', adminId, {
      title = 'Error',
      description = 'No tienes permisos para crear trabajos',
      type = 'error',
    })
    return
  end
  
  -- Parse data si viene como JSON string
  if type(jobData) == 'string' then
    jobData = json.decode(jobData)
  end
  
  -- Validaciones básicas
  if not jobData.name or not jobData.label then
    TriggerClientEvent('ox:notify', adminId, {
      title = 'Error',
      description = 'Nombre y etiqueta son requeridos',
      type = 'error',
    })
    return
  end
  
  -- Validar estructura de stash
  if not jobData.stash or not jobData.stash.x then
    TriggerClientEvent('ox:notify', adminId, {
      title = 'Error',
      description = 'Ubicación de stash inválida',
      type = 'error',
    })
    return
  end
  
  -- Guardar job en la base de datos o configuración
  print('^3[Jobs] Admin ' .. GetPlayerName(adminId) .. ' creó un nuevo job: ' .. jobData.name .. '^7')
  print(json.encode(jobData))
  
  -- Aquí irían las operaciones de BD/guardado
  -- exports.oxmysql:execute('INSERT INTO jobs (name, label, ...) VALUES (?, ?, ...)', {...})
  
  TriggerClientEvent('ox:notify', adminId, {
    title = 'Éxito',
    description = 'Job "' .. jobData.name .. '" creado exitosamente',
    type = 'success',
  })
  
  -- Notificar a todos los jugadores sobre el nuevo job
  TriggerClientEvent('chat:addMessage', -1, {
    args = { 'Sistema', 'Nuevo job creado: ' .. jobData.label },
    color = { 0, 255, 0 }
  })
end)

-- =====================================================
-- CREATE GANG EVENT
-- =====================================================
RegisterNetEvent('gang:create', function(gangData)
  local adminId = source
  
  if not check_admin_permission(adminId) then
    TriggerClientEvent('ox:notify', adminId, {
      title = 'Error',
      description = 'No tienes permisos para crear bandas',
      type = 'error',
    })
    return
  end
  
  -- Parse data si viene como JSON string
  if type(gangData) == 'string' then
    gangData = json.decode(gangData)
  end
  
  -- Validaciones básicas
  if not gangData.name or not gangData.label then
    TriggerClientEvent('ox:notify', adminId, {
      title = 'Error',
      description = 'Nombre y etiqueta son requeridos',
      type = 'error',
    })
    return
  end
  
  -- Validar estructura de stash
  if not gangData.stash or not gangData.stash.x then
    TriggerClientEvent('ox:notify', adminId, {
      title = 'Error',
      description = 'Ubicación de stash inválida',
      type = 'error',
    })
    return
  end
  
  -- Guardar gang en la base de datos o configuración
  print('^3[Gangs] Admin ' .. GetPlayerName(adminId) .. ' creó una nueva banda: ' .. gangData.name .. '^7')
  print(json.encode(gangData))
  
  -- Aquí irían las operaciones de BD/guardado
  -- exports.oxmysql:execute('INSERT INTO gangs (name, label, ...) VALUES (?, ?, ...)', {...})
  
  TriggerClientEvent('ox:notify', adminId, {
    title = 'Éxito',
    description = 'Banda "' .. gangData.name .. '" creada exitosamente',
    type = 'success',
  })
  
  -- Notificar a todos los jugadores sobre la nueva banda
  TriggerClientEvent('chat:addMessage', -1, {
    args = { 'Sistema', 'Nueva banda creada: ' .. gangData.label },
    color = { 255, 0, 0 }
  })
end)

-- Log de inicio
print('^2oxe_dashboard_v1 server started^7')
