const mongoose=require('mongoose')
const messageSchema=mongoose.Schema({
    message:{
        type:String
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    } 
},{ timeStamps: "true" })
const ChatSchema=mongoose.Schema({
    roomId:{
        type:String,
    },
    particpants:[{type:mongoose.Schema.Types.ObjectId,ref:"users"}],
    messages:[messageSchema]
})
const chatModel=mongoose.model("Chat",ChatSchema)
module.exports=chatModel