-- Server-side Ticket Management
-- Handles support tickets with database persistence

-- Check if player is admin
local function IsAdmin(playerId)
    local Framework = require '@ox_core/lib/init' or {}
    if Framework and Framework.GetPlayer then
        local player = Framework.GetPlayer(playerId)
        if player and (player.hasPermission('admin') or player.hasPermission('mod')) then
            return true
        end
    end
    return true -- Fallback
end

-- =====================================================
-- CREATE TICKET
-- =====================================================
RegisterServerEvent('ticket:create')
AddEventHandler('ticket:create', function(ticketData)
    local playerId = source
    local playerName = GetPlayerName(playerId)
    
    if not ticketData or not ticketData.title or not ticketData.description then
        lib.notify(playerId, { description = 'Datos incompletos del ticket', type = 'error' })
        return
    end
    
    -- Generate unique ticket ID
    local ticketId = 'TK-' .. os.time() .. '-' .. playerId
    
    -- Insert into database
    local result = MySQL.insert.await(
        'INSERT INTO support_tickets (id, player_id, player_name, player_band, title, description, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        { ticketId, playerId, playerName, ticketData.playerBand or '', ticketData.title, ticketData.description, ticketData.priority or 'medium', 'open' }
    )
    
    if result then
        -- Insert initial message if provided
        if ticketData.initialMessage then
            MySQL.insert.await(
                'INSERT INTO ticket_messages (ticket_id, author_id, author_name, message, message_type) VALUES (?, ?, ?, ?, ?)',
                { ticketId, playerId, playerName, ticketData.initialMessage, 'text' }
            )
        end
        
        lib.notify(playerId, { 
            description = 'Ticket creado: ' .. ticketId, 
            type = 'success' 
        })
        
        print('^2[Tickets] New ticket ' .. ticketId .. ' created by ' .. playerName .. '^7')
    else
        lib.notify(playerId, { description = 'Error al crear el ticket', type = 'error' })
    end
end)

-- =====================================================
-- ADD MESSAGE TO TICKET
-- =====================================================
RegisterServerEvent('ticket:addMessage')
AddEventHandler('ticket:addMessage', function(ticketId, message, messageType, imageUrl)
    local playerId = source
    local playerName = GetPlayerName(playerId)
    
    if not ticketId or not message then
        lib.notify(playerId, { description = 'Datos incompletos', type = 'error' })
        return
    end
    
    -- Verify ticket exists
    local ticketExists = MySQL.scalar.await('SELECT id FROM support_tickets WHERE id = ?', { ticketId })
    
    if not ticketExists then
        lib.notify(playerId, { description = 'Ticket no encontrado', type = 'error' })
        return
    end
    
    -- Insert message
    local result = MySQL.insert.await(
        'INSERT INTO ticket_messages (ticket_id, author_id, author_name, message, message_type, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        { ticketId, playerId, playerName, message, messageType or 'text', imageUrl or nil }
    )
    
    if result then
        -- Update ticket updated_at
        MySQL.update.await('UPDATE support_tickets SET updated_at = NOW() WHERE id = ?', { ticketId })
        
        lib.notify(playerId, { description = 'Mensaje agregado al ticket', type = 'success' })
        print('^2[Tickets] Message added to ticket ' .. ticketId .. ' by ' .. playerName .. '^7')
    else
        lib.notify(playerId, { description = 'Error al agregar mensaje', type = 'error' })
    end
end)

-- =====================================================
-- GET TICKET DETAILS
-- =====================================================
RegisterServerEvent('ticket:getDetails')
AddEventHandler('ticket:getDetails', function(ticketId)
    local adminId = source
    
    if not IsAdmin(adminId) then
        TriggerClientEvent('ticket:details', adminId, nil)
        return
    end
    
    -- Get ticket info
    local ticket = MySQL.single.await(
        'SELECT * FROM support_tickets WHERE id = ?',
        { ticketId }
    )
    
    if not ticket then
        TriggerClientEvent('ticket:details', adminId, nil)
        return
    end
    
    -- Get messages
    local messages = MySQL.query.await(
        'SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC',
        { ticketId }
    )
    
    -- Get participants
    local participants = MySQL.query.await(
        'SELECT * FROM ticket_participants WHERE ticket_id = ?',
        { ticketId }
    )
    
    -- Send complete data to client
    TriggerClientEvent('ticket:details', adminId, {
        ticket = ticket,
        messages = messages or {},
        participants = participants or {},
    })
    
    print('^3[Tickets] Admin ' .. GetPlayerName(adminId) .. ' viewed ticket ' .. ticketId .. '^7')
end)

-- =====================================================
-- UPDATE TICKET STATUS
-- =====================================================
RegisterServerEvent('ticket:updateStatus')
AddEventHandler('ticket:updateStatus', function(ticketId, newStatus)
    local adminId = source
    local adminName = GetPlayerName(adminId)
    
    if not IsAdmin(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    if not ticketId or not newStatus then
        lib.notify(adminId, { description = 'Datos incompletos', type = 'error' })
        return
    end
    
    -- Validate status
    local validStatuses = { 'open', 'in_progress', 'resolved', 'closed' }
    local isValid = false
    for _, status in ipairs(validStatuses) do
        if newStatus == status then
            isValid = true
            break
        end
    end
    
    if not isValid then
        lib.notify(adminId, { description = 'Estado inválido', type = 'error' })
        return
    end
    
    -- Update ticket
    local resolvedAt = nil
    if newStatus == 'resolved' then
        resolvedAt = os.time()
    end
    
    local result = MySQL.update.await(
        'UPDATE support_tickets SET status = ?, resolved_at = ?, resolved_by_admin_id = ?, resolved_by_admin_name = ? WHERE id = ?',
        { newStatus, resolvedAt, adminId, adminName, ticketId }
    )
    
    if result then
        lib.notify(adminId, { description = 'Estado del ticket actualizado a: ' .. newStatus, type = 'success' })
        print('^2[Tickets] Admin ' .. adminName .. ' updated ticket ' .. ticketId .. ' status to ' .. newStatus .. '^7')
    else
        lib.notify(adminId, { description = 'Error al actualizar el ticket', type = 'error' })
    end
end)

-- =====================================================
-- INVITE PLAYER TO TICKET
-- =====================================================
RegisterServerEvent('ticket:invitePlayer')
AddEventHandler('ticket:invitePlayer', function(ticketId, playerId, playerName)
    local adminId = source
    local adminName = GetPlayerName(adminId)
    
    if not IsAdmin(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    -- Verify ticket exists
    local ticketExists = MySQL.scalar.await('SELECT id FROM support_tickets WHERE id = ?', { ticketId })
    
    if not ticketExists then
        lib.notify(adminId, { description = 'Ticket no encontrado', type = 'error' })
        return
    end
    
    -- Check if already invited
    local alreadyInvited = MySQL.scalar.await(
        'SELECT id FROM ticket_participants WHERE ticket_id = ? AND player_id = ?',
        { ticketId, playerId }
    )
    
    if alreadyInvited then
        lib.notify(adminId, { description = 'Este jugador ya está invitado', type = 'warning' })
        return
    end
    
    -- Add participant
    local result = MySQL.insert.await(
        'INSERT INTO ticket_participants (ticket_id, player_id, player_name, invited_by_admin_id, invited_by_admin_name) VALUES (?, ?, ?, ?, ?)',
        { ticketId, playerId, playerName, adminId, adminName }
    )
    
    if result then
        lib.notify(adminId, { description = 'Jugador invitado al ticket', type = 'success' })
        print('^2[Tickets] Admin ' .. adminName .. ' invited player ' .. playerName .. ' to ticket ' .. ticketId .. '^7')
    else
        lib.notify(adminId, { description = 'Error al invitar jugador', type = 'error' })
    end
end)

-- =====================================================
-- GET ALL TICKETS (for dashboard)
-- =====================================================
RegisterServerEvent('tickets:getAll')
AddEventHandler('tickets:getAll', function()
    local adminId = source
    
    if not IsAdmin(adminId) then
        lib.notify(adminId, { description = 'No tienes permiso', type = 'error' })
        return
    end
    
    -- Get all tickets with messages
    local tickets = MySQL.query.await('SELECT * FROM support_tickets ORDER BY created_at DESC LIMIT 50')
    
    if not tickets then
        TriggerClientEvent('oxe_dashboard:ticketsUpdate', adminId, {})
        return
    end
    
    local ticketsWithMessages = {}
    
    for _, ticket in ipairs(tickets) do
        -- Get messages for this ticket
        local messages = MySQL.query.await(
            'SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC',
            { ticket.id }
        ) or {}
        
        -- Format messages
        local formattedMessages = {}
        for _, msg in ipairs(messages) do
            table.insert(formattedMessages, {
                id = msg.id,
                author = msg.author_name,
                role = "user",
                message = msg.message,
                timestamp = os.date('%H:%M', msg.created_at / 1000),
                image = msg.image_url or nil
            })
        end
        
        -- Build ticket object
        table.insert(ticketsWithMessages, {
            id = ticket.id,
            playerId = tostring(ticket.player_id),
            playerName = ticket.player_name,
            playerBand = ticket.player_band,
            title = ticket.title,
            description = ticket.description,
            priority = ticket.priority,
            status = ticket.status,
            createdAt = os.date('%d/%m/%Y %H:%M', ticket.created_at / 1000),
            updatedAt = os.date('%d/%m/%Y %H:%M', ticket.updated_at / 1000),
            messages = formattedMessages
        })
    end
    
    -- Send to client
    TriggerClientEvent('oxe_dashboard:ticketsUpdate', adminId, ticketsWithMessages)
    print('^2[Tickets] Admin sent ' .. #ticketsWithMessages .. ' tickets to dashboard^7')
end)

