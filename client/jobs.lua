-- =====================================================
-- OXE Dashboard v1 - Jobs/Gangs Client System
-- =====================================================
-- Client-side handlers for job and gang management
-- =====================================================

-- =====================================================
-- GANGS SYSTEM
-- =====================================================

-- Receive gang list updates
RegisterNetEvent('gangs:updateList')
AddEventHandler('gangs:updateList', function(gangs)
    SendEvent('dashboard:gangsUpdated', gangs)
end)

-- Receive gang details
RegisterNetEvent('gang:details')
AddEventHandler('gang:details', function(gangData)
    SendEvent('dashboard:gangDetails', gangData)
end)

-- Get all gangs
function GetGangs()
    TriggerServerEvent('gangs:getAll')
end

-- Get gang details
function GetGangDetails(gangId)
    TriggerServerEvent('gang:getDetails', gangId)
end

-- Create gang
function CreateGang(gangData)
    TriggerServerEvent('gang:create', gangData)
end

-- Update gang
function UpdateGang(gangId, updateData)
    TriggerServerEvent('gang:update', gangId, updateData)
end

-- Add member to gang
function AddGangMember(gangId, playerId, playerName)
    TriggerServerEvent('gang:addMember', gangId, playerId, playerName)
end

-- Remove member from gang
function RemoveGangMember(gangId, memberId)
    TriggerServerEvent('gang:removeMember', gangId, memberId)
end

-- =====================================================
-- JOBS SYSTEM
-- =====================================================

-- Receive job list updates
RegisterNetEvent('jobs:updateList')
AddEventHandler('jobs:updateList', function(jobs)
    SendEvent('dashboard:jobsUpdated', jobs)
end)

-- Receive job details
RegisterNetEvent('job:details')
AddEventHandler('job:details', function(jobData)
    SendEvent('dashboard:jobDetails', jobData)
end)

-- Get all jobs
function GetJobs()
    TriggerServerEvent('jobs:getAll')
end

-- Get job details
function GetJobDetails(jobId)
    TriggerServerEvent('job:getDetails', jobId)
end

-- Create job
function CreateJob(jobData)
    TriggerServerEvent('job:create', jobData)
end

-- Update job
function UpdateJob(jobId, updateData)
    TriggerServerEvent('job:update', jobId, updateData)
end

-- Add member to job
function AddJobMember(jobId, playerId, playerName, salary)
    TriggerServerEvent('job:addMember', jobId, playerId, playerName, salary or 0)
end

-- Remove member from job
function RemoveJobMember(jobId, memberId)
    TriggerServerEvent('job:removeMember', jobId, memberId)
end

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

function SendEvent(eventName, data)
    -- Send to NUI (dashboard)
    SendNUIMessage({
        type = eventName,
        data = data
    })
end

-- Initialize on script start
print('^2[OXE-Jobs] Client system loaded^7')
