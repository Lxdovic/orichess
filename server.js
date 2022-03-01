const express = require('express')
const app = express()
const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static')

app.use(history())
app.use(serveStatic(__dirname + '/dist'))
app.use(serveStatic(__dirname))

server = app.listen(3001, function(){
    console.log('server is running on port 3001')
})

const io = require('socket.io')(server)

console.log(io)

io.on('connection', function(socket) {
    console.log(socket.id)
    socket.on('SEND_MESSAGE', function(data) {
        io.emit('MESSAGE', data)
        console.log(data)
    });
});