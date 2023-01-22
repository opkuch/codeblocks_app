
var gIo = null
function setupSocketAPI(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        // New connected socket
        socket.on('disconnect', socket => {
            // Socket disconnected 
        })
        socket.on('block-set-topic', topic => {
            if (socket.myTopic === topic) return
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
                // Socket is leaving topic
            }
            socket.join(topic)
            socket.myTopic = topic
        })
        socket.on('update-block', block => {
            // A block from socket 
            broadcast({
                type: 'block-updated',
                data: block,
                room: socket.myTopic,
            })
        })
    })
}

function emitTo({ type, data, label }) {
    if (label) gIo.to('watching:' + label).emit(type, data)
    else gIo.emit(type, data)
}

// If possible, send to all sockets BUT not the current socket 
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null }) {
    // Broadcasting event
    if (room) {
        // Emit to room
        gIo.to(room).emit(type, data)
    } else {
        // Emit to all
        gIo.emit(type, data)
    }
}

module.exports = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo,
    // emit to a specific user (if currently active in system)
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
}
