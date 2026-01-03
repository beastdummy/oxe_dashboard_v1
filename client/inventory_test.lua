-- Test script para verificar el sistema de inventario
-- Coloca este archivo en tu carpeta de recursos si deseas testear

-- Comando para dar items rápidamente
RegisterCommand('testgive', function(source, args, rawCommand)
    local itemName = args[1] or 'bread'
    local quantity = tonumber(args[2]) or 1
    
    TriggerEvent('inventory:giveItem', itemName, quantity)
    TriggerEvent('chat:addMessage', {
        args = { 'Test', 'Solicitando ' .. quantity .. 'x ' .. itemName }
    })
end, false)

-- Comando para soltar items
RegisterCommand('testdrop', function(source, args, rawCommand)
    local itemName = args[1] or 'bread'
    local quantity = tonumber(args[2]) or 1
    
    TriggerEvent('inventory:dropItem', itemName, quantity)
    TriggerEvent('chat:addMessage', {
        args = { 'Test', 'Soltando ' .. quantity .. 'x ' .. itemName }
    })
end, false)

-- Comando para eliminar items
RegisterCommand('testdelete', function(source, args, rawCommand)
    local itemName = args[1] or 'bread'
    local quantity = tonumber(args[2]) or 1
    
    TriggerEvent('inventory:deleteItem', itemName, quantity)
    TriggerEvent('chat:addMessage', {
        args = { 'Test', 'Eliminando ' .. quantity .. 'x ' .. itemName }
    })
end, false)

-- Comando para vaciar inventario
RegisterCommand('testclear', function(source, args, rawCommand)
    TriggerEvent('inventory:clearInventory')
    TriggerEvent('chat:addMessage', {
        args = { 'Test', 'Vaciando inventario' }
    })
end, false)

TriggerEvent('chat:addMessage', {
    args = { 'Test', 'Inventory test commands loaded: /testgive, /testdrop, /testdelete, /testclear' }
})
