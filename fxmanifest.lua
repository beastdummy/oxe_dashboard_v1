fx_version 'cerulean'
game 'gta5'

author 'OXE Team'
description 'OXE Dashboard v1 - Advanced FiveM Administration Dashboard'
version '1.0.0'

ui_page 'web/build/index.html'

files {
  'web/build/index.html',
  'web/build/**/*',
  'shared/locales/*.json',
}

shared_scripts {
  'shared/config.lua',
  'shared/permissions.lua',
  'shared/framework/ox_core.lua',
  '@ox_lib/init.lua',
}

client_scripts {
  'client/main.lua',
  'client/inventory.lua',
  'client/actions.lua',
}

server_scripts {
  'server/main.lua',
  'server/inventory.lua',
  'server/actions.lua',
}

dependencies {
  'ox_core',
  'ox_lib',
}

optional_dependencies {
  'ox_inventory',
}

-- NUI Callbacks
exports('isOpen', function()
  return false
end)

exports('toggleDashboard', function()
  TriggerEvent('chat:addMessage', { args = { 'Dashboard', 'Toggle' } })
end)
