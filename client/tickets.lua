-- Client-side Ticket Management
-- Handles ticket event receivers and dispatches to dashboard

-- Receive all tickets from server
RegisterNetEvent('oxe_dashboard:ticketsUpdate')
AddEventHandler('oxe_dashboard:ticketsUpdate', function(tickets)
    -- Dispatch custom event to React
    TriggerEvent('oxe_dashboard:dispatchEvent', 'oxe_dashboard:ticketsUpdate', tickets)
end)

-- Receive ticket details from server
RegisterNetEvent('ticket:details')
AddEventHandler('ticket:details', function(ticket)
    TriggerEvent('oxe_dashboard:dispatchEvent', 'oxe_dashboard:ticketDetails', ticket)
end)

-- Receive message added confirmation
RegisterNetEvent('ticket:messageAdded')
AddEventHandler('ticket:messageAdded', function(ticketId, messageId)
    TriggerEvent('oxe_dashboard:dispatchEvent', 'oxe_dashboard:messageAdded', {
        ticketId = ticketId,
        messageId = messageId
    })
end)

-- Receive status update confirmation
RegisterNetEvent('ticket:statusUpdated')
AddEventHandler('ticket:statusUpdated', function(ticketId, newStatus)
    TriggerEvent('oxe_dashboard:dispatchEvent', 'oxe_dashboard:statusUpdated', {
        ticketId = ticketId,
        status = newStatus
    })
end)

print('^3[Tickets] Client loaded^7')
