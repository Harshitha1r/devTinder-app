const express=require('express')
require('dotenv').config();
const ConnectDB=require('./Config/database')
const cookieparser=require('cookie-parser')
const authRouter=require('./router/authRouter')
const profileRouter=require('./router/profileRouter')
const connectionRouter = require('./router/connectionRouter')
const userRouter = require('./router/userRouter')
const http=require('http')
const cors=require('cors');
const initializeSocket = require('./Config/socket');
const chatRouter = require('./router/chatRouter');

const app=express();

app.use(cors({origin:'http://localhost:5173',credentials:true}))

app.use(express.json())

app.use(cookieparser())

const server=http.createServer(app)
initializeSocket(server)

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',connectionRouter)
app.use('/',userRouter)
app.use('/',chatRouter)

ConnectDB().then(()=>{
    console.log("Database connected successfully")
    server.listen(7000,()=>{
        console.log("listening to port 7000")
    })
})
.catch((err)=>{
    console.log("unable to connect db"+err)
})
