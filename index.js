const express = require("express")
const cors = require("cors")
const path = require("path")
const mongoose = require("mongoose")
const authRoutes = require("./Routes/auth")
const messageRoutes = require("./Routes/messages")
const socket = require("socket.io");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

// const __dirname = path.resolve();



mongoose.connect(process.env.MONGO_URL
    ).then(()=>console.log("DB Connection Successfull !"))
    .catch((err)=>console.log(err));

    app.use("/api/auth", authRoutes);
    app.use("/api/messages", messageRoutes);

    // app.use(express.static(path.join(__dirname,"../frontend/build")))

    
    // app.get("*",(req,res)=>{
    //   res.sendFile(path.join(__dirname,"../frontend/build/index.html"))
    // })
    
const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})



const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });