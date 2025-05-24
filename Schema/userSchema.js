const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    age:{
        type:Number
    },
    skills:{
        type:[String]
    }
},{timeStamps:"true"})

const userModel=mongoose.model("users",userSchema)

module.exports=userModel