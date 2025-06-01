const mongoose = require('mongoose')
const connectionSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.ObjectId,
        ref: "users"
    },
    toUserId: {
        type: mongoose.Schema.ObjectId,
        ref:"users"
    },
    status: {
        type: String,
        enum: {
            values: ["intrested", "ignored", "accepted", "rejected"],
            message: props => `${props.value} is not allowed`
        }
    }
})

const connectionModel = mongoose.model("Connection", connectionSchema)
module.exports = connectionModel