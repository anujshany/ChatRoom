const path = require('path')
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//setting static folders
app.use(express.static(path.join(__dirname,'public')));

const botName = 'Let‘s Talk Bot';

//run when a client connects
io.on('connection', socket=>{
    //Welcoming the current user
    socket.emit('message', formatMessage(botName, 'Welcome to Let‘s Talk!'));

    //Broadcast when a user connects
    socket.broadcast.emit('message',formatMessage(botName,'A user has joined the chat'));

    //Runs when client disconnects
    socket.on('disconnect',()=>{
        io.emit('message',formatMessage(botName,'A user has left the chat'));
    });

    //Listen for chatMessage
    socket.on('chatMessage',(msg)=>{
        io.emit('message',formatMessage('USER',msg));
    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=> console.log(`Server Running on port ${PORT}`));
