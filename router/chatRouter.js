const express=require('express')
const {userAuth, hashValue}=require('../Config/utils')
const Chat=require("../Schema/chatSchema")
const chatRouter=express.Router();

chatRouter.get('/fetch/messages/:targetUserid',userAuth,async(req,res)=>{
    try{
        const {targetUserid}=req.params
        const userId=req.user._id
        const roomFound=await Chat.findOne({particpants:{$all:[userId,targetUserid]}})
        res.json({message:"Messages fetched successfuly",data:roomFound.messages})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

module.exports=chatRouter