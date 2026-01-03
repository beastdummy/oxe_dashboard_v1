-- oxe_dashboard_v1 | Shared Config

Config = {
  -- Nombre del recurso
  resource_name = 'oxe_dashboard_v1',
  
  -- Keybind para abrir el dashboard
  open_key = 'F10',
  
  -- Framework que se está usando
  framework = 'ox_core', -- 'ox_core', 'qbx_core', 'qb-core', 'esx'
  
  -- Configuración de notificaciones
  notifications = {
    position = 'top-right',
    duration = 3000,
  },
  
  -- Módulos disponibles
  modules = {
    players = true,
    jobs = true,
    gangs = true,
    shops = true,
    missions = true,
    logs = true,
  },
  
  -- Configuración de permisos
  permissions = {
    admin_level = 2, -- Nivel mínimo de admin para acceder
  },
}

return Config
