# Mission System Documentation

## Overview
El sistema completo de misiones permite crear, gestionar y ejecutar misiones complejas con NPCs, objetivos, minijuegos, sistemas de seguridad y recompensas.

## Features

### 1. Mission Creation UI
- **Dashboard**: Interfaz visual en el dashboard Intelligence
- **Step-by-step builder**: 7 pasos para crear una misión completa
  1. Información básica (nombre, tipo, dificultad)
  2. NPCs (bosses, guardias, civiles, criminales)
  3. Props (muebles, armas, herramientas, electrónica)
  4. Objetivos (locaciones, matar, coleccionar, etc.)
  5. Minijuegos (lockpick, hack, thermite, drilling)
  6. Sistemas de seguridad (lasers, cámaras, alarmas)
  7. Revisión y creación

### 2. NPC Management
Crea diferentes tipos de NPCs con comportamientos:
- **Boss**: Objetivo principal
- **Guard**: Enemigos de patrulla
- **Civilian**: Civiles neutrales
- **Criminal**: Aliados criminales
- **Police**: Enemigos tipo policía

Comportamientos:
- `patrol`: Patrulla en círculo
- `static`: Estático en un lugar
- `aggressive`: Ataca a los jugadores

### 3. Props & Environment
Coloca props en el mapa:
- Muebles
- Armas
- Herramientas
- Decoraciones
- Electrónica

Cada prop puede tener interacciones:
- Talk (hablar)
- Take (coger)
- Use (usar)
- Hack (hackear)
- Steal (robar)

### 4. Vehicles
Spawnea vehículos con:
- Modelo configurable
- Posición y heading
- Opción locked/unlocked
- Colores personalizados
- Conductor NPC opcional

### 5. Objectives
Define objetivos que los jugadores deben completar:
- **Location**: Ir a una ubicación
- **Kill**: Matar a un objetivo
- **Collect**: Coleccionar items
- **Escort**: Escoltar a una persona
- **Hack**: Hackear un sistema
- **Destroy**: Destruir un objeto

### 6. Minigames
Sistema flexible para minijuegos:
- **Lockpick** 🔓: Abrir cerraduras
- **Hacking** 💻: Hackear dispositivos
- **Thermite** 🔥: Quemar estructuras
- **Drilling** 🪛: Perforar bóvedas
- **Safecracking** 🔐: Abrir cajas de seguridad
- **Timer Bomb** ⏲️: Bombas con temporizador

Configuración:
```lua
{
  type = "lockpick",
  difficulty = 1,
  reward = { xp = 500, money = 1000 },
  timeLimit = 30,
}
```

### 7. Security Systems
Integración con sistemas de seguridad:

#### Lasers (KuzQuality)
Documentación: https://docs.kuzquality.com/resources/premium-resources/security-systems/developer-docs

```lua
{
  type = "laser",
  coordinates = { x = 100, y = 200, z = 30 },
  heading = 0,
  config = {
    hasLasers = true,
    hasCamera = false,
    hasAlarm = true,
    disarmCode = "1234"
  }
}
```

#### Cámaras
- Vigilancia visual
- Detección de intrusos
- Grabación

#### Alarmas
- Sistema de alerta
- Notificaciones
- Respuesta automática

#### Keypads
- Bloqueo por código
- Límite de intentos
- Autodestrucción opcional

### 8. Rewards System
Recompensa a los jugadores por completar misiones:
- **XP**: Puntos de experiencia
- **Money**: Dinero
- **Items**: Items especiales
- **Reputation**: Reputación con facciones

### 9. ox_target Integration
Puntos de interacción visual usando ox_target:
- Etiquetas personalizadas
- Iconos
- Validaciones
- Eventos personalizados

## Backend Integration

### Server-side Events

#### Mission Management
```lua
-- Create mission
TriggerServerEvent('mission:create', missionData)

-- Assign to player
TriggerServerEvent('mission:assignToPlayer', playerId, missionId)

-- Complete objective
TriggerServerEvent('mission:completeObjective', missionId, objectiveId)

-- Complete mission
TriggerServerEvent('mission:complete', missionId)

-- Abandon mission
TriggerServerEvent('mission:abandon', missionId)
```

#### Server Exports
```lua
-- Create a mission
exports['oxe_dashboard_v1']:CreateMission(missionData)

-- Get mission
exports['oxe_dashboard_v1']:GetMission(missionId)

-- Update mission
exports['oxe_dashboard_v1']:UpdateMission(missionId, missionData)

-- Get all missions
exports['oxe_dashboard_v1']:GetAllMissions()

-- Assign mission to player
exports['oxe_dashboard_v1']:AssignMissionToPlayer(playerId, missionId)

-- Get player missions
exports['oxe_dashboard_v1']:GetPlayerMissions(playerId)
```

## Client-side

### Mission Spawning
```lua
-- Spawn NPC
SpawnNPC(npcData)

-- Spawn prop
SpawnProp(propData)

-- Spawn vehicle
SpawnVehicle(vehicleData)

-- Create ox_target point
CreateOxTargetPoint(targetData)

-- Spawn laser system
SpawnLaserSecuritySystem(securityData)
```

## Example Mission

```lua
local exampleMission = {
  name = "jewelry_heist",
  label = "Jewelry Store Heist",
  type = "heist",
  difficulty = "hard",
  
  objectives = {
    {
      id = "obj_1",
      title = "Go to jewel store",
      type = "location",
      coordinates = { x = 100, y = 200, z = 30 }
    },
    {
      id = "obj_2", 
      title = "Hack security system",
      type = "hack"
    }
  },
  
  npcs = {
    {
      id = "npc_boss",
      name = "Pablo",
      type = "boss",
      model = "a_m_m_business_1",
      coordinates = { x = 110, y = 210, z = 30 },
      heading = 100
    }
  },
  
  securitySystems = {
    {
      id = "laser_1",
      type = "laser",
      coordinates = { x = 105, y = 205, z = 30 },
      config = { hasLasers = true, hasAlarm = true }
    }
  },
  
  minigames = {
    {
      type = "hack",
      difficulty = 2,
      reward = { xp = 1000, money = 5000 }
    }
  },
  
  rewards = {
    xp = 5000,
    money = 50000
  }
}
```

## Dependencies
- `ox_core`: Framework base
- `ox_lib`: Utilidades generales
- `ox_inventory`: Sistema de inventario (opcional)
- `ox_target`: Sistema de interacciones (opcional)
- `kuzquality-security-systems`: Sistema de seguridad con lasers (opcional)

## Future Enhancements
- [ ] Database persistence
- [ ] Mission statistics and analytics
- [ ] Advanced AI behaviors
- [ ] Dynamic difficulty scaling
- [ ] Procedural mission generation
- [ ] Multiplayer mission coordination
- [ ] Leaderboards
- [ ] Achievement system
