-- Admin Logs System
-- Supports: SQL Database, Discord Webhooks, FiveManager

-- Load configuration
local Config = require 'shared.config'
local logConfig = Config.logging

if not logConfig then
    logConfig = {
        sql = { enabled = false },
        discord = { enabled = false },
        fiveManager = { enabled = false },
        file = { enabled = true, path = 'logs/admin_logs.json' },
    }
end

-- Color codes for Discord embeds
local actionColors = {
    message = 0x3B82F6,      -- Blue
    suspend = 0xEAB308,      -- Yellow
    ban = 0xEF4444,          -- Red
    spectate = 0xA855F7,     -- Purple
    broadcast = 0xF97316,    -- Orange
    heal = 0x22C55E,         -- Green
    kill = 0x000000,         -- Black
    freeze = 0x06B6D4,       -- Cyan
    inventory = 0x8B5CF6,    -- Violet
}

-- Function to log admin action
local function LogAdminAction(adminId, adminName, action, targetId, targetName, details)
    if not adminId or not adminName or not action then
        print("^1[Logs] Missing required parameters^7")
        return
    end
    
    local logEntry = {
        timestamp = os.date("%Y-%m-%d %H:%M:%S"),
        timestampUnix = os.time(),
        admin = {
            id = adminId,
            name = adminName,
        },
        action = action,
        target = {
            id = targetId or "N/A",
            name = targetName or "N/A",
        },
        details = details or {},
    }
    
    -- Log to SQL
    if logConfig.sql.enabled then
        LogToSQL(logEntry)
    end
    
    -- Send to Discord
    if logConfig.discord.enabled then
        SendToDiscord(logEntry)
    end
    
    -- Send to FiveManager
    if logConfig.fiveManager.enabled then
        SendToFiveManager(logEntry)
    end
    
    -- Log to file
    if logConfig.file.enabled then
        LogToFile(logEntry)
    end
    
    print("^3[Logs] " .. adminName .. " executed " .. action .. " on " .. (targetName or "Unknown") .. "^7")
end

-- SQL Logging
function LogToSQL(logEntry)
    local query = [[
        INSERT INTO admin_logs 
        (admin_id, admin_name, action, target_id, target_name, details, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ]]
    
    local details = json.encode(logEntry.details)
    
    if logConfig.sql.resource == 'oxmysql' then
        exports.oxmysql:execute(query, {
            logEntry.admin.id,
            logEntry.admin.name,
            logEntry.action,
            logEntry.target.id,
            logEntry.target.name,
            details,
            logEntry.timestamp,
        }, function(result)
            if result then
                print("^2[SQL Log] Saved successfully^7")
            end
        end)
    elseif logConfig.sql.resource == 'mysql-async' then
        MySQL.Async.execute(query, {
            logEntry.admin.id,
            logEntry.admin.name,
            logEntry.action,
            logEntry.target.id,
            logEntry.target.name,
            details,
            logEntry.timestamp,
        }, function(rowsChanged)
            if rowsChanged > 0 then
                print("^2[SQL Log] Saved successfully^7")
            end
        end)
    end
end

-- Discord Webhook Logging
function SendToDiscord(logEntry)
    if not logConfig.discord.webhookUrl or logConfig.discord.webhookUrl == 'https://discordapp.com/api/webhooks/YOUR_WEBHOOK_ID_HERE' then
        print("^1[Discord Logs] Webhook URL not configured! Edit shared/config.lua^7")
        return
    end
    
    local actionColor = actionColors[logEntry.action] or 0x808080
    
    local embed = {
        title = "🔔 Admin Action Logged",
        color = actionColor,
        fields = {
            {
                name = "👤 Admin",
                value = logEntry.admin.name .. " (ID: " .. logEntry.admin.id .. ")",
                inline = true,
            },
            {
                name = "⚡ Action",
                value = string.upper(logEntry.action),
                inline = true,
            },
            {
                name = "🎯 Target",
                value = logEntry.target.name .. " (ID: " .. logEntry.target.id .. ")",
                inline = true,
            },
        },
        footer = {
            text = "OXE Dashboard Logger",
            icon_url = logConfig.discord.iconUrl,
        },
        timestamp = os.date("!%Y-%m-%dT%H:%M:%SZ"),
    }
    
    -- Add details if present
    if logEntry.details and next(logEntry.details) then
        local detailsStr = ""
        for key, value in pairs(logEntry.details) do
            detailsStr = detailsStr .. "• " .. key .. ": " .. tostring(value) .. "\n"
        end
        if detailsStr ~= "" then
            table.insert(embed.fields, {
                name = "📋 Details",
                value = detailsStr,
                inline = false,
            })
        end
    end
    
    local webhook = {
        username = logConfig.discord.botName,
        avatar_url = logConfig.discord.iconUrl,
        embeds = { embed },
    }
    
    PerformHttpRequest(logConfig.discord.webhookUrl, function(statusCode, response, headers)
        if statusCode == 204 then
            print("^2[Discord Log] Message sent successfully^7")
        else
            print("^1[Discord Log] Failed to send message (Status: " .. statusCode .. ")^7")
        end
    end, 'POST', json.encode(webhook), { ['Content-Type'] = 'application/json' })
end

-- FiveManager Integration
function SendToFiveManager(logEntry)
    if not logConfig.fiveManager.apiKey or logConfig.fiveManager.apiKey == 'YOUR_FIVEMANAGER_API_KEY_HERE' then
        print("^1[FiveManager Logs] API Key not configured! Edit shared/config.lua^7")
        return
    end
    
    -- Adjust this based on FiveManager's actual API
    local payload = {
        action = logEntry.action,
        admin_id = logEntry.admin.id,
        admin_name = logEntry.admin.name,
        target_id = logEntry.target.id,
        target_name = logEntry.target.name,
        details = logEntry.details,
        timestamp = logEntry.timestamp,
    }
    
    local headers = {
        ['Content-Type'] = 'application/json',
        ['Authorization'] = 'Bearer ' .. logConfig.fiveManager.apiKey,
    }
    
    -- FiveManager API endpoint (adjust based on your setup)
    local endpoint = "https://fivemanager.your-domain.com/api/servers/" .. logConfig.fiveManager.serverId .. "/logs"
    
    PerformHttpRequest(endpoint, function(statusCode, response, headers)
        if statusCode >= 200 and statusCode < 300 then
            print("^2[FiveManager Log] Logged successfully^7")
        else
            print("^1[FiveManager Log] Failed (Status: " .. statusCode .. ")^7")
        end
    end, 'POST', json.encode(payload), headers)
end

-- File Logging
function LogToFile(logEntry)
    local logPath = logConfig.file.path
    local logDir = string.sub(logPath, 1, string.len(logPath) - string.len(string.match(logPath, "[^/]*$")))
    
    -- Create directory if it doesn't exist
    os.execute("mkdir " .. logDir:gsub("/", "\\"))
    
    -- Read existing logs
    local file = io.open(logPath, "r")
    local logs = {}
    
    if file then
        local content = file:read("*a")
        file:close()
        if content and content ~= "" then
            logs = json.decode(content) or {}
        end
    end
    
    -- Add new entry
    table.insert(logs, logEntry)
    
    -- Keep only last 1000 entries
    if #logs > 1000 then
        logs = { table.unpack(logs, #logs - 999) }
    end
    
    -- Write back to file
    local file = io.open(logPath, "w")
    if file then
        file:write(json.encode(logs, { indent = 2 }))
        file:close()
        print("^2[File Log] Saved to " .. logPath .. "^7")
    end
end

-- Get logs from database
local function GetLogsFromSQL(limit, offset)
    limit = limit or 100
    offset = offset or 0
    
    local query = [[
        SELECT * FROM admin_logs 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
    ]]
    
    if logConfig.sql.resource == 'oxmysql' then
        exports.oxmysql:fetch(query, { limit, offset }, function(result)
            return result
        end)
    end
end

-- Exports
exports('LogAdminAction', LogAdminAction)
exports('GetLogs', GetLogsFromSQL)

-- Create SQL table on start
CreateThread(function()
    if logConfig.sql.enabled then
        local createTableQuery = [[
            CREATE TABLE IF NOT EXISTS admin_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                admin_id INT NOT NULL,
                admin_name VARCHAR(50) NOT NULL,
                action VARCHAR(50) NOT NULL,
                target_id VARCHAR(50),
                target_name VARCHAR(50),
                details JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                KEY (admin_id),
                KEY (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ]]
        
        if logConfig.sql.resource == 'oxmysql' then
            exports.oxmysql:execute(createTableQuery, {}, function(result)
                print("^2[Logs] Database table ready^7")
            end)
        end
    end
end)

print('^3[Logs] System loaded | SQL: ' .. (logConfig.sql.enabled and 'ON' or 'OFF') .. ' | Discord: ' .. (logConfig.discord.enabled and 'ON' or 'OFF') .. ' | FiveManager: ' .. (logConfig.fiveManager.enabled and 'ON' or 'OFF') .. '^7')
