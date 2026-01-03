-- oxe_dashboard_v1 | Permissions System

Permissions = {
  -- Acciones globales
  DASHBOARD_ACCESS = 'dashboard.access',
  
  -- Gestión de jugadores
  PLAYERS_VIEW = 'dashboard.players.view',
  PLAYERS_KICK = 'dashboard.players.kick',
  PLAYERS_BAN = 'dashboard.players.ban',
  PLAYERS_WARN = 'dashboard.players.warn',
  
  -- Gestión de jobs
  JOBS_CREATE = 'dashboard.jobs.create',
  JOBS_EDIT = 'dashboard.jobs.edit',
  JOBS_DELETE = 'dashboard.jobs.delete',
  
  -- Gestión de gangs
  GANGS_CREATE = 'dashboard.gangs.create',
  GANGS_EDIT = 'dashboard.gangs.edit',
  GANGS_DELETE = 'dashboard.gangs.delete',
  
  -- Gestión de shops
  SHOPS_CREATE = 'dashboard.shops.create',
  SHOPS_EDIT = 'dashboard.shops.edit',
  SHOPS_DELETE = 'dashboard.shops.delete',
  
  -- Logs y auditoría
  LOGS_VIEW = 'dashboard.logs.view',
  LOGS_DELETE = 'dashboard.logs.delete',
}

return Permissions
