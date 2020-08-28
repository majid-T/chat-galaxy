// var createError = require('http-errors');
const express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
const app = express();
const dbDao = require('./dao');

let Rooms = { Mars : [], Jupiter : [], Saturn : [], Sun : [], Earth : [] };

app.set('view engine', 'ejs');

// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


//routing parts
app.get('/', (req, res) => {
	res.render('index');
});

app.get('/app', (req, res) => {
    res.render('index');
});

app.get('/chatroom', (req, res) => {
    res.render('chatroom');
});

app.get('/logs', (req, res) => {
    res.render('logs');
});
 //-----------------

// server = app.listen(3000);
// server = app.listen(12077);
var port = (process.env.PORT || '3000');
console.log(port);
server = app.listen(port);

const io = require("socket.io")(server);

io.on('connection', (socket) => {

	console.log(`-*-*-*-\nEVENT: New User connected\nSocket Id:\t\t${socket.id}\nDate:\t\t${new Date().toISOString()}\n-------`);
    dbDao.saveEvent({
        eventName:'Socket-Connect',
        eventDesc:'New Socket Connected',
        eventDate:new Date().toISOString(),
        eventOwner: 'Server',
        socketId : socket.id
    });

    socket.on('changeUsername', (data) => {
        let userAvatar = data.avatar;
        socket.avatar = data.avatar;
        socket.username = data.username;
        socket.joinedRoom ='Earth';
        socket.join('Earth');

        Rooms['Earth'].push({username:socket.username,avatar:socket.avatar});

        console.log(`-*-*-*-\nEVENT: User name ${socket.username} defined for\nSocket Id:\t\t${socket.id}\nDate:\t\t${new Date().toISOString()}\n-------`);
        dbDao.saveEvent({
            eventName:'Username-defined',
            eventDesc:`${socket.id} defined username ${socket.username} for himself`,
            eventDate:new Date().toISOString(),
            eventOwner: `${socket.username}`,
            socketId : socket.id
        });

        io.sockets.to(`${socket.joinedRoom}`).emit('roomUsers',Rooms[socket.joinedRoom]);

        io.sockets.to(`${socket.joinedRoom}`).emit('newMessage', {message : `${socket.username} joined ${socket.joinedRoom} on ${new Date().toISOString()}`, username : 'SERVER',avatar:'server'});

        socket.emit('newMessage',{message : `Hi ${socket.username},Welcome to planet ${socket.joinedRoom} `, username : 'SERVER',avatar:'server'});

    })

    //listen on new_message
    socket.on('newMessage', (data) => {
        console.log(data.message);
        dbDao.saveChat({
            chatUsername:`${socket.username}`,
            chatMessage:`${data.message}`,
            chatRoom: socket.joinedRoom,
            chatDate: new Date().toISOString(),
            socketId : socket.id
        });

        //broadcast the new message
        io.sockets.to(`${socket.joinedRoom}`).emit('newMessage', {message : data.message, username : socket.username,avatar:data.userAvatar});
    })

    //listen on typing
    socket.on('userTyping', (data) => {
    	socket.to(`${socket.joinedRoom}`).broadcast.emit('userTyping', {username : socket.username});
    });

    socket.on('disconnect', (data) => {
        console.log(`-*-*-*-\nEVENT: ${socket.username} disconnected\nSocket Id:\t\t${socket.id}\nDate:\t\t${new Date().toISOString()}\n-------`);
        dbDao.saveEvent({
            eventName:'User-Disconnect',
            eventDesc:`User ${socket.username} disconnected`,
            eventDate:new Date().toISOString(),
            eventOwner: `${socket.username}`,
            socketId : socket.id
        });
        io.sockets.to(`${socket.joinedRoom}`).emit('newMessage', {message : `${socket.username} left the room on ${new Date().toISOString()}`, username : 'SERVER',avatar:'server'});
        if(socket.joinedRoom){
            Rooms[socket.joinedRoom] = Rooms[socket.joinedRoom].filter(x => x.username!==socket.username);
            io.sockets.to(`${socket.joinedRoom}`).emit('roomUsers',Rooms[socket.joinedRoom]);
        }
    });

    socket.on('changeRoom',(data)=>{
        console.log(`-*-*-*-\nEVENT: ${socket.username} changed room to ${data.newRoom}\nSocket Id:\t\t${socket.id}\nDate:\t\t${new Date().toISOString()}\n-------`);
        io.sockets.to(`${socket.joinedRoom}`).emit('newMessage', {message : `${socket.username} left the room for ${socket.joinedRoom} on ${new Date().toISOString()}`, username : 'SERVER',avatar:'server'});
        let prevRoom = socket.joinedRoom;
        socket.joinedRoom = data.newRoom;
        socket.join(data.newRoom);
        socket.emit('newMessage',{message : `Hi ${socket.username},Welcome to ${socket.joinedRoom} planet `, username : 'SERVER',avatar:'server'});


        //show users -----
        Rooms[prevRoom] = Rooms[prevRoom].filter(x => x.username!==socket.username);
        Rooms[data.newRoom].push({username:socket.username,avatar:socket.avatar});
        io.sockets.to(`${prevRoom}`).emit('roomUsers',Rooms[prevRoom]);
        io.sockets.to(`${socket.joinedRoom}`).emit('roomUsers',Rooms[socket.joinedRoom]);

        // end of show users-------

        dbDao.saveEvent({
            eventName:'User Changed Room',
            eventDesc:`User ${socket.username} changed room from ${prevRoom} to ${socket.joinedRoom}`,
            eventDate:new Date().toISOString(),
            eventOwner: `${socket.username}`,
            socketId : socket.id
        });
    });


    //---------------------------------
    // ---- logs events----------------
    // --------------------------------
    socket.on('getAllEvents',()=>{
        console.log('All events triggered');
        dbDao.getAllEvents()
            .then((data)=>{
                socket.emit('allEvents',data);
            })
            .catch((data)=>{
                console.log(`ERROR\n: ${data}`);
            });
    });

    socket.on('getAllChats',()=>{
        console.log('All chats triggered');
        dbDao.getAllChats()
            .then((data)=>{
                socket.emit('allChats',data);
            })
            .catch((data)=>{
                console.log(`ERROR\n: ${data}`);
            });
    });

    socket.on('getChatsForRoom',(data)=>{
        console.log(`Chat history requested for ${data.room}`);
        dbDao.getChatsForRoom(data.room)
            .then((data)=>{
                socket.emit('allChats',data);
            })
            .catch((data)=>{
                console.log(`ERROR\n: ${data}`);
            });
    });

})
