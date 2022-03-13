const express = require('express')
const app = express()
const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static')
const mysql = require('mysql')
require('dotenv').config()

// app.use(history())
// app.use(serveStatic(__dirname + '/dist'))
// app.use(serveStatic(__dirname))

server = app.listen(3001, function(){
    console.log('server is running on port 3001')
})

var con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
})

con.connect(function(err) {
  if (err) throw err
  console.log('Connected!')
})

const io = require('socket.io')(server)

io.on('connection', function(socket) {
    console.log(socket.id)

    io.to(socket.id).emit('CREATE_USERNAME', generateUserName())

    socket.on('SEND_MESSAGE', function(data) {
        io.emit('MESSAGE', data)
        console.log(data)
    })

    socket.on('REGISTER_USER', function(user) {
      var sql = `INSERT INTO users (id, name, mail, picture, date) VALUES (NULL, '${user.name}', '${user.email}', 'https://linktomyprofilepicture.com/picture.png', NULL)`
      con.query(sql, function (err, result) {
        if (err) throw err;
        
        io.to(socket.id).emit('REGISTER_CONFIRM')
      })
    })

    socket.on('LOGIN_USER', function(user) {
      var sql = `SELECT * FROM users WHERE mail = '${user.email}'`
      con.query(sql, function (err, result) {
        if (err) throw err;
        
        console.log(result[0])
        io.to(socket.id).emit('LOGIN_CONFIRM')
      })
    })
})

function generateUserName() {
    return new Date().valueOf()
}