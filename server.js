const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require('socket.io')(http);
const Watching = require("./watching");
const path = require("path");

let reading = new Watching("read.log");

reading.start();

app.get('/log', (req, res) => {
    // console.log()
    var fileName = 'index.html';
    var required = {
        root: path.join(__dirname)
    }
  res.sendFile(fileName,required,function(err){
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("sent");
    }
  });


});

io.on('connection', function(socket) {
  console.log('a new user connected');
  reading.on("process",function process(data){
    socket.emit("update",data);
  })
let data = reading.getLogs();
socket.emit("init",data);
});

http.listen(3000, function() {
  console.log('listening on port:3000');
});

