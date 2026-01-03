-- Custom Notification System
-- Compatible with ox_lib notifications
-- Exports available for other scripts

local notificationQueue = {}
local maxNotifications = 3

-- Color scheme matching dashboard theme
local notificationColors = {
    success = { r = 34, g = 197, b = 94 },   -- Green
    error = { r = 239, g = 68, b = 68 },     -- Red
    info = { r = 59, g = 130, b = 246 },     -- Blue
    warning = { r = 234, g = 179, b = 8 },   -- Yellow
    admin = { r = 249, g = 115, b = 22 },    -- Orange (Dashboard theme)
}

-- Show notification using ox_lib if available, otherwise custom
local function ShowNotification(title, description, type, duration)
    type = type or 'info'
    duration = duration or 5000
    
    -- Try ox_lib first
    if lib and lib.notify then
        lib.notify({
            title = title,
            description = description,
            type = type,
            position = 'top',
            duration = duration,
        })
    else
        -- Fallback: Custom notification (chat-based)
        local color = notificationColors[type] or notificationColors['info']
        
        TriggerEvent('chat:addMessage', {
            args = { '📢 ' .. title, description },
            color = { color.r, color.g, color.b }
        })
    end
    
    print('^3[Notification] ' .. type:upper() .. ' - ' .. title .. ': ' .. description .. '^7')
end

-- Advanced notification with custom styling
local function ShowAdvancedNotification(title, description, type, duration)
    type = type or 'info'
    duration = duration or 5000
    
    -- Primary attempt: ox_lib (best visual)
    if lib and lib.notify then
        lib.notify({
            title = title,
            description = description,
            type = type,
            position = 'top',
            duration = duration,
        })
        return
    end
    
    -- Secondary attempt: Advanced GTA notification
    local color = notificationColors[type] or notificationColors['info']
    local iconType = 'CHAR_CALL_NETWORK'
    
    if type == 'success' then
        iconType = 'CHAR_ARMED'
    elseif type == 'error' then
        iconType = 'CHAR_CALL_NETWORK'
    elseif type == 'warning' then
        iconType = 'CHAR_CALL_NETWORK'
    elseif type == 'admin' then
        iconType = 'CHAR_CALL_NETWORK'
    end
    
    -- Use advanced notification
    BeginTextCommandThefeedPost("STRING")
    AddTextComponentString(description)
    local iconHandle = GetDictNameForHash(GetHashKey("CHAR_CALL_NETWORK"))
    
    TriggerEvent('chat:addMessage', {
        args = { '📢 ' .. title, description },
        color = { color.r, color.g, color.b }
    })
end

-- Success notification
local function NotifySuccess(title, description, duration)
    ShowNotification(title or 'Éxito', description or 'Operación completada', 'success', duration or 4000)
end

-- Error notification
local function NotifyError(title, description, duration)
    ShowNotification(title or 'Error', description or 'Algo salió mal', 'error', duration or 4000)
end

-- Info notification
local function NotifyInfo(title, description, duration)
    ShowNotification(title or 'Información', description or 'Información importante', 'info', duration or 5000)
end

-- Warning notification
local function NotifyWarning(title, description, duration)
    ShowNotification(title or 'Advertencia', description or 'Por favor tomar precaución', 'warning', duration or 5000)
end

-- Admin notification (Orange - Dashboard theme)
local function NotifyAdmin(title, description, duration)
    type = 'admin'
    duration = duration or 5000
    
    if lib and lib.notify then
        lib.notify({
            title = title,
            description = description,
            type = 'info', -- Use info type for styling
            position = 'top',
            duration = duration,
        })
    else
        local color = notificationColors['admin']
        TriggerEvent('chat:addMessage', {
            args = { '⚙️ ' .. (title or 'Admin'), description or '' },
            color = { color.r, color.g, color.b }
        })
    end
    
    print('^3[Admin Notification] ' .. (title or 'Admin') .. ': ' .. (description or '') .. '^7')
end

-- Custom notification with full control
local function NotifyCustom(config)
    config = config or {}
    local title = config.title or 'Notification'
    local description = config.description or ''
    local type = config.type or 'info'
    local duration = config.duration or 5000
    local icon = config.icon or '📢'
    
    if lib and lib.notify then
        lib.notify({
            title = title,
            description = description,
            type = type,
            position = config.position or 'top',
            duration = duration,
        })
    else
        local color = notificationColors[type] or notificationColors['info']
        TriggerEvent('chat:addMessage', {
            args = { icon .. ' ' .. title, description },
            color = { color.r, color.g, color.b }
        })
    end
end

-- Message from admin (special styling)
local function NotifyAdminMessage(adminName, messageText, messageType)
    messageType = messageType or 'notification'
    
    if messageType == 'notification' then
        NotifyAdmin('📨 Mensaje de ' .. adminName, messageText, 6000)
    elseif messageType == 'chat' then
        TriggerEvent('chat:addMessage', {
            args = { '💬 ' .. adminName .. ' (Admin)', messageText },
            color = { 249, 115, 22 } -- Orange
        })
    end
    
    print('^3[Admin Message] ' .. adminName .. ': ' .. messageText .. '^7')
end

-- Exports for other scripts
exports('NotifySuccess', NotifySuccess)
exports('NotifyError', NotifyError)
exports('NotifyInfo', NotifyInfo)
exports('NotifyWarning', NotifyWarning)
exports('NotifyAdmin', NotifyAdmin)
exports('NotifyCustom', NotifyCustom)
exports('NotifyAdminMessage', NotifyAdminMessage)
exports('ShowNotification', ShowNotification)
exports('ShowAdvancedNotification', ShowAdvancedNotification)

print('^3[Notifications] System loaded | Framework: ox_lib ' .. (lib and 'available' or 'unavailable') .. '^7')
