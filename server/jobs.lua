-- =====================================================
-- OXE Dashboard v1 - Jobs/Gangs System
-- =====================================================
-- Handles all job and gang management operations
-- =====================================================

local MySQL = exports.oxmysql

-- =====================================================
-- GANGS SYSTEM
-- =====================================================

-- Get all gangs
RegisterServerEvent('gangs:getAll')
AddEventHandler('gangs:getAll', function()
    local src = source
    local adminInfo = GetPlayerAdmin(src)
    
    if not adminInfo.isAdmin then
        TriggerClientEvent('chat:addMessage', src, {
            args = { 'Admin', 'No permissions' },
            color = { 255, 0, 0 }
        })
        return
    end

    MySQL.Async.fetchAll('SELECT * FROM gangs ORDER BY reputation DESC', {}, function(gangs)
        if gangs then
            -- Get member count for each gang
            for i, gang in ipairs(gangs) do
                local memberCount = MySQL.Sync.fetchScalar(
                    'SELECT COUNT(*) as count FROM gang_members WHERE gang_id = ?',
                    { gang.id }
                )
                gang.members_count = memberCount or 0
            end
            
            TriggerClientEvent('gangs:updateList', src, gangs)
        end
    end)
end)

-- Get single gang details
RegisterServerEvent('gang:getDetails')
AddEventHandler('gang:getDetails', function(gangId)
    local src = source
    local adminInfo = GetPlayerAdmin(src)
    
    if not adminInfo.isAdmin then return end

    MySQL.Async.fetchAll('SELECT * FROM gang_members WHERE gang_id = ? ORDER BY rank DESC', { gangId }, function(members)
        TriggerClientEvent('gang:details', src, {
            gangId = gangId,
            members = members or {}
        })
    end)
end)

-- Create gang
RegisterServerEvent('gang:create')
AddEventHandler('gang:create', function(gangData)
    local src = source
    local adminInfo = GetPlayerAdmin(src)
    
    if not adminInfo.isAdmin or adminInfo.permission < 3 then
        LogAction(adminInfo, 'gang:create - UNAUTHORIZED ATTEMPT', { gangData = gangData })
        return
    end

    local name = gangData.name
    local label = gangData.label
    local color = gangData.color or '#FF0000'
    local territory = gangData.territory or 'Unknown'

    MySQL.Async.execute(
        'INSERT INTO gangs (name, label, color, territory, status) VALUES (?, ?, ?, ?, ?)',
        { name, label, color, territory, 'active' },
        function(result)
            if result then
                LogAction(adminInfo, 'gang:create', {
                    gangName = name,
                    gangLabel = label
                })
                TriggerClientEvent('chat:addMessage', src, {
                    args = { 'Admin', 'Gang "' .. name .. '" created successfully' },
                    color = { 0, 255, 0 }
                })
                TriggerEvent('gangs:getAll')
            end
        end
    )
end)

-- Update gang
RegisterServerEvent('gang:update')
AddEventHandler('gang:update', function(gangId, updateData)
    local src = source
    local adminInfo = GetPlayerAdmin(src)
    
    if not adminInfo.isAdmin or adminInfo.permission < 3 then
        LogAction(adminInfo, 'gang:update - UNAUTHORIZED ATTEMPT', { gangId = gangId })
        return
    end

    local allowedFields = { 'label', 'color', 'territory', 'leader_id', 'leader_name', 'reputation', 'treasury', 'level', 'status' }
    local setClause = {}
    local values = {}

    for key, value in pairs(updateData) do
        if KeyExists(allowedFields, key) then
            table.insert(setClause, key .. ' = ?')
            table.insert(values, value)
        end
    end

    if #setClause == 0 then return end
    
    table.insert(values, gangId)

    MySQL.Async.execute(
        'UPDATE gangs SET ' .. table.concat(setClause, ', ') .. ' WHERE id = ?',
        values,
        function(result)
            if result > 0 then
                LogAction(adminInfo, 'gang:update', {
                    gangId = gangId,
                    changes = updateData
                })
                TriggerEvent('gangs:getAll')
            end
        end
    )
end)

-- Add member to gang
RegisterServerEvent('gang:addMember')
AddEventHandler('gang:addMember', function(gangId, playerId, playerName)
    local src = source
    local adminInfo = GetPlayerAdmin(src)
    
    if not adminInfo.isAdmin then
        LogAction(adminInfo, 'gang:addMember - UNAUTHORIZED', { gangId = gangId })
        return
    end

    MySQL.Async.execute(
        'INSERT INTO gang_members (gang_id, player_id, player_name, rank) VALUES (?, ?, ?, 0)',
        { gangId, playerId, playerName },
        function(result)
            if result then
                LogAction(adminInfo, 'gang:addMember', {
                    gangId = gangId,
                    playerId = playerId,
                    playerName = playerName
                })
                
                -- Update member count
                local count = MySQL.Sync.fetchScalar(
                    'SELECT COUNT(*) as count FROM gang_members WHERE gang_id = ?',
                    { gangId }
                )
                MySQL.Async.execute('UPDATE gangs SET members_count = ? WHERE id = ?', { count, gangId })
                
                TriggerEvent('gangs:getAll')
            end
        end
    )
end)

-- Remove member from gang
RegisterServerEvent('gang:removeMember')
AddEventHandler('gang:removeMember', function(gangId, memberId)
    local src = source
    local adminInfo = GetPlayerAdmin(src)
    
    if not adminInfo.isAdmin then
        LogAction(adminInfo, 'gang:removeMember - UNAUTHORIZED', { gangId = gangId })
        return
    end

    MySQL.Async.execute(
        'DELETE FROM gang_members WHERE id = ? AND gang_id = ?',
        { memberId, gangId },
        function(result)
            if result > 0 then
                LogAction(adminInfo, 'gang:removeMember', {
                    gangId = gangId,
                    memberId = memberId
                })
                
                -- Update member count
                local count = MySQL.Sync.fetchScalar(
                    'SELECT COUNT(*) as count FROM gang_members WHERE gang_id = ?',
                    { gangId }
                )
                MySQL.Async.execute('UPDATE gangs SET members_count = ? WHERE id = ?', { count, gangId })
                
                TriggerEvent('gangs:getAll')
            end
        end
    )
end)

-- =====================================================
-- JOBS SYSTEM
-- =====================================================

-- Get all jobs
RegisterServerEvent('jobs:getAll')
AddEventHandler('jobs:getAll', function()
    local src = source
    local adminInfo = GetPlayerAdmin(src)
    
    if not adminInfo.isAdmin then
        TriggerClientEvent('chat:addMessage', src, {
            args = { 'Admin', 'No permissions' },
            color = { 255, 0, 0 }
        })
        return
    end

    MySQL.Async.fetchAll('SELECT * FROM jobs ORDER BY level DESC', {}, function(jobs)
        if jobs then
            -- Get member count for each job
            for i, job in ipairs(jobs) do
                local memberCount = MySQL.Sync.fetchScalar(
                    'SELECT COUNT(*) as count FROM job_members WHERE job_id = ?',
                    { job.id }
                )
                job.members_count = memberCount or 0
            end
            
            TriggerClientEvent('jobs:updateList', src, jobs)
        end
    end)
end)

-- Get single job details
RegisterServerEvent('job:getDetails')
AddEventHandler('job:getDetails', function(jobId)
    local src = source
    local adminInfo = GetPlayerAdmin(src)
    
    if not adminInfo.isAdmin then return end

    MySQL.Async.fetchAll('SELECT * FROM job_members WHERE job_id = ? ORDER BY grade DESC', { jobId }, function(members)
        TriggerClientEvent('job:details', src, {
            jobId = jobId,
            members = members or {}
        })
    end)
end)

-- Create job
RegisterServerEvent('job:create')
AddEventHandler('job:create', function(jobData)
    local src = source
    local adminInfo = GetPlayerAdmin(src)
    
    if not adminInfo.isAdmin or adminInfo.permission < 3 then
        LogAction(adminInfo, 'job:create - UNAUTHORIZED ATTEMPT', { jobData = jobData })
        return
    end

    local name = jobData.name
    local label = jobData.label
    local color = jobData.color or '#FFA500'
    local territory = jobData.territory or 'Unknown'
    local paymentRate = jobData.paymentRate or 500

    MySQL.Async.execute(
        'INSERT INTO jobs (name, label, color, territory, payment_rate, status) VALUES (?, ?, ?, ?, ?, ?)',
        { name, label, color, territory, paymentRate, 'active' },
        function(result)
            if result then
                LogAction(adminInfo, 'job:create', {
                    jobName = name,
                    jobLabel = label
                })
                TriggerClientEvent('chat:addMessage', src, {
                    args = { 'Admin', 'Job "' .. name .. '" created successfully' },
                    color = { 0, 255, 0 }
                })
                TriggerEvent('jobs:getAll')
            end
        end
    )
end)

-- Update job
RegisterServerEvent('job:update')
AddEventHandler('job:update', function(jobId, updateData)
    local src = source
    local adminInfo = GetPlayerAdmin(src)
    
    if not adminInfo.isAdmin or adminInfo.permission < 3 then
        LogAction(adminInfo, 'job:update - UNAUTHORIZED ATTEMPT', { jobId = jobId })
        return
    end

    local allowedFields = { 'label', 'color', 'territory', 'boss_id', 'boss_name', 'level', 'treasury', 'payment_rate', 'status' }
    local setClause = {}
    local values = {}

    for key, value in pairs(updateData) do
        if KeyExists(allowedFields, key) then
            table.insert(setClause, key .. ' = ?')
            table.insert(values, value)
        end
    end

    if #setClause == 0 then return end
    
    table.insert(values, jobId)

    MySQL.Async.execute(
        'UPDATE jobs SET ' .. table.concat(setClause, ', ') .. ' WHERE id = ?',
        values,
        function(result)
            if result > 0 then
                LogAction(adminInfo, 'job:update', {
                    jobId = jobId,
                    changes = updateData
                })
                TriggerEvent('jobs:getAll')
            end
        end
    )
end)

-- Add member to job
RegisterServerEvent('job:addMember')
AddEventHandler('job:addMember', function(jobId, playerId, playerName, salary)
    local src = source
    local adminInfo = GetPlayerAdmin(src)
    
    if not adminInfo.isAdmin then
        LogAction(adminInfo, 'job:addMember - UNAUTHORIZED', { jobId = jobId })
        return
    end

    salary = salary or 0

    MySQL.Async.execute(
        'INSERT INTO job_members (job_id, player_id, player_name, grade, salary) VALUES (?, ?, ?, 0, ?)',
        { jobId, playerId, playerName, salary },
        function(result)
            if result then
                LogAction(adminInfo, 'job:addMember', {
                    jobId = jobId,
                    playerId = playerId,
                    playerName = playerName,
                    salary = salary
                })
                
                -- Update member count
                local count = MySQL.Sync.fetchScalar(
                    'SELECT COUNT(*) as count FROM job_members WHERE job_id = ?',
                    { jobId }
                )
                MySQL.Async.execute('UPDATE jobs SET members_count = ? WHERE id = ?', { count, jobId })
                
                TriggerEvent('jobs:getAll')
            end
        end
    )
end)

-- Remove member from job
RegisterServerEvent('job:removeMember')
AddEventHandler('job:removeMember', function(jobId, memberId)
    local src = source
    local adminInfo = GetPlayerAdmin(src)
    
    if not adminInfo.isAdmin then
        LogAction(adminInfo, 'job:removeMember - UNAUTHORIZED', { jobId = jobId })
        return
    end

    MySQL.Async.execute(
        'DELETE FROM job_members WHERE id = ? AND job_id = ?',
        { memberId, jobId },
        function(result)
            if result > 0 then
                LogAction(adminInfo, 'job:removeMember', {
                    jobId = jobId,
                    memberId = memberId
                })
                
                -- Update member count
                local count = MySQL.Sync.fetchScalar(
                    'SELECT COUNT(*) as count FROM job_members WHERE job_id = ?',
                    { jobId }
                )
                MySQL.Async.execute('UPDATE jobs SET members_count = ? WHERE id = ?', { count, jobId })
                
                TriggerEvent('jobs:getAll')
            end
        end
    )
end)

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

function KeyExists(table, key)
    for k, v in pairs(table) do
        if v == key then
            return true
        end
    end
    return false
end

function GetPlayerAdmin(playerId)
    -- This would integrate with your actual admin system
    -- For now, returning a structure that can be extended
    local hasAdmin = GetResourceState('es_extended') == 'started'
    
    return {
        isAdmin = true, -- TODO: Integrate with your framework
        permission = 3, -- TODO: Get from framework
        adminId = GetPlayerIdentifier(playerId, 0),
        adminName = GetPlayerName(playerId)
    }
end

function LogAction(adminInfo, action, details)
    -- Log to database
    MySQL.Async.execute(
        'INSERT INTO admin_logs (admin_id, admin_name, action, details, created_at) VALUES (?, ?, ?, ?, NOW())',
        {
            adminInfo.adminId,
            adminInfo.adminName,
            action,
            json.encode(details or {})
        }
    )
    
    -- Log to console
    print('^2[OXE-Admin] ' .. action .. ' - ' .. adminInfo.adminName .. '^7')
end
