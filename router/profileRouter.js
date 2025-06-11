const express = require('express')
const profileRouter = express.Router();
const {userAuth} = require('../Config/utils')
const bcrypt = require('bcrypt')
const User=require('../Schema/userSchema')

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send({ message: "User info retrieved successfully", data:user })
    }
    catch (err) {
        res.status(500).json({message:err.message})
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        const data = req.body
        const allowedFields = ["firstName", "lastName", "skills","photoUrl","age","about","role","techStack","experienceLevel"]
        if (Object.keys(data).every(key => allowedFields.includes(key))) {
            const user = req.user
            Object.keys(data).forEach(key => user[key] = data[key])
            await user.save();
            res.json({ message: "Updated successfully", data:user })
        } else {
            throw new Error("Failed to update")
        }

    }
    catch (err) {
        res.status(500).send({message:err.message})
    }
})

profileRouter.patch('/profile/password', async (req, res) => {
    try {
        const password = req.body.password;
        const email=req.body.email;
        const hashedPas = await bcrypt.hash(password, 10)
        const user = await User.findOne({email:email})
        user.password = hashedPas
        await user.save();
        res.json({ message: "Updated successfully", user })
    }
    catch (err) {
        res.status(500).json({message:err.message})
    }
})

module.exports = profileRouter