/**
 * @file socket.js
 * @description Socket io
 */

var server = require('http').createServer();
var io = require('socket.io')(server);

const PORT = 7000;

io.on('connection', (client) => {
  client.on('delivery_status_update', (data) => {
    io.emit('delivery_status_update', data);
  })
  client.on('UpdateLocation', (data) => {
    io.emit('UpdateLocation', data);
  })
  client.on('disconnect', () => {
    console.log('Client Disconnected');
  });
});

server.listen(PORT);

console.log('Server listening in port:', PORT);