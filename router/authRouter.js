const User = require('../Schema/userSchema')
const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const hashedPas = await bcrypt.hash(data.password, 10)
        const user = new User({
            firstName: data.firstName, lastName: data.lastName,
            email: data.email, password: hashedPas, age: data.age, skills: data.skills
        })
        await user.save();
        res.send("User added successfully")
    } catch (err) {
        res.status(400).send("Error:" + err.message)
    }
})

authRouter.post('/login', async (req, res) => {
    const data = req.body;
    try {
        const userFound = await User.findOne({ email: data.email })
        if (userFound) {
            const isValid = await bcrypt.compare(data.password, userFound.password)
            if (isValid) {
                const token = jwt.sign({ _id: userFound._id }, "harshitha@123")
                await res.cookie("token", token)
                res.json({ message: "Logged in successfully" })
            } else {
                throw new Error("Password is not valid")
            }
        } else {
            throw new Error("User does not exist")
        }

    }
    catch (err) {
        res.status(400).send("Error" + err.message)
    }
})

authRouter.post('/logout', (req, res) => {
    res.cookie('token', '')
    res.json({ message: "Loggedn out successfully" })
})

module.exports = authRouter