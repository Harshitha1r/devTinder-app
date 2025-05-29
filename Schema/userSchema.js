const mongoose=require('mongoose')
const npmvalidator=require('validator')

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        min:5
    },
    lastName:{
        type:String,
        required:true,
        min:1
    },
    email:{
        type:String,
        required:true,
        validate:{
            validator:function(value){
                return npmvalidator.isEmail(value)
            },
            message:props => `${props.value} is not a valid email!`
        },
        unique:true
    },
    password:{
        type:String,
        required:true,
        validate:{
            validator:function(value){
                return npmvalidator.isStrongPassword(value)
            },
            message:`Please enter a strong password`
        },
        min:8
    },
    age:{
        type:Number,
        required:true
    },
    skills:{
        type:[String]
    }
},{timeStamps:"true"})

const userModel=mongoose.model("users",userSchema)

module.exports=userModel