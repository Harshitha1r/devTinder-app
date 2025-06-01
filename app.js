const express=require('express')
const ConnectDB=require('./Config/database')
const cookieparser=require('cookie-parser')
const authRouter=require('./router/authRouter')
const profileRouter=require('./router/profileRouter')
const connectionRouter = require('./router/connectionRouter')
const userRouter = require('./router/userRouter')
const cors=require('cors')

const app=express();

app.use(cors({origin:'http://localhost:5173',credentials:true}))

app.use(express.json())

app.use(cookieparser())

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',connectionRouter)
app.use('/',userRouter)

ConnectDB().then(()=>{
    console.log("Database connected successfully")
    app.listen(7000,()=>{
        console.log("listening to port 7000")
    })
})
.catch((err)=>{
    console.log("unable to connect db"+err)
})
