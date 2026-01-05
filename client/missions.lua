-- Client-side Mission System
-- Handles mission UI, spawning NPCs, props, and mission progression

local PlayerMissions = {}
local ActiveMission = nil
local SpawnedNPCs = {}
local SpawnedProps = {}
local SpawnedVehicles = {}

-- =====================================================
-- SPAWN NPC
-- =====================================================
local function SpawnNPC(npcData)
  -- Load model
  local modelHash = GetHashKey(npcData.model)
  RequestModel(modelHash)
  while not HasModelLoaded(modelHash) do
    Wait(10)
  end

  -- Create ped
  local ped = CreatePed(4, modelHash, npcData.coordinates.x, npcData.coordinates.y, npcData.coordinates.z, npcData.heading, true, false)
  SetBlockingOfNonTemporaryEvents(ped, true)
  
  -- Set behavior
  if npcData.behavior == "patrol" then
    TaskStartScenarioInPlace(ped, "WORLD_HUMAN_STUPOR", 0, true)
  elseif npcData.behavior == "aggressive" then
    TaskStartScenarioInPlace(ped, "WORLD_HUMAN_STUPOR", 0, true)
  end

  SpawnedNPCs[npcData.id] = ped
  
  print('^2[Missions] Spawned NPC: ' .. npcData.name .. '^7')
  
  return ped
end

-- =====================================================
-- SPAWN PROP
-- =====================================================
local function SpawnProp(propData)
  local modelHash = GetHashKey(propData.model)
  RequestModel(modelHash)
  while not HasModelLoaded(modelHash) do
    Wait(10)
  end

  local prop = CreateObject(modelHash, propData.coordinates.x, propData.coordinates.y, propData.coordinates.z, true, true, false)
  SetEntityHeading(prop, propData.heading or 0)
  
  if propData.scale then
    SetObjectScale(prop, propData.scale)
  end

  SpawnedProps[propData.id] = prop
  
  print('^2[Missions] Spawned Prop: ' .. propData.name .. '^7')
  
  return prop
end

-- =====================================================
-- SPAWN VEHICLE
-- =====================================================
local function SpawnVehicle(vehicleData)
  local modelHash = GetHashKey(vehicleData.model)
  RequestModel(modelHash)
  while not HasModelLoaded(modelHash) do
    Wait(10)
  end

  local vehicle = CreateVehicle(modelHash, vehicleData.coordinates.x, vehicleData.coordinates.y, vehicleData.coordinates.z, vehicleData.heading, true, false)
  SmashVehicleWindow(vehicle, 0)
  SmashVehicleWindow(vehicle, 1)
  
  if vehicleData.locked then
    LockVehicleDoors(vehicle, 2)
  end

  if vehicleData.customColor then
    SetVehicleColours(vehicle, vehicleData.customColor.r, vehicleData.customColor.g)
  end

  SpawnedVehicles[vehicleData.id] = vehicle
  
  print('^2[Missions] Spawned Vehicle: ' .. vehicleData.model .. '^7')
  
  return vehicle
end

-- =====================================================
-- CREATE OX_TARGET POINT
-- =====================================================
local function CreateOxTargetPoint(target)
  if GetResourceState('ox_target') ~= 'started' then
    print('^1[Missions] ox_target is not running^7')
    return
  end

  exports.ox_target:addBoxZone({
    coords = vec3(target.coordinates.x, target.coordinates.y, target.coordinates.z),
    size = vec3(target.radius, target.radius, 2),
    icon = target.icon,
    label = target.label,
    onEnter = function()
      TriggerEvent('mission:interactionTriggered', target.id)
    end,
  })
  
  print('^2[Missions] Created ox_target point: ' .. target.label .. '^7')
end

-- =====================================================
-- SPAWN LASER SECURITY SYSTEM
-- =====================================================
local function SpawnLaserSecuritySystem(securityData)
  if GetResourceState('kuzquality-security-systems') ~= 'started' then
    print('^1[Missions] kuzquality-security-systems is not running^7')
    return
  end

  -- TODO: Implement laser spawning using kuzquality API
  -- Reference: https://docs.kuzquality.com/resources/premium-resources/security-systems/developer-docs
  
  print('^2[Missions] Created laser security system at ' .. 
        securityData.coordinates.x .. ', ' .. 
        securityData.coordinates.y .. ', ' .. 
        securityData.coordinates.z .. '^7')
end

-- =====================================================
-- LOAD MISSION
-- =====================================================
local function LoadMission(missionData)
  if not missionData then
    print('^1[Missions] Mission data is invalid^7')
    return false
  end

  print('^3[Missions] Loading mission: ' .. missionData.label .. '^7')
  
  ActiveMission = missionData
  
  -- Spawn NPCs
  if missionData.npcs then
    for _, npcData in ipairs(missionData.npcs) do
      SpawnNPC(npcData)
    end
  end

  -- Spawn Props
  if missionData.props then
    for _, propData in ipairs(missionData.props) do
      SpawnProp(propData)
    end
  end

  -- Spawn Vehicles
  if missionData.vehicles then
    for _, vehicleData in ipairs(missionData.vehicles) do
      SpawnVehicle(vehicleData)
    end
  end

  -- Create ox_target points
  if missionData.oxTargets then
    for _, targetData in ipairs(missionData.oxTargets) do
      CreateOxTargetPoint(targetData)
    end
  end

  -- Spawn security systems
  if missionData.securitySystems then
    for _, securityData in ipairs(missionData.securitySystems) do
      SpawnLaserSecuritySystem(securityData)
    end
  end

  print('^2[Missions] Mission loaded successfully^7')
  
  return true
end

-- =====================================================
-- UNLOAD MISSION
-- =====================================================
local function UnloadMission()
  if not ActiveMission then
    return
  end

  print('^3[Missions] Unloading mission: ' .. ActiveMission.label .. '^7')

  -- Delete NPCs
  for _, ped in pairs(SpawnedNPCs) do
    if DoesEntityExist(ped) then
      DeleteEntity(ped)
    end
  end
  SpawnedNPCs = {}

  -- Delete Props
  for _, prop in pairs(SpawnedProps) do
    if DoesEntityExist(prop) then
      DeleteEntity(prop)
    end
  end
  SpawnedProps = {}

  -- Delete Vehicles
  for _, vehicle in pairs(SpawnedVehicles) do
    if DoesEntityExist(vehicle) then
      DeleteEntity(vehicle)
    end
  end
  SpawnedVehicles = {}

  ActiveMission = nil
  
  print('^2[Missions] Mission unloaded^7')
end

-- =====================================================
-- TRIGGER MINIGAME
-- =====================================================
local function TriggerMinigame(minigameConfig)
  if minigameConfig.type == "lockpick" then
    -- TODO: Trigger lockpick minigame (e.g., ox_lock)
    print('^2[Missions] Starting lockpick minigame^7')
  elseif minigameConfig.type == "hack" then
    -- TODO: Trigger hack minigame
    print('^2[Missions] Starting hack minigame^7')
  elseif minigameConfig.type == "thermite" then
    -- TODO: Trigger thermite minigame
    print('^2[Missions] Starting thermite minigame^7')
  elseif minigameConfig.type == "drilling" then
    -- TODO: Trigger drilling minigame
    print('^2[Missions] Starting drilling minigame^7')
  elseif minigameConfig.type == "safecrack" then
    -- TODO: Trigger safecrack minigame
    print('^2[Missions] Starting safecrack minigame^7')
  elseif minigameConfig.type == "timerbomb" then
    -- TODO: Trigger timerbomb minigame
    print('^2[Missions] Starting timerbomb minigame^7')
  end
end

-- =====================================================
-- SERVER EVENTS
-- =====================================================
RegisterNetEvent('mission:assigned', function(missionId)
  -- Mission was assigned to player
  TriggerServerEvent('mission:getMissionData', missionId)
end)

RegisterNetEvent('mission:getMissionDataResponse', function(missionData)
  LoadMission(missionData)
end)

RegisterNetEvent('mission:objectiveCompleted', function(missionId, objectiveId)
  TriggerEvent('chat:addMessage', {
    args = { 'Mission', 'Objective completed!' },
    color = { 0, 255, 0 }
  })
end)

RegisterNetEvent('mission:completed', function(missionId, rewards)
  TriggerEvent('chat:addMessage', {
    args = { 'Mission', 'Mission completed! Rewards: XP +' .. rewards.xp },
    color = { 0, 255, 0 }
  })
  
  UnloadMission()
end)

RegisterNetEvent('mission:abandoned', function(missionId)
  UnloadMission()
  
  TriggerEvent('chat:addMessage', {
    args = { 'Mission', 'Mission abandoned' },
    color = { 255, 100, 0 }
  })
end)

RegisterNetEvent('mission:interactionTriggered', function(targetId)
  if not ActiveMission then return end
  
  for _, target in ipairs(ActiveMission.oxTargets) do
    if target.id == targetId then
      print('^2[Missions] Interaction triggered: ' .. target.label .. '^7')
      
      if target.triggerEvent then
        TriggerEvent(target.triggerEvent)
      end
      
      break
    end
  end
end)

-- =====================================================
-- COMMAND TO START TEST MISSION
-- =====================================================
RegisterCommand('testmission', function()
  local testMission = {
    id = "TEST-001",
    name = "test_mission",
    label = "Test Mission",
    type = "delivery",
    difficulty = "easy",
    npcs = {},
    props = {},
    vehicles = {},
    oxTargets = {},
    securitySystems = {},
    objectives = {},
  }
  
  LoadMission(testMission)
  TriggerEvent('chat:addMessage', {
    args = { 'System', 'Test mission loaded' },
    color = { 255, 255, 0 }
  })
end, false)

-- =====================================================
-- CLEANUP ON RESOURCE STOP
-- =====================================================
AddEventHandler('onResourceStop', function(resourceName)
  if GetCurrentResourceName() == resourceName then
    UnloadMission()
  end
end)
