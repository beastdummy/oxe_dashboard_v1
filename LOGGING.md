# Admin Logging System - Configuration Guide

El sistema de logging de OXE Dashboard v1 te permite registrar todas las acciones de admin en múltiples plataformas.

## 🔧 Configuración Rápida

Todos los logs se configuran en `shared/config.lua` en la sección `logging`:

```lua
logging = {
    sql = { enabled = true, resource = 'oxmysql' },
    discord = { enabled = true, webhookUrl = '...' },
    fiveManager = { enabled = false, apiKey = '...' },
    file = { enabled = true, path = 'logs/admin_logs.json' },
},
```

---

## 📊 SQL Database (MySQL)

### Instalación

1. Necesitas `oxmysql` o `mysql-async` instalado en tu servidor
2. En `shared/config.lua`:

```lua
logging = {
    sql = {
        enabled = true,
        resource = 'oxmysql', -- o 'mysql-async'
    },
    ...
}
```

### Tabla Automática

La tabla se crea automáticamente al iniciar el recurso:

```sql
CREATE TABLE admin_logs (
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
)
```

### Usar los Logs

```sql
-- Ver últimos 100 logs
SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 100;

-- Ver logs de un admin específico
SELECT * FROM admin_logs WHERE admin_id = 1 ORDER BY created_at DESC;

-- Ver logs de una acción específica
SELECT * FROM admin_logs WHERE action = 'ban' ORDER BY created_at DESC;

-- Analizar detalles JSON
SELECT admin_name, action, target_name, JSON_UNQUOTE(JSON_EXTRACT(details, '$.reason')) as reason
FROM admin_logs WHERE action = 'ban';
```

---

## 💬 Discord Webhooks

### Pasos para Configurar

1. **Crea un servidor en Discord** (si no tienes uno)
2. **Abre las configuraciones del servidor** → Integraciones → Webhooks
3. **Haz clic en "Nuevo Webhook"**
4. **Dale un nombre** (ej: "Admin Logger")
5. **Selecciona el canal** donde recibirás los logs
6. **Haz clic en "Copiar URL de Webhook"**
7. **Pega la URL en `shared/config.lua`:**

```lua
logging = {
    discord = {
        enabled = true,
        webhookUrl = 'https://discordapp.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN',
        botName = '🤖 OXE Admin Logger',
        iconUrl = 'https://cdn.discordapp.com/emojis/889703127195455488.png',
    },
    ...
}
```

### Ejemplo de Embed

Los mensajes en Discord se ven así:

```
📢 Admin Action Logged

👤 Admin: JohnAdmin (ID: 1)
⚡ Action: MESSAGE
🎯 Target: Player123 (ID: 123)

📋 Details:
• messageType: notification
• title: Advertencia
• message: No hagas eso de nuevo

[Pie con timestamp]
```

---

## 🖥️ FiveManager Integration

### Pasos para Configurar

1. Verifica que tengas acceso a tu panel de FiveManager
2. En `shared/config.lua`:

```lua
logging = {
    fiveManager = {
        enabled = true,
        apiKey = 'YOUR_FIVEMANAGER_API_KEY',
        serverId = 1,  -- Tu ID de servidor en FiveManager
        endpoint = 'https://fivemanager.tu-dominio.com/api',
    },
    ...
}
```

3. Obtén tu API Key:
   - Ve a tu panel FiveManager
   - Busca "API" o "Configuración de API"
   - Crea una nueva clave o copia la existente
   - Pégala en la configuración

---

## 📁 File Logging (JSON Local)

Almacena los logs en un archivo JSON local. Útil para backup o análisis local.

```lua
logging = {
    file = {
        enabled = true,
        path = 'logs/admin_logs.json',
    },
    ...
}
```

### Ubicación de Archivos

Los logs se guardan en: `resources/oxe_dashboard_v1/logs/admin_logs.json`

Mantiene los últimos **1000 registros** (se purga automáticamente)

### Estructura del Archivo

```json
[
    {
        "timestamp": "2026-01-03 14:30:45",
        "timestampUnix": 1735911045,
        "admin": {
            "id": 1,
            "name": "JohnAdmin"
        },
        "action": "ban",
        "target": {
            "id": 123,
            "name": "PlayerName"
        },
        "details": {
            "banType": "permanent",
            "reason": "Cheating"
        }
    }
]
```

---

## 📝 Acciones Registradas

Las siguientes acciones se registran automáticamente:

| Acción | Descripción | Detalles |
|--------|-------------|----------|
| **message** | Mensaje enviado | messageType, title, message |
| **suspend** | Jugador suspendido | days, reason, suspendUntil |
| **ban** | Jugador baneado | banType, days, reason, banUntil |
| **spectate** | Spectate iniciado | (ninguno) |
| **broadcast** | Broadcast enviado | type, message |
| **heal** | Jugador sanado | health, armor |
| **kill** | Jugador eliminado | (ninguno) |
| **freeze** | Jugador congelado | frozen (true/false) |
| **inventory** | Inventario consultado | (ninguno) |

---

## 🔍 Debugging

### Ver logs en consola

En el servidor FiveM, verás mensajes como:

```
[Logs] Admin JohnAdmin executed message on PlayerName
[Discord Log] Message sent successfully
[SQL Log] Saved successfully
[File Log] Saved to logs/admin_logs.json
```

### Errores comunes

**Discord**
```
[Discord Log] Failed to send message (Status: 401)
→ Webhook URL incorrecto o expirado

[Discord Logs] Webhook URL not configured!
→ Configura el webhookUrl en shared/config.lua
```

**SQL**
```
[SQL Log] Saved successfully
→ Todo bien

No aparece [SQL Log]
→ oxmysql no está cargado o no existe la tabla
```

---

## 🔐 Seguridad

- **Nunca compartas tu Webhook URL o API Key**
- Guarda las claves en un `.env` si es posible
- Rotea las claves regularmente
- Los logs contienen información sensible (nombres, razones de bans, etc.)

---

## 📊 Estadísticas

Para ver estadísticas de logs:

```sql
-- Acciones más comunes
SELECT action, COUNT(*) as count FROM admin_logs 
GROUP BY action ORDER BY count DESC;

-- Admin más activo
SELECT admin_name, COUNT(*) as count FROM admin_logs 
GROUP BY admin_name ORDER BY count DESC;

-- Jugadores más sancionados
SELECT target_name, COUNT(*) as count FROM admin_logs 
WHERE action IN ('ban', 'suspend') 
GROUP BY target_name ORDER BY count DESC;
```

---

## ✅ Verificar Configuración

Al iniciar el servidor, verás:

```
[Logs] System loaded | SQL: ON | Discord: ON | FiveManager: OFF
```

Si alguno está deshabilitado pero querías que estuviera habilitado, revisa `shared/config.lua`.

---

## 💡 Tips

- **Combina todos los sistemas** para máxima redundancia
- **SQL** para análisis y búsqueda
- **Discord** para alertas en tiempo real
- **Archivos** para backup local
- **FiveManager** si ya lo usas

