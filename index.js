// required lib
const express = require('express'),
    bodyParser = require('body-parser'),
    fileUpload = require('express-fileupload'),
    path = require('path'),

    app = express();

// required database 
const mongoose = require('mongoose');
//connect DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/abc',
{userNewUrlParser: true}).then(()=> {
    console.log("Connected !!!")
}).catch(err =>{
    console.log(err);
});

// required path
const Tasks = require('./api/models/todoList.model'),
    routers = require('./api/routers/todoList.router');
routers(app);

// define port
const port = process.env.PORT || 3001;

//define socket port
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3002);
io.on('connetion', function(socket){
    io.socket.emit("user_online", socket.id + 'is connected');
    socket.on('mesage', function(msg){
        socket.broadcast.emit('re_message', socket.id +": is disconnected")
    });
    socket.on('disconnect', function(msg){
        socket.broadcast.emit("re_message", socket.id +": is disconneted")
    })
});


//app. use
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// show errors
app.use(function(req, res){
    res.status(404).send({ url: req.originalUrl + ' not found'})
})


// listen port
app.listen(port, function(req, res){})



