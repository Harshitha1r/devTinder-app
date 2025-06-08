const express=require('express')
const {userAuth, hashValue}=require('../Config/utils')
const Chat=require("../Schema/chatSchema");
const userModel = require('../Schema/userSchema');
const chatRouter=express.Router();

chatRouter.get('/fetch/messages/:targetUserid',userAuth,async(req,res)=>{
    try{
        const {targetUserid}=req.params
        const userId=req.user._id
        const roomFound=await Chat.findOne({particpants:{$all:[userId,targetUserid]}})
        const targetUser=await userModel.findById(targetUserid).select("firstName lastName photoUrl")
        res.json({message:"Messages fetched successfuly",data:roomFound.messages,toDetails:targetUser
        })
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

chatRouter.get('/fetch/chats',userAuth,async(req,res)=>{
    try{
    const roomFound=await Chat.find({particpants:req.user._id}).populate("particpants",["_id","firstName","lastName","photoUrl"]).select("particpants")
    let arr=[]
    roomFound.map(obj=>{
        obj.particpants.map(users=>{
            if(users._id.toString()!==req.user._id.toString())
            {
                arr.push(users)
            }
        })
    })
    res.json({message:"Fetched Successfully",data:arr})
    }
    catch(err){
    res.status(500).json({message:err.message})
    }
})

module.exports=chatRouter