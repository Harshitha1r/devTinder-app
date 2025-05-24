const express=require('express')
const ConnectDB=require('./Config/database')
const User=require('./Schema/userSchema')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cookieparser=require('cookie-parser')

const app=express();

app.use(express.json())

app.use(cookieparser())


app.post('/signup',async(req,res)=>{
    try{
    const data=req.body;
    const hashedPas=await bcrypt.hash(data.password,10)
    const user=new User({firstName:data.firstName,lastName:data.lastName,
        email:data.email,password:hashedPas,age:data.age,skills:data.skills})
    await user.save();
    res.send("User added successfully")
    }catch(err){
        res.status(400).send("Error"+err)
    }
})

app.post('/login',async(req,res)=>{
    const data=req.body;
    try {
    const userFound=await User.findOne({email:data.email})
    if(userFound){
        const isValid=await bcrypt.compare(data.password,userFound.password)
        if(isValid){
            const token=jwt.sign({_id:userFound._id},"harshitha@123")
            await res.cookie("token",token,{expires: new Date(Date.now() + 9000)})
            res.send("Logged in successfully")
        }else{
            throw new Error("Password is valid")
        }
    }else{
    throw new Error("User does not exist")}

}
    catch(err){
        res.status(400).send("Error"+err)
    }
})


app.get('/profile',async(req,res)=>{
    const {token}=req.cookies;
    try{
    const isTokenValid=jwt.verify(token,"harshitha@123")
    if(isTokenValid._id){
        const data=await User.findById(isTokenValid._id)
        res.send(data)
    }else{
        throw new Error("Token is not valid login again")
    }}catch(err){
        res.status(400).send("Err"+err)
    }
})


ConnectDB().then(()=>{
    console.log("Database connected successfully")
    app.listen(7000,()=>{
        console.log("listening to port 7000")
    })
})
.catch((err)=>{
    console.log("unable to connect db"+err)
})
