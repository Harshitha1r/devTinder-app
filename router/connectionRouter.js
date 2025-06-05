const express = require('express')
const connectionRouter = express.Router();
const {userAuth} = require('../Config/utils');
const user = require('../Schema/userSchema')
const connectionSchema = require('../Schema/connectionSchema')

connectionRouter.post('/request/send/:status/:userId', userAuth, async (req, res) => {
    try {
        const { status, userId } = req.params;
        if (userId === req.user._id.toString()) {
            throw new Error("Cannot send a request")
        }
        const connectionExist = await connectionSchema.findOne({
            $or:
                [{ fromUserId: req.user._id, toUserId: userId }, { fromUserId: userId, toUserId: req.user._id }]
        })
        if (connectionExist) {
            throw new Error("Connection request already exist")
        }
        const userExist = await user.findById(userId)
        if (userExist) {
            const request = new connectionSchema({ fromUserId: req.user._id, toUserId: userId, status: status })
            await request.save();
            if(status=="ignored"){
              res.json({ message: "Connection igored" })  
            }else{
            res.json({ message: "Connection request sent succesfully" })
            }
        } else {
            throw new Error("User does not exist to send a request")
        }
    }
    catch (err) {
        res.status(500).json({message:err.message})
    }

})

connectionRouter.post('/request/review/:status/:userId', userAuth, async (req, res) => {
    try {
        const { status, userId } = req.params;
        const connectionExist = await connectionSchema.findOne({ fromUserId: userId, toUserId: req.user._id })
        if (!connectionExist) {
            throw new Error("Connection request not exist")
        }
        const statusAllowed = ["accepted", "rejected"]
        if (statusAllowed.includes(status) && !statusAllowed.includes(connectionExist.status)) {
            connectionExist.status = status;
            await connectionExist.save();
            res.json({ message: `Connection ${status} successfully` })
        } else {
            throw new Error(`Status ${status} not allowed`)
        }
    }
    catch (err) {
        res.status(500).json({message:err.message})
    }
})

module.exports = connectionRouter