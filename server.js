const express = require('express')
const app = express()
const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static')

// app.use(history())
// app.use(serveStatic(__dirname + '/dist'))
// app.use(serveStatic(__dirname))

server = app.listen(3000, function(){
    console.log('server is running on port 3000')
})

const io = require('socket.io')(server)

io.on('connection', function(socket) {
    console.log(socket.id)

    io.to(socket.id).emit('CREATE_USERNAME', generateUserName())

    socket.on('SEND_MESSAGE', function(data) {
        io.emit('MESSAGE', data)
        console.log(data)
    });
});

function generateUserName() {
    return new Date().valueOf()
}