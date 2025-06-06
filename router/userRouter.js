const express = require('express')
const userRouter = express.Router();
const {userAuth} = require('../Config/utils')
const connectionSchema = require('../Schema/connectionSchema');
const user = require('../Schema/userSchema');

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        let arr=[]
        const connections = await connectionSchema.find({ toUserId: req.user._id, status: 'intrested' }).populate("fromUserId", ["_id","firstName", "lastName","photoUrl","about"])
        connections.forEach(user=>{
            arr.push(user.fromUserId)
        })
        res.json({ message: "Request fetched successfully", data: arr })
    }
    catch (err) {
        res.status(500).json({message:err.message})
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const connections = await connectionSchema.find(
            { $or: [{ toUserId: req.user._id, status: 'accepted' }, { fromUserId: req.user._id, status: 'accepted' }] })
            .populate("fromUserId", ["_id","firstName", "lastName","photoUrl","about"])
            .populate("toUserId", ["_id","firstName", "lastName","photoUrl","about"])
            let arr=[]
            connections.forEach(user=>{
                if(user.fromUserId._id.toString() == req.user._id.toString()){
                    arr.push(user.toUserId)
                }else{
                    arr.push(user.fromUserId) 
                }
            })
        
        res.json({ message: "Connections fetched successfully", data: arr })
    }
    catch (err) {
        res.status(500).json({message:err.message})
    }
})

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        let hideReq = []
        const connections = await connectionSchema.find(
            { $or: [{ toUserId: req.user._id }, { fromUserId: req.user._id }] }).select("fromUserId toUserId")
        connections.forEach(users => {
            hideReq.push(users.fromUserId.toString())
            hideReq.push(users.toUserId.toString())
        })
        const userList = await 
        user.find({ $and: [{ _id: { $nin: req.user._id } }, { _id: { $nin: Array.from(hideReq) } }] })
        .select("_id email firstName lastName skills age photoUrl")
        .limit(limit)
        res.json({ message: "Connections fetched successfully", profiles: userList })
    }
    catch (err) {
        res.status(500).json({message:err.message})
    }
})

module.exports = userRouter