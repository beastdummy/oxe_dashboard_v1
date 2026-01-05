-- Server-side Mission Management System
-- Handles mission creation, editing, deletion, and player mission assignment

local Missions = {}
local MissionData = {}
local PlayerMissions = {}

-- =====================================================
-- LOAD MISSIONS FROM STORAGE
-- =====================================================
local function LoadMissions()
  -- TODO: Load from database/storage
  -- For now, using in-memory storage
  print('^2[Missions] Mission system initialized^7')
end

-- =====================================================
-- CREATE MISSION
-- =====================================================
function Missions.Create(missionData)
  if not missionData or not missionData.name then
    return false, "Mission name is required"
  end

  local missionId = "MISSION-" .. tostring(#MissionData + 1):format("%04d")
  
  local mission = {
    id = missionId,
    name = missionData.name,
    label = missionData.label or missionData.name,
    description = missionData.description or "",
    type = missionData.type or "delivery",
    difficulty = missionData.difficulty or "medium",
    status = "draft",
    startLocation = missionData.startLocation or { x = 0, y = 0, z = 0 },
    objectives = missionData.objectives or {},
    npcs = missionData.npcs or {},
    props = missionData.props or {},
    vehicles = missionData.vehicles or {},
    oxTargets = missionData.oxTargets or {},
    minigames = missionData.minigames or {},
    securitySystems = missionData.securitySystems or {},
    rewards = missionData.rewards or { xp = 1000, money = 5000 },
    timeLimit = missionData.timeLimit or 0,
    requiredItems = missionData.requiredItems or {},
    minLevel = missionData.minLevel or 0,
    createdBy = missionData.createdBy or "system",
    createdAt = os.date('%Y-%m-%d %H:%M:%S'),
    updatedAt = os.date('%Y-%m-%d %H:%M:%S'),
  }

  MissionData[missionId] = mission
  
  print('^3[Missions] Created mission: ' .. missionId .. ' (' .. mission.label .. ')^7')
  
  return true, mission
end

-- =====================================================
-- GET MISSION
-- =====================================================
function Missions.Get(missionId)
  return MissionData[missionId]
end

-- =====================================================
-- UPDATE MISSION
-- =====================================================
function Missions.Update(missionId, missionData)
  if not MissionData[missionId] then
    return false, "Mission not found"
  end

  local mission = MissionData[missionId]
  
  -- Update fields
  for key, value in pairs(missionData) do
    if key ~= "id" and key ~= "createdAt" then
      mission[key] = value
    end
  end
  
  mission.updatedAt = os.date('%Y-%m-%d %H:%M:%S')
  
  return true, mission
end

-- =====================================================
-- DELETE MISSION
-- =====================================================
function Missions.Delete(missionId)
  if not MissionData[missionId] then
    return false, "Mission not found"
  end

  MissionData[missionId] = nil
  print('^3[Missions] Deleted mission: ' .. missionId .. '^7')
  
  return true
end

-- =====================================================
-- GET ALL MISSIONS
-- =====================================================
function Missions.GetAll()
  local missions = {}
  for _, mission in pairs(MissionData) do
    table.insert(missions, mission)
  end
  return missions
end

-- =====================================================
-- GET MISSIONS BY FILTER
-- =====================================================
function Missions.GetByFilter(filter)
  local filtered = {}
  
  for _, mission in pairs(MissionData) do
    local matches = true
    
    if filter.type and mission.type ~= filter.type then
      matches = false
    end
    
    if filter.difficulty and mission.difficulty ~= filter.difficulty then
      matches = false
    end
    
    if filter.status and mission.status ~= filter.status then
      matches = false
    end
    
    if filter.minLevel and mission.minLevel > filter.minLevel then
      matches = false
    end
    
    if matches then
      table.insert(filtered, mission)
    end
  end
  
  return filtered
end

-- =====================================================
-- ACTIVATE MISSION
-- =====================================================
function Missions.Activate(missionId)
  if not MissionData[missionId] then
    return false, "Mission not found"
  end

  local mission = MissionData[missionId]
  mission.status = "active"
  mission.updatedAt = os.date('%Y-%m-%d %H:%M:%S')
  
  print('^2[Missions] Activated mission: ' .. missionId .. '^7')
  
  return true, mission
end

-- =====================================================
-- ASSIGN MISSION TO PLAYER
-- =====================================================
function Missions.AssignToPlayer(playerId, missionId)
  if not MissionData[missionId] then
    return false, "Mission not found"
  end

  if not PlayerMissions[playerId] then
    PlayerMissions[playerId] = {}
  end

  local missionStatus = {
    missionId = missionId,
    assignedAt = os.date('%Y-%m-%d %H:%M:%S'),
    completed = false,
    completedAt = nil,
    objectives = {},
  }

  -- Initialize objective tracking
  local mission = MissionData[missionId]
  for _, objective in pairs(mission.objectives) do
    missionStatus.objectives[objective.id] = {
      id = objective.id,
      completed = false,
      completedAt = nil,
    }
  end

  PlayerMissions[playerId][missionId] = missionStatus
  
  print('^3[Missions] Assigned mission ' .. missionId .. ' to player ' .. playerId .. '^7')
  
  return true, missionStatus
end

-- =====================================================
-- GET PLAYER MISSIONS
-- =====================================================
function Missions.GetPlayerMissions(playerId)
  return PlayerMissions[playerId] or {}
end

-- =====================================================
-- COMPLETE OBJECTIVE
-- =====================================================
function Missions.CompleteObjective(playerId, missionId, objectiveId)
  if not PlayerMissions[playerId] or not PlayerMissions[playerId][missionId] then
    return false, "Player mission not found"
  end

  local missionStatus = PlayerMissions[playerId][missionId]
  
  if missionStatus.objectives[objectiveId] then
    missionStatus.objectives[objectiveId].completed = true
    missionStatus.objectives[objectiveId].completedAt = os.date('%Y-%m-%d %H:%M:%S')
    
    print('^2[Missions] Player ' .. playerId .. ' completed objective ' .. objectiveId .. '^7')
    
    return true
  end

  return false, "Objective not found"
end

-- =====================================================
-- COMPLETE MISSION
-- =====================================================
function Missions.CompleteMission(playerId, missionId, rewards)
  if not PlayerMissions[playerId] or not PlayerMissions[playerId][missionId] then
    return false, "Player mission not found"
  end

  local missionStatus = PlayerMissions[playerId][missionId]
  missionStatus.completed = true
  missionStatus.completedAt = os.date('%Y-%m-%d %H:%M:%S')
  
  print('^2[Missions] Player ' .. playerId .. ' completed mission ' .. missionId .. '^7')
  
  -- TODO: Award rewards (XP, money, items)
  
  return true, missionStatus
end

-- =====================================================
-- ABANDON MISSION
-- =====================================================
function Missions.AbandonMission(playerId, missionId)
  if not PlayerMissions[playerId] or not PlayerMissions[playerId][missionId] then
    return false, "Player mission not found"
  end

  PlayerMissions[playerId][missionId] = nil
  
  print('^3[Missions] Player ' .. playerId .. ' abandoned mission ' .. missionId .. '^7')
  
  return true
end

-- =====================================================
-- NUI CALLBACKS
-- =====================================================
RegisterNUICallback('mission:create', function(data, cb)
  local playerId = source
  
  -- TODO: Verify admin permission
  
  local success, result = Missions.Create(data)
  
  cb(json.encode({
    success = success,
    data = result,
  }))
end)

RegisterNUICallback('mission:update', function(data, cb)
  local playerId = source
  local missionId = data.id
  
  -- TODO: Verify admin permission
  
  local success, result = Missions.Update(missionId, data)
  
  cb(json.encode({
    success = success,
    data = result,
  }))
end)

RegisterNUICallback('mission:delete', function(data, cb)
  local playerId = source
  local missionId = data.id
  
  -- TODO: Verify admin permission
  
  local success = Missions.Delete(missionId)
  
  cb(json.encode({
    success = success,
  }))
end)

RegisterNUICallback('mission:getAll', function(data, cb)
  local missions = Missions.GetAll()
  
  cb(json.encode({
    success = true,
    data = missions,
  }))
end)

RegisterNUICallback('mission:activate', function(data, cb)
  local playerId = source
  local missionId = data.id
  
  -- TODO: Verify admin permission
  
  local success, result = Missions.Activate(missionId)
  
  cb(json.encode({
    success = success,
    data = result,
  }))
end)

-- =====================================================
-- SERVER EVENTS
-- =====================================================
RegisterNetEvent('mission:assignToPlayer', function(playerId, missionId)
  local adminId = source
  
  -- TODO: Verify admin permission
  
  Missions.AssignToPlayer(playerId, missionId)
  
  TriggerClientEvent('mission:assigned', playerId, missionId)
end)

RegisterNetEvent('mission:completeObjective', function(missionId, objectiveId)
  local playerId = source
  
  Missions.CompleteObjective(playerId, missionId, objectiveId)
  
  TriggerClientEvent('mission:objectiveCompleted', playerId, missionId, objectiveId)
end)

RegisterNetEvent('mission:complete', function(missionId)
  local playerId = source
  local mission = Missions.Get(missionId)
  
  if mission then
    Missions.CompleteMission(playerId, missionId, mission.rewards)
    
    TriggerClientEvent('mission:completed', playerId, missionId, mission.rewards)
  end
end)

RegisterNetEvent('mission:abandon', function(missionId)
  local playerId = source
  
  Missions.AbandonMission(playerId, missionId)
  
  TriggerClientEvent('mission:abandoned', playerId, missionId)
end)

-- Load missions on resource start
LoadMissions()

-- Export functions
exports('CreateMission', function(missionData)
  return Missions.Create(missionData)
end)

exports('GetMission', function(missionId)
  return Missions.Get(missionId)
end)

exports('UpdateMission', function(missionId, missionData)
  return Missions.Update(missionId, missionData)
end)

exports('DeleteMission', function(missionId)
  return Missions.Delete(missionId)
end)

exports('GetAllMissions', function()
  return Missions.GetAll()
end)

exports('AssignMissionToPlayer', function(playerId, missionId)
  return Missions.AssignToPlayer(playerId, missionId)
end)

exports('GetPlayerMissions', function(playerId)
  return Missions.GetPlayerMissions(playerId)
end)
