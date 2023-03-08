import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const BodyParser = require('body-parser')
import Route from "./routes";
const con = require("./db/dcCoonect")
const cors = require('cors')
const app = express();
app.use(cors({}));
app.use(BodyParser())
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

Route(app)

io.on("connection", (socket) => {
    console.log(`User Id connect: ${socket.id}`);

    socket.on("join_room", (room: any)=>{
        socket.join(room)
        console.log(`user with Id : ${socket.id} joined room: ${room}`);
    })
    socket.on('send_message', data =>{
        socket.to(data.conversation_id).emit('receive_message', data)
    })
    socket.on("disconnect",()=>{
        console.log('User disconnect: ', socket.id)
    })
});

httpServer.listen(5000, () => {
    console.log('server RUNNING')
}); 