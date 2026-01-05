# Missions System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     OXE Dashboard v1                            │
│                    Missions Module                              │
└─────────────────────────────────────────────────────────────────┘

                         Frontend Layer
                         ═════════════════════
                                 │
                    ┌────────────┼────────────┐
                    │                         │
            ┌──────▼──────┐          ┌──────▼──────┐
            │ Intelligence│          │  Operations │
            │    Page     │          │    Create   │
            └──────┬──────┘          └──────┬──────┘
                   │                         │
            ┌──────▼─────────────────────────▼──────┐
            │  MissionsSection Component             │
            ├────────────────────────────────────────┤
            │ • Mission List                         │
            │ • Mission Builder (7 Steps)            │
            │ • Filter & Search                      │
            └──────────────┬─────────────────────────┘
                           │
                    NUI Callbacks
                    /  |  \
                   /   |    \
          Create / Update\ Delete
            
                         Server Layer
                         ═════════════════════
                                 │
                    ┌────────────┼────────────┐
                    │                         │
          ┌─────────▼────────┐    ┌──────────▼──────┐
          │ Mission Database │    │  Server Events  │
          ├──────────────────┤    ├─────────────────┤
          │ • Create         │    │ • Create        │
          │ • Read           │    │ • Update        │
          │ • Update         │    │ • Delete        │
          │ • Delete         │    │ • Assign        │
          │ • Get All        │    │ • Complete      │
          │ • Filter         │    │ • Abandon       │
          └──────┬───────────┘    └────────┬────────┘
                 │                         │
          Storage/Memory            Event Listeners
                 │                         │
            ┌────┴─────────────────────────┴────┐
            │   Player Mission Tracking         │
            ├──────────────────────────────────┤
            │ • Assigned Missions              │
            │ • Objective Progress             │
            │ • Rewards & Status               │
            └────────────────────────────────────┘

                        Client Layer
                        ═════════════════════
                                 │
                    ┌────────────┼────────────┐
                    │                         │
          ┌─────────▼────────┐    ┌──────────▼──────┐
          │  Mission Loader  │    │  Entity Manager │
          ├──────────────────┤    ├─────────────────┤
          │ • Load Mission   │    │ • Spawn NPCs    │
          │ • Unload Mission │    │ • Spawn Props   │
          │ • Manage Spawns  │    │ • Spawn Vehicle │
          └────────┬─────────┘    └────────┬────────┘
                   │                       │
            ┌──────▼───────────────────────▼──────┐
            │   Game World Integration             │
            ├──────────────────────────────────────┤
            │ • NPC Entities                       │
            │ • Props & Objects                    │
            │ • Vehicles                           │
            │ • Interactive Points (ox_target)     │
            │ • Security Systems (KuzQuality)      │
            └──────────────────────────────────────┘
```

## Data Flow

### Mission Creation Flow
```
User Input (Dashboard UI)
        ↓
Form Validation (Frontend)
        ↓
Send NUI Callback
        ↓
Server Receives (mission:create)
        ↓
Validate Permissions
        ↓
Create Mission Record
        ↓
Store in Memory/Database
        ↓
Return Success + Mission ID
        ↓
Update UI with Response
```

### Mission Assignment Flow
```
Admin Assigns Mission
        ↓
Server Event (mission:assignToPlayer)
        ↓
Check if mission exists
        ↓
Create player mission record
        ↓
Initialize objectives tracking
        ↓
Trigger Client Event
        ↓
Load Mission on Client
        ↓
Spawn All Entities (NPCs, Props, etc.)
        ↓
Create Interactive Points
        ↓
Mission Ready for Player
```

### Mission Progression Flow
```
Player Starts Interaction
        ↓
Trigger Interactive Point
        ↓
Execute Objective Action
        ↓
Track Progress (Server)
        ↓
Check if Complete
        ├─ No → Wait for Next Interaction
        └─ Yes → Complete Objective
                    ↓
                    Check all Objectives
                    ├─ Not All Done → Continue
                    └─ All Done → Mission Complete
                                  ↓
                                  Award Rewards
                                  ↓
                                  Cleanup Entities
                                  ↓
                                  Update UI
```

## Component Interaction

### Frontend Components

```
┌─────────────────────────────────────┐
│  IntelligencePage                   │
│  ├─ MissionsSection                 │
│  │  ├─ Mission List View            │
│  │  │  ├─ Search & Filter           │
│  │  │  ├─ Mission Cards             │
│  │  │  └─ Action Buttons            │
│  │  │                               │
│  │  └─ Mission Builder              │
│  │     ├─ Step Progress             │
│  │     ├─ Form Inputs               │
│  │     ├─ Entity Management         │
│  │     └─ Navigation                │
│  │                                  │
│  └─ (Modals & Dialogs)              │
└─────────────────────────────────────┘
```

### Backend Modules

```
server/missions.lua
├─ Missions Object
│  ├─ Create(data)
│  ├─ Get(id)
│  ├─ Update(id, data)
│  ├─ Delete(id)
│  ├─ GetAll()
│  ├─ GetByFilter(filter)
│  ├─ Activate(id)
│  ├─ AssignToPlayer(playerId, missionId)
│  ├─ GetPlayerMissions(playerId)
│  ├─ CompleteObjective(playerId, missionId, objectiveId)
│  ├─ CompleteMission(playerId, missionId)
│  └─ AbandonMission(playerId, missionId)
│
├─ NUI Callbacks
│  ├─ mission:create
│  ├─ mission:update
│  ├─ mission:delete
│  ├─ mission:getAll
│  └─ mission:activate
│
├─ Server Events
│  ├─ mission:assignToPlayer
│  ├─ mission:completeObjective
│  ├─ mission:complete
│  └─ mission:abandon
│
└─ Exports
   ├─ CreateMission
   ├─ GetMission
   ├─ UpdateMission
   ├─ DeleteMission
   ├─ GetAllMissions
   ├─ AssignMissionToPlayer
   └─ GetPlayerMissions

client/missions.lua
├─ Entity Spawning
│  ├─ SpawnNPC(data)
│  ├─ SpawnProp(data)
│  ├─ SpawnVehicle(data)
│  └─ CreateOxTargetPoint(data)
│
├─ Mission Management
│  ├─ LoadMission(data)
│  ├─ UnloadMission()
│  └─ TriggerMinigame(config)
│
├─ Client Events
│  ├─ mission:assigned
│  ├─ mission:objectiveCompleted
│  ├─ mission:completed
│  ├─ mission:abandoned
│  └─ mission:interactionTriggered
│
└─ Commands
   └─ /testmission
```

## Type Definitions

```
Mission
├─ id: string
├─ name: string
├─ label: string
├─ description: string
├─ type: MissionType
├─ difficulty: MissionDifficulty
├─ status: MissionStatus
├─ objectives: Objective[]
├─ npcs: NPC[]
├─ props: Prop[]
├─ vehicles: VehicleSpawn[]
├─ oxTargets: OxTargetPoint[]
├─ minigames: MiniGameConfig[]
├─ securitySystems: SecuritySystem[]
├─ rewards: MissionReward
├─ timeLimit: number
├─ requiredItems: string[]
├─ minLevel: number
├─ createdBy: string
├─ createdAt: string
└─ updatedAt: string

NPC
├─ id: string
├─ name: string
├─ type: NPCType
├─ model: string
├─ coordinates: Vec3
├─ heading: number
├─ dialogue: DialogueNode[]
└─ behavior: "patrol" | "static" | "aggressive"

Objective
├─ id: string
├─ title: string
├─ description: string
├─ type: ObjectiveType
├─ target: string
├─ coordinates: Vec3
└─ completed: boolean

SecuritySystem
├─ id: string
├─ type: "laser" | "camera" | "alarm" | "keypad"
├─ coordinates: Vec3
├─ heading: number
└─ config: SecurityConfig
```

## Integration Points

### Required Resources
- `ox_core`: Framework & player management
- `ox_lib`: Utilities & notifications

### Optional Integrations
- `ox_target`: Interactive points system
- `ox_inventory`: Item management
- `kuzquality-security-systems`: Laser grids & security

### Minigame Support
- `ox_lock`: Lockpicking minigame
- Custom hack systems
- Custom thermite burning
- Custom drilling systems
- Custom safecracking

## Security & Validation

```
┌─────────────────────────────────────┐
│     Permission Checks               │
├─────────────────────────────────────┤
│ • Admin/Moderator verification      │
│ • Dashboard access control          │
│ • Mission creation rights           │
│ • Player assignment validation      │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│     Data Validation                 │
├─────────────────────────────────────┤
│ • Required field checks             │
│ • Coordinate validation             │
│ • Type checking                     │
│ • Enum validation                   │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│     Server-side Verification        │
├─────────────────────────────────────┤
│ • Mission existence check           │
│ • Player online verification        │
│ • State consistency checks          │
│ • Error logging                     │
└─────────────────────────────────────┘
```

## Performance Considerations

### Optimizations
- **Memory**: In-memory storage with optional DB persistence
- **Rendering**: Lazy-loaded mission list components
- **Spawning**: Batch entity creation on mission load
- **Cleanup**: Automatic entity deletion on mission unload
- **Caching**: NPC models cached to prevent repeated requests

### Scalability
- Supports unlimited missions (limited by storage)
- Multiple concurrent player missions
- Efficient filtering and searching
- Modular architecture for easy expansion

## Extension Points

### Adding New Minigame Types
1. Add to `MiniGameType` enum
2. Add constant to `MINIGAME_TYPES`
3. Implement trigger in `TriggerMinigame()`
4. Add configuration validation

### Adding New Security Systems
1. Add to `SecuritySystem` type
2. Add to `SECURITY_SYSTEMS` constants
3. Implement spawning logic in `SpawnSecuritySystem()`
4. Add external resource integration

### Adding Reward Types
1. Extend `MissionReward` interface
2. Add to `REWARD_TYPES` constants
3. Implement reward distribution in `CompleteMission()`
4. Add player feedback notification
