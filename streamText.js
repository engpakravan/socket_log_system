const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs')

let messages = {
  public : [] 
}


io.sockets.on('connection', function(socket){
  let userRoom ;

  io.sockets.in(userRoom).emit('messages' , messages[userRoom])

  socket.on('room' , room => {
    userRoom = room
    //Check it from messages if(empty) getFromDatabase
    //else messages[userRoom] = databaseData
    messages[userRoom] = []
    socket.join(room)
  })

  socket.on('new_message', (message) => {
    console.log(`New Message Room : ${userRoom}`)
    messages[userRoom].push(message)
    io.sockets.in(userRoom).emit('messages' , messages[userRoom])
    //Also insert to database
  });

  fs.watchFile('text.txt', (curr, prev) => {
    io.sockets.in(userRoom).emit('textChanged' , 'Salam Text Changed')  
  });

});

app.use('/', express.static('app'));
server.listen(9092 , 'localhost' , () => {
  console.log("Server Started")
})
