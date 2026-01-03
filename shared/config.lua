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
  
  -- =============================================
  -- LOGGING CONFIGURATION
  -- =============================================
  logging = {
    -- SQL Database Logging
    sql = {
      enabled = true,
      resource = 'oxmysql', -- 'oxmysql' or 'mysql-async'
    },
    
    -- Discord Webhook Logging
    discord = {
      enabled = true,
      webhookUrl = 'https://discordapp.com/api/webhooks/YOUR_WEBHOOK_ID_HERE', -- Change this!
      botName = '🤖 OXE Admin Logger',
      iconUrl = 'https://cdn.discordapp.com/emojis/889703127195455488.png',
    },
    
    -- FiveManager Integration
    fiveManager = {
      enabled = false,
      apiKey = 'YOUR_FIVEMANAGER_API_KEY_HERE',
      serverId = 1,
      endpoint = 'https://fivemanager.your-domain.com/api',
    },
    
    -- Local File Logging (JSON)
    file = {
      enabled = true,
      path = 'logs/admin_logs.json',
    },
  },
  
  -- Configuración de permisos
  permissions = {
    admin_level = 2, -- Nivel mínimo de admin para acceder
  },
}

return Config
