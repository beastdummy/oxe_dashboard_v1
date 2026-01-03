-- OX Core Framework Bridge
-- Provides unified access to ox_core player and group data
-- Compatible with ox_core for production and fallback for dev mode

local OxCoreAvailable = GetResourceState('ox_core') == 'started'

-- Helper function to get a player's information
local function GetPlayerInfo(playerId)
    if OxCoreAvailable then
        local player = Ox.GetPlayer(playerId)
        if player then
            return {
                id = player.userId,
                serverId = playerId,
                charId = player.charId,
                stateId = player.stateId,
                firstName = player.firstName or 'Unknown',
                lastName = player.lastName or 'Unknown',
                fullName = (player.firstName or 'Unknown') .. ' ' .. (player.lastName or 'Unknown'),
                job = player.getGroup('job'),
                group = player.getGroup('job'),
                cash = (player.getBalance and player.getBalance('cash')) or 0,
                bank = (player.getBalance and player.getBalance('bank')) or 0,
                position = (player.getPos and player.getPos()) or { x = 0, y = 0, z = 0 },
                licenses = (player.getLicenses and player.getLicenses()) or {},
            }
        end
    else
        -- Fallback: Dev mode mock data
        return {
            id = 0,
            serverId = playerId,
            charId = 0,
            stateId = 'DEV_' .. playerId,
            firstName = 'Dev',
            lastName = 'Player',
            fullName = 'Dev Player',
            job = { name = 'none', grade = 0 },
            group = { name = 'none', grade = 0 },
            cash = 5000,
            bank = 10000,
            position = { x = 0, y = 0, z = 0 },
            licenses = {},
        }
    end
    return nil
end

-- Get all online players
local function GetOnlinePlayers()
    if OxCoreAvailable then
        local players = Ox.GetPlayers()
        local result = {}
        for _, player in ipairs(players) do
            table.insert(result, {
                id = player.userId,
                serverId = player.source,
                charId = player.charId,
                stateId = player.stateId,
                firstName = player.firstName or 'Unknown',
                lastName = player.lastName or 'Unknown',
                fullName = (player.firstName or 'Unknown') .. ' ' .. (player.lastName or 'Unknown'),
                job = player.getGroup('job'),
            })
        end
        return result
    else
        -- Fallback: Return empty list in dev mode
        return {}
    end
end

-- Get player by ID
local function GetPlayer(playerId)
    return GetPlayerInfo(playerId)
end

-- Check if player has permission
local function HasPermission(playerId, permission)
    if OxCoreAvailable then
        local player = Ox.GetPlayer(playerId)
        if player then
            return player.hasPermission(permission)
        end
    else
        -- Fallback: Allow all in dev mode
        return true
    end
    return false
end

-- Get player's group
local function GetPlayerGroup(playerId, groupType)
    if OxCoreAvailable then
        local player = Ox.GetPlayer(playerId)
        if player then
            return player.getGroup(groupType)
        end
    else
        -- Fallback: Return empty group
        return { name = 'none', grade = 0 }
    end
    return nil
end

-- Get all groups by type
local function GetGroupsByType(groupType)
    if OxCoreAvailable then
        return Ox.GetGroupsByType(groupType)
    else
        -- Fallback: Return empty array
        return {}
    end
end

-- Get group information
local function GetGroup(groupName)
    if OxCoreAvailable then
        return Ox.GetGroup(groupName)
    else
        -- Fallback: Return empty group
        return { name = groupName, label = groupName, grades = {} }
    end
end

-- Get active players in group
local function GetGroupActivePlayers(groupName)
    if OxCoreAvailable then
        return Ox.GetGroupActivePlayers(groupName)
    else
        -- Fallback: Return empty array
        return {}
    end
end

-- Add permission to group
local function SetGroupPermission(groupName, grade, permission, value)
    if OxCoreAvailable then
        return Ox.SetGroupPermission(groupName, grade, permission, value)
    end
    return false
end

-- Ban user
local function BanUser(userId, reason, hours)
    if OxCoreAvailable then
        return Ox.BanUser(userId, reason, hours)
    end
    return false
end

-- Check if user is banned
local function IsUserBanned(userId)
    if OxCoreAvailable then
        -- Using proper ban check
        local result = Ox.GetBan(userId)
        return result ~= nil
    end
    return nil
end

-- Unban user
local function UnbanUser(userId)
    if OxCoreAvailable then
        return Ox.UnbanUser(userId)
    end
    return false
end

-- Check if ox_core is available
local function IsOxCoreAvailable()
    return OxCoreAvailable
end

-- Server-side exports
if IsDuplicityVersion() then
    exports('GetPlayerInfo', GetPlayerInfo)
    exports('GetOnlinePlayers', GetOnlinePlayers)
    exports('GetPlayer', GetPlayer)
    exports('HasPermission', HasPermission)
    exports('GetPlayerGroup', GetPlayerGroup)
    exports('GetGroupsByType', GetGroupsByType)
    exports('GetGroup', GetGroup)
    exports('GetGroupActivePlayers', GetGroupActivePlayers)
    exports('SetGroupPermission', SetGroupPermission)
    exports('BanUser', BanUser)
    exports('IsUserBanned', IsUserBanned)
    exports('UnbanUser', UnbanUser)
    exports('IsOxCoreAvailable', IsOxCoreAvailable)

    print('^3[Framework] ox_core bridge loaded | Status: ' .. (OxCoreAvailable and '^2Enabled' or '^1Disabled (Dev Mode)') .. '^7')
end

-- Return functions for use in other scripts
return {
    GetPlayerInfo = GetPlayerInfo,
    GetOnlinePlayers = GetOnlinePlayers,
    GetPlayer = GetPlayer,
    HasPermission = HasPermission,
    GetPlayerGroup = GetPlayerGroup,
    GetGroupsByType = GetGroupsByType,
    GetGroup = GetGroup,
    GetGroupActivePlayers = GetGroupActivePlayers,
    SetGroupPermission = SetGroupPermission,
    BanUser = BanUser,
    IsUserBanned = IsUserBanned,
    UnbanUser = UnbanUser,
    IsOxCoreAvailable = IsOxCoreAvailable,
}
