const socket = require('socket.io')
const { hashValue } = require('./utils')
const chatSchema = require('../Schema/chatSchema')

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: 'http://localhost:5173'
        }
    })
    io.on("connection", (socket) => {
        socket.on("joinChat", (params) => {
            try {
                const { userId, targetUserId } = params;
                const hashedValue = hashValue(userId, targetUserId)
                socket.join(hashedValue)
            } catch (err) {
                console.log(err)
            }
        })
        socket.on("sendMessage", async ({ userId, targetUserId, message, firstName, lastName }) => {
            try {
                const hashedValue = hashValue(userId, targetUserId)
                const roomFound = await chatSchema.findOne({ particpants: { $all: [userId, targetUserId] } })
                let msgDetails = {
                    message: message,
                    firstName: firstName,
                    lastName: lastName
                }
                if(!roomFound){
                const chat=new chatSchema({roomId:hashValue(userId,targetUserId),particpants:[userId,targetUserId]})
                chat.messages.push(msgDetails)
                await chat.save();
                }else{
                roomFound.messages.push(msgDetails)
                await roomFound.save();
                }
                io.to(hashedValue).emit("messagRecieved", { firstName, lastName, message })
                io.emit("fetchNotification",{targetUserId,firstName})
            }
            catch (err) {
                console.log(err)
            }
        })
        socket.on("disconnect", () => {

        })
    })
}

module.exports = initializeSocket