const mongoose = require('mongoose')
const npmvalidator = require('validator')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [5,"firstName should contain atleast 5 Characaters"]
    },
    lastName: {
        type: String,
        required: true,
        minlength: [1,"lastName should not be empty"]
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return npmvalidator.isEmail(value)
            },
            message: props => `${props.value} is not a valid email!`
        },
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return npmvalidator.isStrongPassword(value)
            },
            message: `Please enter a strong password`
        },
        minlength: 8,
    },
    age: {
        type: Number,
        min: [18, 'Age must be at least 18'],
        max: [65, 'Age must be below 65']
    },
    skills: {
        type: [String]
    },
    photoUrl: {
        type:String
    },
    about : {
        type:String
    },
    gender:{
        type:String,
        enum:{
            values:["Male","Female"],
            message: props => `${props.value} is not allowed`
        }
    }
}, { timeStamps: "true" })

const userModel = mongoose.model("users", userSchema)

module.exports = userModel