const express = require('express')
const userRouter = express.Router();
const userAuth = require('../Config/utils')
const connectionSchema = require('../Schema/connectionSchema');
const user = require('../Schema/userSchema');

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const connections = await connectionSchema.find({ toUserId: req.user._id, status: 'intrested' }).populate("fromUserId", ["firstName", "lastName"])
        res.json({ message: "Request fetched successfully", data: connections })
    }
    catch (err) {
        res.status(400).send('Error:' + err.message)
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const connections = await connectionSchema.find(
            { $or: [{ toUserId: req.user._id, status: 'accepted' }, { fromUserId: req.user._id, status: 'accepted' }] })
            .populate("fromUserId", ["firstName", "lastName"])
        res.json({ message: "Connections fetched successfully", data: connections })
    }
    catch (err) {
        res.status(400).send('Error:' + err.message)
    }
})

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        let hideReq = []
        const connections = await connectionSchema.find(
            { $or: [{ toUserId: req.user._id }, { fromUserId: req.user._id }] }).select("fromUserId toUserId")
        connections.forEach(users => {
            hideReq.push(users.fromUserId.toString())
            hideReq.push(users.toUserId.toString())
        })
        const userList = await user.find({ $and: [{ _id: { $nin: req.user._id } }, { _id: { $nin: Array.from(hideReq) } }] }).select("firstName lastName skills")
        res.json({ message: "Connections fetched successfully", data: userList })
    }
    catch (err) {
        res.status(400).send('Error:' + err.message)
    }
})

module.exports = userRouter